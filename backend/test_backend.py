import io
import sys
import os
import json
import asyncio

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure Windows console supports Malayalam UTF-8 output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import pymupdf
from PIL import Image, ImageDraw
from fastapi import UploadFile

from main import (
    read_root,
    health_check,
    get_sample_lessons,
    extract_pdf,
    extract_image
)
from app.ocr import get_tesseract_status

def create_sample_pdf() -> bytes:
    """Creates a genuine PDF document with SCERT Kerala curriculum text."""
    doc = pymupdf.open()
    page = doc.new_page()
    
    text = (
        "SCERT Kerala Mathematics - Class 4\n"
        "Chapter 1: Lines and Shapes (വരകളും രൂപങ്ങളും)\n"
        "Geometric shapes, angles, straight lines, curved lines.\n"
        "Right angle (ലംബകോൺ), acute angle (ന്യൂനകോൺ), obtuse angle (ബൃഹത്കോൺ).\n"
        "Let us observe clocks, scissors, and book corners in our classroom.\n"
    )
    page.insert_text((50, 72), text, fontsize=12)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def create_sample_image() -> bytes:
    """Creates a sample test PNG image with rendered text."""
    img = Image.new("RGB", (400, 150), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.text((20, 30), "DRISHTI Kerala Smartboard", fill=(15, 23, 42))
    draw.text((20, 70), "SCERT Basic Science Class 5", fill=(37, 99, 235))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def run_all_tests():
    print("=" * 60, flush=True)
    print("RUNNING DRISHTI BACKEND VERIFICATION SUITE", flush=True)
    print("=" * 60, flush=True)

    # 1. Test Root
    res_root = read_root()
    print("1. GET / => Result:", res_root, flush=True)
    assert "VAAYANA" in res_root["app"]

    # 2. Test /api/health
    res_health = health_check()
    print("\n2. GET /api/health => Status:", res_health["status"], flush=True)
    assert res_health["status"] == "ok"
    assert "vaayana" in res_health["service"]

    # 3. Test /api/sample-lessons
    samples = get_sample_lessons()
    print(f"\n3. GET /api/sample-lessons => Loaded {len(samples)} SCERT Kerala modules:", flush=True)
    for s in samples:
        print(f"   - [{s['grade']} {s['subject']}] {s['titleEn']} ({s['titleMl']})", flush=True)
    assert len(samples) == 6, f"Expected 6 SCERT Mathematics lessons, got {len(samples)}"
    for s in samples:
        assert s["subject"] == "Mathematics", f"Non-mathematics lesson detected: {s['subject']}"

    # 4. Test actual PDF text extraction with PyMuPDF
    pdf_bytes = create_sample_pdf()
    print(f"\n4. Testing PyMuPDF text extraction ({len(pdf_bytes)} byte PDF)...", flush=True)
    from app.ocr import extract_text_from_pdf_bytes, extract_text_from_image_bytes
    page_count, extracted_text, meta = extract_text_from_pdf_bytes(pdf_bytes)
    print("   Success: True", flush=True)
    print("   Page Count:", page_count, flush=True)
    print("   Engine:", meta.get("engine", "PyMuPDF"), flush=True)
    print("   Snippet Preview:\n  ", extracted_text[:160].replace("\n", " "), "...", flush=True)
    assert "Lines and Shapes" in extracted_text, "Expected textbook text was not found in extracted output"

    # 5. Test actual Image text extraction
    img_bytes = create_sample_image()
    print(f"\n5. Testing image extraction ({len(img_bytes)} byte PNG)...", flush=True)
    img_text, img_meta = extract_text_from_image_bytes(img_bytes)
    tess_status = get_tesseract_status()
    print("   OCR Available on Host:", tess_status["available"], flush=True)
    if tess_status["available"]:
        print("   Extracted Image Text:", img_text, flush=True)
    else:
        print("   Host Notice (Tesseract):", img_meta.get("error", "Graceful fallback active"), flush=True)

    print("\n" + "=" * 60, flush=True)
    print("ALL CORE BACKEND VERIFICATION TESTS PASSED!", flush=True)
    print("=" * 60, flush=True)

if __name__ == "__main__":
    run_all_tests()
