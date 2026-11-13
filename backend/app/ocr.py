import io
import re
import unicodedata
import logging
from typing import Tuple, List, Dict, Any, Optional
from app.config import TESSERACT_CMD
from app.database import compute_sha256

logger = logging.getLogger(__name__)

def get_tesseract_status() -> Dict[str, Any]:
    """
    Checks if the Tesseract binary is reachable and which language packs are installed.
    """
    try:
        import pytesseract
        if TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
            
        langs = pytesseract.get_languages()
        ver = pytesseract.get_tesseract_version()
        return {
            "available": True,
            "version": str(ver),
            "languages": langs,
            "hasMalayalam": "mal" in langs,
            "hasEnglish": "eng" in langs
        }
    except Exception as exc:
        return {
            "available": False,
            "version": None,
            "languages": [],
            "hasMalayalam": False,
            "hasEnglish": False,
            "error": str(exc)
        }

def normalize_text(text: str) -> str:
    """Normalizes whitespace, Unicode representations, and Malayalam glyph variants."""
    if not text:
        return ""
    # Normalize unicode to NFC
    text = unicodedata.normalize("NFC", text)
    # Replace non-breaking spaces and unusual whitespace
    text = text.replace("\u00A0", " ").replace("\u200B", "").replace("\r\n", "\n")
    # Collapse 3+ newlines into 2
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def detect_page_headings(page_text: str, page_blocks: Optional[List[Any]] = None) -> List[str]:
    """Identifies prominent section or chapter headings on a given page."""
    headings = []
    lines = [line.strip() for line in page_text.split("\n") if line.strip()]
    
    chapter_pattern = re.compile(
        r'^(?:Chapter|Unit|Lesson|Part|പാഠം|അധ്യായം|യൂണിറ്റ്)\s*(\d+|[IVXLCDM]+)?[\s:\.\-]+(.+)$',
        re.IGNORECASE
    )
    standalone_chapter = re.compile(
        r'^(?:Chapter|Unit|Lesson|Part|പാഠം|അധ്യായം|യൂണിറ്റ്)\s*(\d+|[IVXLCDM]+)?$',
        re.IGNORECASE
    )

    for i, line in enumerate(lines[:6]):  # Check top lines of the page
        m = chapter_pattern.match(line)
        if m:
            headings.append(line)
            continue
        if standalone_chapter.match(line) and i + 1 < len(lines):
            headings.append(f"{line}: {lines[i+1]}")
            continue
        # Also capture all-caps or distinct short headings (< 50 chars) with letters
        if len(line) < 50 and not line.endswith(('.', '?', '!', ',')):
            if any(k in line.lower() for k in ["science", "mathematics", "പരിസര", "ഗണിതം", "birds", "water", "fractions", "കഥ"]):
                headings.append(line)

    return list(dict.fromkeys(headings))  # Preserve unique in order

def detect_chapters_from_pages(pages: List[Dict[str, Any]], total_pages: int) -> List[Dict[str, Any]]:
    """
    Scans extracted pages to detect chapter boundaries, unit titles, and page ranges.
    Returns structured chapter objects for teacher selection.
    """
    chapter_markers = []
    chapter_regex = re.compile(
        r'(?:Chapter|Unit|Lesson|Part|പാഠം|അധ്യായം|യൂണിറ്റ്)\s*(\d+|[IVXLCDM]+)?[\s:\.\-]+([^\n]{3,80})',
        re.IGNORECASE
    )
    standalone_regex = re.compile(
        r'^(?:Chapter|Unit|Lesson|Part|പാഠം|അധ്യായം|യൂണിറ്റ്)\s*(\d+|[IVXLCDM]+)?$',
        re.IGNORECASE
    )

    for page in pages:
        p_num = page["pageNumber"]
        p_text = page["text"] or ""
        lines = [l.strip() for l in p_text.split("\n") if l.strip()]

        for i, line in enumerate(lines[:8]):
            # Skip running headers or continuation/conclusion markers
            if re.search(r'\b(?:continued|contd|conclusion|തുടർച്ച|ഉപസംഹാരം)\b', line, re.IGNORECASE):
                continue

            m = chapter_regex.search(line)
            if m:
                chap_num = (m.group(1) or "").strip().lower()
                clean_title = line.strip().strip("-:.")
                
                # If we already have markers, check if this is the same chapter number
                if chapter_markers and chap_num and chapter_markers[-1].get("chapNum") == chap_num:
                    continue

                chapter_markers.append({
                    "startPage": p_num,
                    "chapNum": chap_num,
                    "title": clean_title,
                    "snippet": p_text[:250].replace("\n", " ").strip()
                })
                break
            elif standalone_regex.match(line) and i + 1 < len(lines):
                if re.search(r'\b(?:continued|contd|conclusion|തുടർച്ച|ഉപസംഹാരം)\b', lines[i+1], re.IGNORECASE):
                    continue
                clean_title = f"{line}: {lines[i+1]}".strip()
                chapter_markers.append({
                    "startPage": p_num,
                    "chapNum": "",
                    "title": clean_title,
                    "snippet": p_text[:250].replace("\n", " ").strip()
                })
                break

    # If distinct chapter markers found, construct non-overlapping ranges
    detected = []
    if chapter_markers:
        for idx, cm in enumerate(chapter_markers):
            start_p = cm["startPage"]
            # End page is page before next chapter or total pages
            if idx + 1 < len(chapter_markers):
                next_start = chapter_markers[idx + 1]["startPage"]
                end_p = max(start_p, next_start - 1)
            else:
                end_p = total_pages

            # Estimate word count for this chapter's pages
            chap_words = sum(
                p["wordCount"] for p in pages 
                if start_p <= p["pageNumber"] <= end_p
            )

            detected.append({
                "chapterIndex": idx + 1,
                "title": cm["title"],
                "titleMl": cm["title"] if any('\u0D00' <= c <= '\u0D7F' for c in cm["title"]) else "",
                "startPage": start_p,
                "endPage": end_p,
                "pageCount": end_p - start_p + 1,
                "snippet": cm["snippet"],
                "estimatedWordCount": chap_words
            })

    # If no markers found (or single chapter), create a default full-textbook chapter
    if not detected:
        total_words = sum(p["wordCount"] for p in pages)
        snippet = pages[0]["snippet"] if pages else ""
        detected.append({
            "chapterIndex": 1,
            "title": "Complete Textbook / Unit (Full Document)",
            "titleMl": "സമ്പൂർണ്ണ പാഠഭാഗം (മുഴുവൻ പേജുകൾ)",
            "startPage": 1,
            "endPage": total_pages,
            "pageCount": total_pages,
            "snippet": snippet,
            "estimatedWordCount": total_words
        })

    return detected

def extract_text_from_pdf_bytes(pdf_bytes: bytes, filename: str = "textbook.pdf") -> Tuple[int, str, Dict[str, Any]]:
    """
    Comprehensive PyMuPDF + Tesseract extraction pipeline.
    Preserves exact page numbering, word counts, and chapter boundaries.
    """
    try:
        import pymupdf
    except ImportError:
        import fitz as pymupdf

    file_hash = compute_sha256(pdf_bytes)
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    page_count = len(doc)
    
    pages_audit = []
    extracted_text_blocks = []
    ocr_applied_pages = []
    unreadable_pages = []
    total_words = 0

    tess_status = get_tesseract_status()

    for page_idx in range(page_count):
        page_num = page_idx + 1
        page = doc[page_idx]
        
        # 1. Inspect embedded images on this page
        try:
            page_images = page.get_images(full=True)
            image_count = len(page_images)
        except Exception:
            page_images = []
            image_count = 0
        has_images = image_count > 0

        # 2. Digital text extraction
        raw_text = page.get_text()
        clean_text = normalize_text(raw_text)
        digital_word_count = len(clean_text.split())
        has_selectable = digital_word_count >= 15
        ocr_applied = False
        unreadable_reason = None

        # 3. Scanned page OCR fallback if digital text is scarce
        if digital_word_count < 15 and tess_status["available"]:
            try:
                import pytesseract
                from PIL import Image
                pix = page.get_pixmap(dpi=200)
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                
                lang = "mal+eng" if (tess_status["hasMalayalam"] and tess_status["hasEnglish"]) else "eng" if tess_status["hasEnglish"] else None
                if lang:
                    ocr_text = pytesseract.image_to_string(img, lang=lang)
                    clean_ocr = normalize_text(ocr_text)
                    if len(clean_ocr.split()) > digital_word_count and len(clean_ocr.split()) >= 5:
                        clean_text = clean_ocr
                        ocr_applied = True
                        ocr_applied_pages.append(page_num)
            except Exception as ocr_err:
                logger.info(f"OCR skipped on page {page_num}: {ocr_err}")

        words = clean_text.split()
        word_count = len(words)
        total_words += word_count

        # 4. Determine authoritative extraction method & visual classification
        if ocr_applied and word_count >= 15:
            extraction_method = "ocr"
            requires_visual = False
            unreadable_reason = None
        elif digital_word_count >= 15:
            extraction_method = "digital_text"
            requires_visual = False
            unreadable_reason = None
        elif has_images:
            extraction_method = "image_only"
            requires_visual = True
            unreadable_reason = f"Image-only page containing {image_count} embedded diagram(s)/illustration(s) without selectable text"
        else:
            extraction_method = "unprocessable"
            requires_visual = False
            unreadable_pages.append(page_num)
            unreadable_reason = "Blank or unreadable page with no selectable text and no detectable images"

        headings = detect_page_headings(clean_text)

        page_record = {
            "pageNumber": page_num,
            "wordCount": word_count,
            "charCount": len(clean_text),
            "hasSelectableText": has_selectable,
            "hasImages": has_images,
            "imageCount": image_count,
            "extractionMethod": extraction_method,
            "ocrApplied": ocr_applied,
            "requiresVisualProcessing": requires_visual,
            "isUnreadable": extraction_method == "unprocessable",
            "unreadableReason": unreadable_reason,
            "headings": headings,
            "snippet": clean_text[:180].replace("\n", " ").strip() if clean_text else (f"[Image Page: {image_count} diagram(s)]" if has_images else "[Empty Page]"),
            "text": clean_text
        }
        pages_audit.append(page_record)

        # 5. Always preserve every page in extracted_text_blocks so no page boundaries are lost
        if clean_text:
            if extraction_method == "image_only":
                extracted_text_blocks.append(f"--- [Page {page_num}] ---\n[Visual Diagram Page: {image_count} image(s)]\n{clean_text}")
            else:
                extracted_text_blocks.append(f"--- [Page {page_num}] ---\n{clean_text}")
        elif extraction_method == "image_only":
            extracted_text_blocks.append(f"--- [Page {page_num}] ---\n[Visual Page / Diagram: {image_count} embedded illustration(s) - Requires Visual Processing]")
        else:
            extracted_text_blocks.append(f"--- [Page {page_num}] ---\n[Blank / Unprocessable Page]")

    full_text = "\n\n".join(extracted_text_blocks)
    doc.close()

    # Malayalam language assessment
    malayalam_chars = len([c for c in full_text if '\u0D00' <= c <= '\u0D7F'])
    malayalam_detected = malayalam_chars > 30

    # Detect chapters across the entire page collection
    detected_chapters = detect_chapters_from_pages(pages_audit, page_count)

    # First and last portions for preview
    first_snippet = full_text[:400].replace("\n", " ").strip() if full_text else ""
    last_snippet = full_text[-400:].replace("\n", " ").strip() if full_text else ""

    # Strict page-level mutually exclusive accounting
    pages_digital = len([p for p in pages_audit if p["extractionMethod"] == "digital_text"])
    pages_ocr = len([p for p in pages_audit if p["extractionMethod"] == "ocr"])
    pages_image = len([p for p in pages_audit if p["extractionMethod"] == "image_only"])
    pages_unproc = len([p for p in pages_audit if p["extractionMethod"] == "unprocessable"])

    image_only_nums = [p["pageNumber"] for p in pages_audit if p["extractionMethod"] == "image_only"]
    unproc_nums = [p["pageNumber"] for p in pages_audit if p["extractionMethod"] == "unprocessable"]
    empty_or_scanned = image_only_nums + unproc_nums
    total_imgs = sum(p["imageCount"] for p in pages_audit)

    document_audit = {
        "filename": filename,
        "totalPages": page_count,
        "processedPages": page_count,
        "pagesWithDigitalText": pages_digital,
        "pagesOcrProcessed": pages_ocr,
        "pagesImageOnly": pages_image,
        "pagesUnprocessable": pages_unproc,
        "pagesWithText": pages_digital + pages_ocr,
        "pagesWithLittleOrNoText": pages_image + pages_unproc,
        "pagesRequiringVisualProcessing": pages_image,
        "imageOnlyPageNumbers": image_only_nums,
        "unprocessedPageNumbers": unproc_nums,
        "emptyOrScannedPageNumbers": empty_or_scanned,
        "totalWordCount": total_words,
        "totalImageCount": total_imgs,
        "hasSelectableText": any(p["hasSelectableText"] for p in pages_audit),
        "malayalamCharCount": malayalam_chars,
        "malayalamDetected": malayalam_detected,
        "firstSnippet": first_snippet,
        "lastSnippet": last_snippet,
        "detectedChapters": detected_chapters
    }

    metadata = {
        "engine": "PyMuPDF" + ("+Tesseract" if ocr_applied_pages else ""),
        "fileHash": file_hash,
        "ocrAppliedPages": ocr_applied_pages,
        "unreadablePages": unreadable_pages,
        "tesseractAvailable": tess_status["available"],
        "pages": pages_audit,
        "detectedChapters": detected_chapters,
        "documentAudit": document_audit
    }

    return page_count, full_text, metadata

def extract_text_from_image_bytes(image_bytes: bytes, filename: str = "scan.png") -> Tuple[str, Dict[str, Any]]:
    """
    Extract text from an image using Tesseract OCR with detailed audit metrics.
    """
    file_hash = compute_sha256(image_bytes)
    tess_status = get_tesseract_status()
    if not tess_status["available"]:
        return "", {
            "success": False,
            "fileHash": file_hash,
            "error": "Tesseract OCR binary is not installed or not in PATH on the host system.",
            "details": tess_status.get("error", "")
        }

    try:
        import pytesseract
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes))
        lang = "mal+eng" if (tess_status["hasMalayalam"] and tess_status["hasEnglish"]) else "eng" if tess_status["hasEnglish"] else None
        
        extracted_text = pytesseract.image_to_string(img, lang=lang) if lang else pytesseract.image_to_string(img)
        clean_text = normalize_text(extracted_text)
        words = clean_text.split()
        
        malayalam_chars = len([c for c in clean_text if '\u0D00' <= c <= '\u0D7F'])

        page_record = {
            "pageNumber": 1,
            "wordCount": len(words),
            "charCount": len(clean_text),
            "hasSelectableText": False,
            "ocrApplied": True,
            "isUnreadable": len(words) == 0,
            "headings": detect_page_headings(clean_text),
            "snippet": clean_text[:200].replace("\n", " ").strip(),
            "text": clean_text
        }

        doc_audit = {
            "filename": filename,
            "totalPages": 1,
            "processedPages": 1,
            "pagesWithText": 1 if len(words) > 0 else 0,
            "pagesWithLittleOrNoText": 0 if len(words) >= 15 else 1,
            "emptyOrScannedPageNumbers": [] if len(words) >= 15 else [1],
            "totalWordCount": len(words),
            "hasSelectableText": False,
            "malayalamCharCount": malayalam_chars,
            "malayalamDetected": malayalam_chars > 20,
            "firstSnippet": clean_text[:300].replace("\n", " ").strip(),
            "lastSnippet": clean_text[-300:].replace("\n", " ").strip(),
            "detectedChapters": [{
                "chapterIndex": 1,
                "title": filename,
                "startPage": 1,
                "endPage": 1,
                "pageCount": 1,
                "snippet": clean_text[:200].replace("\n", " ").strip(),
                "estimatedWordCount": len(words)
            }]
        }

        return clean_text, {
            "success": True,
            "fileHash": file_hash,
            "languageUsed": lang or "default",
            "imageFormat": img.format,
            "imageSize": img.size,
            "pages": [page_record],
            "detectedChapters": doc_audit["detectedChapters"],
            "documentAudit": doc_audit
        }
    except Exception as exc:
        return "", {
            "success": False,
            "fileHash": file_hash,
            "error": str(exc)
        }
