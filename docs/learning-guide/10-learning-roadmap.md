# VAAYANA (വായന) — Developer Learning Guide
## Module 10: Personal Developer Learning Roadmap & Mastery Curriculum

---

### Welcome to Your Mastery Curriculum!
Congratulations on making it through the architectural and technical deep dives of Modules 01 through 09!

Reading code is essential, but **true mastery comes from hands-on execution**. This final module provides an **8-Stage Progressive Curriculum** designed specifically for your current technical background (basic JavaScript and Python, learning TypeScript, React, Tailwind, and FastAPI).

Each stage is structured with:
1. **Target Concepts**: What you will learn.
2. **Specific Files to Study**: Exact paths in VAAYANA.
3. **Hands-On Mini-Exercise**: A safe, practical challenge to build muscle memory.
4. **Graduation Criteria**: How you know you have mastered the stage.

---

### Stage 1: Mental Model & Architecture Mastery
*Goal: Understand how the application hangs together before touching code.*

- **Target Concepts**: Decoupled client-server architecture, offline-first execution, the lifecycle of a slide presentation.
- **Files to Study**:
  - `docs/learning-guide/01-project-overview.md`
  - `docs/learning-guide/02-architecture.md`
  - `frontend/src/App.tsx`
- **Hands-On Exercise**:
  1. Open `frontend/src/App.tsx`.
  2. Follow each `<Route>` tag and list the 5 primary page components.
  3. Draw a simple diagram on paper showing how a teacher clicks from `LandingPage` into `ClassroomExperience` and finally into `LessonView`.
- **Graduation Criteria**: You can explain to another person in 2 minutes how VAAYANA loads a lesson when the computer has no internet connection.

---

### Stage 2: TypeScript in Practice
*Goal: Overcome the fear of TypeScript types, interfaces, and compiler warnings.*

- **Target Concepts**: Primitive types, interfaces, optional fields (`?`), union types (`|`), typing props.
- **Files to Study**:
  - `docs/learning-guide/03-typescript-guide.md`
  - `frontend/src/types/index.ts`
  - `frontend/src/components/Footer.tsx`
- **Hands-On Exercise**:
  1. Open `frontend/src/types/index.ts`.
  2. Locate `interface Slide`.
  3. Notice how `teaching_notes?: string` is optional.
  4. Mental check: If you wanted to add an optional `audio_url?: string` to each slide, what line would you add to `Slide`?
  5. Check `ActivityType`: notice the list of supported activities. What happens if you add `'thermometer'` to this union?
- **Graduation Criteria**: You can read any interface in `types/index.ts` and instantly describe what properties an object must contain.

---

### Stage 3: React Core & Component Anatomy
*Goal: Master functional components, JSX, `useState`, `useEffect`, and props.*

- **Target Concepts**: Component nesting, state triggers, side effects, cleanup functions.
- **Files to Study**:
  - `docs/learning-guide/04-react-guide.md`
  - `frontend/src/components/SoundControl.tsx` (Simple state component)
  - `frontend/src/components/QuizActivity.tsx` (Interactive state component)
  - `frontend/src/context/LanguageContext.tsx` (Context provider)
- **Hands-On Exercise**:
  1. Open `frontend/src/components/SoundControl.tsx`.
  2. Trace the `useState` boolean that tracks whether sound is muted or enabled.
  3. See how the Lucide icon changes from `<Volume2 />` to `<VolumeX />` based on that state.
  4. Look at `QuizActivity.tsx` to see how `useState<number | null>(null)` tracks the selected option.
- **Graduation Criteria**: You understand why changing a state variable with `setScore(newScore)` causes React to re-render the score on screen, and why assigning `score = newScore` fails.

---

### Stage 4: Tailwind CSS & Visual Craft
*Goal: Confidently style user interfaces using utility classes and design tokens.*

- **Target Concepts**: Flexbox, grid, padding/margin scales, custom hex colors, hover states, dark theme mechanics.
- **Files to Study**:
  - `docs/learning-guide/05-tailwind-guide.md`
  - `frontend/tailwind.config.js`
  - `frontend/src/components/Navbar.tsx`
- **Hands-On Exercise**:
  1. Open `frontend/src/components/Navbar.tsx`.
  2. Find the language toggle button.
  3. Identify which Tailwind class sets the background (`bg-[#111114]` or `bg-[#7950B8]`).
  4. Identify which class sets the hover effect (`hover:border-[#7950B8]`).
  5. Identify which class provides rounded corners (`rounded-xl` or `rounded-full`).
- **Graduation Criteria**: You can look at any element in VAAYANA and predict its exact CSS styles just by reading its `className` string.

---

### Stage 5: Backend & AI Pipelines
*Goal: Understand how FastAPI, Pydantic, PyMuPDF, and Gemini collaborate.*

- **Target Concepts**: REST routes, request validation with Pydantic, PDF parsing, structured AI prompts.
- **Files to Study**:
  - `docs/learning-guide/06-backend-guide.md`
  - `backend/app/models.py`
  - `backend/app/ocr.py`
  - `backend/app/gemini_service.py`
  - `backend/main.py`
- **Hands-On Exercise**:
  1. Start the backend: `cd backend && uvicorn main:app --reload`.
  2. Open your browser to `http://localhost:8000/docs`.
  3. Find the `GET /api/health` endpoint and click **Try it out** -> **Execute**.
  4. Inspect the JSON response.
  5. Find the `POST /api/generate-lesson` endpoint and inspect the schema definition generated by Pydantic.
- **Graduation Criteria**: You can trace how an uploaded PDF goes from raw bytes to PyMuPDF text, into a Gemini prompt, through Pydantic validation, and into a JSON response.

---

### Stage 6: Database & Offline Architecture
*Goal: Master local data persistence across SQLite and browser IndexedDB.*

- **Target Concepts**: Relational tables, SQL parameterization, IndexedDB object stores, transactions, auto-seeding.
- **Files to Study**:
  - `docs/learning-guide/07-database-and-offline.md`
  - `backend/app/database.py`
  - `frontend/src/services/storage.ts`
  - `frontend/src/data/sampleLessons.ts`
- **Hands-On Exercise**:
  1. Open Chrome/Edge Developer Tools (`F12`) on `http://localhost:5173`.
  2. Navigate to **Application** -> **Storage** -> **IndexedDB** -> **vaayana_local_db** -> **lessons**.
  3. Click on the first lesson (`math-ch1`).
  4. Inspect the raw JavaScript object containing slides and quiz questions.
  5. Open `frontend/src/services/storage.ts` and locate `getAllLessons()`. Notice how the `IDBTransaction` reads those records.
- **Graduation Criteria**: You can explain how IndexedDB ensures that lessons, slides, and quizzes work even if the teacher disconnects the Wi-Fi.

---

### Stage 7: Feature Engineering — Building a New Manipulative
*Goal: Apply everything you have learned to build a brand new interactive learning tool.*

- **Target Concepts**: Component state, SVG/Canvas rendering, touch interactions, sound triggers.
- **Files to Study as References**:
  - `frontend/src/components/activities/AbacusManipulative.tsx`
  - `frontend/src/components/activities/CompassActivity.tsx`
- **Hands-On Challenge (The Digital Thermometer)**:
  1. Goal: Create a digital thermometer where Class 4 students can slide mercury up and down to learn about temperature in EVS.
  2. Step 1: Create a new file `frontend/src/components/activities/ThermometerActivity.tsx`.
  3. Step 2: Define a state: `const [temperature, setTemperature] = useState<number>(25);`.
  4. Step 3: Draw a vertical tube using Tailwind `w-8 h-64 bg-gray-800 rounded-full relative`.
  5. Step 4: Draw the red mercury inside: `<div style={{ height: `${temperature}%` }} className="w-full bg-[#FF8066] rounded-full transition-all" />`.
  6. Step 5: Add buttons for `+5°C` and `-5°C` that call `setTemperature()` and play `soundService.playClick()`.
  7. Step 6: Add bilingual labels: "താപനില (Temperature): {temperature}°C".
- **Graduation Criteria**: You can create an interactive interactive manipulative from scratch and register it inside `InteractiveSlideView.tsx`.

---

### Stage 8: Independent Maintenance, Debugging & Extension
*Goal: Attain full independence to debug and maintain VAAYANA in production.*

- **Target Concepts**: Console logging, React DevTools, Network tab debugging, error boundaries, performance profiling.
- **Files to Study**:
  - `docs/learning-guide/09-codebase-review.md`
  - Browser DevTools (Console, Network, Sources, Application tabs)
- **Hands-On Exercise**:
  1. Intentionally introduce a syntax error in a component (e.g., mistype a prop name).
  2. Observe the TypeScript error message in your terminal and editor.
  3. Fix the error.
  4. Open the Network tab in DevTools, click around the app, and observe that **zero network requests** are made during classroom presentation mode (proving 100% offline autonomy).
- **Graduation Criteria**: You can identify, trace, and fix a bug in both the frontend React code and the backend FastAPI code without asking for assistance.

---

### Mentor's Final Words
You now possess a complete, professional, 10-module curriculum tailored specifically to your learning journey. Take your time, tackle one stage at a time, and remember: **every great software engineer was once a beginner who refused to give up.**

Whenever you are ready, pick your starting point and let us begin!

