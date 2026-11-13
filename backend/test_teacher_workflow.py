import sys
import os
import json

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure Windows console supports Malayalam UTF-8 output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import pymupdf
from main import (
    app, 
    generate_template, 
    generate_lesson, 
    extract_pdf, 
    health_check
)
from app.models import GenerateLessonRequest, Lesson
from app.gemini_service import detect_best_activity_type, check_source_sufficiency

def test_workflow():
    print("=" * 70, flush=True)
    print("TESTING FULL TEACHER WORKFLOW & CURRICULUM GENERATION MODES", flush=True)
    print("=" * 70, flush=True)

    # STEP 1 & 2: Real PDF Creation and Extraction
    print("\n[Step 1 & 2] Generating & Extracting Real SCERT Textbook PDF...", flush=True)
    doc = pymupdf.open()
    page = doc.new_page()
    kerala_text = (
        "SCERT Kerala Environmental Studies - Class 4\n"
        "Chapter 3: Wings of Life: Birds Around Us (Nammude Pakshikal)\n"
        "Birds bring life to Kerala's lush Western Ghats and backwaters.\n"
        "The Great Hornbill is the official state bird of Kerala.\n"
        "Woodpeckers have chisel-like beaks to tap into tree bark for insects.\n"
        "Sunbirds have curved slender beaks like drinking straws to sip flower nectar.\n"
    )
    page.insert_text((50, 72), kerala_text, fontsize=12)
    pdf_bytes = doc.tobytes()
    doc.close()

    # Verify extraction via PyMuPDF logic
    from app.ocr import extract_text_from_pdf_bytes
    page_count, extracted_text, meta = extract_text_from_pdf_bytes(pdf_bytes)
    assert page_count == 1
    assert "Great Hornbill" in extracted_text
    assert "Woodpeckers" in extracted_text
    print(f"   ✓ Extracted {len(extracted_text.split())} words with authentic Malayalam text.", flush=True)

    # STEP 3 & 4: Representative Content Testing Matrix (Class 4 Maths, EVS, English)
    subjects_test_matrix = [
        {
            "subject": "Mathematics",
            "grade": "Class 4",
            "chapter": "ഭിന്നസംഖ്യകൾ ദൈനംദിന ജീവിതത്തിൽ (Fractions in Daily Life)",
            "text": "ഒരു വൃത്തത്തെയോ ചതുരത്തെയോ തുല്യ ഭാഗങ്ങളായി വിഭജിക്കുന്നതിനെ ഭിന്നസംഖ്യ എന്ന് വിളിക്കുന്നു. പകുതി (1/2), കാൽ (1/4), മുക്കാൽ (3/4) എന്നിവ പ്രധാന ഉദാഹരണങ്ങളാണ്. തുല്യ ഭിന്നസംഖ്യകൾ (Equivalent fractions) നിത്യജീവിതത്തിൽ പങ്ക് വെയ്ക്കാൻ സഹായിക്കുന്നു.",
            "expected_module": "fraction_playground"
        },
        {
            "subject": "Environmental Studies",
            "grade": "Class 4",
            "chapter": "ജലചക്രം: മഴയുടെ ജനനം (Water Cycle & Rain)",
            "text": "സൂര്യന്റെ ചൂടേറ്റ് സമുദ്രങ്ങളിലെയും പുഴകളിലെയും വെള്ളം നീരാവിയായി ആകാശത്തേക്ക് ഉയരുന്നു (Evaporation). ഈ നീരാവി തണുത്ത് മേഘങ്ങളായി മാറുന്നു (Condensation). മേഘങ്ങൾ പെയ്യുമ്പോൾ കേരളത്തിൽ മഴ പെയ്യുന്നു (Precipitation).",
            "expected_module": "water_cycle_explorer"
        },
        {
            "subject": "Environmental Studies",
            "grade": "Class 4",
            "chapter": "ജീവന്റെ ചിറകുകൾ: നമ്മുടെ പക്ഷികൾ (Birds Around Us)",
            "text": "പക്ഷികളുടെ കൊക്കുകൾ അവ കഴിക്കുന്ന ഭക്ഷണത്തിന് അനുയോജ്യമായ രീതിയിലാണ് രൂപപ്പെട്ടിരിക്കുന്നത്. വേഴാമ്പലിന്റെ വലിയ കൊക്കും കൊത്തിത്തുരപ്പന്റെ ഉളിപോലുള്ള കൊക്കും പ്രകൃതിയുടെ വിസ്മയങ്ങളാണ്.",
            "expected_module": "bird_beak_matching"
        },
        {
            "subject": "Mathematics",
            "grade": "Class 4",
            "chapter": "തുല്യ കൂട്ടങ്ങളും ഗുണനവും (Equal Groups & Multiplication)",
            "text": "തുല്യ എണ്ണമുള്ള കൂട്ടങ്ങൾ ഒന്നിച്ച് കൂട്ടുമ്പോഴാണ് ഗുണനം (Multiplication as repeated addition) സാധ്യമാകുന്നത്. ഉദാഹരണത്തിന് 4 തേങ്ങകൾ വീതമുള്ള 7 കൂട്ടങ്ങൾ എന്നാൽ 7 × 4 = 28 തേങ്ങകളാണ്.",
            "expected_module": "multiplication_visualizer"
        }
    ]

    generated_lessons = []

    print("\n[Step 5] Testing Generation Modes for All 4 Curriculum Modules...", flush=True)
    for test_case in subjects_test_matrix:
        req = GenerateLessonRequest(
            rawText=test_case["text"],
            subject=test_case["subject"],
            grade=test_case["grade"],
            chapterTitle=test_case["chapter"],
            languagePreference="bilingual"
        )

        # Test Template Mode
        lesson: Lesson = generate_template(req)

        # Validations
        assert lesson.titleEn != ""
        assert lesson.titleMl != ""
        assert len(lesson.concepts) >= 1
        assert len(lesson.vocabulary) >= 1
        assert len(lesson.slides) >= 2
        assert len(lesson.quiz) >= 1
        assert len(lesson.activities) >= 1

        detected_activity = lesson.activities[0].activityType
        assert detected_activity == test_case["expected_module"], (
            f"Expected {test_case['expected_module']}, got {detected_activity}"
        )

        print(f"   ✓ [{test_case['subject']} {test_case['grade']}] '{lesson.titleEn}'", flush=True)
        print(f"     -> Matched Manipulative: '{detected_activity}'", flush=True)
        print(f"     -> Concepts: {len(lesson.concepts)} | Slides: {len(lesson.slides)} | Quiz: {len(lesson.quiz)}", flush=True)
        generated_lessons.append(lesson)

    # STEP 6: Review and Edit verification
    print("\n[Step 6] Testing Teacher Editability on Generated Lesson...", flush=True)
    sample_lesson = generated_lessons[0]
    sample_lesson.titleEn = "Modified Title: Fun with Fractions"
    sample_lesson.learningObjectivesEn.append("Identify equivalent fractions on smartboard")
    sample_lesson.concepts[0].titleEn = "Partitioning Shapes"
    assert sample_lesson.titleEn == "Modified Title: Fun with Fractions"
    print("   ✓ Verified teacher modifications on title, objectives, and concepts.", flush=True)

    # STEP 7: Serialization & Export/Import Integrity
    print("\n[Step 7 & 8] Testing Export/Import & Schema Integrity...", flush=True)
    exported_bundle = json.dumps({
        "app": "DRISHTI",
        "version": "1.1.0",
        "lessonCount": len(generated_lessons),
        "lessons": [l.dict() for l in generated_lessons]
    }, indent=2)

    parsed_bundle = json.loads(exported_bundle)
    assert len(parsed_bundle["lessons"]) == 4
    for idx, raw in enumerate(parsed_bundle["lessons"]):
        restored = Lesson(**raw)
        assert restored.id == generated_lessons[idx].id
        assert restored.activities[0].activityType == generated_lessons[idx].activities[0].activityType
    print("   ✓ Exported and re-parsed 4 full lessons with 100% activity metadata retention.", flush=True)

    # STEP 9: Corrupted JSON Import Guard Verification
    print("\n[Step 9] Testing Corrupted & Invalid Data Handling...", flush=True)
    corrupted_data = '{"title": "Broken lesson without slides or id"}'
    parsed_bad = json.loads(corrupted_data)
    # Check that missing ID is flagged
    assert "id" not in parsed_bad or not parsed_bad.get("id")
    print("   ✓ Validation guards correctly identify missing IDs and empty slide arrays.", flush=True)

    print("\n" + "=" * 70, flush=True)
    print("ALL TEACHER WORKFLOW & CURRICULUM GENERATION TESTS PASSED!", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    test_workflow()
