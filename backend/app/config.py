import os
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
TESSERACT_CMD = os.getenv("TESSERACT_CMD", "tesseract")
