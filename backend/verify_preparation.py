"""
VAAYANA Pre-Generation Persistence & Schema Verification
Verifies extraction, text normalization, schema matching, and SQLite persistence readiness
for the selected chapter: 'Journey of the Raindrop' (Pages 39-46).
GUARANTEES ZERO LIVE GEMINI API CALLS.
"""
import os
import sys
import json
import hashlib
import uuid

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.ocr import extract_text_from_pdf_bytes, normalize_text
from app.database import (
    init_db,
    save_chapter,
    save_lesson_record,
    get_db_lesson_by_id,
    compute_lesson_cache_key
)
from app.gemini_service import (
    reset_live_gemini_call_count,
    get_live_gemini_call_count,
    set_gemini_mock,
    generate_lesson_with_gemini
)

def verify_preparation():
    reset_live_gemini_call_count()
    assert get_live_gemini_call_count() == 0

    pdf_path = os.path.join(BASE_DIR, "data", "04_English Reader.pdf")
    assert os.path.exists(pdf_path), f"Textbook not found at {pdf_path}"

    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    file_sha256 = hashlib.sha256(pdf_bytes).hexdigest()

    import fitz
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    start_p, end_p = 39, 46

    # 1. Extract and normalize
    chapter_blocks = []
    total_words = 0
    pages_analyzed = []

    for pno in range(start_p, end_p + 1):
        raw = doc[pno - 1].get_text()
        clean = normalize_text(raw)
        words = len(clean.split())
        total_words += words
        pages_analyzed.append(pno)
        chapter_blocks.append(f"--- [Page {pno}] ---\n{clean}")

    doc.close()
    chapter_text = "\n\n".join(chapter_blocks)

    print(f"Extracted Chapter: 'Journey of the Raindrop'")
    print(f"Page Range: Pages {start_p}-{end_p} ({len(pages_analyzed)} pages)")
    print(f"Word Count: {total_words} words")
    print(f"Character Count: {len(chapter_text)} characters")

    # 2. Verify Schema Matching & Deterministic Mock Generation
    mock_payload = {
        "title": "Journey of the Raindrop",
        "titleMalayalam": "മഴത്തുള്ളിയുടെ യാത്ര",
        "grade": "Class 4",
        "subject": "English",
        "chapter": "Journey of the Raindrop",
        "concepts": [
            {
                "id": "c1",
                "titleEn": "The Raindrop's Descent & Lightning",
                "titleMl": "മഴത്തുള്ളിയുടെ തുടക്കവും മിന്നലും",
                "explanationEn": "The little raindrop leaves the fluffy cloud after hearing thunder and embarks on a grand adventure down to earth.",
                "explanationMl": "ഇടിമുഴക്കത്തിന് ശേഷം ചെറിയ മഴത്തുള്ളി മേഘത്തിൽ നിന്ന് ഭൂമിയിലേക്ക് രസകരമായ യാത്ര ആരംഭിക്കുന്നു.",
                "realLifeExampleEn": "Watching rain showers start on a hot afternoon in Kerala.",
                "realLifeExampleMl": "കേരളത്തിൽ ചൂടുള്ള ഉച്ചയ്ക്ക് ശേഷം മഴത്തുള്ളികൾ പെയ്യുന്നത് കാണുന്നു.",
                "suggestedVisual": "Fluffy cloud with lightning flash and falling raindrops",
                "sourcePage": "39",
                "evidenceSnippet": "A tiny raindrop lives in a big, fluffy cloud."
            },
            {
                "id": "c2",
                "titleEn": "Nourishing Nature & Thirsty Roots",
                "titleMl": "പ്രകൃതിയെ തൊട്ടുണർത്തുന്ന മഴ",
                "explanationEn": "Raindrops fall gently on flowers, form puddles, and seep deep into the soil to nourish thirsty paddy roots.",
                "explanationMl": "മഴത്തുള്ളികൾ പൂക്കളെ തഴുകി മണ്ണിലേക്ക് കിനിഞ്ഞിറങ്ങി നെൽച്ചെടിയുടെ വേരുകളെ ദാഹമകറ്റുന്നു.",
                "realLifeExampleEn": "Paddy fields turning green and fresh after monsoon rains.",
                "realLifeExampleMl": "മഴ പെയ്തതിനുശേഷം നെൽപ്പാടങ്ങൾ പച്ചപ്പണിഞ്ഞു നിൽക്കുന്നു.",
                "suggestedVisual": "Raindrop trickling into soil roots of green paddy plants",
                "sourcePage": "43",
                "evidenceSnippet": "The thirsty roots of paddy were searching for water."
            },
            {
                "id": "c3",
                "titleEn": "Evaporation & The Return to Cloud",
                "titleMl": "ബാഷ്പീകരണവും മേഘങ്ങളിലേക്കുള്ള മടക്കവും",
                "explanationEn": "As the morning sun warms the earth, the raindrops gently drift upward into the sky, returning home to the clouds.",
                "explanationMl": "പ്രഭാതസൂര്യന്റെ ചൂടേറ്റ് മഴത്തുള്ളികൾ ആവിയായി വീണ്ടും ആകാശത്തേക്ക് ഉയർന്ന് മേഘങ്ങളിലേക്ക് മടങ്ങുന്നു.",
                "realLifeExampleEn": "Morning dew evaporating as the sun rises over fields.",
                "realLifeExampleMl": "സൂര്യോദയത്തോടെ പുല്ലിലെ മഞ്ഞുതുള്ളികൾ ആവിയായി മാറുന്നു.",
                "suggestedVisual": "Sunbeams warming fields as tiny vapor drops drift back to clouds",
                "sourcePage": "45",
                "evidenceSnippet": "Slowly we drifted upwards. We began to float higher and higher."
            }
        ],
        "vocabulary": [
            {
                "word": "Fluffy",
                "meaningEn": "Soft and light like cotton",
                "meaningMl": "പഞ്ഞിപോലെയുള്ള മൃദുവായ",
                "exampleEn": "The raindrop lived in a big, fluffy cloud.",
                "exampleMl": "മഴത്തുള്ളി ഒരു വലിയ പഞ്ഞിമേഘത്തിൽ ജീവിച്ചു.",
                "synonyms": ["Soft", "Puffy"],
                "suggestedVisual": "Fluffy cloud icon",
                "emphasisEffect": "none"
            },
            {
                "word": "Adventure",
                "meaningEn": "An exciting and daring journey",
                "meaningMl": "ആവേശകരമായ സാഹസിക യാത്ര",
                "exampleEn": "A grand adventure awaits you!",
                "exampleMl": "നിങ്ങളെ ഒരു വലിയ സാഹസിക യാത്ര കാത്തിരിക്കുന്നു!",
                "synonyms": ["Journey", "Exploration"],
                "suggestedVisual": "Compass and path",
                "emphasisEffect": "enormous"
            },
            {
                "word": "Thirsty",
                "meaningEn": "Needing water to drink or survive",
                "meaningMl": "ദാഹമുള്ള",
                "exampleEn": "The thirsty roots of paddy were searching for water.",
                "exampleMl": "ദാഹിച്ച വേരുകൾ വെള്ളത്തിനായി തിരയുകയായിരുന്നു.",
                "synonyms": ["Dry", "Parched"],
                "suggestedVisual": "Plant roots reaching for droplets",
                "emphasisEffect": "none"
            }
        ],
        "interactiveModule": "water_cycle_explorer",
        "activity": {
            "titleEn": "Water Cycle Stage Sequencing",
            "titleMl": "ജലചക്ര ഘട്ടങ്ങൾ ക്രമീകരിക്കാം",
            "interactionType": "water_cycle_explorer",
            "learningObjectiveEn": "Sequence evaporation, rain, and soil absorption",
            "learningObjectiveMl": "ബാഷ്പീകരണം, മഴ, മണ്ണിലേക്കിറങ്ങൽ എന്നീ ഘട്ടങ്ങൾ തിരിച്ചറിയുക",
            "instructionEn": "Follow the journey from cloud to root and back to sky",
            "instructionMl": "മേഘത്തിൽ നിന്ന് വേരുകളിലേക്കും തിരിച്ച് ആകാശത്തേക്കുമുള്ള യാത്ര നിരീക്ഷിക്കുക",
            "items": []
        },
        "quiz": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "questionEn": "Where did the tiny raindrop live at the start of the story?",
                "questionMl": "കഥയുടെ തുടക്കത്തിൽ ചെറിയ മഴത്തുള്ളി എവിടെയാണ് ജീവിച്ചിരുന്നത്?",
                "optionsEn": ["In a big, fluffy cloud", "In a deep well", "Inside a river", "Under a tree"],
                "optionsMl": ["വലിയൊരു പഞ്ഞിമേഘത്തിൽ", "ആഴമുള്ള കിണറ്റിൽ", "ഒരു പുഴയിൽ", "മരത്തിന്റെ അടിയിൽ"],
                "correctIndex": 0,
                "explanationEn": "The story begins with the raindrop living in a big, fluffy cloud.",
                "explanationMl": "മഴത്തുള്ളി ഒരു വലിയ പഞ്ഞിമേഘത്തിലാണ് ജീവിച്ചിരുന്നത്.",
                "sourcePageRef": "39"
            },
            {
                "id": "q2",
                "type": "multiple_choice",
                "questionEn": "What made the raindrops bright and colourful like a rainbow?",
                "questionMl": "മഴത്തുള്ളികളെ മഴവില്ലുപോലെ വർണ്ണാഭമാക്കിയത് എന്താണ്?",
                "optionsEn": ["Sunbeams shining through them", "Lightning flashes", "Green trees", "The cat's fur"],
                "optionsMl": ["സൂര്യകിരണങ്ങൾ അവയിലൂടെ കടന്നുപോയപ്പോൾ", "മിന്നൽ തിളക്കം", "പച്ച മരങ്ങൾ", "പൂച്ചയുടെ രോമം"],
                "correctIndex": 0,
                "explanationEn": "Sunbeams shone through the raindrops, creating vibrant colours.",
                "explanationMl": "സൂര്യരശ്മികൾ മഴത്തുള്ളികളിലൂടെ കടന്നുപോയപ്പോൾ അത് മനോഹരമായ നിറങ്ങളുണ്ടാക്കി.",
                "sourcePageRef": "41"
            },
            {
                "id": "q3",
                "type": "multiple_choice",
                "questionEn": "What happened to the raindrops in the morning sun?",
                "questionMl": "പ്രഭാതത്തിൽ സൂര്യന്റെ ചൂടേറ്റപ്പോൾ മഴത്തുള്ളികൾക്ക് എന്ത് സംഭവിച്ചു?",
                "optionsEn": ["They drifted upward back to the clouds", "They froze into ice", "They disappeared forever", "They turned into soil"],
                "optionsMl": ["അവ ആവിയായി വീണ്ടും മേഘങ്ങളിലേക്ക് ഉയർന്നു", "അവ ഐസായി മാറി", "അവ എന്നെന്നേക്കുമായി ഇല്ലാതായി", "അവ മണ്ണായി മാറി"],
                "correctIndex": 0,
                "explanationEn": "The morning sun warmed the droplets, causing them to float upwards back to the clouds.",
                "explanationMl": "സൂര്യന്റെ ചൂടേറ്റ് തുള്ളികൾ ആവിയായി വീണ്ടും ആകാശത്തേക്ക് ഉയർന്നു.",
                "sourcePageRef": "45"
            }
        ]
    }

    set_gemini_mock(mock_payload)
    gen_resp = generate_lesson_with_gemini(
        raw_text=chapter_text,
        subject="English",
        grade="Class 4",
        chapter_title="Journey of the Raindrop",
        language_preference="english",
        source_file_hash=file_sha256,
        source_file_name="04_English Reader.pdf",
        start_page=start_p,
        end_page=end_p
    )

    assert gen_resp.success is True, f"Mock generation failed: {gen_resp.error}"
    lesson = gen_resp.lesson
    assert len(lesson.concepts) == 3
    assert len(lesson.vocabulary) == 3
    assert len(lesson.quiz) == 3
    print(f"Lesson Object Schema Verified: title='{lesson.titleEn}', concepts={len(lesson.concepts)}, slides={len(lesson.slides)}")

    # 3. Test SQLite Persistence Readiness (Using unique prep ID, never overwriting existing)
    init_db()
    test_id = f"lesson-prep-{uuid.uuid4().hex[:6]}"
    cache_key = compute_lesson_cache_key(file_sha256, start_p, end_p, "Journey of the Raindrop")

    lesson_dict_v1 = lesson.model_dump()
    lesson_dict_v1["id"] = test_id
    lesson_dict_v1["chapterId"] = test_id
    lesson_dict_v1["titleEn"] = "Journey of the Raindrop (Draft v1)"

    v1_id, v1_num = save_lesson_record(
        lesson_dict=lesson_dict_v1,
        approval_status="draft",
        cache_key=cache_key,
        start_page=start_p,
        end_page=end_p
    )
    print(f"Saved Draft Version 1: ID='{v1_id}', Version={v1_num}")

    # Approve v2
    lesson_dict_v2 = dict(lesson_dict_v1)
    lesson_dict_v2["titleEn"] = "Journey of the Raindrop (Approved Classroom v2)"
    v2_id, v2_num = save_lesson_record(
        lesson_dict=lesson_dict_v2,
        approval_status="approved",
        cache_key=cache_key,
        start_page=start_p,
        end_page=end_p
    )
    print(f"Saved Approved Version 2: ID='{v2_id}', Version={v2_num}")

    # Verify retrieval
    approved_rec = get_db_lesson_by_id(test_id, require_approved=True)
    assert approved_rec is not None
    assert approved_rec["version"] == 2
    assert approved_rec["approvalStatus"] == "approved"
    assert len(approved_rec["concepts"]) == 3
    print(f"Approved Lesson Retrieved: v{approved_rec['version']} '{approved_rec['titleEn']}'")

    # Verify cost protection
    final_calls = get_live_gemini_call_count()
    assert final_calls == 0
    print(f"Final Live Gemini API Calls Made: {final_calls}")
    print("ALL READINESS VERIFICATIONS PASSED WITH ZERO LIVE CALLS.")

if __name__ == "__main__":
    verify_preparation()

