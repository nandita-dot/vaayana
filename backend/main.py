import os
import sys
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.config import ALLOWED_ORIGINS, PORT, GEMINI_API_KEY, GEMINI_MODEL
from app.models import (
    ExtractPdfResponse, 
    ExtractImageResponse, 
    GenerateLessonRequest, 
    GenerateLessonResponse,
    RegenerateSectionRequest,
    RegenerateSectionResponse,
    Lesson,
    LessonApprovalRequest,
    LessonApprovalResponse
)
from app.ocr import extract_text_from_pdf_bytes, extract_text_from_image_bytes, get_tesseract_status
from app.gemini_service import (
    generate_lesson_with_gemini, 
    generate_manual_template_lesson,
    regenerate_section_with_gemini,
    filter_text_by_pages
)
from app.sample_data import SAMPLE_LESSONS
from app.database import (
    init_db,
    save_chapter,
    get_chapter_by_hash,
    get_cached_lesson_by_hash,
    get_cached_lesson_by_key,
    compute_lesson_cache_key,
    save_lesson_record,
    get_all_db_lessons,
    get_db_lesson_by_id,
    delete_db_lesson
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vaayana-backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database on startup
    try:
        init_db()
        logger.info("Vaayana SQLite database initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not auto-initialize SQLite database: {e}")
    yield

app = FastAPI(
    title="VAAYANA (വായന) Backend API",
    description="Interactive visual learning platform backend for Kerala Class 4 smartboards",
    version="2.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChapterPreviewRequest(BaseModel):
    rawText: str
    startPage: Optional[int] = None
    endPage: Optional[int] = None

@app.get("/")
def read_root():
    return {
        "app": "VAAYANA (വായന)",
        "description": "AI-assisted interactive textbook platform for Kerala Class 4 schools",
        "status": "healthy",
        "version": "2.1.0"
    }

@app.get("/api/health")
def health_check():
    tess_status = get_tesseract_status()
    return {
        "status": "ok",
        "service": "vaayana-core",
        "supportedLanguages": ["malayalam", "english"],
        "curriculum": "Kerala SCERT Class 4 (Mathematics, EVS, English)",
        "ocr": {
            "tesseractInstalled": tess_status["available"],
            "version": tess_status.get("version"),
            "languages": tess_status.get("languages", []),
            "hasMalayalam": tess_status.get("hasMalayalam", False),
            "hasEnglish": tess_status.get("hasEnglish", False)
        },
        "geminiConfigured": bool(GEMINI_API_KEY),
        "geminiModel": GEMINI_MODEL
    }

@app.get("/api/ai-status")
def ai_status():
    """Returns whether Gemini AI key is configured and which model is active."""
    return {
        "aiAvailable": bool(GEMINI_API_KEY),
        "model": GEMINI_MODEL,
        "provider": "Google GenAI SDK"
    }

@app.get("/api/sample-lessons")
def get_sample_lessons():
    """Returns curated SCERT Kerala Class 4 interactive lessons."""
    return SAMPLE_LESSONS

@app.get("/api/db-lessons")
def get_saved_lessons():
    """Returns all lessons persisted in the local SQLite database."""
    try:
        return get_all_db_lessons()
    except Exception as e:
        logger.error(f"Error reading SQLite lessons: {e}")
        return []

@app.get("/api/cached-lesson/{file_hash}")
def get_cached_lesson(file_hash: str, start_page: Optional[int] = None, end_page: Optional[int] = None, chapter: Optional[str] = None):
    """
    Checks if an existing approved lesson exists for the scoped cache key or file hash.
    Ensures that lessons from different chapters of a long textbook do not collide.
    """
    try:
        cache_key = compute_lesson_cache_key(file_hash, start_page, end_page, chapter or "")
        cached = get_cached_lesson_by_key(cache_key, require_approved=True)
        if not cached and not start_page and not end_page:
            cached = get_cached_lesson_by_hash(file_hash)
            
        if cached:
            return {
                "found": True,
                "lesson": cached,
                "version": cached.get("version", 1),
                "approvalStatus": cached.get("approvalStatus", "approved")
            }
        return {"found": False, "lesson": None}
    except Exception as e:
        logger.error(f"Error checking cache: {e}")
        return {"found": False, "error": str(e)}

@app.post("/api/chapter-preview")
def preview_chapter(req: ChapterPreviewRequest):
    """
    Extracts text for the selected start and end page range so the teacher can inspect before generating.
    """
    filtered_text, pages = filter_text_by_pages(req.rawText, req.startPage, req.endPage)
    words = filtered_text.split()
    return {
        "text": filtered_text,
        "wordCount": len(words),
        "pageCount": len(pages),
        "pagesIncluded": pages,
        "snippet": filtered_text[:350].replace("\n", " ").strip()
    }

@app.post("/api/approve-lesson", response_model=LessonApprovalResponse)
def approve_lesson(req: LessonApprovalRequest):
    """
    Saves an approved lesson to SQLite database. Increments version and sets status to approved.
    """
    try:
        cache_key = compute_lesson_cache_key(
            file_hash=req.lesson.sourceFileHash or "",
            start_page=None,
            end_page=None,
            chapter_title=req.lesson.chapter or req.lesson.titleEn
        )
        version_id, next_ver = save_lesson_record(
            req.lesson.model_dump(), 
            approval_status=req.approvalStatus,
            cache_key=cache_key
        )
        return LessonApprovalResponse(
            success=True,
            lessonId=req.lesson.id,
            version=next_ver,
            approvalStatus=req.approvalStatus,
            message="Lesson successfully approved and stored in SQLite database."
        )
    except Exception as e:
        logger.error(f"Error approving lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/db-lessons/{lesson_id}")
def get_lesson(lesson_id: str, require_approved: bool = False):
    """Retrieves a specific lesson by ID or version ID from SQLite."""
    lesson = get_db_lesson_by_id(lesson_id, require_approved=require_approved)
    if not lesson:
        raise HTTPException(status_code=404, detail=f"Lesson '{lesson_id}' not found in SQLite database.")
    return lesson

@app.delete("/api/db-lessons/{lesson_id}")
def delete_lesson(lesson_id: str):
    """Deletes a lesson from SQLite database."""
    try:
        delete_db_lesson(lesson_id)
        return {"success": True, "deleted": lesson_id}
    except Exception as e:
        logger.error(f"Error deleting lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract-pdf", response_model=ExtractPdfResponse)
async def extract_pdf(file: UploadFile = File(...)):
    """
    Comprehensive PyMuPDF extraction with full page auditing, heading detection, and chapter discovery.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        content = await file.read()
        page_count, extracted_text, meta = extract_text_from_pdf_bytes(content, filename=file.filename)
        file_hash = meta.get("fileHash", "")
        
        malayalam_chars = len([c for c in extracted_text if '\u0D00' <= c <= '\u0D7F'])
        detected = "malayalam" if malayalam_chars > 30 else "english"
        snippet = extracted_text[:400].replace("\n", " ").strip() if extracted_text else ""

        # Auto-register chapter metadata in SQLite if possible
        try:
            if file_hash:
                save_chapter(
                    chapter_id=f"chap-{file_hash[:10]}",
                    title=file.filename.replace(".pdf", ""),
                    grade="Class 4",
                    subject="Environmental Studies",
                    filename=file.filename,
                    file_hash=file_hash,
                    extracted_text=extracted_text,
                    metadata=meta
                )
        except Exception as db_err:
            logger.warning(f"Failed to record chapter in SQLite: {db_err}")

        # Warn if extraction yielded very little text
        word_count = meta.get("documentAudit", {}).get("totalWordCount", len(extracted_text.split()))
        warning = None
        if word_count < 30:
            warning = "Text extraction yielded very few words. If this is a scanned textbook, ensure OCR language packs are installed."

        return ExtractPdfResponse(
            success=True,
            pageCount=page_count,
            extractedText=extracted_text,
            languageDetected=detected,
            previewSnippet=snippet,
            sourceFileHash=file_hash,
            fileName=file.filename,
            engine=meta.get("engine", "PyMuPDF"),
            ocrAvailable=meta.get("tesseractAvailable", False),
            documentAudit=meta.get("documentAudit"),
            pages=meta.get("pages", []),
            detectedChapters=meta.get("detectedChapters", []),
            warning=warning
        )
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        return ExtractPdfResponse(
            success=False,
            pageCount=0,
            extractedText="",
            languageDetected="unknown",
            previewSnippet="",
            engine="PyMuPDF",
            ocrAvailable=False,
            error=str(e)
        )

@app.post("/api/extract-image", response_model=ExtractImageResponse)
async def extract_image(file: UploadFile = File(...)):
    """
    Accepts textbook image scans (PNG, JPG, WebP) and extracts text using Tesseract OCR.
    """
    allowed_exts = (".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff")
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(status_code=400, detail="Supported formats: PNG, JPG, JPEG, WebP, BMP, TIFF.")

    try:
        content = await file.read()
        extracted_text, meta = extract_text_from_image_bytes(content, filename=file.filename)
        file_hash = meta.get("fileHash", "")
        
        malayalam_chars = len([c for c in extracted_text if '\u0D00' <= c <= '\u0D7F'])
        detected = "malayalam" if malayalam_chars > 30 else "english"
        snippet = extracted_text[:400].replace("\n", " ").strip() if extracted_text else ""

        # Auto-register chapter in SQLite if possible
        try:
            if file_hash:
                save_chapter(
                    chapter_id=f"chap-{file_hash[:10]}",
                    title=file.filename,
                    grade="Class 4",
                    subject="Environmental Studies",
                    filename=file.filename,
                    file_hash=file_hash,
                    extracted_text=extracted_text,
                    metadata=meta
                )
        except Exception as db_err:
            logger.warning(f"Failed to record chapter in SQLite: {db_err}")

        return ExtractImageResponse(
            success=meta.get("success", False),
            extractedText=extracted_text,
            languageDetected=detected,
            previewSnippet=snippet,
            sourceFileHash=file_hash,
            fileName=file.filename,
            ocrAvailable=get_tesseract_status()["available"],
            metadata=meta,
            error=meta.get("error")
        )
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return ExtractImageResponse(
            success=False,
            extractedText="",
            languageDetected="unknown",
            previewSnippet="",
            ocrAvailable=False,
            error=str(e)
        )

@app.post("/api/generate-lesson", response_model=GenerateLessonResponse)
def generate_lesson(req: GenerateLessonRequest):
    """
    Evidence-grounded hierarchical lesson generation.
    Filters textbook text by selected chapter/page range,
    checks scoped cache key, and generates with Gemini or grounded template.
    """
    effective_title = req.selectedChapterTitle or req.chapterTitle
    if not req.rawText.strip() and not effective_title.strip():
        raise HTTPException(status_code=400, detail="Please provide either textbook text or chapter title.")

    # 1. Scoped Cache Key check: Belongs to exact document AND selected chapter/pages
    cache_key = compute_lesson_cache_key(
        file_hash=req.sourceFileHash or "",
        start_page=req.startPage,
        end_page=req.endPage,
        chapter_title=effective_title
    )

    if req.sourceFileHash and not req.forceRegenerate:
        try:
            cached_data = get_cached_lesson_by_key(cache_key, require_approved=True)
            if cached_data:
                logger.info(f"Loaded approved lesson for cache key {cache_key} directly from SQLite.")
                cached_lesson = Lesson.model_validate(cached_data)
                return GenerateLessonResponse(
                    success=True,
                    lesson=cached_lesson,
                    aiAvailable=bool(GEMINI_API_KEY),
                    modelUsed="SQLite Local Cache",
                    fromCache=True,
                    warnings=["Reused previously approved lesson for this exact chapter/page range from local SQLite database (0 API calls)."]
                )
        except Exception as cache_err:
            logger.warning(f"Cache check error: {cache_err}")

    # 2. Generate with Gemini API
    response = generate_lesson_with_gemini(
        raw_text=req.rawText,
        subject=req.subject,
        grade=req.grade,
        chapter_title=effective_title,
        language_preference=req.languagePreference,
        source_file_hash=req.sourceFileHash or "",
        source_file_name=req.sourceFileName or "",
        start_page=req.startPage,
        end_page=req.endPage
    )

    # 3. If generation succeeded, save to SQLite as draft
    if response.success and response.lesson:
        try:
            save_lesson_record(
                response.lesson.model_dump(), 
                approval_status="draft",
                cache_key=cache_key,
                start_page=req.startPage,
                end_page=req.endPage
            )
        except Exception as save_err:
            logger.warning(f"Could not cache generated lesson to SQLite: {save_err}")

    return response

@app.post("/api/generate-template-lesson", response_model=Lesson)
def generate_template(req: GenerateLessonRequest):
    """
    Creates an evidence-grounded Class 4 curriculum lesson scaffold from the actual selected pages.
    """
    effective_title = req.selectedChapterTitle or req.chapterTitle
    lesson = generate_manual_template_lesson(
        raw_text=req.rawText,
        subject=req.subject,
        grade=req.grade,
        chapter_title=effective_title,
        source_file_hash=req.sourceFileHash or "",
        source_file_name=req.sourceFileName or "",
        start_page=req.startPage,
        end_page=req.endPage
    )
    # Save template draft to SQLite
    cache_key = compute_lesson_cache_key(
        file_hash=req.sourceFileHash or "",
        start_page=req.startPage,
        end_page=req.endPage,
        chapter_title=effective_title
    )
    try:
        save_lesson_record(
            lesson.model_dump(), 
            approval_status="draft",
            cache_key=cache_key,
            start_page=req.startPage,
            end_page=req.endPage
        )
    except Exception as db_err:
        logger.warning(f"Could not persist template to SQLite: {db_err}")
        
    return lesson

@app.post("/api/regenerate-section", response_model=RegenerateSectionResponse)
def regenerate_section(req: RegenerateSectionRequest):
    """
    Regenerates a specific sub-section with evidence grounding.
    """
    return regenerate_section_with_gemini(
        section=req.section,
        raw_text=req.rawText,
        subject=req.subject,
        grade=req.grade,
        chapter_title=req.chapterTitle
    )

# Static frontend serving for unified desktop execution
import sys
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

_dist_candidates = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist"),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist"),
    os.path.join(getattr(sys, "_MEIPASS", ""), "dist") if hasattr(sys, "_MEIPASS") else ""
]
FRONTEND_DIST = next((d for d in _dist_candidates if d and os.path.exists(d)), None)

if FRONTEND_DIST:
    _assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(_assets_dir):
        app.mount("/assets", StaticFiles(directory=_assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend build index.html not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
