# VAAYANA (വായന) — Developer Learning Guide
## Module 01: Project Overview & System Fundamentals

---

### Welcome to Your Mentorship Journey
Welcome to the inner workings of **VAAYANA (വായന)**! As your senior software engineer and personal mentor, my goal is to guide you step-by-step from having basic JavaScript and Python knowledge to possessing a deep, comprehensive mastery of this entire codebase. 

By the end of this guide, you will not only understand how every single component and API endpoint fits together, but you will also feel confident modifying features, fixing bugs, and adding brand new educational modules on your own.

---

### 1. What is VAAYANA?

**VAAYANA** (a Malayalam word meaning *"Reading"* or *"Comprehensive Learning"*) is an interactive, bilingual (Malayalam and English) digital smartboard and classroom presentation suite. It was specially designed for primary school classrooms, tailored specifically for **ALP School Koottala (A.L.P.S. Koottala)** following the **Kerala SCERT** (State Council of Educational Research and Training) curriculum for Class 4.

#### The Problem It Solves
1. **Rural Smartboard Usability**: Traditional presentation tools (like PowerPoint or generic slide viewers) are passive, clunky on touchscreens, and lack specialized primary-school tools.
2. **Intermittent Connectivity**: Many rural classrooms in Kerala experience unstable internet access. VAAYANA is engineered with an **offline-first** design: once loaded or bundled, an entire lesson (complete with interactive simulations, voice narration, and quizzes) runs directly in the browser with **zero internet connection**.
3. **Bilingual Classroom Pedagogy**: In Kerala state schools, teachers switch fluidly between Malayalam and English. VAAYANA allows instant bilingual switching at the click of a button for all interface labels, slide contents, vocabulary flashcards, and voice narration.
4. **Hands-On Digital Manipulatives**: Rather than just showing static textbook pictures, VAAYANA provides tactile digital manipulatives—such as an interactive bead abacus, geometric geoboard, rotatable analog clock, draggable fraction circles, 3D compass, solar system simulator, and water cycle demonstrator.

---

### 2. High-Level Technology Stack

VAAYANA is structured as a **modern decoupled web application** consisting of an autonomous frontend client and a Python FastAPI backend.

```
+---------------------------------------------------------------------------------+
|                                 BROWSER CLIENT                                  |
|                                                                                 |
|  React 18 + Vite               Tailwind CSS              Lucide & Framer Motion |
|  - Component UI Tree           - Child-Friendly Dark     - Tactile animations   |
|  - Fast HMR Development          Theme & Playful Accents - Iconography          |
|                                                                                 |
|  Web Audio API (Synthesizer)   HTML5 Canvas (Drawing)    IndexedDB (Storage)    |
|  - Sound effects & fanfares    - Teacher smartboard pen  - Offline persistence  |
+---------------------------------------------------------------------------------+
                                       ▲
                                       │ HTTP / REST APIs (JSON)
                                       ▼
+---------------------------------------------------------------------------------+
|                                 PYTHON BACKEND                                  |
|                                                                                 |
|  FastAPI + Uvicorn             Pydantic v2               SQLite (vaayana.db)    |
|  - Async web server            - Data validation         - Lesson persistence   |
|  - REST endpoints              - Strict schema contracts - Lesson versioning    |
|                                                                                 |
|  PyMuPDF (fitz) + Tesseract    Google GenAI SDK (Gemini) Hash Cache Engine      |
|  - PDF text & layout parsing   - Automated slide & quiz  - SHA-256 duplicate    |
|  - Malayalam/English OCR         curation from textbook    detection            |
+---------------------------------------------------------------------------------+
```

#### Frontend Core Technologies
- **React 18**: A JavaScript library that builds user interfaces using reusable building blocks called "components".
- **TypeScript**: A superset of JavaScript that adds "types" (formal contracts on variables and function arguments) so errors are caught while typing code rather than crashing at runtime in front of students.
- **Vite**: An ultra-fast development server and asset bundler that transforms our code and hot-reloads the browser in milliseconds.
- **Tailwind CSS**: A utility-first CSS framework that lets you style HTML elements directly in the code using shorthand class names (e.g., `flex items-center justify-between bg-black text-white`).
- **Framer Motion**: A fluid motion library that powers the playful cartoon airplane transitions, floating stars, and sliding UI panels.
- **Canvas Confetti**: A lightweight visual particle library that launches bursts of colorful celebration confetti when students complete an activity or quiz.
- **Web Audio API**: Browser-native sound generation that synthesizes cheerful chimes, pops, coin drops, and victory music using pure mathematical audio frequencies without downloading large MP3 files.
- **IndexedDB**: A client-side database built into all modern browsers allowing megabytes of lesson data, quizzes, and state to persist even when the device is completely disconnected from the network.

#### Backend Core Technologies
- **Python 3.10+**: The backend scripting language chosen for its extensive ecosystem in document processing and AI.
- **FastAPI**: A high-performance Python web framework built on standard Python type hints, featuring automatic interactive OpenAPI documentation (`/docs`).
- **Uvicorn**: An ASGI (Asynchronous Server Gateway Interface) web server that powers FastAPI.
- **Pydantic v2**: A data validation and settings management library that enforces strict structure on the lessons, slides, and quizzes traveling between the database, AI model, and frontend.
- **PyMuPDF (`fitz`) & Tesseract OCR**: Tools to extract raw text and images from Kerala SCERT textbook PDF files, supporting Malayalam script optical character recognition.
- **Google GenAI SDK (`google-genai`)**: Connects to Google's Gemini models (`gemini-2.5-flash`) to intelligently read raw textbook pages, extract learning objectives, format interactive slides, and draft multiple-choice quiz questions.
- **SQLite**: A serverless, self-contained SQL database stored in a single file (`backend/vaayana.db`) used to cache processed lessons and track lesson versions.

---

### 3. Repository Tour & Directory Layout

Let us take a walking tour through the root workspace (`d:\projects\dristhi`):

```
d:\projects\dristhi\
├── .env.example              # Template showing required environment variables
├── .gitignore                # Tells Git which files to ignore (node_modules, venv, .db)
├── LICENSE                   # Software license (MIT)
├── README.md                 # User-facing summary of the project
├── PROJECT_DOCUMENTATION.md  # Detailed technical architectural documentation
├── start_vaayana.bat         # One-click Windows batch script to start both servers
│
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py       # Marks directory as a Python package
│   │   ├── config.py         # Application settings, ports, and environment variables
│   │   ├── database.py       # SQLite connection, schema definition, and query helpers
│   │   ├── gemini_service.py # Gemini 2.5 integration, prompt engineering, and fallbacks
│   │   ├── models.py         # Pydantic schemas (Lesson, Slide, Quiz, Vocabulary)
│   │   ├── ocr.py            # PDF text extraction and Tesseract Malayalam OCR
│   │   └── sample_data.py    # Hardcoded SCERT Class 4 sample lessons (fallback data)
│   ├── main.py               # Application entrypoint and REST API endpoints
│   ├── requirements.txt      # Python package dependencies
│   ├── vaayana.db            # Local SQLite database file (created automatically)
│   └── venv/                 # Python virtual environment (isolated packages)
│
└── frontend/                 # React + TypeScript Frontend
    ├── index.html            # Main HTML document template
    ├── package.json          # Node.js dependencies and script definitions
    ├── postcss.config.js     # PostCSS configuration for Tailwind CSS
    ├── tailwind.config.js    # Tailwind color palette, fonts, and dark theme setup
    ├── tsconfig.json         # TypeScript compiler configuration
    ├── vite.config.ts        # Vite build tool and development server configuration
    ├── public/               # Static assets served directly (favicons, audio, fonts)
    └── src/                  # Application source code
        ├── App.tsx           # Top-level React component, routes, and global providers
        ├── main.tsx          # React application entrypoint (renders App into index.html)
        ├── index.css         # Global CSS styles and Tailwind directives
        ├── context/          # React Context providers for global application state
        │   └── LanguageContext.tsx  # Malayalam / English bilingual toggle state
        ├── types/            # TypeScript type definitions and interfaces
        │   └── index.ts      # Core contracts (Lesson, Slide, ActivityType, Quiz)
        ├── data/             # Static client-side data
        │   └── sampleLessons.ts     # Pre-bundled SCERT Math & EVS Class 4 lessons
        ├── services/         # Client services for external communication & hardware
        │   ├── api.ts        # Fetch API functions to talk to FastAPI backend
        │   ├── storage.ts    # Native IndexedDB client storage engine
        │   └── soundService.ts # Web Audio API procedural sound synthesizer
        ├── pages/            # Full-page view components mapped to URLs
        │   ├── LandingPage.tsx        # Homepage with subject cards and school identity
        │   ├── TeacherWorkspace.tsx   # PDF upload, OCR preview, and AI generation
        │   ├── ClassroomExperience.tsx# Smartboard dashboard & lesson launcher
        │   ├── LessonView.tsx         # Slide-by-slide presentation viewer
        │   └── LibraryPage.tsx        # Lesson repository and offline storage manager
        └── components/       # Reusable UI components
            ├── Navbar.tsx             # Top navigation bar with bilingual switch
            ├── Footer.tsx             # Footer showing A.L.P.S. Koottala identity
            ├── InteractiveSlideView.tsx # Main slide renderer with drawing canvas
            ├── QuizActivity.tsx       # Multiple-choice quiz runner with celebratory sound
            ├── SmartboardControls.tsx # Touch-friendly presentation control bar
            ├── SoundControl.tsx       # Audio toggle button
            ├── UploadModal.tsx        # Modal for uploading textbook PDF chapters
            ├── EducationalVideo.tsx   # Embeddable video component
            ├── activities/            # 30+ Interactive subject manipulatives
            │   ├── AbacusManipulative.tsx
            │   ├── AnalogClockManipulative.tsx
            │   ├── TangramActivity.tsx
            │   ├── GeoboardManipulative.tsx
            │   ├── CompassActivity.tsx
            │   ├── SolarSystemSimulator.tsx
            │   └── ... (many more)
            └── animations/            # Visual presentation animations
                ├── ChapterTransition.tsx # 16s cartoon airplane flight & celebration
                ├── MotionBackground.tsx  # Subtle floating educational background icons
                ├── ConceptAnimator.tsx   # Animated concept explainer cards
                └── EmphasisWordAnimator.tsx # Word-by-word visual highlight animation
```

---

### 4. The Three Core User Workflows

To understand why the code is written the way it is, let us follow the three primary journeys through the system.

#### Workflow 1: The Teacher Lesson Preparation Flow (Online / Semi-Online)
```
Teacher uploads textbook PDF (SCERT Class 4)
  │
  ▼
Frontend `UploadModal.tsx` posts file to Backend `/api/extract-pdf`
  │
  ▼
PyMuPDF (`fitz`) parses PDF text; if scanned, Tesseract runs Malayalam OCR
  │
  ▼
Backend computes SHA-256 hash of the file to check SQLite cache
  │
  ▼
Teacher reviews extracted text preview in `TeacherWorkspace.tsx`
  │
  ▼
Teacher clicks "Generate Interactive Lesson" -> calls `/api/generate-lesson`
  │
  ▼
Gemini 2.5 Flash analyzes text, structures into slides, selects manipulatives & writes quiz
  │
  ▼
Teacher inspects and edits slides in the workspace editor
  │
  ▼
Teacher clicks "Approve & Save" -> Lesson is saved to Backend SQLite AND Frontend IndexedDB
```

#### Workflow 2: The Smartboard Classroom Experience (Interactive Teaching)
```
Teacher navigates to `/classroom` on the projector / smartboard
  │
  ▼
Selects Subject (Mathematics or EVS) and Chapter (e.g., "Know the Directions")
  │
  ▼
`LessonView.tsx` mounts and loads the approved lesson from IndexedDB
  │
  ▼
`InteractiveSlideView.tsx` renders the current slide:
  ├── Malayalam & English bilingual text side-by-side
  ├── Smartboard Canvas drawing overlay (teacher draws with pen/finger)
  ├── HTML5 SpeechSynthesis speaks the slide content aloud in Malayalam
  └── Dynamic Manipulative Component loads (e.g., `CompassActivity.tsx`)
  │
  ▼
Teacher advances through slides using large touch buttons (`SmartboardControls.tsx`)
  │
  ▼
Final Slide launches `QuizActivity.tsx` (Students vote on options, chimes play on answers)
  │
  ▼
Quiz completes -> `ChapterTransition.tsx` plays celebratory fanfare, confetti explodes,
and a cute cartoon airplane glides across the screen!
```

#### Workflow 3: The 100% Offline Emergency Classroom Mode
```
Teacher boots computer in a classroom with NO internet and NO backend server running.
  │
  ▼
Browser opens local frontend (e.g., cached or local file server).
  │
  ▼
Frontend `storage.ts` checks IndexedDB (`vaayana_local_db`).
  │
  ▼
If IndexedDB is empty, it automatically seeds itself from `frontend/src/data/sampleLessons.ts`.
  │
  ▼
All 6 Mathematics chapters and 3 EVS chapters load with complete slides, interactive
manipulatives, sound effects, and quizzes with ZERO network requests.
```

---

### 5. Essential Jargon Glossary (For Beginners)

Before we dive into the deep architecture, let us demystify several technical terms that you will encounter frequently:

- **Component**: In React, a component is a reusable JavaScript function that returns user interface code (HTML-like syntax called JSX). Think of it like a custom HTML tag (e.g., `<Navbar />` or `<AbacusManipulative />`).
- **Props**: Short for "properties". In React, props are arguments passed into a component, exactly like arguments passed into a regular JavaScript function.
- **State**: Variables inside a component that, when changed, automatically cause the browser to redraw (re-render) that part of the screen.
- **TypeScript Interface**: A blueprint or contract that specifies what fields an object must have (e.g., an interface `Slide` says that every slide must have a `title`, `content`, and `slideNumber`).
- **REST API**: A standard way for frontend code to ask the backend server for data using standard HTTP requests (`GET`, `POST`, `PUT`, `DELETE`).
- **Endpoint**: A specific URL on the backend server that listens for requests (e.g., `http://localhost:8000/api/generate-lesson`).
- **Pydantic Model**: A Python class that automatically verifies whether incoming data matches the expected data types and structure before allowing the code to proceed.
- **IndexedDB**: A fast, transactional database engine built directly inside modern web browsers that lets web applications save objects locally on the user's hard drive.
- **Manipulative**: In primary school pedagogy, a physical object (like counting beads, blocks, or clock hands) used by children to learn abstract concepts through touch. In VAAYANA, these are digital, interactive web components.

---

### Mentor's Checkpoint
Now that you have a solid bird's-eye view of the project's purpose, technologies, directory structure, and user workflows, you are ready to explore **Module 02: Architecture & Data Flow**!

