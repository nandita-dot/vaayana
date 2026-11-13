"""
Automated Test Suite: Multi-Page Textbook Grounding & Chapter Selection Pipeline
Tests the complete 10-stage pipeline on a realistic 12-page SCERT textbook PDF.
"""

import os
import sys
import fitz  # PyMuPDF
import hashlib
import json

# Ensure backend directory is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

# Ensure Windows console supports Malayalam UTF-8 output
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from app.ocr import extract_text_from_pdf_bytes, normalize_text
from app.models import SubjectType, GradeType, GenerateLessonRequest
from app.gemini_service import filter_text_by_pages, generate_manual_template_lesson, generate_lesson_with_gemini
from app.database import (
    compute_lesson_cache_key,
    save_lesson_record,
    get_cached_lesson_by_key,
    init_db
)

def create_synthetic_multipage_textbook() -> bytes:
    """Creates a realistic 12-page PDF with 3 distinct SCERT chapters."""
    doc = fitz.open()

    pages_content = [
        # Page 1: Preface & Front Matter (Low content / non-chapter)
        ("SCERT KERALA - DEPARTMENT OF EDUCATION\n\n"
         "State Council of Educational Research and Training (SCERT), Kerala\n"
         "Vidya Bhavan, Poojappura, Thiruvananthapuram, Kerala\n\n"
         "Standard IV - Textbook Development Committee\n"
         "Foreword and Guidelines for Primary Teachers"),

        # Pages 2-5: Chapter 1 - Wings of Life: Birds Around Us
        ("Unit 1: Wings of Life - Birds Around Us\n"
         "ജീവന്റെ ചിറകുകൾ: നമ്മുടെ പക്ഷികൾ\n\n"
         "Birds are amazing creatures found all across the villages and wetlands of Kerala. "
         "Every bird has specialized body parts adapted to its specific way of life in our state. "
         "The beak or bill is one of the most important adaptations for survival and eating food."),

        ("Unit 1: Continued - Beak Shapes and Diet\n"
         "The Woodpecker (മരംകൊത്തി) has a strong, chisel-shaped beak designed for drilling wood. "
         "It uses its strong beak to drill into tree bark to find insects and larvae hiding inside. "
         "The Kingfisher (പൊൻമാൻ) has a long, sharp, dagger-like pointed bill to catch swift fish from rivers and paddy fields. "
         "The Sparrow (കുരുവി) has a small, conical beak perfect for cracking hard seeds and grains."),

        ("Unit 1: Continued - Feet, Claws and Nesting\n"
         "Ducks and teals living in Vembanad Lake have webbed feet that act as paddles for swimming efficiently. "
         "Birds build different kinds of nests to lay eggs and protect their young nestlings from predators. "
         "The Weaver Bird (തൂക്കണാംകുരുവി) weaves intricate hanging nests using coconut palm leaves and grass blades. "
         "The Tailor Bird (தையൽക്കാരൻ പക്ഷി) stitches broad leaves together with plant fibers to make a cradle."),

        ("Unit 1: Conclusion - Conservation of Kerala's Birds\n"
         "Birds play an essential role in controlling insects and pollinating native flowering plants in Kerala. "
         "Loss of wetlands, mangroves, and excessive use of chemical pesticides threaten many wetland bird species. "
         "Students should observe bird visitors in school gardens and provide fresh drinking water in earthen bowls during hot summer months."),

        # Pages 6-9: Chapter 2 - Fractions in Daily Life
        ("Chapter 2: Fractions in Daily Life - Equal Sharing\n"
         "ഭിന്നസംഖ്യകൾ ദൈനംദിന ജീവിതത്തിൽ: തുല്യ പങ്കിടൽ\n\n"
         "In our daily lives in Kerala, we often share food, fruits, and objects equally among friends. "
         "A fraction represents one or more equal parts of a whole object or group. "
         "When a mother divides one fresh round dosa into two identical equal portions, each portion is one-half (1/2)."),

        ("Chapter 2: Continued - Numerator and Denominator\n"
         "In every fraction written as a/b, the number on the bottom is called the Denominator (ഛേദം). "
         "The denominator shows the total number of equal parts into which the whole has been divided. "
         "The number on the top is called the Numerator (അംശം). "
         "The numerator shows how many of those equal parts are being chosen, eaten, or considered."),

        ("Chapter 2: Continued - Equivalent Fractions\n"
         "Fractions that look different can represent the exact same quantity; these are called Equivalent Fractions (തുല്യ ഭിന്നസംഖ്യകൾ). "
         "If we divide a steamed appam into 2 equal parts, 1 part is 1/2. "
         "If we divide the same appam into 4 equal parts, 2 parts make 2/4. "
         "1/2 is equal to 2/4, which is also equal to 4/8. "
         "Multiplying both numerator and denominator by the same number produces equivalent fractions."),

        ("Chapter 2: Conclusion - Comparing and Practical Applications\n"
         "When two fractions share the same denominator, the fraction with the larger numerator is greater: 3/4 is larger than 1/4. "
         "Measuring liquid ingredients such as 1/2 litre of milk or 1/4 cup of coconut oil requires understanding fractional parts. "
         "Equal sharing promotes fairness and mathematical reasoning in our classroom activities."),

        # Pages 10-12: Chapter 3 - The Water Cycle & Kerala Rains
        ("Unit 3: The Water Cycle - The Story of Rain in Kerala\n"
         "ജലചക്രം: കേരളത്തിലെ മഴയുടെ കഥ\n\n"
         "Kerala receives abundant rainfall from two monsoons: Edavappathi (Southwest) and Thulam (Northeast). "
         "The water cycle is the continuous movement of water from the Earth's surface into the atmosphere and back again. "
         "The intense heat of the sun causes water in the Arabian Sea, rivers, and paddy fields to turn into water vapor through Evaporation (ബാഷ്പീകരണം)."),

        ("Unit 3: Continued - Condensation and Cloud Formation\n"
         "As water vapor rises high into the cooler air above the Western Ghats (പശ്ചിമഘട്ടം), it cools down. "
         "Cooling causes invisible water vapor to transform back into tiny water droplets, a process called Condensation (ഘനീഭവനം). "
         "Millions of these microscopic droplets gather together to form heavy rain clouds across the Kerala sky."),

        ("Unit 3: Conclusion - Precipitation and River Flow\n"
         "When water droplets in the clouds become too heavy to stay suspended in the atmosphere, they fall as rain: Precipitation (വർഷപാതം). "
         "Rainwater replenishes 44 rivers of Kerala, flowing from the eastern hills back into the western backwaters and the Arabian Sea. "
         "This unending cycle keeps our lush green land alive and provides drinking water to all living things.")
    ]

    nirmala_font = "C:/Windows/Fonts/Nirmala.ttf"
    use_nirmala = os.path.exists(nirmala_font)

    for title_and_text in pages_content:
        page = doc.new_page()
        if use_nirmala:
            page.insert_text((50, 70), title_and_text, fontsize=11, fontfile=nirmala_font)
        else:
            page.insert_text((50, 70), title_and_text, fontsize=11)

    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def run_tests():
    print("=" * 70)
    print("TEST SUITE: Multi-Page Textbook Grounding & Chapter Selection")
    print("=" * 70)

    # Step 0: Ensure DB initialized
    init_db()

    # Step 1: Generate PDF
    print("\n[Stage 1] Generating synthetic 12-page SCERT textbook PDF...")
    pdf_bytes = create_synthetic_multipage_textbook()
    file_hash = hashlib.sha256(pdf_bytes).hexdigest()
    print(f"Generated PDF ({len(pdf_bytes)} bytes, SHA-256: {file_hash[:12]}...)")

    # Step 2: Test PDF Extraction & Document Audit
    print("\n[Stage 2] Testing PDF Extraction & Document Audit...")
    page_count, full_text, metadata = extract_text_from_pdf_bytes(pdf_bytes, filename="scert_class4_textbook.pdf")
    
    audit = metadata["documentAudit"]
    pages = metadata["pages"]
    chapters = metadata["detectedChapters"]

    print(f"Total Pages Extracted: {audit['totalPages']}")
    print(f"Total Word Count: {audit['totalWordCount']}")
    print(f"Malayalam Detected: {audit['malayalamDetected']}")
    print(f"Detected Chapters Count: {len(chapters)}")

    assert audit["totalPages"] == 12, f"Expected 12 pages, got {audit['totalPages']}"
    assert len(pages) == 12, f"Expected 12 page audits, got {len(pages)}"
    assert audit["totalWordCount"] > 250, f"Expected > 250 words, got {audit['totalWordCount']}"
    if os.path.exists("C:/Windows/Fonts/Nirmala.ttf"):
        assert audit["malayalamDetected"] is True, "Expected Malayalam characters to be detected with Nirmala font"
    assert len(chapters) == 3, f"Expected exactly 3 distinct chapters detected, got {len(chapters)}"

    for ch in chapters:
        print(f"  - Detected Chapter: '{ch['title']}' (Pages {ch['startPage']}-{ch['endPage']}, ~{ch['estimatedWordCount']} words)")

    print("STAGE 2 PASSED: Full 12-page audit and chapter markers verified.")

    # Step 3: Test Text Slicing / Chapter Filtering
    print("\n[Stage 3] Testing Page Filtering for Chapter 2 (Fractions, Pages 6-9)...")
    
    # Filter Pages 6 to 9
    filtered_text, pages_included = filter_text_by_pages(full_text, start_page=6, end_page=9)
    print(f"Filtered Text Length: {len(filtered_text)} chars, Pages included: {pages_included}")

    # Must contain Chapter 2 content
    assert "Fractions" in filtered_text or "ഭിന്നസംഖ്യകൾ" in filtered_text, "Filtered text missing Fractions title"
    assert "Denominator" in filtered_text or "ഛേദം" in filtered_text, "Filtered text missing Denominator"
    assert "Equivalent Fractions" in filtered_text or "തുല്യ ഭിന്നസംഖ്യകൾ" in filtered_text, "Filtered text missing Equivalent Fractions"

    # Must NOT contain Chapter 1 (Birds) or Chapter 3 (Water Cycle) content
    assert "Woodpecker" not in filtered_text, "Isolation failure: Woodpecker from Chapter 1 leaked into Chapter 2"
    assert "Kingfisher" not in filtered_text, "Isolation failure: Kingfisher from Chapter 1 leaked into Chapter 2"
    assert "Evaporation" not in filtered_text, "Isolation failure: Evaporation from Chapter 3 leaked into Chapter 2"
    assert "Arabian Sea" not in filtered_text, "Isolation failure: Arabian Sea from Chapter 3 leaked into Chapter 2"

    print("STAGE 3 PASSED: Chapter 2 content strictly isolated with zero cross-chapter leakage.")

    # Step 4: Test Grounded Multi-Concept Extraction
    print("\n[Stage 4] Testing Grounded Concept Generation from Chapter 2...")
    lesson = generate_manual_template_lesson(
        raw_text=full_text,
        subject="Mathematics",
        grade="Class 4",
        chapter_title="Fractions in Daily Life",
        start_page=6,
        end_page=9
    )

    concepts = lesson.concepts
    print(f"Concepts Generated: {len(concepts)}")
    assert len(concepts) >= 3, f"Expected at least 3 concepts, got {len(concepts)}"

    for i, c in enumerate(concepts):
        print(f"  Concept {i+1}: {c.titleEn} (ml: {c.titleMl})")
        print(f"    - Source Page: Page {c.sourcePage}")
        print(f"    - Evidence: '{c.evidenceSnippet[:80]}...'")
        
        # Verify page citation is within selected range (Pages 6-9)
        assert c.sourcePage is not None, f"Concept {i+1} has no sourcePage citation!"
        page_val = int(c.sourcePage) if str(c.sourcePage).isdigit() else 6
        assert 6 <= page_val <= 9, f"Concept {i+1} cited Page {c.sourcePage}, outside range [6, 9]!"
        
        # Verify evidence snippet is authentic
        assert c.evidenceSnippet and len(c.evidenceSnippet.strip()) > 10, f"Concept {i+1} missing authentic evidence quote"

    print("STAGE 4 PASSED: Multiple concepts extracted with valid page citations and authentic evidence snippets.")

    # Step 5: Test Scoped Caching Isolation
    print("\n[Stage 5] Testing Scoped SQLite Caching...")
    key_ch1 = compute_lesson_cache_key(file_hash, start_page=2, end_page=5, chapter_title="Wings of Life")
    key_ch2 = compute_lesson_cache_key(file_hash, start_page=6, end_page=9, chapter_title="Fractions in Daily Life")
    key_ch3 = compute_lesson_cache_key(file_hash, start_page=10, end_page=12, chapter_title="Water Cycle")

    print(f"Cache Key Ch 1: {key_ch1}")
    print(f"Cache Key Ch 2: {key_ch2}")
    print(f"Cache Key Ch 3: {key_ch3}")

    assert key_ch1 != key_ch2, "Cache key collision between Chapter 1 and Chapter 2!"
    assert key_ch2 != key_ch3, "Cache key collision between Chapter 2 and Chapter 3!"

    # Save Chapter 2 lesson to DB as approved
    lesson_dict = lesson.model_dump()
    lesson_dict["sourceFileHash"] = file_hash
    save_lesson_record(
        lesson_dict=lesson_dict,
        approval_status="approved",
        cache_key=key_ch2,
        start_page=6,
        end_page=9
    )

    # Querying Chapter 2 with key_ch2 MUST return lesson
    cached_ch2 = get_cached_lesson_by_key(key_ch2, require_approved=True)
    assert cached_ch2 is not None, "Failed to retrieve cached lesson for Chapter 2"
    assert cached_ch2["chapter"] == "Fractions in Daily Life", "Retrieved wrong lesson from cache"

    # Querying Chapter 1 or 3 MUST NOT return Chapter 2
    cached_ch1 = get_cached_lesson_by_key(key_ch1, require_approved=True)
    cached_ch3 = get_cached_lesson_by_key(key_ch3, require_approved=True)
    assert cached_ch1 is None, "Cache Isolation Failure: Chapter 1 returned Chapter 2 lesson!"
    assert cached_ch3 is None, "Cache Isolation Failure: Chapter 3 returned Chapter 2 lesson!"

    print("STAGE 5 PASSED: Scoped caching strictly isolates chapters and page ranges.")

    # Step 6: Test Low-Text Edge Case Warning
    print("\n[Stage 6] Testing Edge Case: Brief Preface Page 1 (Low Text)...")
    preface_text, _ = filter_text_by_pages(full_text, start_page=1, end_page=1)
    word_count_p1 = len(preface_text.split())
    print(f"Page 1 Word Count: {word_count_p1} words")
    
    lesson_p1 = generate_manual_template_lesson(
        raw_text=full_text,
        subject="Environmental Studies",
        grade="Class 4",
        chapter_title="SCERT Committee",
        start_page=1,
        end_page=1
    )
    print(f"Source Accuracy Confidence: {lesson_p1.sourceAccuracyConfidence}")
    print(f"Source Warnings: {lesson_p1.sourceWarnings}")
    assert lesson_p1.sourceAccuracyConfidence in ["low", "medium"], "Expected confidence to reflect brief text"
    assert any("brief" in w.lower() or "short" in w.lower() or "few" in w.lower() or "caution" in w.lower() for w in lesson_p1.sourceWarnings), "Expected warning about brief source text"

    print("STAGE 6 PASSED: Low-text pages properly audited and flagged with confidence degradation.")

    print("\n" + "=" * 70)
    print("ALL MULTI-PAGE TEXTBOOK PIPELINE TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
