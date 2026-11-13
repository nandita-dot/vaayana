# VAAYANA (വായന) — Developer Learning Guide
## Module 06: Python & FastAPI Backend

---

### Mentor Introduction
Now that we have explored the frontend, let us venture into the server room: the **Python FastAPI Backend** inside the `backend/` directory.

FastAPI has quickly become one of the most popular web frameworks in the world because it is blazingly fast, modern, and leverages standard Python type hints to automatically validate data and generate interactive documentation.

If you have basic Python knowledge, you will feel right at home. Let us examine how the backend is structured, file by file.

---

### 1. Backend Architecture & Entrypoint (`backend/main.py`)

When you run `start_vaayana.bat` (or run `uvicorn main:app --reload`), the file that starts everything is `backend/main.py`.

Let us look at its anatomy:

```python
# Conceptual structure of backend/main.py:
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.config import settings

# 1. LIFESPAN EVENT: Runs when the server starts up and shuts down
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure the SQLite database and tables exist
    init_db()
    print("Database initialized successfully.")
    yield
    # Shutdown: Clean up resources if needed
    print("Server shutting down.")

# 2. CREATE THE FASTAPI APP INSTANCE
app = FastAPI(
    title="VAAYANA API",
    description="Interactive Smartboard Platform for Primary Education",
    version="1.0.0",
    lifespan=lifespan
)

# 3. CORS (Cross-Origin Resource Sharing) MIDDLEWARE
# The frontend runs on http://localhost:5173, while backend runs on http://localhost:8000.
# Without CORS middleware, the browser would block the frontend from talking to the backend!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow requests from any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### What is CORS?
If you have ever seen an error in the browser console like:
`Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy`,
it means the server did not specify which domains are allowed to talk to it. The `CORSMiddleware` in `main.py` explicitly tells the browser: *"It is safe for the VAAYANA frontend to make requests here."*

---

### 2. Configuration Management (`backend/app/config.py`)

Hardcoding API keys or port numbers inside your code is a dangerous anti-pattern. If you accidentally commit your Gemini API key to GitHub, unauthorized users could use your quota.

In VAAYANA, all configuration is managed cleanly in `backend/app/config.py`:

```python
import os
from pathlib import Path
from dotenv import load_dotenv

# Load key-value pairs from .env file if it exists
load_dotenv()

class Settings:
    PROJECT_NAME: str = "VAAYANA API"
    VERSION: str = "1.0.0"
    API_PORT: int = int(os.getenv("PORT", 8000))
    API_HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # Gemini AI API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Database Path
    DB_PATH: Path = Path(__file__).resolve().parent.parent / "vaayana.db"
    
    # OCR Tesseract path (optional custom Windows path)
    TESSERACT_CMD: str = os.getenv("TESSERACT_CMD", "")

settings = Settings()
```

Notice the pattern `os.getenv("VARIABLE_NAME", default_value)`:
If the environment variable is set in the `.env` file, Python uses that value. If it is missing, it falls back safely to the default value without crashing!

---

### 3. Data Validation with Pydantic v2 (`backend/app/models.py`)

In vanilla Python, dictionaries have no type safety:
```python
# Vanilla Python dictionary:
lesson = {"title": 12345} # Title is a number? Nobody stops you!
```

In FastAPI, we use **Pydantic** to declare schemas. Pydantic models act as strict contracts that validate data entering and leaving our API endpoints:

```python
# From backend/app/models.py:
from pydantic import BaseModel, Field
from typing import List, Optional

class VocabularyItem(BaseModel):
    term_en: str
    term_ml: str
    definition_en: str
    definition_ml: str
    pronunciation: Optional[str] = None

class Slide(BaseModel):
    slide_number: int
    title_ml: str
    title_en: str
    content_ml: str
    content_en: str
    activity_type: Optional[str] = None
    interactive_module: Optional[str] = None
    vocabulary: List[VocabularyItem] = Field(default_factory=list)
    teaching_notes: Optional[str] = None

class Lesson(BaseModel):
    id: str
    chapter_number: int
    chapter_title_ml: str
    chapter_title_en: str
    subject: str
    grade_level: int = 4
    slides: List[Slide]
    is_approved: bool = False
```

#### The Bridge Between Python and TypeScript
Compare `backend/app/models.py` with `frontend/src/types/index.ts`. Notice how they match almost property-for-property!

```
Python (backend/app/models.py)      TypeScript (frontend/src/types/index.ts)
---------------------------------      ----------------------------------------
class Slide(BaseModel):                export interface Slide {
    slide_number: int                      slide_number: number;
    title_ml: str                          title_ml: string;
    vocabulary: List[VocabularyItem]       vocabulary?: VocabularyItem[];
```
This guarantees that when the backend sends JSON to the frontend, both sides speak the exact same language.

---

### 4. Textbook Extraction & OCR Pipeline (`backend/app/ocr.py`)

When a teacher uploads a chapter from a Kerala SCERT textbook PDF, how does Python turn that PDF into editable text?

`backend/app/ocr.py` uses a **Two-Tier Extraction Pipeline**:

```
                       [ Uploaded PDF File ]
                                 │
                                 ▼
                     [ PyMuPDF (fitz) Parsing ]
                                 │
             ┌───────────────────┴───────────────────┐
             │ Has selectable text?                  │
             ▼                                       ▼
           [ YES ]                                 [ NO ]
    Extract text directly                   (Scanned Image PDF)
    (Instant & 100% accurate)                        │
                                                     ▼
                                            [ Tesseract OCR ]
                                            Languages: mal + eng
                                                     │
                                                     ▼
                                            Extract characters from image
```

Look at how this logic is implemented in `ocr.py`:

```python
import fitz  # PyMuPDF library
import pytesseract
from PIL import Image
import io

def extract_text_from_pdf(pdf_bytes: bytes) -> dict:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages_data = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text() # Try extracting digital text
        
        # If the page has almost no digital text, it is likely a scanned photo of a textbook!
        if len(text.strip()) < 50:
            pix = page.get_pixmap()
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            try:
                # Run OCR with Malayalam and English language packs:
                text = pytesseract.image_to_string(img, lang="mal+eng")
            except Exception as e:
                print(f"OCR not available or failed: {e}")
                
        pages_data.append({
            "page_number": page_num + 1,
            "text": text.strip()
        })
        
    return {"total_pages": len(doc), "pages": pages_data}
```

---

### 5. Gemini AI Generation Pipeline (`backend/app/gemini_service.py`)

Once the textbook text is extracted, `app/gemini_service.py` sends it to Google's **Gemini 2.5 Flash** model to convert the raw text into structured classroom slides and quiz questions.

#### The Prompt Engineering Architecture:
In `gemini_service.py`, the prompt instructs Gemini to act as a **Kerala SCERT Primary School Curriculum Expert**:

1. **Class 4 Appropriate Language**: Simple Malayalam and English suitable for 9-year-olds.
2. **Pedagogical Structure**:
   - Slide 1: Engaging hook / real-world question.
   - Slides 2–4: Core concepts with clear definitions and Malayalam pronunciation.
   - Slide 5: Interactive activity manipulative (specifying `'abacus'`, `'compass'`, etc.).
   - Slide 6: Summary and vocabulary review.
3. **Strict JSON Output**: The AI must return pure JSON matching the Pydantic `Lesson` schema, with no conversational fluff.

```python
# Simplified snippet from backend/app/gemini_service.py:
def generate_lesson_from_text(raw_text: str, subject: str, chapter_title: str) -> dict:
    if not settings.GEMINI_API_KEY:
        # Fallback if user hasn't set an API key: Return curated template!
        return get_fallback_template(subject, chapter_title)

    prompt = f"""
    You are an expert Kerala SCERT primary education specialist.
    Transform the following Class 4 textbook excerpt into an interactive lesson.
    
    Subject: {subject}
    Chapter: {chapter_title}
    Text: {raw_text[:4000]}
    
    REQUIREMENTS:
    - Return a JSON object with: chapter_title_ml, chapter_title_en, slides, and quiz.
    - Each slide must have title_ml, title_en, content_ml, content_en.
    - Suggest suitable interactive_module ('abacus', 'clock', 'compass', etc.).
    - Generate 3 multiple choice questions for the quiz.
    - Respond ONLY with valid JSON.
    """
    
    # Call Gemini model
    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config={"response_mime_type": "application/json"}
    )
    
    return json.loads(response.text)
```

---

### 6. Interactive API Documentation (Swagger / OpenAPI)

One of the greatest developer superpowers of FastAPI is built-in interactive documentation.

Whenever the backend is running, open your browser and navigate to:
👉 `http://localhost:8000/docs`

You will see an interactive web page generated automatically by FastAPI where you can:
- See every available endpoint.
- Inspect the exact JSON request body each endpoint expects.
- Click **"Try it out"** to execute real API requests and inspect responses directly from your browser without writing any code!

---

### Mentor's Checkpoint
You now understand how the backend runs: `main.py` entrypoint, CORS middleware, `config.py` environment settings, Pydantic data schemas, PyMuPDF + Tesseract extraction, and Gemini AI lesson generation.

In **Module 07: Database & Offline Storage**, we will explore how SQLite and browser IndexedDB keep lessons saved forever!

