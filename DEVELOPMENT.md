# VAAYANA (വായന) — Developer & Build Guide

This document describes the local development setup, backend compilation, packaging, testing, and GitHub release procedures for VAAYANA.

---

## 1. Prerequisites

Ensure your development workstation has the following tools installed:

| Tool | Recommended Version | Purpose |
|---|---|---|
| **Node.js** | `>= 20.x LTS` | Frontend build and Electron host |
| **npm** | `>= 10.x` | Node package manager |
| **Python** | `3.10` or `3.11` | Backend development and PyInstaller compilation |
| **Git** | Latest | Version control |
| **Tesseract OCR** *(Optional)* | `>= 5.0` with `mal` & `eng` packs | Optical character recognition for scanned Malayalam PDFs |
| **FUSE / libfuse2** *(Linux)* | Standard | Required for executing and testing AppImages on Ubuntu 22.04+ |

---

## 2. Repository Setup

Clone the repository and inspect branches:

```bash
git clone https://github.com/nandita-dot/vaayana.git
cd vaayana
```

### Install Root & Electron Dependencies
```bash
npm install
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Set Up Python Virtual Environment
From the repository root:

**On Linux / macOS:**
```bash
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
pip install pyinstaller
```

**On Windows (PowerShell):**
```powershell
python -m venv backend\venv
.\backend\venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
pip install pyinstaller
```

---

## 3. Running Locally in Development Mode

You can run the web client and backend independently or launch the full Electron desktop shell.

### Option A: Web Development Mode (Browser)

1. **Start the FastAPI Backend:**
   ```bash
   # From repository root with virtual environment activated:
   python backend/run_server.py
   # Or using uvicorn directly:
   uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```
   API is accessible at `http://127.0.0.1:8000`. OpenAPI docs: `http://127.0.0.1:8000/docs`.

2. **Start the Vite Frontend Server:**
   ```bash
   npm run frontend:dev
   ```
   Open `http://localhost:5173` in Google Chrome or Edge.

### Option B: Electron Desktop Shell (Development)

Run the desktop app directly against the local source tree:
```bash
npm run desktop:dev
```
Electron launches, connects to the local development backend (or boots it automatically via `backend-manager.cjs`), and presents the native desktop window.

---

## 4. Building the Backend with PyInstaller

To bundle the Python backend into a standalone, single-folder executable that requires no Python runtime on target machines:

```bash
# From repository root:
python backend/build_backend.py
```

- **Linux Output**: Staged into `electron/bin/vaayana-backend/vaayana-backend`
- **Windows Output**: Staged into `electron/bin/vaayana-backend/vaayana-backend.exe`
- All dependencies (PyMuPDF, FastAPI, Starlette, SQLite, Uvicorn) and Tesseract runners are compiled into this folder.

---

## 5. Desktop Packaging (Linux AppImage)

To build the distributable Ubuntu/Linux x64 AppImage:

```bash
# One-command build (compiles frontend, builds backend, packages AppImage):
npm run desktop:package:linux
```

Or manually in individual steps:
```bash
# 1. Build frontend distribution
npm run frontend:build

# 2. Build standalone Linux backend
python backend/build_backend.py

# 3. Clean prior packaging output
rm -rf dist-electron

# 4. Package AppImage with Electron Builder
npx electron-builder --linux AppImage --x64 --publish never
```

The resulting distributable package is generated at:
```text
dist-electron/VAAYANA-2.1.1-linux-x64.AppImage
```

---

## 6. Testing the AppImage on Linux

1. Mark the AppImage executable:
   ```bash
   chmod +x dist-electron/VAAYANA-*-linux-x64.AppImage
   ```
2. Execute the AppImage:
   ```bash
   ./dist-electron/VAAYANA-*-linux-x64.AppImage
   ```
3. Inspect logs and persistent user data:
   ```bash
   ls -la ~/.local/share/VAAYANA/
   # Verify SQLite database initialization:
   sqlite3 ~/.local/share/VAAYANA/vaayana.db ".tables"
   ```

---

## 7. Release Publishing & Auto-Updater Workflow

Releases are published automatically via GitHub Actions upon pushing a version tag.

### Release Workflow Stages (`.github/workflows/release.yml`)

1. Triggered on tag push (`v*`) or manual `workflow_dispatch`.
2. Sets up Python 3.10 and Node.js 20.
3. Installs Ubuntu build dependencies (`libfuse2`, `tesseract-ocr`, `tesseract-ocr-mal`).
4. Compiles standalone Linux backend via PyInstaller.
5. Builds the React frontend with relative asset paths.
6. Packages Linux AppImage and update manifests (`latest-linux.yml`, `*.blockmap`) using `electron-builder --publish always`.
7. Deterministically attaches and updates assets on the target GitHub Release using GitHub CLI (`gh release upload --clobber`).
8. Verifies remote GitHub Release assets via `gh release view` to guarantee download availability.

### How to Publish a New Version

1. Bump version in `package.json` and `frontend/package.json`:
   ```json
   "version": "2.1.2"
   ```
2. Commit and push the version change:
   ```bash
   git add package.json frontend/package.json package-lock.json
   git commit -m "chore: bump version to 2.1.2"
   git push origin main
   ```
3. Create and push the Git tag:
   ```bash
   git tag v2.1.2
   git push origin v2.1.2
   ```
4. GitHub Actions will build and publish the release with the AppImage and `latest-linux.yml`.
5. Installed instances of VAAYANA (e.g. running `v2.1.0` or `v2.1.1`) will detect the update within 15 seconds of launch and offer one-click download and restart.
