# VAAYANA (വായന) — Project Documentation

> This document describes the intended product, current architectural direction, and development constraints. It is not a substitute for inspecting the implementation. 

## 1. Project overview

VAAYANA (വായന) is an offline-first, teacher-led interactive learning application intended for use on classroom smartboards in a Malayalam-medium primary-school setting in Kerala.

The goal is to make lessons more visual and participatory. Instead of relying only on static textbook pages, teachers can use interactive simulations, visual demonstrations, classroom challenges, and quizzes.

The initial beta is designed to run locally on a school computer. It is not intended to require a cloud deployment, student accounts, or continuous internet connectivity for ordinary classroom use.

## 2. Target users and environment

- Primary user: classroom teacher.
- Learners: primary-school children interacting with the shared classroom display under teacher guidance.
- Initial educational context: Grade 4, Malayalam-medium, Kerala.
- Primary device: desktop/laptop connected to a smartboard or large classroom display.
- Input: touchscreen and mouse; keyboard support where useful.
- Initial deployment model: local application, tested in one school before considering broader rollout.


## 3. Curriculum scope

The current development focus is Grade 4 Mathematics and EVS.

### Chapter sequence

| Chapter | Title | Main learning areas | Status note |
|---|---|---|---|
| 1 | Lines and Shapes | Circles, triangles, rectangles, geoboard, 3D shapes, tangram | Existing curriculum work; verify current implementation |
| 2 | Find the Relation | Number patterns, four-digit numbers, abacus, number names, number combinations | Existing curriculum work; verify current implementation |
| 3 | How Many Numbers? | Number wheel, Roman numerals, clocks | Existing curriculum work; verify current implementation |
| 4 | Increasing Numbers | Number pairs, complements to 1000, different addition strategies | Existing curriculum work; verify current implementation |
| 5 | It's Time! | Hours, minutes, seconds, elapsed time, calendar mathematics | Planned / in development |
| 6 | Decreasing Numbers | Abacus subtraction, written subtraction, regrouping, Indian currency | Planned / in development |


## 4. Learning and interaction principles

1. **Teacher-led:** the teacher controls lesson selection and progression.
2. **Hands-on:** children should be able to manipulate visual objects on the board.
3. **Concept-first:** animations should explain a mathematical idea, not merely decorate a slide.
4. **Immediate feedback:** answers should receive clear, encouraging feedback.
5. **Accessible:** use readable text, clear contrast, large controls, and reduced-motion support.
6. **Local-first:** approved lessons and classroom activities should work without internet.
7. **Malayalam-first:** use natural, age-appropriate Malayalam for relevant instructions and explanations. Keep English learning content in English where appropriate.

## 5. Technology architecture

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide icon set
- Noto Sans Malayalam fonts bundled locally

Responsibilities:

- Render teacher and classroom interfaces.
- Present lesson content and activities.
- Handle touch and mouse interactions.
- Run client-side simulations and animations.
- Cache appropriate content in browser storage.
- Provide a consistent smartboard-oriented user experience.

### Backend

- Python
- FastAPI
- PyMuPDF for PDF text extraction
- Tesseract OCR where installed and required
- Google Gemini integration for optional AI-assisted lesson preparation(need to be implemented)

Responsibilities:

- Expose local application APIs.
- Support teacher lesson-preparation workflows.
- Process uploaded lesson documents where supported.
- Persist application data locally.
- Invoke the AI service only for explicitly requested AI-assisted preparation.

### Local persistence

- SQLite: local structured application and lesson data.
- IndexedDB: browser-side persistence/cache for appropriate client data.


## 6. High-level architecture

```text
Teacher
  |
  v
React + TypeScript frontend
  |                         |
  | local interactions     | HTTP API requests
  v                         v
Browser storage          FastAPI backend
(IndexedDB)                  |
                             +--> SQLite
                             |
                             +--> PDF text extraction (PyMuPDF)
                             |
                             +--> OCR (Tesseract, when available)
                             |
                             +--> Gemini API (optional, online only)

Classroom activities run in the frontend and should not require
a network request for each interaction.
```

This is the intended architectural model. 

## 7. Teacher workflow

The intended lesson-preparation workflow is:

1. Teacher opens the teacher workspace.
2. Teacher selects an existing chapter or prepares lesson material.
3. If a PDF is supplied, the backend extracts available text; OCR may be needed for scanned pages.
4. The teacher reviews and edits the extracted or manually entered content.
5. The teacher prepares lesson slides, activities, visualizations, and quiz questions.
6. The teacher approves and saves the lesson.
7. The approved lesson becomes available in the classroom interface.
8. The teacher launches the lesson on the smartboard.

AI assistance is optional. A teacher must be able to prepare and use a lesson manually when internet access or AI service availability is absent.

## 8. Classroom activity architecture

An activity should pass through the full integration path:

1. Activity component is implemented.
2. Activity is represented in the lesson data/schema.
3. Activity identifier or type is registered.
4. The lesson renderer recognizes and renders it.
5. The chapter exposes it in the classroom workflow.
6. User interactions work in the running browser.
7. Activity state and completion behaviour are verified.

A component that is not connected to the lesson renderer is not a classroom feature.

### Existing Mathematics activity concepts

The earlier Mathematics work included activity concepts such as:

- Shape explorer and geoboard.
- 3D shape viewer and tangram puzzle.
- Number patterns and number-pair matching.
- Abacus and car-race score activities.
- Number-name explorer.
- Number wheel and Roman numeral explorer.
- Interactive clock.
- Addition and number-pair challenges.

Verify each one in the current repository and running app before describing it as available.

### Planned Chapter 5 activities

**The Girls' Race**
- Three animated participants.
- A displayed start time and distinct finish times.
- Digital and analogue clock reading.
- Elapsed-time questions.
- Synchronized hour, minute, and second hands.

**Little Drops, Mighty Ocean**
- A tap leaking one millilitre each second.
- A visual container and live amount counter.
- Adjustable simulation speed, pause, resume, and reset.
- Guided conversion from minutes to seconds.
- Core example: 10 minutes = 600 seconds, therefore 600 mL at 1 mL per second.

**Calendar Mathematics**
- Interactive monthly calendar.
- Month navigation and date selection.
- Weekday, date-offset, month-length, and day-count challenges.
- Age-appropriate leap-year explanation.

### Planned Chapter 6 activities

**Abacus subtraction**
- Thousands, hundreds, tens, and ones columns.
- Bead manipulation.
- Step-by-step regrouping.
- Reset and practice modes.

**Written subtraction**
- Place-value-aligned vertical subtraction.
- Column-by-column interaction.
- Animated regrouping.
- Comparison with the abacus representation.

**Indian notes and coins**
- Educational denomination illustrations.
- Select, move, add, and remove money objects.
- Live total calculation.
- Making amounts, comparing collections, shopping, and calculating change.

Currency illustrations are educational representations, not misleading replicas of banknotes.

## 9. Sound design

A reusable audio service is intended to provide optional local sound effects:

- Airplane whoosh during chapter transitions.
- Soft UI interaction sound.
- Positive chime for correct answers.
- Gentle feedback for incorrect answers.
- Short celebration audio for completed activities.
- Subtle object sounds for abacus beads and currency interactions.
- Optional clock tick where it supports learning.

Requirements:

- Audio assets must be local or generated by lightweight browser audio synthesis.
- No external audio URLs should be required for offline use.
- Provide a global mute control and volume setting.
- Avoid loud autoplay.
- Stop activity audio when the activity ends or the user navigates away.
- Respect browser autoplay restrictions and reduced-motion/accessibility preferences.


## 10. Visual design system

The current visual direction uses:

| Purpose | Colour |
|---|---|
| Primary dark background | `#111713` |
| Soft foreground | `#F1F4EE` |
| Activity accents | Blue, yellow, orange, red |

Design principles:

- Large, legible typography.
- High-contrast controls.
- Large touch targets.
- Playful but uncluttered cartoon illustrations.
- Smooth, purposeful animations.
- Consistent iconography.
- Responsive layouts for desktop and smartboard displays.
- Locally bundled fonts and visual assets wherever possible.

## 11. Offline-first design

The local beta is intended to support classroom use without a continuous internet connection.

Expected design boundaries:

- Frontend activity logic runs locally.
- Approved lesson data is stored locally.
- SQLite stores backend-owned structured data.
- IndexedDB stores appropriate browser-side data/cache.
- Fonts and essential visual assets are bundled with the application.
- Optional AI generation is the main internet-dependent workflow.

Offline readiness must be tested by disconnecting the network after the application and its required local data have been prepared. Do not assume offline support merely because the frontend can load once.

## 12. Privacy and security

- No student accounts are required by the initial product scope.
- Do not introduce student identity or performance tracking without an explicit product decision.
- Keep API keys exclusively in local environment configuration.
- Never expose Gemini credentials in frontend code.
- Never commit `.env` files or credentials.
- Do not publish real classroom data, student information, or private uploads.
- Do not commit local SQLite databases.
- Check the redistribution rights of textbooks, PDFs, fonts, illustrations, and audio assets before publishing them.

## 13. Local development

See `README.md` for clone, dependency installation, and startup instructions.

Typical development services:

- Frontend: Vite development server, commonly `http://localhost:5173`.
- Backend: FastAPI development server, commonly `http://localhost:8000`.

Use the actual ports and ASGI entry point configured in the current repository.

## 14. Testing and definition of done

A feature is complete only when:

- Its component is implemented.
- It is registered in the correct lesson/activity data.
- It is reachable through the normal classroom interface.
- Its interactions work with mouse and touch where applicable.
- Its calculations and answer validation are correct.
- It works with the intended local/offline setup.
- It has no blocking browser-console errors.
- Relevant frontend and backend checks pass.

For visual activities, verify the actual running page. A successful TypeScript check or production build does not prove that the activity is visible or usable.

## 15. GitHub repository hygiene

Before publishing:

- Review `.gitignore`.
- Confirm `.env` and all credentials are excluded.
- Confirm local SQLite files are excluded.
- Confirm uploaded textbooks and private teaching materials are excluded unless redistribution is permitted.
- Keep dependency lockfiles under version control.
- Include an `.env.example` only if its variable names match the actual application configuration; use placeholders, never real secrets.
- Add a license only after choosing the intended reuse terms.
- Use meaningful commits that describe one logical change.

## 16. Known implementation caveats

The following must be checked against the current branch before being presented as completed:

- Whether EVS and English have been fully removed.
- Whether the six Mathematics chapters are all registered and accessible.
- Whether the abacus, clock, and chapter-transition animations are visible in the live classroom route.
- Whether Chapters 5 and 6 are implemented or still planned.
- Whether sound effects and global audio settings are integrated.
- Whether the current local launcher starts both services correctly.
- Whether a clean clone can initialize its local database and run without access to the developer's machine.

Keep this section current as the project evolves.
