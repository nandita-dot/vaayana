import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Try root .env first, then backend/.env
load_dotenv()
backend_env = Path(__file__).resolve().parent.parent / ".env"
if backend_env.exists():
    load_dotenv(backend_env)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
PORT = int(os.getenv("PORT", "8000"))
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

def resolve_tesseract_cmd() -> str:
    """
    Dynamically resolves the Tesseract executable path.
    Gracefully supports Windows, Linux, and custom environment overrides.
    """
    # 1. Custom environment variable override
    env_cmd = os.getenv("TESSERACT_CMD")
    if env_cmd and os.path.exists(env_cmd):
        return env_cmd

    # 2. Check bundled resources if packaged with PyInstaller
    if hasattr(sys, "_MEIPASS"):
        meipass = Path(getattr(sys, "_MEIPASS"))
        bundled_win = meipass / "tesseract" / "tesseract.exe"
        bundled_linux = meipass / "tesseract" / "tesseract"
        if bundled_win.exists():
            return str(bundled_win)
        if bundled_linux.exists():
            return str(bundled_linux)

    # 3. Standard OS installation paths
    if sys.platform == "win32":
        candidates = [
            Path(os.environ.get("PROGRAMFILES", "C:\\Program Files")) / "Tesseract-OCR" / "tesseract.exe",
            Path(os.environ.get("PROGRAMFILES(X86)", "C:\\Program Files (x86)")) / "Tesseract-OCR" / "tesseract.exe",
            Path(os.environ.get("LOCALAPPDATA", "")) / "Programs" / "Tesseract-OCR" / "tesseract.exe"
        ]
        for c in candidates:
            if c.exists():
                return str(c)
    else:
        for c in ["/usr/bin/tesseract", "/usr/local/bin/tesseract"]:
            if os.path.exists(c):
                return c

    # 4. Fallback to default command name on PATH
    return env_cmd or "tesseract"

TESSERACT_CMD = resolve_tesseract_cmd()
