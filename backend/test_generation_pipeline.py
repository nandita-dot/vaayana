import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure Windows console supports Malayalam UTF-8 output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from main import (
    app, 
    ai_status, 
    generate_template, 
    generate_lesson, 
    regenerate_section, 
    health_check,
    get_sample_lessons
)
from app.models import (
    GenerateLessonRequest, 
    RegenerateSectionRequest,
    Lesson,
    GenerateLessonResponse,
    RegenerateSectionResponse
)
from app.gemini_service import (
    detect_best_activity_type, 
    check_source_sufficiency,
    generate_manual_template_lesson
)

def run_pipeline_tests():
    print("=" * 65, flush=True)
    print("TESTING DRISHTI TEXTBOOK-TO-LESSON GENERATION PIPELINE", flush=True)
    print("=" * 65, flush=True)

    # 1. Health & AI Status Endpoint Check
    print("\n1. Testing GET /api/health and /api/ai-status handlers...", flush=True)
    health = health_check()
    print(f"   Health check service: {health['service']}", flush=True)
    print(f"   OCR installed: {health['ocr']['tesseractInstalled']}", flush=True)
    print(f"   Gemini model configured: {health['geminiModel']}", flush=True)

    status = ai_status()
    print(f"   AI Status: {status}", flush=True)
    assert status["model"] == "gemini-2.5-flash", f"Expected gemini-2.5-flash, got {status['model']}"
    assert "aiAvailable" in status
    assert status["provider"] == "Google GenAI SDK"
    print("   ✓ AI Status and Health checks verified.", flush=True)

    # 2. Test Smartboard Manipulative Detection Logic
    print("\n2. Testing Smartboard Manipulative Detection Logic...", flush=True)

    # Fractions
    act_frac = detect_best_activity_type("Mathematics", "ഭിന്നസംഖ്യകൾ", "Fractions are equal parts of a whole circle or rectangle.")
    print(f"   - Fractions text -> Detected: '{act_frac}'", flush=True)
    assert act_frac == "fraction_playground", f"Expected fraction_playground, got {act_frac}"

    # Multiplication
    act_mult = detect_best_activity_type("Mathematics", "ഗുണന പട്ടിക", "Multiplication is repeated addition of equal groups.")
    print(f"   - Multiplication text -> Detected: '{act_mult}'", flush=True)
    assert act_mult == "multiplication_visualizer", f"Expected multiplication_visualizer, got {act_mult}"

    # Bird beaks
    act_bird = detect_best_activity_type("Environmental Studies", "പക്ഷികൾ", "Different birds have beak adaptations for catching prey and seeds.")
    print(f"   - Bird beaks text -> Detected: '{act_bird}'", flush=True)
    assert act_bird == "bird_beak_matching", f"Expected bird_beak_matching, got {act_bird}"

    # Water cycle
    act_water = detect_best_activity_type("Basic Science", "ജലചക്രം", "The water cycle involves evaporation from water bodies, clouds, and precipitation as rain.")
    print(f"   - Water cycle text -> Detected: '{act_water}'", flush=True)
    assert act_water == "water_cycle_explorer", f"Expected water_cycle_explorer, got {act_water}"

    # General non-matching
    act_general = detect_best_activity_type("Social Science", "കേരളത്തിന്റെ ചരിത്രം", "History of ancient ports in Kerala.")
    print(f"   - General History text -> Detected: '{act_general}'", flush=True)
    assert act_general == "visual_explanation", f"Expected visual_explanation, got {act_general}"
    print("   ✓ All 5 activity detection pathways verified.", flush=True)

    # 3. Test Source Sufficiency and Warning Logic
    print("\n3. Testing Source Text Sufficiency Guard...", flush=True)
    short_text = "Fractions are parts of a whole."  # 6 words (< 25)
    conf_short, warn_short = check_source_sufficiency(short_text)
    print(f"   - Short text ({len(short_text.split())} words): Confidence='{conf_short}' | Warnings={len(warn_short)}", flush=True)
    assert conf_short == "insufficient_source", f"Expected insufficient_source, got {conf_short}"
    assert len(warn_short) > 0, "Expected warning for short text"

    adequate_text = (
        "In this chapter we explore Kerala's monsoon and the journey of water. "
        "The Sun warms the water in rivers, paddy fields, and the Arabian sea. "
        "As the water heats up, it turns into invisible water vapor and rises high into the sky. "
        "This process is known as evaporation. As vapor cools high above the Western Ghats, "
        "tiny droplets gather together to form dense rain clouds in a process called condensation. "
        "When the clouds become heavy, water falls back to the fertile land as life-giving rain."
    )
    conf_adequate, warn_adequate = check_source_sufficiency(adequate_text)
    print(f"   - Adequate text ({len(adequate_text.split())} words): Confidence='{conf_adequate}' | Warnings={len(warn_adequate)}", flush=True)
    assert conf_adequate == "high", f"Expected high confidence, got {conf_adequate}"
    print("   ✓ Source sufficiency rules verified.", flush=True)

    # 4. Test Structured SCERT Template Lesson Generator
    print("\n4. Testing /api/generate-template-lesson handler...", flush=True)
    req = GenerateLessonRequest(
        rawText=adequate_text,
        subject="Environmental Studies",
        grade="Class 4",
        chapterTitle="ജലചക്രം (Water Cycle)",
        languagePreference="malayalam"
    )
    template_lesson: Lesson = generate_template(req)
    assert template_lesson.titleEn != ""
    assert template_lesson.titleMl != ""
    assert len(template_lesson.learningObjectivesEn) >= 2
    assert len(template_lesson.learningObjectivesMl) >= 2
    assert len(template_lesson.concepts) >= 1
    assert len(template_lesson.vocabulary) >= 1
    assert len(template_lesson.activities) >= 1
    assert template_lesson.activities[0].activityType == "water_cycle_explorer"
    assert len(template_lesson.slides) >= 2
    assert len(template_lesson.quiz) >= 1
    assert template_lesson.generatedBy == "template"

    print(f"   ✓ Generated template lesson: '{template_lesson.titleEn}'", flush=True)
    print(f"     - Concepts ({len(template_lesson.concepts)}): {template_lesson.concepts[0].titleEn} / {template_lesson.concepts[0].titleMl}", flush=True)
    print(f"     - Vocabulary ({len(template_lesson.vocabulary)}): {template_lesson.vocabulary[0].word}", flush=True)
    print(f"     - Linked Smartboard Activity: {template_lesson.activities[0].activityType}", flush=True)
    print(f"     - Formative Quiz ({len(template_lesson.quiz)} questions): {template_lesson.quiz[0].questionEn}", flush=True)

    # 5. Test Live Gemini Generator Without Silent Mocks
    print("\n5. Testing /api/generate-lesson handler (Without GEMINI_API_KEY)...", flush=True)
    gen_res: GenerateLessonResponse = generate_lesson(req)
    
    # Assert honest reporting (zero mock deception)
    assert gen_res.aiAvailable is False, "Expected aiAvailable: False when GEMINI_API_KEY is not set"
    assert gen_res.success is False, "Expected success: False when AI is unconfigured"
    assert gen_res.lesson is None, "Expected lesson: None when generation cannot proceed"
    assert "GEMINI_API_KEY" in (gen_res.error or ""), f"Expected error mentioning GEMINI_API_KEY, got: {gen_res.error}"
    print(f"   ✓ Zero-hallucination verification confirmed: '{gen_res.error}'", flush=True)

    # 6. Test Section Regeneration Handler
    print("\n6. Testing /api/regenerate-section handler...", flush=True)
    regen_req = RegenerateSectionRequest(
        section="concepts",
        rawText=adequate_text,
        subject="Environmental Studies",
        grade="Class 4",
        chapterTitle="ജലചക്രം"
    )
    regen_res: RegenerateSectionResponse = regenerate_section(regen_req)
    assert regen_res.aiAvailable is False
    assert regen_res.success is False
    assert regen_res.data is None
    print(f"   ✓ Section regeneration gracefully handled without error crash: '{regen_res.error}'", flush=True)

    # 7. Test Curated Sample Lessons
    print("\n7. Testing /api/sample-lessons handler...", flush=True)
    samples = get_sample_lessons()
    assert len(samples) >= 3
    print(f"   ✓ Verified {len(samples)} pre-curated Kerala SCERT sample lessons.", flush=True)

    print("\n" + "=" * 65, flush=True)
    print("ALL 7 TEXTBOOK-TO-LESSON PIPELINE BACKEND TESTS PASSED!", flush=True)
    print("=" * 65, flush=True)

if __name__ == "__main__":
    run_pipeline_tests()
