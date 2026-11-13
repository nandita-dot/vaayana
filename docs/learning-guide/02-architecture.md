# VAAYANA (വായന) — Developer Learning Guide
## Module 02: System Architecture & Data Flow

---

### Mentor Introduction
In this module, we will pull back the curtains on how VAAYANA is organized architecturally. As a software developer, one of the most critical skills you will build is the ability to trace a user's action (like clicking a button) through all the layers of an application down to the network and database, and back up to the screen.

Let us explore the blueprint of VAAYANA.

---

### 1. High-Level Architectural Pattern

VAAYANA follows a **Decoupled Client-Server Architecture** with an **Offline-First Storage Strategy**.

```
+-------------------------------------------------------------------------------+
|                            FRONTEND CLIENT (BROWSER)                          |
|                                                                               |
|  [ React Component Tree (Views, Buttons, Slides, Manipulatives) ]             |
|                                   │                                           |
|                     ┌─────────────┴─────────────┐                             |
|                     ▼                           ▼                             |
|         [ React State / Context ]    [ Web Audio / Canvas Engines ]           |
|                     │                                                         |
|                     ▼                                                         |
|        [ Storage Service Layer (storage.ts) ]                                 |
|          ├── Read/Write from Browser IndexedDB                                |
|          └── Fallback to bundled sampleLessons.ts (Offline guaranteed)        |
+-------------------------------------------------------------------------------+
                               │ (Optional HTTP via api.ts)
                               ▼
+-------------------------------------------------------------------------------+
|                          BACKEND SERVER (FASTAPI)                             |
|                                                                               |
|  [ FastAPI Routes (main.py) ]                                                 |
|     ├── CORS & Request Validation (Pydantic Models)                           |
|     ├── SQLite Database Operations (database.py)                              |
|     ├── PDF Parsing & OCR Pipeline (ocr.py)                                   |
|     └── AI Prompting & Transformation (gemini_service.py)                     |
+-------------------------------------------------------------------------------+
```

Notice the key insight: **The frontend does not require the backend server to deliver a classroom presentation.** The frontend is fully autonomous for teaching operations, while the backend functions as an authoring assistant (extracting text from PDFs and using AI to structure lessons).

---

### 2. Frontend Component Hierarchy

React applications are built like inverted trees. At the top sits `App.tsx`, which branches out into routes, layouts, pages, and atomic components.

Here is the exact nesting hierarchy of VAAYANA's frontend:

```
App.tsx (Root Component)
 ├── LanguageProvider (Context: bilingual Malayalam/English state)
 │    ├── MotionBackground (Floating decorative stars, pencils, books)
 │    ├── BrowserRouter (React Router)
 │    │    ├── Navbar (Logo, A.L.P.S. Koottala badge, nav links, language switch)
 │    │    │
 │    │    ├── <Routes> (URL path routing)
 │    │    │    ├── Route "/": LandingPage
 │    │    │    │    ├── Hero Section (Subject cards: Math, EVS)
 │    │    │    │    ├── Stats / Features overview
 │    │    │    │    └── Quick Chapter launch buttons
 │    │    │    │
 │    │    │    ├── Route "/teacher": TeacherWorkspace
 │    │    │    │    ├── UploadModal (PDF upload & OCR preview)
 │    │    │    │    ├── Lesson Editor (Slide content, vocabulary, quiz builder)
 │    │    │    │    └── Lesson Previewer
 │    │    │    │
 │    │    │    ├── Route "/classroom": ClassroomExperience
 │    │    │    │    ├── Subject Filter Tabs (All, Mathematics, EVS)
 │    │    │    │    └── Chapter Grid (Cards linking to `/lesson/:id`)
 │    │    │    │
 │    │    │    ├── Route "/lesson/:id": LessonView
 │    │    │    │    ├── Chapter Header & Slide Progress Bar
 │    │    │    │    ├── InteractiveSlideView
 │    │    │    │    │    ├── Slide Text (Bilingual Malayalam + English)
 │    │    │    │    │    ├── Drawing Canvas Overlay (Teacher pen/highlighter)
 │    │    │    │    │    ├── Vocabulary Pill Cards (Pronunciation tooltips)
 │    │    │    │    │    └── Dynamic Activity Container:
 │    │    │    │    │         ├── AbacusManipulative
 │    │    │    │    │         ├── AnalogClockManipulative
 │    │    │    │    │         ├── CompassActivity
 │    │    │    │    │         ├── TangramActivity
 │    │    │    │    │         ├── SolarSystemSimulator
 │    │    │    │    │         └── ... (30+ activity manipulatives)
 │    │    │    │    │
 │    │    │    │    ├── SmartboardControls (Big touch Prev/Next, Draw, Speak, Fullscreen)
 │    │    │    │    ├── QuizActivity (Rendered on final slide)
 │    │    │    │    └── ChapterTransition (Animated airplane & victory fanfare)
 │    │    │    │
 │    │    │    └── Route "/library": LibraryPage
 │    │    │         └── Offline Storage Manager (IndexedDB status, export/import)
 │    │    │
 │    │    └── Footer (A.L.P.S. Koottala school identity, credits)
```

---

### 3. Detailed Request Journey: Tracing an Action

To understand how data flows across the system, let us trace what happens when a teacher generates a lesson from a textbook PDF.

```
[Teacher Workspace UI]
  │ 1. Teacher selects "Class 4 Math Chapter 1.pdf" and clicks "Generate"
  ▼
[frontend/src/services/api.ts]
  │ 2. Sends HTTP POST with FormData to `http://localhost:8000/api/extract-pdf`
  ▼
[backend/main.py] -> endpoint `extract_pdf`
  │ 3. Computes SHA-256 hash of the uploaded PDF bytes
  │ 4. Calls `check_cached_lesson(hash)` in `app/database.py`
  │    ├── If cached in SQLite: Returns cached lesson JSON immediately!
  │    └── If not cached:
  │          a. Calls `extract_text_and_images_from_pdf()` in `app/ocr.py`
  │          b. PyMuPDF extracts text; Tesseract OCR runs if pages are scanned images
  ▼
[backend/main.py] -> endpoint `generate_lesson_endpoint`
  │ 5. Receives raw textbook text and invokes `generate_lesson()` in `app/gemini_service.py`
  │ 6. Constructs structured prompt with Kerala SCERT pedagogical guidelines
  │ 7. Calls Gemini API (`gemini-2.5-flash`) expecting structured JSON output
  │ 8. Pydantic validates raw response against `Lesson` schema (`app/models.py`)
  ▼
[backend/app/database.py]
  │ 9. Saves lesson record to SQLite table `lessons` and creates cache record
  ▼
[frontend/src/pages/TeacherWorkspace.tsx]
  │ 10. `api.ts` parses HTTP response into TypeScript `Lesson` object
  │ 11. React component calls `setLesson(generatedLesson)` (State Update)
  │ 12. Component automatically re-renders; preview slides appear on screen
  ▼
[frontend/src/services/storage.ts]
  │ 13. Teacher clicks "Approve Lesson"
  │ 14. Frontend writes the approved `Lesson` object into IndexedDB (`vaayana_local_db`)
  │ 15. The lesson is now available to the classroom offline forever!
```

---

### 4. Frontend-to-Backend Communication (`frontend/src/services/api.ts`)

All communication between the frontend and the backend is centralized inside `frontend/src/services/api.ts`. Rather than spreading raw `fetch()` calls across dozens of components, this service file exposes clean asynchronous JavaScript functions.

Here is a breakdown of the primary API contracts:

| Function in `api.ts` | HTTP Method & URL | What It Sends | What It Returns |
|---|---|---|---|
| `checkHealth()` | `GET /api/health` | None | `{ status: "healthy", database: "connected", ... }` |
| `checkAIStatus()` | `GET /api/ai-status` | None | `{ configured: boolean, model: string }` |
| `extractPdf(file)` | `POST /api/extract-pdf` | `FormData` with PDF file | Extracted text and image metadata |
| `generateLesson(text, ...)` | `POST /api/generate-lesson` | JSON with raw text & subject | Complete structured `Lesson` object |
| `approveLesson(lesson)` | `POST /api/approve-lesson` | Full `Lesson` JSON | `{ success: true, lesson_id: string }` |
| `getDbLessons()` | `GET /api/db-lessons` | None | Array of all approved lessons from SQLite |

#### Graceful Degradation Pattern
Look at how `frontend/src/services/api.ts` handles network failures:
```typescript
// Conceptual pattern used in api.ts:
export async function getDbLessons(): Promise<Lesson[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/db-lessons`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.warn('Backend unavailable, falling back to local storage:', error);
    // If backend is down, fall back to local IndexedDB automatically!
    return await storageService.getLessons();
  }
}
```
This is called **Graceful Degradation**: if the backend server crashes or is turned off, the frontend does not show a white error screen—it silently falls back to local data.

---

### 5. Offline-First Data Strategy: The Two-Tier Fallback

One of the most elegant architectural designs in VAAYANA is its **Two-Tier Storage Architecture** implemented in `frontend/src/services/storage.ts`.

```
                    ┌───────────────────────────────┐
                    │  Classroom requests a Lesson  │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ Does lesson exist in browser  │
                    │         IndexedDB?            │
                    └───────┬───────────────┬───────┘
                       YES  │               │ NO
                            ▼               ▼
          ┌─────────────────────┐   ┌────────────────────────────────┐
          │ Return lesson from  │   │ Read bundled sample lessons    │
          │ IndexedDB (instant) │   │ from `sampleLessons.ts`        │
          └─────────────────────┘   └───────────────┬────────────────┘
                                                    │
                                                    ▼
                                    ┌────────────────────────────────┐
                                    │ Automatically seed IndexedDB   │
                                    │ with sample data for next time │
                                    └────────────────────────────────┘
```

#### Why IndexedDB instead of localStorage?
You might be familiar with browser `localStorage`. However, `localStorage` has two severe limitations:
1. It is limited to approximately **5 MB** of text.
2. It is **synchronous**, meaning saving a large chapter with 30 slides can freeze the browser for half a second.

**IndexedDB**, by contrast:
- Is **asynchronous** (runs in the background without freezing the UI).
- Can store **hundreds of megabytes** of structured objects, images, and audio buffers.
- Supports indexing, transactions, and binary data.

---

### 6. Architectural Decision Records (ADRs)

To think like a senior engineer, you must understand *why* certain technologies were chosen over alternatives:

1. **Why Vite instead of Create-React-App?**
   *Create-React-App* uses Webpack, which takes 30–60 seconds to bundle. *Vite* uses native browser ES Modules, starting the development server in under 300 milliseconds.
2. **Why Web Audio API instead of MP3 files?**
   Loading 20 MP3 files over a slow school Wi-Fi connection causes audio delays. With the Web Audio API (`soundService.ts`), sound waves (chimes, clicks, fanfares) are generated mathematically on the fly in real-time with zero network requests.
3. **Why SQLite instead of PostgreSQL or MongoDB?**
   VAAYANA is designed to be self-contained on a teacher's laptop. Installing and running PostgreSQL requires background services and user authentication. SQLite requires zero configuration—the entire database lives in a single local file (`vaayana.db`).

---

### Mentor's Checkpoint
You now understand the macro-architecture: how components nest, how data flows between frontend and backend, and how offline storage guarantees uninterrupted classroom teaching.

Next, we will break down **Module 03: TypeScript for JavaScript Developers**, where we will demystify the syntax you see in `.ts` and `.tsx` files!

