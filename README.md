# VAAYANA (വായന)

**An offline-first, interactive smartboard learning application for primary classrooms.**

VAAYANA is designed to turn classroom lessons into visual, hands-on learning experiences. Teachers can prepare lessons and use interactive activities, visualizations, and quizzes on a classroom display or smartboard.

> **Project status:** Local beta / active development. Check the current branch and browser-tested features before relying on any feature described as planned or in progress.

## Highlights

- Interactive, smartboard-oriented learning experiences.
- Teacher-led lesson preparation and classroom presentation.
- Local-first storage for approved lesson content.
- Interactive visualizations and activities designed for touch and mouse input.
- Malayalam-friendly interface and locally bundled Malayalam fonts.
- Optional AI-assisted lesson preparation, subject to internet access and a configured Gemini API key.
- Local backend and frontend development; no hosted service is required for the local beta.

## Current curriculum scope

The current development focus is **Grade 4 Mathematics**. The planned/maintained chapter sequence is:

1. Lines and Shapes
2. Find the Relation
3. How Many Numbers?
4. Increasing Numbers
5. It's Time! — planned / in development
6. Decreasing Numbers — planned / in development

Only describe a chapter or activity as complete after verifying that it is available and working through the classroom interface in the current repository version.

## Technology stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling and interaction | Tailwind CSS, Framer Motion, Lucide icons |
| Backend | Python, FastAPI |
| Document processing | PyMuPDF; Tesseract OCR where installed and needed |
| Local persistence | SQLite and browser IndexedDB |
| AI-assisted preparation | Google Gemini API (optional; requires internet and a key) |
| Local fonts | Noto Sans Malayalam |

The exact dependency versions are defined by the repository's frontend and backend dependency manifests. Use those files rather than installing arbitrary latest versions.

## Requirements

Install the following before setting up the project:

- Git
- Node.js and npm (use a version supported by `frontend/package.json` and the lockfile; Node.js 20 LTS is a sensible starting point if no version is pinned)
- Python (use the version supported by the backend dependency files; Python 3.10 or newer is a sensible starting point)
- A modern browser such as Chrome or Edge

Optional:

- Tesseract OCR, if you need OCR for scanned/image-only textbook pages. Text extraction from digitally generated PDFs may work without it.
- A Google Gemini API key, only if you intend to use the optional AI-assisted lesson-preparation workflow. Never commit the key to GitHub.

## Download and run locally

### 1. Clone the repository

Replace `<your-github-username>` with the GitHub account that owns the repository.

```bash
git clone https://github.com/<your-github-username>/vaayana.git
cd vaayana
```

If you use a different repository name, use its actual GitHub URL.

### 2. Set up the backend

Open a terminal:

```bash
cd backend
```

Create and activate a virtual environment.

**Windows PowerShell:**

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the dependencies using the backend manifest that exists in this repository. For example, if the file is `requirements.txt`:

```bash
pip install -r requirements.txt
```

Start the FastAPI server using the actual ASGI entry point in the project. If the backend entry point is `main.py` and exposes `app`, the command is:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

If the entry point is in a package (for example, `app/main.py`), adjust the import path accordingly. Keep this terminal running.

### 3. Set up the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

If the repository includes `package-lock.json`, `npm ci` can be used instead of `npm install` for a reproducible install:

```bash
npm ci
npm run dev
```

Vite commonly serves the development frontend at:

```text
http://localhost:5173
```

The backend commonly serves its API at:

```text
http://localhost:8000
```

Use the actual URLs printed by the development servers and ensure the frontend API configuration points to the backend URL.

### 4. Optional environment configuration

Some features, especially AI-assisted lesson preparation, may require environment variables.

- Check the backend configuration file and any `.env.example` included in the repository.
- Create a local `.env` file only if the application expects one.
- Add your own Gemini API key locally if required.
- Never paste API keys into source code, README files, screenshots, commits, or public issue reports.
- `.env` files are excluded by `.gitignore`.

The classroom's local lesson and activity functionality should not require a Gemini API call unless a specific AI preparation feature is being used.

### 5. Open VAAYANA

Open the frontend URL printed by Vite in your browser. Start the backend first if the frontend needs API access.

For the local beta, run both services on the same computer. If using a smartboard, connect the classroom display to that computer and use the browser in full-screen mode.

## Project structure

The following is a conceptual overview. The exact filenames and subfolders may differ in the current repository.

```text
vaayana/
├── frontend/
│   ├── public/
│   │   └── fonts/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── activities/
│       └── ...
├── backend/
│   ├── ...
│   └── ...
├── .gitignore
├── README.md
└── PROJECT_DOCUMENTATION.md
```

## Offline-first behaviour

VAAYANA is designed so that classroom use does not depend on continuous internet access:

- Approved lesson content is stored locally.
- The application uses local persistence for lesson data and browser-side caching.
- Interactive activity logic is intended to run on the device.
- AI-assisted content preparation is an optional workflow and requires internet access.

The precise offline behaviour depends on the current implementation and should be tested after a clean local installation.

## Data, privacy, and security

- Do not commit `.env` files, API keys, credentials, or private configuration.
- Do not commit local SQLite databases or real classroom uploads.
- Do not add identifiable student information to sample data, screenshots, or issue reports.
- Keep any source textbooks or copyrighted teaching materials out of the public repository unless you have permission to redistribute them.
- Review all files before making the repository public.

## Documentation

See [`PROJECT_DOCUMENTATION.md`](PROJECT_DOCUMENTATION.md) for the project overview, architecture, workflows, local data design, offline approach, and development notes.

## Development notes

Before submitting changes:

1. Install frontend and backend dependencies from the checked-in manifests.
2. Run the frontend type check and production build scripts defined in `frontend/package.json`.
3. Run the backend tests, if present.
4. Open the application in a browser and test the affected teacher and classroom flows.
5. Verify that interactive activities are reachable from the actual lesson interface—not merely present as unused component files.
6. Confirm that no secrets, local databases, private textbook files, or personal data are included in the commit.


## License & Usage Rights

**VAAYANA (വായന) is proprietary software developed specifically for ALP School Koottala, Kerala.**

Copyright © 2026 [Nandita Nair]. All rights reserved.

The software is provided to ALP School Koottala under a limited, non-exclusive, non-transferable licence for internal educational and classroom use.

### Permitted Use
- Classroom teaching and learning activities at ALP School Koottala.
- Installation and use on authorised school devices and smartboards.
- Local backups for operational continuity.
- Creation, editing and management of educational lesson content by authorised teachers.

### Restrictions
Without prior written permission from the copyright owner, you may not:

- Copy, redistribute, publish or resell this software.
- Reuse the source code, application design or original components in another project.
- Distribute the software to other schools, institutions or organisations.
- Modify and redistribute derivative versions of the software.
- Claim ownership of the original software or its components.

### Third-Party Components
VAAYANA uses third-party libraries, frameworks, fonts and other resources that remain subject to their respective licences. Their individual licensing terms continue to apply.

### Licensing Enquiries
For permission to reuse, distribute, adapt or deploy VAAYANA in another institution, contact:

**Developer:** [Nandita Nair]  
**Email:** [nanditanair1805@gmail.com]

See the [`LICENSE`](./LICENSE) file for the complete licensing terms.

---

## Project Status(in-progress)

VAAYANA is being developed as a school-specific, offline-first educational platform. Its features and educational content are designed around the teaching requirements of ALP School Koottala.

The project is intended for controlled school use rather than public redistribution.
