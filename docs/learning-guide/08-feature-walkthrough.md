# VAAYANA (വായന) — Developer Learning Guide
## Module 08: End-to-End Feature Walkthroughs

---

### Mentor Introduction
The true mark of a developer who understands an application is their ability to trace any user interaction from start to finish. When a student clicks a button or a teacher swipes on a smartboard, what exact line of code runs first? What state changes? What functions are invoked?

In this module, we will perform a deep dive into **12 key features** of VAAYANA, walking through the code execution paths step-by-step.

---

### Feature 1: Homepage Navigation & Subject Selection

**User Action**: The teacher opens the home page (`/`) and clicks the "Mathematics" or "EVS" card.

1. **Initiating Component**: `frontend/src/pages/LandingPage.tsx`.
2. **State & Rendering**:
   - `LandingPage` imports subject cards from local definitions or state.
   - Each card displays bilingual titles (e.g., "Mathematics / ഗണിതം"), chapter counts, and theme-colored icons.
3. **Execution**:
   - The user clicks a subject card, triggering a React Router `<Link to="/classroom?subject=mathematics">` or calling `navigate('/classroom')`.
4. **Data Flow**:
   - The browser URL updates to `/classroom`. React Router unmounts `LandingPage` and mounts `ClassroomExperience`.
   - `ClassroomExperience` reads the query parameter (or default filter) and sets `selectedSubject = 'mathematics'`.
5. **UI Update**:
   - The classroom grid filters and displays only Mathematics chapters (Chapters 1 through 6).

---

### Feature 2: Bilingual Malayalam/English Toggle

**User Action**: The teacher clicks the language switch button in the navigation bar (`Navbar.tsx`).

1. **Initiating Component**: `frontend/src/components/Navbar.tsx`.
2. **Execution**:
   - The user clicks the button `<button onClick={toggleLanguage}>`.
   - This invokes `toggleLanguage()` provided by `useLanguage()` from `LanguageContext.tsx`.
3. **Data Transformation & State**:
   - In `LanguageContext.tsx`, the state setter `setLanguage(prev => prev === 'ml' ? 'en' : 'ml')` flips the state string.
4. **Re-render Propagation**:
   - Every component subscribing to `useLanguage()` across the entire app tree re-renders simultaneously:
     - `Navbar.tsx` updates its text from "മലയാളം" to "English".
     - `InteractiveSlideView.tsx` re-evaluates `{language === 'ml' ? slide.title_ml : slide.title_en}`.
     - `QuizActivity.tsx` switches questions and answer choices to the chosen language.

---

### Feature 3: PDF Upload, Extraction & OCR Preview

**User Action**: In the Teacher Workspace (`/teacher`), the teacher drags and drops a SCERT textbook chapter PDF.

1. **Initiating Component**: `frontend/src/components/UploadModal.tsx`.
2. **Execution**:
   - The `<input type="file" onChange={handleFileChange} />` event captures the `File` object.
   - The user clicks "Extract Text". This invokes `extractPdf(file)` in `frontend/src/services/api.ts`.
3. **Network Request**:
   - `api.ts` builds a `FormData` object containing the binary file and executes `fetch('http://localhost:8000/api/extract-pdf', { method: 'POST', body: formData })`.
4. **Backend Processing (`backend/main.py` -> `app/ocr.py`)**:
   - FastAPI receives `UploadFile`. It computes `hashlib.sha256(content).hexdigest()`.
   - It checks `check_cache(file_hash)`. If absent, PyMuPDF opens the PDF stream.
   - For each page, if selectable text is found, it extracts it; if scanned, Tesseract runs OCR (`lang='mal+eng'`).
   - The endpoint returns `{ pages: [...], total_pages: 5, file_hash: "..." }`.
5. **UI Update**:
   - `UploadModal` receives the JSON response, calls `onExtractionComplete(data)`, and closes the modal.
   - `TeacherWorkspace.tsx` displays the extracted text preview in a scrollable panel with page navigation tabs.

---

### Feature 4: AI-Powered Lesson Generation (Gemini 2.5)

**User Action**: The teacher reviews the extracted textbook text and clicks "Generate Interactive Lesson".

1. **Initiating Component**: `frontend/src/pages/TeacherWorkspace.tsx`.
2. **Execution**:
   - Invokes `generateLesson({ text: rawText, subject: 'evs', chapter_title: 'Marvels of the Sky' })` in `api.ts`.
3. **Backend Processing (`app/gemini_service.py`)**:
   - FastAPI endpoint `/api/generate-lesson` calls `generate_lesson_from_text()`.
   - The system formats a prompt with pedagogical guidelines for Kerala Class 4.
   - The Google GenAI SDK invokes `gemini-2.5-flash` with `response_mime_type: "application/json"`.
   - Pydantic validates the returned JSON against the `Lesson` schema (`app/models.py`).
   - The lesson is saved in SQLite table `lessons` as a draft (`is_approved = 0`).
4. **Frontend State & UI Update**:
   - `TeacherWorkspace.tsx` receives the full `Lesson` object and sets `setLesson(data)`.
   - A live interactive preview appears on screen showing slides, interactive manipulative badges, vocabulary lists, and quiz questions. The teacher can edit slide text directly before saving.

---

### Feature 5: Slide-by-Slide Smartboard Navigation

**User Action**: The teacher or student presses the "Next" button or hits the Right Arrow key on a wireless smartboard clicker.

1. **Initiating Component**: `frontend/src/pages/LessonView.tsx` and `SmartboardControls.tsx`.
2. **Event Listeners**:
   - Touch/Click: `<button onClick={handleNextSlide}>` inside `SmartboardControls.tsx`.
   - Keyboard: Window `keydown` event listener in `LessonView.tsx` (`event.key === 'ArrowRight' || event.key === 'Space'`).
3. **State Change**:
   - `setCurrentSlideIndex(prev => Math.min(prev + 1, lesson.slides.length - 1))`.
4. **Sound Feedback**:
   - Calls `soundService.playClick()` -> Web Audio API synthesizes a subtle 400Hz pop sound.
5. **UI Update**:
   - The progress bar at the top advances (e.g., from `33%` to `50%`).
   - `InteractiveSlideView.tsx` re-renders with the new slide data.
   - Any previous drawing canvas annotations are preserved or reset based on settings.

---

### Feature 6: Smartboard Drawing Canvas Overlay

**User Action**: The teacher clicks the "Pen" tool to circle an important word or draw a diagram over the slide.

1. **Initiating Component**: `frontend/src/components/InteractiveSlideView.tsx` and `SmartboardControls.tsx`.
2. **Execution**:
   - Teacher taps the Pen icon in `SmartboardControls.tsx`.
   - Toggles state: `setIsDrawingMode(prev => !prev)`.
3. **Canvas Setup**:
   - In `InteractiveSlideView.tsx`, the `<canvas>` element switches its CSS from `pointer-events-none` to `pointer-events-auto` and `cursor-crosshair`.
   - The teacher selects a color (e.g., `#FFD166` warm yellow or `#72D6B0` mint).
4. **Drawing Logic**:
   - `onMouseDown` / `onTouchStart`: Records starting coordinates `(e.offsetX, e.offsetY)` and sets `isDrawing = true`.
   - `onMouseMove` / `onTouchMove`: If `isDrawing === true`, obtains 2D context `ctx = canvas.getContext('2d')`, calls `ctx.lineTo(x, y)` and `ctx.stroke()`.
   - `onMouseUp` / `onTouchEnd`: Sets `isDrawing = false` and calls `ctx.closePath()`.
5. **Clear / Reset**:
   - Clicking the "Eraser/Trash" button calls `ctx.clearRect(0, 0, canvas.width, canvas.height)`.

---

### Feature 7: Interactive Math Manipulatives (Abacus & Clock)

**User Action**: During a Math lesson on Place Values (Chapter 1), the student drags beads on the digital abacus.

1. **Initiating Component**: `frontend/src/components/activities/AbacusManipulative.tsx`.
2. **State & Logic**:
   - The abacus maintains state for 4 columns: `Thousands`, `Hundreds`, `Tens`, `Ones`:
     ```typescript
     const [columns, setColumns] = useState({ thousands: 2, hundreds: 4, tens: 5, ones: 3 });
     ```
3. **Interaction**:
   - Clicking or dragging a bead in the "Tens" column calls `handleBeadClick('tens', beadIndex)`.
   - Invokes `soundService.playBeadMove()` -> Plays a soft wooden click tone via Web Audio API.
   - Calculates the new total value: `(2 * 1000) + (4 * 100) + (6 * 10) + (3 * 1) = 2463`.
4. **UI Update**:
   - The bead animates along the rod using CSS transitions.
   - The digital readout below updates instantly in both English digits ("2,463") and Malayalam word form ("രണ്ടായിരത്തി നാനൂറ്റി അറുപത്തിമൂന്ന്").

---

### Feature 8: Interactive EVS Manipulatives (Magnetic Compass)

**User Action**: In EVS Chapter 3 ("Know the Directions"), the student rotates a digital magnetic compass to find North.

1. **Initiating Component**: `frontend/src/components/activities/CompassActivity.tsx`.
2. **State & Logic**:
   - Maintains `rotationAngle` state (in degrees from 0 to 360).
3. **Interaction**:
   - Student drags the dial or taps directional buttons ("East", "South-West").
   - The needle animates smoothly to the target angle using CSS transform `rotate(${rotationAngle}deg)`.
   - When the needle aligns within ±5° of true North (0° / 360°):
     - The needle glows in mint green `#72D6B0`.
     - Calls `soundService.playSuccessChime()`.
     - Displays Malayalam directional label "വടക്ക് (North)" with an educational explanation of Earth's magnetic poles.

---

### Feature 9: Vocabulary Flashcards & Pronunciation Tooltips

**User Action**: A student taps a highlighted vocabulary card on the slide (e.g., "Atmosphere / അന്തരീക്ഷം").

1. **Initiating Component**: `frontend/src/components/InteractiveSlideView.tsx`.
2. **Rendering**:
   - Slides have an optional `vocabulary: VocabularyItem[]` array.
   - Each term renders as a playful badge with a speaker icon.
3. **Interaction**:
   - Clicking the card triggers the browser's built-in **Web Speech Synthesis API**:
     ```typescript
     const utterance = new SpeechSynthesisUtterance(term.term_ml);
     utterance.lang = 'ml-IN'; // Malayalam India voice
     window.speechSynthesis.speak(utterance);
     ```
4. **UI Update**:
   - An interactive popup card expands showing:
     - Term in Malayalam: **അന്തരീക്ഷം**
     - Term in English: **Atmosphere**
     - Meaning in simple Class 4 Malayalam: ഭൂമിയെ ചുറ്റിപ്പറ്റിയുള്ള വായുവിന്റെ ആവരണം.
     - Audio replay button with wave animation.

---

### Feature 10: Quiz Activity with Real-Time Feedback

**User Action**: At the end of the lesson, the class answers a multiple-choice question. A student taps an option.

1. **Initiating Component**: `frontend/src/components/QuizActivity.tsx`.
2. **State Variables**:
   - `selectedOption`: index of the clicked choice.
   - `isAnswered`: boolean indicating whether feedback is currently displayed.
   - `score`: integer tallying total correct answers.
3. **Execution**:
   - When student taps Option B (`optionIndex === 1`):
     ```typescript
     const handleSelect = (index: number) => {
       setSelectedOption(index);
       setIsAnswered(true);
       if (index === currentQuestion.correct_answer) {
         soundService.playCorrect(); // Pleasant high-pitch chime
         setScore(prev => prev + 1);
       } else {
         soundService.playIncorrect(); // Friendly gentle boop sound
       }
     };
     ```
4. **UI Update**:
   - If Correct: The selected card turns bright Mint Green (`#72D6B0`), pulses slightly, and displays a checkmark icon.
   - If Incorrect: The selected card turns soft Coral (`#FF8066`), and the actual correct option is highlighted in mint so children learn the right answer immediately.
   - Explanation text appears below the options explaining *why* that answer is correct in simple Malayalam.

---

### Feature 11: Chapter Completion, Airplane Flight & Confetti

**User Action**: The student answers the final quiz question and finishes the lesson.

1. **Initiating Component**: `frontend/src/components/QuizActivity.tsx` -> `frontend/src/components/animations/ChapterTransition.tsx`.
2. **Execution**:
   - `QuizActivity` triggers `onComplete(finalScore)`.
   - `LessonView.tsx` unmounts the slide view and mounts `<ChapterTransition />`.
3. **Sound & Audio Effects**:
   - `soundService.playCelebrationFanfare()`: Procedurally generates an uplifting 5-chord victory melody using triangle and sine wave oscillators.
4. **Visual Effects (Confetti & Motion)**:
   - `canvas-confetti` executes 3 successive bursts of colorful particles (purple, mint, yellow, sky blue) across the screen:
     ```typescript
     confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
     ```
   - Framer Motion runs a **16-second slow cartoon airplane animation**:
     - A cute illustrated airplane enters from bottom-left, glides gracefully across a curved path, and exits top-right.
     - Displays a prominent congratulations banner: **"അഭിനന്ദനങ്ങൾ! നിങ്ങൾ ഈ അധ്യായം വിജയകരമായി പൂർത്തിയാക്കി!"** ("Congratulations! You have successfully completed this chapter!").

---

### Feature 12: Offline Synchronization & Auto-Seeding

**User Action**: A teacher opens VAAYANA for the first time on a laptop without internet or backend server running.

1. **Initiating Component**: `frontend/src/pages/ClassroomExperience.tsx` or `LandingPage.tsx`.
2. **Execution**:
   - Calls `storageService.getLessons()` in `frontend/src/services/storage.ts`.
3. **Database Query**:
   - Opens IndexedDB `vaayana_local_db`.
   - Executes `store.getAll()`.
4. **Auto-Seeding Logic**:
   - IndexedDB returns an empty array `[]`.
   - `storage.ts` detects `results.length === 0`.
   - It imports `sampleLessons` from `frontend/src/data/sampleLessons.ts`.
   - Runs a transaction adding all 6 Mathematics lessons and 3 EVS lessons into IndexedDB.
5. **UI Update**:
   - The UI immediately renders all 9 chapters complete with thumbnails, learning objectives, and badges.
   - No error banners, no spinners, no failed network alerts!

---

### Mentor's Checkpoint
You have now walked through the entire functional lifecycle of VAAYANA's features! You know which component starts each action, which functions execute, how state updates, and how the screen redraws.

In **Module 09: Codebase Review & Architectural Assessment**, we will analyze the codebase critically like a software architect to find technical debt, areas for improvement, and best practices!

