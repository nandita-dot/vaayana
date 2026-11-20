"""
VAAYANA Desktop Backend Entrypoint
Starts the FastAPI application on 127.0.0.1 for the Electron desktop client.
"""
import os
import sys

# Configure persistent user-data directory for standalone/frozen executable BEFORE importing app modules
if hasattr(sys, "_MEIPASS") or getattr(sys, "frozen", False):
    if not os.environ.get("VAAYANA_DATA_DIR"):
        if sys.platform == "win32":
            app_data = os.environ.get("APPDATA") or os.path.expanduser("~\\AppData\\Roaming")
            data_dir = os.path.join(app_data, "VAAYANA")
        else:
            app_data = os.environ.get("XDG_DATA_HOME") or os.path.expanduser("~/.local/share")
            data_dir = os.path.join(app_data, "VAAYANA")
        os.makedirs(data_dir, exist_ok=True)
        os.environ["VAAYANA_DATA_DIR"] = data_dir

# Ensure backend root directory is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import uvicorn
from main import app
from app.config import PORT

if __name__ == "__main__":
    # Support custom port via env, fallback to default 8000
    port = int(os.environ.get("PORT", PORT))
    host = os.environ.get("HOST", "127.0.0.1")

    print(f"Starting VAAYANA Backend on http://{host}:{port}...")
    if os.environ.get("VAAYANA_DATA_DIR"):
        print(f"Persistent user-data directory: {os.environ.get('VAAYANA_DATA_DIR')}")
    uvicorn.run(app, host=host, port=port, log_level="info")
