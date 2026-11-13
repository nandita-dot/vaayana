"""
Complete Teacher Workflow & Deterministic Verification Suite
Tests:
1. 64-page PDF with mixed digital text, image-only pages, and unreadable pages.
2. Complete page accounting (totalPages == sum of mutually exclusive classifications).
3. Zero-call Gemini mocking and cost control (assert live Gemini calls == 0).
4. Multi-concept generation, evidence grounding, and schema integrity.
5. SQLite persistence: draft vs approved versioning, specific version retrieval, invalid IDs.
6. Full end-to-end workflow: Upload -> Audit -> Select Chapter -> Generate -> Save -> Retrieve -> Reopen.
"""

import os
import sys
import json
import hashlib
import io

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

import pymupdf
from PIL import Image

from app.ocr import extract_text_from_pdf_bytes, normalize_text
from app.models import SubjectType, GradeType
from app.gemini_service import (
    filter_text_by_pages,
    generate_manual_template_lesson,
    generate_lesson_with_gemini,
    set_gemini_mock,
    get_live_gemini_call_count,
    reset_live_gemini_call_count
)
from app.database import (
    compute_lesson_cache_key,
    save_lesson_record,
    get_cached_lesson_by_key,
    get_db_lesson_by_id,
    get_all_db_lessons,
    delete_db_lesson,
    init_db
)

def create_sample_image_bytes() -> bytes:
    """Creates a small 100x100 dummy PNG image for PDF embedding."""
    img = Image.new("RGB", (100, 100), color=(30, 80, 180))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def create_complex_64page_pdf() -> bytes:
    """
    Creates a realistic 64-page textbook PDF:
    - Page 1: Unprocessable / blank front cover
    - Pages 2-11: Chapter 1 (Digital text)
    - Page 12: Image-only page (diagram of bird beaks, no selectable text)
    - Pages 13-27: Chapter 2 (Digital text)
    - Page 28: Image-only page (fraction circles chart, no selectable text)
    - Pages 29-44: Chapter 3 (Digital text)
    - Page 45: Image-only page (water cycle Western Ghats map, no selectable text)
    - Pages 46-63: Chapter 4 & 5 (Digital text)
    - Page 64: Blank / unprocessable back cover
    """
    doc = pymupdf.open()
    img_bytes = create_sample_image_bytes()

    for p in range(1, 65):
        page = doc.new_page()

        # Image-only pages on 12, 28, 45 (Contains embedded image, NO digital text)
        if p in (12, 28, 45):
            rect = pymupdf.Rect(50, 50, 400, 400)
            page.insert_image(rect, stream=img_bytes)
            # No insert_text call!
        elif p in (1, 64):
            # Unprocessable / blank cover pages with 0 words
            pass
        else:
            # Digital text page
            if p == 2:
                title = "Unit 1: Wings of Life - Birds Around Us\nജീവന്റെ ചിറകുകൾ\n"
            elif p == 13:
                title = "Chapter 2: Fractions in Daily Life - Equal Sharing\nഭിന്നസംഖ്യകൾ\n"
            elif p == 29:
                title = "Unit 3: The Water Cycle and Kerala Monsoons\nജലചക്രം\n"
            elif p == 46:
                title = "Unit 4: Equal Groups and Multiplication Wonders\nഗുണന വിസ്മയങ്ങൾ\n"
            else:
                title = f"Page {p} Curriculum Content\n"

            body = (
                f"{title}"
                f"This is page {p} of the Kerala SCERT textbook. "
                "Students observe nature and practice mathematics using classroom smartboards. "
                "Learning through active inquiry and bilingual understanding builds foundational conceptual clarity. "
                "Every organism and mathematical principle is illustrated with everyday local Kerala examples."
            )
            page.insert_text((50, 70), body, fontsize=11)

    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def run_tests():
    print("=" * 75)
    print("VAAYANA COMPLETE TEACHER WORKFLOW & DETERMINISTIC VERIFICATION SUITE")
    print("=" * 75)

    reset_live_gemini_call_count()
    init_db()

    # --------------------------------------------------------------------------
    # STAGE 1: PDF Processing & Strict Page Accounting on 64-Page Textbook
    # --------------------------------------------------------------------------
    print("\n[Stage 1] Testing 64-page PDF with mixed digital text, image-only, & blank pages...")
    pdf_bytes = create_complex_64page_pdf()
    file_hash = hashlib.sha256(pdf_bytes).hexdigest()
    print(f"Generated 64-page PDF ({len(pdf_bytes)} bytes, SHA-256: {file_hash[:12]}...)")

    page_count, full_text, meta = extract_text_from_pdf_bytes(pdf_bytes, filename="class4_kerala_textbook_64p.pdf")
    audit = meta["documentAudit"]
    pages = meta["pages"]

    print(f"  - Total Pages in Document: {audit['totalPages']}")
    print(f"  - Pages with Digital Text: {audit['pagesWithDigitalText']}")
    print(f"  - Pages Processed with OCR: {audit['pagesOcrProcessed']}")
    print(f"  - Image-Only / Diagram Pages: {audit['pagesImageOnly']}")
    print(f"  - Unprocessable / Blank Pages: {audit['pagesUnprocessable']}")
    print(f"  - Total Words Extracted: {audit['totalWordCount']}")
    print(f"  - Total Images Detected: {audit['totalImageCount']}")
    print(f"  - Image-only Page Numbers: {audit['imageOnlyPageNumbers']}")
    print(f"  - Unprocessable Page Numbers: {audit['unprocessedPageNumbers']}")

    # Assertions for Bug 1
    assert audit["totalPages"] == 64, f"Expected 64 pages, got {audit['totalPages']}"
    assert len(pages) == 64, f"Expected 64 page records, got {len(pages)}"

    # Check strict mathematical partition invariant
    partition_sum = (
        audit["pagesWithDigitalText"] + 
        audit["pagesOcrProcessed"] + 
        audit["pagesImageOnly"] + 
        audit["pagesUnprocessable"]
    )
    assert partition_sum == 64, f"Page classification partition invariant failed: {partition_sum} != 64"

    # Verify exact image-only pages
    assert audit["pagesImageOnly"] == 3, f"Expected 3 image-only pages, got {audit['pagesImageOnly']}"
    assert audit["imageOnlyPageNumbers"] == [12, 28, 45], f"Wrong image-only page numbers: {audit['imageOnlyPageNumbers']}"

    # Verify unprocessable cover pages
    assert audit["pagesUnprocessable"] == 2, f"Expected 2 unprocessable pages, got {audit['pagesUnprocessable']}"
    assert audit["unprocessedPageNumbers"] == [1, 64], f"Wrong unprocessable page numbers: {audit['unprocessedPageNumbers']}"

    # Verify that image-only pages are flagged as requiring visual processing
    for p_num in (12, 28, 45):
        p_record = pages[p_num - 1]
        assert p_record["hasImages"] is True, f"Page {p_num} should have hasImages=True"
        assert p_record["extractionMethod"] == "image_only", f"Page {p_num} should have extractionMethod='image_only'"
        assert p_record["requiresVisualProcessing"] is True, f"Page {p_num} should have requiresVisualProcessing=True"

    # Verify that EVERY page boundary exists in full_text
    for p_num in range(1, 65):
        assert f"--- [Page {p_num}] ---" in full_text, f"Missing page boundary for Page {p_num} in full_text!"

    print("✓ STAGE 1 PASSED: 100% of 64 pages accounted for; image-only pages cleanly indexed without silent dropping.")

    # --------------------------------------------------------------------------
    # STAGE 2: Cost Control Guard — Zero Live Gemini API Calls
    # --------------------------------------------------------------------------
    print("\n[Stage 2] Verifying Cost Control & Deterministic Mocking...")

    mock_gemini_lesson = {
        "titleEn": "Fractions in Daily Life: Equal Sharing",
        "titleMl": "ഭിന്നസംഖ്യകൾ: തുല്യമായി പങ്കുവെക്കാം",
        "descriptionEn": "Exploring halves, quarters, and denominators using classroom dosas and appams.",
        "descriptionMl": "ദോശയും അപ്പവും തുല്യമായി വീതിച്ച് ഭിന്നസംഖ്യകൾ പഠിക്കാം.",
        "learningObjectivesEn": [
            "Understand fractions as equal parts of a whole",
            "Identify numerators and denominators",
            "Find equivalent fractions visually"
        ],
        "learningObjectivesMl": [
            "ഭിന്നസംഖ്യകൾ തുല്യ ഭാഗങ്ങളാണെന്ന് മനസ്സിലാക്കുക",
            "അംശവും ഛേദവും തിരിച്ചറിയുക",
            "തുല്യ ഭിന്നസംഖ്യകൾ കണ്ടെത്തുക"
        ],
        "concepts": [
            {
                "id": "c1",
                "titleEn": "Equal Sharing into Halves (1/2)",
                "titleMl": "തുല്യ പങ്കിടലും പകുതിയും (1/2)",
                "explanationEn": "Dividing a single whole object into two identical parts creates one-half.",
                "explanationMl": "ഒരു വസ്തുവിനെ രണ്ട് തുല്യ ഭാഗങ്ങളാക്കുമ്പോൾ ഓരോന്നും പകുതിയാണ്.",
                "realLifeExampleEn": "Sharing a round dosa equally between two friends.",
                "realLifeExampleMl": "രണ്ട് കുട്ടികൾക്ക് ഒരു ദോശ തുല്യമായി പങ്കുവെക്കുന്നത്.",
                "suggestedVisual": "Circle divided into two equal halves",
                "sourcePage": "13",
                "evidenceSnippet": "Chapter 2: Fractions in Daily Life - Equal Sharing"
            },
            {
                "id": "c2",
                "titleEn": "Numerator and Denominator",
                "titleMl": "അംശവും ഛേദവും",
                "explanationEn": "The denominator shows total equal parts; numerator shows chosen parts.",
                "explanationMl": "ആകെ ഭാഗങ്ങളുടെ എണ്ണം ഛേദവും, എടുത്ത ഭാഗങ്ങൾ അംശവുമാണ്.",
                "realLifeExampleEn": "Drinking 1 glass out of a 4-glass jug.",
                "realLifeExampleMl": "നാല് ഗ്ലാസ്സിൽ നിന്ന് ഒരു ഗ്ലാസ്സ് കുടിക്കുന്നത്.",
                "suggestedVisual": "Fraction bar illustration",
                "sourcePage": "14",
                "evidenceSnippet": "Students observe nature and practice mathematics using classroom smartboards."
            },
            {
                "id": "c3",
                "titleEn": "Equivalent Fractions: 1/2 = 2/4 = 4/8",
                "titleMl": "തുല്യ ഭിന്നസംഖ്യകൾ",
                "explanationEn": "Fractions that look different can represent the exact same portion.",
                "explanationMl": "വ്യത്യസ്തമായി എഴുതിയാലും ഒരേ അളവിനെ സൂചിപ്പിക്കുന്ന ഭിന്നസംഖ്യകൾ.",
                "realLifeExampleEn": "Cutting a half-watermelon into two quarters.",
                "realLifeExampleMl": "പകുതി തണ്ണിമത്തൻ വീണ്ടും രണ്ട് കഷ്ണങ്ങളാക്കുന്നത്.",
                "suggestedVisual": "Side-by-side fraction circle comparison",
                "sourcePage": "15",
                "evidenceSnippet": "Every organism and mathematical principle is illustrated with everyday local Kerala examples."
            }
        ],
        "vocabulary": [
            {
                "word": "Denominator",
                "meaningEn": "The bottom number indicating total parts",
                "meaningMl": "ആകെ തുല്യ ഭാഗങ്ങളുടെ എണ്ണം",
                "exampleEn": "In 1/2, the denominator is 2.",
                "exampleMl": "1/2 എന്നതിൽ ഛേദം 2 ആണ്.",
                "synonyms": ["Base count"],
                "suggestedVisual": "Fraction symbol",
                "emphasisEffect": "none"
            }
        ],
        "activity": {
            "titleEn": "Fraction Playground Manipulative",
            "titleMl": "ഭിന്നസംഖ്യാ കളിസ്ഥലം",
            "interactionType": "fraction_playground",
            "learningObjectiveEn": "Visually manipulate circle and bar fractions",
            "learningObjectiveMl": "വൃത്തത്തിലും ദണ്ഡിലും ഭിന്നസംഖ്യകൾ പരിശീലിപ്പിക്കുക",
            "instructionEn": "Adjust numerator and denominator to see equal portions",
            "instructionMl": "അംശവും ഛേദവും മാറ്റി തുല്യ ഭാഗങ്ങൾ നിരീക്ഷിക്കുക",
            "items": []
        },
        "interactiveModule": "fraction_playground",
        "quiz": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "questionEn": "If a dosa is divided into 2 equal parts, what is each part called?",
                "questionMl": "ഒരു ദോശ 2 തുല്യ ഭാഗങ്ങളാക്കിയാൽ ഓരോ ഭാഗത്തെയും എന്ത് വിളിക്കുന്നു?",
                "optionsEn": ["One-half (1/2)", "One-fourth (1/4)", "Three-fourths (3/4)", "One whole"],
                "optionsMl": ["പകുതി (1/2)", "കാൽ ഭാഗം (1/4)", "മുക്കാൽ ഭാഗം (3/4)", "പൂർണ്ണം"],
                "correctIndex": 0,
                "explanationEn": "Two equal portions of a single whole are called halves.",
                "explanationMl": "ഒരു വസ്തുവിനെ രണ്ട് തുല്യ ഭാഗങ്ങളാക്കിയാൽ ഓരോന്നും പകുതിയാണ്.",
                "sourcePageRef": "13"
            }
        ]
    }

    # Inject mock response
    set_gemini_mock(mock_gemini_lesson)

    # Test generation with Chapter 2 (Pages 13-27)
    gen_response = generate_lesson_with_gemini(
        raw_text=full_text,
        subject="Mathematics",
        grade="Class 4",
        chapter_title="Fractions in Daily Life",
        start_page=13,
        end_page=27,
        source_file_hash=file_hash,
        source_file_name="class4_kerala_textbook_64p.pdf"
    )

    # Cost Control Assertion
    live_calls = get_live_gemini_call_count()
    print(f"  - Actual Live Gemini API Calls Made: {live_calls}")
    assert live_calls == 0, f"Cost Control Failure: Expected 0 live Gemini API calls, but {live_calls} were made!"

    assert gen_response.success is True, "Generation failed"
    generated_lesson = gen_response.lesson
    assert generated_lesson is not None, "Lesson is None"

    print("✓ STAGE 2 PASSED: Generation completed deterministically with ZERO live Gemini API calls.")

    # --------------------------------------------------------------------------
    # STAGE 3: Concept Data Flow, Grounding, and Schema Verification
    # --------------------------------------------------------------------------
    print("\n[Stage 3] Testing Concept Data Flow & Evidence Grounding...")
    concepts = generated_lesson.concepts
    assert len(concepts) == 3, f"Expected 3 concepts, got {len(concepts)}"

    for i, c in enumerate(concepts):
        print(f"  Concept {i+1}: '{c.titleEn}' / '{c.titleMl}'")
        print(f"    - Page Ref: {c.sourcePage}")
        print(f"    - Grounding Quote: '{c.evidenceSnippet}'")
        
        # Verify schema integrity
        assert c.id, f"Concept {i+1} missing ID"
        assert c.titleEn, f"Concept {i+1} missing titleEn"
        assert c.titleMl, f"Concept {i+1} missing titleMl"
        assert c.explanationEn, f"Concept {i+1} missing explanationEn"
        assert c.explanationMl, f"Concept {i+1} missing explanationMl"
        assert c.sourcePage in ("13", "14", "15"), f"Concept {i+1} page ref out of range: {c.sourcePage}"
        assert c.evidenceSnippet, f"Concept {i+1} missing evidenceSnippet"

    # Verify slide generation and manipulative linking
    slides = generated_lesson.slides
    assert len(slides) >= 4, f"Expected at least 4 slides, got {len(slides)}"
    assert slides[1].interactiveModule == "fraction_playground", "Slide 2 should link fraction_playground"
    assert slides[1].evidenceSnippet, "Slide 2 should retain evidenceSnippet"
    assert slides[1].sourcePageRef, "Slide 2 should retain sourcePageRef"

    print("✓ STAGE 3 PASSED: All concepts retain complete schema, evidence quotes, and slide mapping.")

    # --------------------------------------------------------------------------
    # STAGE 4: SQLite Persistence & Versioning (Bug 3 Verification)
    # --------------------------------------------------------------------------
    print("\n[Stage 4] Testing SQLite Persistence Contract, Drafts & Versioning...")
    lesson_id = generated_lesson.id
    lesson_dict = generated_lesson.model_dump()
    lesson_dict["sourceFileHash"] = file_hash

    # 1. Save as Draft (Version 1)
    v1_id, v1_num = save_lesson_record(
        lesson_dict=lesson_dict,
        approval_status="draft",
        start_page=13,
        end_page=27
    )
    print(f"  - Saved Version 1 (Draft): ID='{v1_id}', Version={v1_num}")
    assert v1_num == 1, f"Expected version 1, got {v1_num}"

    # Retrieve by ID -> returns draft v1
    retrieved_v1 = get_db_lesson_by_id(lesson_id)
    assert retrieved_v1 is not None, f"Failed to retrieve lesson by ID '{lesson_id}'"
    assert retrieved_v1["approvalStatus"] == "draft", "Expected approvalStatus='draft'"
    assert retrieved_v1["version"] == 1, "Expected version 1"

    # Query with require_approved=True -> should return None (no approved version exists yet)
    approved_check_none = get_db_lesson_by_id(lesson_id, require_approved=True)
    assert approved_check_none is None, "Draft leaked into require_approved query!"

    # 2. Save as Approved (Version 2)
    v2_id, v2_num = save_lesson_record(
        lesson_dict=lesson_dict,
        approval_status="approved",
        start_page=13,
        end_page=27
    )
    print(f"  - Saved Version 2 (Approved): ID='{v2_id}', Version={v2_num}")
    assert v2_num == 2, f"Expected version 2, got {v2_num}"

    # Query with require_approved=True -> MUST return Version 2 (approved)
    retrieved_approved = get_db_lesson_by_id(lesson_id, require_approved=True)
    assert retrieved_approved is not None, "Failed to retrieve approved lesson"
    assert retrieved_approved["version"] == 2, f"Expected approved version 2, got {retrieved_approved['version']}"
    assert retrieved_approved["approvalStatus"] == "approved"

    # 3. Save a subsequent Draft (Version 3)
    lesson_dict["descriptionEn"] = "WIP Teacher Edits in progress"
    v3_id, v3_num = save_lesson_record(
        lesson_dict=lesson_dict,
        approval_status="draft",
        start_page=13,
        end_page=27
    )
    print(f"  - Saved Version 3 (Draft WIP): ID='{v3_id}', Version={v3_num}")
    assert v3_num == 3, f"Expected version 3, got {v3_num}"

    # Classroom Mode check: MUST NOT return Version 3 draft! Must return Version 2 approved!
    classroom_lesson = get_db_lesson_by_id(lesson_id, require_approved=True)
    assert classroom_lesson is not None, "Classroom retrieval failed"
    assert classroom_lesson["version"] == 2, f"Draft Version 3 leaked into classroom mode! Got v{classroom_lesson['version']}"
    assert classroom_lesson["approvalStatus"] == "approved"

    # Query by specific version ID (e.g., v1_id) -> retrieves exact older version
    old_v1 = get_db_lesson_by_id(v1_id)
    assert old_v1 is not None, f"Failed to retrieve specific older version '{v1_id}'"
    assert old_v1["version"] == 1, f"Expected version 1, got {old_v1['version']}"

    # 4. Test invalid lesson ID handling
    invalid_res = get_db_lesson_by_id("non-existent-lesson-id-99999")
    assert invalid_res is None, "Invalid ID should return None"

    print("✓ STAGE 4 PASSED: Authoritative SQLite persistence, versioning, and draft isolation verified.")

    # --------------------------------------------------------------------------
    # STAGE 5: End-to-End Workflow & Browser Reopen Simulation (Bug 2 & Bug 3)
    # --------------------------------------------------------------------------
    print("\n[Stage 5] Simulating Full Teacher Workflow & Browser Refresh Reopen...")

    # All lessons in library must include the saved lesson
    all_db = get_all_db_lessons()
    matching_in_lib = [l for l in all_db if l.get("id") == lesson_id]
    assert len(matching_in_lib) == 1, f"Expected 1 entry in library for '{lesson_id}', found {len(matching_in_lib)}"
    print(f"  - Lesson verified in Library view: '{matching_in_lib[0]['titleEn']}'")

    # Simulate Teacher Refresh: Query again by ID
    reopened_lesson = get_db_lesson_by_id(lesson_id)
    assert reopened_lesson is not None, "Lesson disappeared on refresh simulation!"
    assert len(reopened_lesson["concepts"]) == 3, "Concepts lost after reopening lesson!"
    assert reopened_lesson["concepts"][0]["evidenceSnippet"], "Evidence snippet lost on reopen!"

    # Final Cost Control Check
    total_live_calls = get_live_gemini_call_count()
    print(f"\nFinal Audit: Total Live Gemini API Calls during entire test run: {total_live_calls}")
    assert total_live_calls == 0, f"Cost Control Violation: {total_live_calls} live API calls made!"

    print("\n" + "=" * 75)
    print("ALL 5 VERIFICATION SUITES PASSED CLEANLY (ZERO GEMINI API CALLS)")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
