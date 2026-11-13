import os
import sys
import json
import hashlib
from pathlib import Path

# Insert backend directory into sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app.config import GEMINI_API_KEY, GEMINI_MODEL
from app.ocr import extract_text_from_pdf_bytes
from app.gemini_service import (
    generate_lesson_with_gemini,
    get_live_gemini_call_count,
    reset_live_gemini_call_count,
    filter_text_by_pages
)
from app.database import (
    init_db,
    save_lesson_record,
    get_db_lesson_by_id,
    compute_lesson_cache_key
)
from app.models import Lesson

def run_single_controlled_generation():
    print("=" * 60)
    print("VAAYANA — Controlled Single Live Gemini Generation")
    print("=" * 60)

    # 1. Verification of environment & safety constraints
    reset_live_gemini_call_count()
    init_db()

    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY is not configured in backend/.env!")
        return

    print(f"Target Model: {GEMINI_MODEL}")
    print(f"Pre-flight Live API Call Count: {get_live_gemini_call_count()}")

    # 2. Extract textbook pages 39-46 from backend/data/04_English Reader.pdf
    pdf_path = backend_dir / "data" / "04_English Reader.pdf"
    if not pdf_path.exists():
        print(f"ERROR: PDF not found at {pdf_path}")
        return

    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    file_hash = hashlib.sha256(pdf_bytes).hexdigest()
    print(f"Textbook PDF: {pdf_path.name} (SHA-256: {file_hash[:16]}...)")

    page_count, full_extracted_text, meta = extract_text_from_pdf_bytes(pdf_bytes, filename=pdf_path.name)
    chapter_text, included_pages = filter_text_by_pages(full_extracted_text, start_page=39, end_page=46)
    print(f"Extracted {len(included_pages)} pages: {included_pages}")
    print(f"Chapter text size: {len(chapter_text)} characters, {len(chapter_text.split())} words")

    # 3. Controlled LIVE Generation: EXACTLY ONE API CALL
    print("\nExecuting EXACTLY ONE Live Gemini Request...")
    response = generate_lesson_with_gemini(
        raw_text=full_extracted_text,
        subject="English",
        grade="Class 4",
        chapter_title="Journey of the Raindrop",
        language_preference="malayalam",
        source_file_hash=file_hash,
        source_file_name=pdf_path.name,
        start_page=39,
        end_page=46
    )

    actual_calls = get_live_gemini_call_count()
    print(f"\nLive Gemini API Requests made: {actual_calls}")

    if not response.success or not response.lesson:
        print(f"GENERATION FAILED: {response.error}")
        return

    lesson = response.lesson
    print("GENERATION SUCCEEDED!")

    # 4. Pydantic Schema Validation
    validated_dict = lesson.model_dump()
    validated_lesson = Lesson.model_validate(validated_dict)
    print("Pydantic Schema Validation: PASSED")

    # 5. Persistence: Save as a NEW DRAFT in SQLite (Do NOT overwrite existing approved lessons)
    cache_key = compute_lesson_cache_key(
        file_hash=file_hash,
        start_page=39,
        end_page=46,
        chapter_title="Journey of the Raindrop"
    )

    # Force draft status
    validated_lesson.approvalStatus = "draft"
    version_id, version_num = save_lesson_record(
        lesson_dict=validated_lesson.model_dump(),
        approval_status="draft",
        cache_key=cache_key,
        start_page=39,
        end_page=46
    )
    print(f"Saved to SQLite as Draft: ID={lesson.id}, Version={version_num}, VersionID={version_id}")

    # 6. Reopen from SQLite to verify round-trip
    reopened = get_db_lesson_by_id(lesson.id, require_approved=False)
    if reopened:
        print(f"Reopened from SQLite successfully! Title: {reopened.get('titleEn')} / {reopened.get('titleMl')}")
    else:
        print("ERROR: Failed to retrieve saved lesson from SQLite!")

    # 7. Verification of Components & Evidence Grounding
    print("\n" + "=" * 60)
    print("VERIFICATION AUDIT")
    print("=" * 60)
    print(f"Title: {lesson.titleEn} ({lesson.titleMl})")
    print(f"Concepts Count: {len(lesson.concepts)}")
    print(f"Slides Count: {len(lesson.slides)}")
    print(f"Vocabulary Count: {len(lesson.vocabulary)}")
    print(f"Activities Count: {len(lesson.activities)}")
    print(f"Quiz Questions Count: {len(lesson.quiz)}")

    # Check evidence snippets against chapter text
    chapter_text_lower = chapter_text.lower()
    all_snippets_valid = True
    snippet_audit = []

    print("\n--- Evidence Grounding Audit ---")
    for idx, c in enumerate(lesson.concepts):
        snip = (c.evidenceSnippet or "").strip()
        page = c.sourcePage
        # Check snippet or 4 consecutive words in chapter text
        in_text = False
        if snip:
            snip_clean = snip.lower().replace('"', '').replace("'", "").strip()
            words = snip_clean.split()
            # Try full or 4-word slice
            if snip_clean in chapter_text_lower:
                in_text = True
            elif len(words) >= 3 and " ".join(words[:4]) in chapter_text_lower:
                in_text = True
            elif any(" ".join(words[i:i+4]) in chapter_text_lower for i in range(max(1, len(words)-3))):
                in_text = True

        status = "MATCHED" if in_text else "WEAK/ABSENT"
        if not in_text:
            all_snippets_valid = False
        snippet_audit.append({
            "concept": c.titleEn,
            "page": page,
            "snippet": snip,
            "status": status
        })
        print(f"  Concept {idx+1} [p. {page}]: '{snip[:60]}...' -> {status}")

    # Check slides for narrative order, animations, and water cycle
    print("\n--- Narrative Slides & Visuals Audit ---")
    has_water_cycle = False
    emphasis_words_found = []
    for idx, s in enumerate(lesson.slides):
        ew = f"[EmphasisWord: {s.emphasisWord.word} ({s.emphasisWord.effect})]" if s.emphasisWord else ""
        if s.emphasisWord:
            emphasis_words_found.append(s.emphasisWord.word)
        im = f"[InteractiveModule: {s.interactiveModule}]" if s.interactiveModule else ""
        if s.interactiveModule in ["water_cycle", "water_cycle_explorer"] or (s.conceptAnimation and s.conceptAnimation.type == "water_cycle"):
            has_water_cycle = True
        print(f"  Slide {idx+1}: ({s.slideType}) {s.titleEn} {ew} {im} (p. {s.sourcePageRef})")

    # Check activity sequencing
    print("\n--- Interactive Activity Audit ---")
    for act in lesson.activities:
        print(f"  Activity: {act.titleEn} (Type: {act.activityType}, Items: {len(act.items)})")

    # Check quiz questions
    print("\n--- Quiz Questions Audit ---")
    for q in lesson.quiz:
        print(f"  Q: {q.questionEn} | Options: {len(q.optionsEn)} | Correct: {q.correctIndex} ({q.optionsEn[q.correctIndex]})")

    print("\n" + "=" * 60)
    print("FINAL SUMMARY REPORT:")
    print(f"1. Actual Gemini API requests: {actual_calls}")
    print(f"2. Generation succeeded: True")
    print(f"3. Concepts: {len(lesson.concepts)}, Slides: {len(lesson.slides)}, Vocabulary: {len(lesson.vocabulary)}, Activities: {len(lesson.activities)}, Quiz: {len(lesson.quiz)}")
    print(f"4. Evidence snippets match extracted text: {all_snippets_valid}")
    print(f"5. Water cycle module present: {has_water_cycle}")
    print(f"6. Word animations present: {emphasis_words_found}")
    print(f"7. Saved as new draft in SQLite: True (ID: {lesson.id})")
    print("=" * 60)

if __name__ == "__main__":
    run_single_controlled_generation()

