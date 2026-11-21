# VAAYANA (വായന) — Project Documentation

> Comprehensive design, architecture, implementation status, and operational reference for VAAYANA. For step-by-step developer setup, see [DEVELOPMENT.md](DEVELOPMENT.md). For system diagrams and IPC specifications, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 1. Project Overview

VAAYANA (വായന) is an offline-first, teacher-led interactive learning and smartboard application engineered specifically for primary classrooms in Kerala (Grade 4, Malayalam medium).

Originally developed for **ALP School Koottala**, VAAYANA transforms textbook chapters into participatory, visual, and tactile learning experiences. Instead of passive lecture slides or static textbooks, teachers guide learners through interactive manipulatives, 3D shape visualizers, digital abacuses, clock simulators, and immediate-feedback classroom challenges.

VAAYANA is packaged as a standalone **Linux AppImage** for classroom smartboards, requiring no prior installation of Node.js, Python, or Git by the teacher, and persisting all user lesson data locally across application updates.

---

## 2. Target Users & Environment

- **Primary User**: Classroom teachers facilitating lessons on interactive smartboards or projector-connected classroom PCs.
- **Learners**: Grade 4 primary school children interacting with tactile visual tools under teacher guidance.
- **Educational Context**: Kerala State Syllabus (SCERT), Class 4, Malayalam and English medium.
- **Display & Input**: Touchscreen smartboards, digital display panels, mouse, and keyboard.
- **Operational Model**: 100% offline classroom execution. Internet access is only needed for initial AppImage download, optional automatic updates, and optional AI-assisted lesson generation during teacher preparation.

---

## 3. Curriculum Scope & Implementation Status

### Grade 4 Mathematics (SCERT Kerala)

All six primary mathematics chapters are fully implemented with interactive manipulatives:

| Chapter | Title (Malayalam & English) | Learning Focus & Manipulatives | Implementation Status |
|---|---|---|---|
| **Ch 1** | **Lines and Shapes**<br>*(വരകളും രൂപങ്ങളും)* | Circles, triangles, rectangles; 5x5 digital Geoboard with elastic bands; rotatable 3D solids (cube, cuboid, cone); 7-piece Tangram puzzle. | **Implemented & Verified** |
| **Ch 2** | **Find the Relation**<br>*(ബന്ധം കണ്ടെത്താം)* | Number patterns, 4-digit place values, 4-column interactive Abacus, Toto car-race score challenge, number-pair matching. | **Implemented & Verified** |
| **Ch 3** | **How Many Numbers?**<br>*(എത്രയെത്ര സംഖ്യകൾ)* | Rotating number wheel, Roman numerals explorer ($I, V, X, L, C$), synchronized analogue/digital clock simulator. | **Implemented & Verified** |
| **Ch 4** | **Increasing Numbers**<br>*(കൂടുന്ന സംഖ്യകൾ)* | Number combinations, complements to 1000, multi-strategy addition visualizer, Dwani door challenge. | **Implemented & Verified** |
| **Ch 5** | **It's Time!**<br>*(സമയമായി!)* | **The Girls' Race** (synchronized clock race analysis); **Little Drops, Mighty Ocean** (water leak timer: 1 mL/sec); **Calendar Mathematics** (interactive monthly calendar & leap years). | **Implemented & Verified** |
| **Ch 6** | **Decreasing Numbers**<br>*(കുറയുന്ന സംഖ്യകൾ)* | **Abacus Subtraction** (place-value bead removal & regrouping); **Written Subtraction Board** (vertical column subtraction); **Indian Currency Explorer** (notes & coins calculation). | **Implemented & Verified** |

### Environmental Studies (EVS) & English Modules

| Subject | Chapter | Implemented Activities | Status |
|---|---|---|---|
| **EVS** | **Around Us in Different Forms**<br>*(നമുക്ക് ചുറ്റും പല രൂപങ്ങളിൽ)* | Solid/Liquid/Gas classifier, container shape adaptation explorer, thermal state transitions (melting, boiling, condensation, freezing), air space demonstration. | **Implemented & Verified** |
| **EVS** | **Marvels of the Sky**<br>*(ആകാശത്തിലെ വിസ്മയങ്ങൾ)* | 3D Solar system simulator, Earth rotation/revolution simulator, Moon phases visualizer, Chandrayaan lunar explorer. | **Implemented & Verified** |
| **EVS** | **Directions and Homeland**<br>*(ദിക്കറിയാം നാട്ടിലൂടാകാം)* | 8-point interactive compass, village map navigation, magnetic compass demo, Kerala river & backwaters explorer. | **Implemented & Verified** |
| **English** | **The Seed of Truth** | Reading passages, vocabulary builder, moral reflection slides, comprehension quiz. | **Implemented & Verified** |

---

## 4. System Architecture

VAAYANA pairs a modern React frontend with a native Electron host and an embedded Python FastAPI backend.

```text
+--------------------------------------------------------------------------------+
|                          ELECTRON DESKTOP CONTAINER                            |
|                                                                                |
|  +-------------------------------------+   +--------------------------------+  |
|  |     Chromium Renderer (Frontend)    |   |     Electron Main Process      |  |
|  |                                     |   |                                |  |
|  |  • React 18 + TypeScript + Vite     |   |  • main.cjs (Window Management)|  |
|  |  • Tailwind CSS + Framer Motion     |   |  • backend-manager.cjs         |  |
|  |  • IndexedDB (drishti_educational)  |   |  • updater-manager.cjs         |  |
|  |  • Noto Sans Malayalam Fonts        |   |  • preload.cjs (Isolated IPC)  |  |
|  +-------------------------------------+   +--------------------------------+  |
|                     │                                      │                   |
|                     │ HTTP REST (127.0.0.1:8000)           │ Process Lifecycle |
|                     ▼                                      ▼ (Spawn / SIGTERM) |
|  +--------------------------------------------------------------------------+  |
|  |                Standalone FastAPI Backend (PyInstaller)                  |  |
|  |                                                                          |  |
|  |  • main.py: REST Endpoints (/api/health, /api/extract-pdf, etc.)         |  |
|  |  • ocr.py: PyMuPDF PDF Text Extraction + Tesseract OCR Fallback          |  |
|  |  • gemini_service.py: Gemini 2.5 Flash Structured Lesson Prompting       |  |
|  |  • database.py: Scoped Lesson Caching & SQLite Operations                |  |
|  +--------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------+
                                       │
                                       ▼
        +--------------------------------------------------------------+
        |                 OS Persistent User Directory                 |
        |       Linux: ~/.local/share/VAAYANA/ ($XDG_DATA_HOME)        |
        |       Windows: %APPDATA%/VAAYANA/                            |
        |                                                              |
        |       • vaayana.db (SQLite database of approved lessons)     |
        |       • Uploaded textbook files & extracted assets           |
        +--------------------------------------------------------------+
```

---

## 5. Local Data Persistence & Zero-Data-Loss Guarantee

Packaged AppImages run from a read-only SquashFS mount. To guarantee data persistence:

1. **Persistent Location**: Electron's `backend-manager.cjs` resolves the operating system's canonical user data path and injects `VAAYANA_DATA_DIR` into the backend process:
   - **Linux**: `~/.local/share/VAAYANA/`
   - **Windows**: `%APPDATA%\VAAYANA\`
2. **SQLite Database**: The local database file `vaayana.db` resides in this directory. It stores:
   - Extracted textbook chapter records and metadata.
   - SHA-256 document cache keys.
   - Teacher-approved lessons and customized quiz questions.
3. **AppImage Updates**: When the user updates VAAYANA to a newer version (either via the auto-updater or by downloading a newer AppImage), `~/.local/share/VAAYANA/` is **never touched**. All saved lessons, custom content, and database records remain intact.

---

## 6. AI & PDF Textbook Extraction Pipeline

VAAYANA features a local-first teacher lesson preparation pipeline with optional cloud AI enhancement:

1. **Document Upload**: Teachers can upload textbook chapters in PDF or image format.
2. **Text Extraction**:
   - **PyMuPDF (`fitz`)**: Fast digital extraction of text, font spans, and page boundaries.
   - **Tesseract OCR**: Automatically invoked if extracted text density is low (supporting scanned textbook pages in Malayalam and English).
3. **Scoped Caching**:
   - A deterministic cache key is generated: `SHA256(fileHash + startPage + endPage + chapterTitle)`.
   - If a lesson for this page range was previously approved and saved to SQLite, it loads instantly with **0 API calls**.
4. **Structured Lesson Generation**:
   - **Online Mode**: Invokes Google Gemini 2.5 Flash using structured Pydantic schemas to extract bilingual learning objectives, core concepts, real-life examples, classroom discussion questions, interactive activity mappings, and multi-choice quizzes.
   - **Offline / Fallback Mode**: If no Gemini API key is configured or the machine is offline, `generate_manual_template_lesson` generates a structured editable SCERT template immediately.
5. **Teacher Approval**: The teacher inspects, edits, or regenerates individual sections. The lesson is saved with `approvalStatus = 'approved'` and immediately becomes available in the classroom view.

---

## 7. Automatic Update Mechanism

- **Technology**: `electron-updater` configured with the GitHub Releases provider for `nandita-dot/vaayana`.
- **Target**: Linux x64 AppImage packages.
- **Workflow**:
  1. Checks for updates 15 seconds after startup, then every 4 hours in the background.
  2. Compares local `package.json` version against `latest-linux.yml` on GitHub Releases.
  3. Displays a non-blocking notification banner in the UI with release notes.
  4. Downloads only upon explicit teacher confirmation, displaying progress.
  5. On install, terminates the Python backend subprocess gracefully before replacing the AppImage and relaunching.

---

## 8. License & Usage

VAAYANA is developed for **ALP School Koottala, Kerala**.

Copyright © 2026 Nandita Nair. All rights reserved.

The software is provided for internal educational and classroom use at ALP School Koottala. For details, refer to the [LICENSE](LICENSE) file.
