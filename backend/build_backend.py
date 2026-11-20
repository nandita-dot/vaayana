"""
VAAYANA Standalone Backend Packaging Tool
Builds the standalone Python executable using PyInstaller for Windows (.exe) and Linux.
"""
import os
import sys
import subprocess
import shutil

def get_python_exe():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    is_windows = sys.platform == "win32"
    venv_python = (
        os.path.join(backend_dir, "venv", "Scripts", "python.exe")
        if is_windows
        else os.path.join(backend_dir, "venv", "bin", "python")
    )
    if os.path.exists(venv_python):
        return venv_python
    return sys.executable

def build():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(backend_dir)
    spec_file = os.path.join(backend_dir, "vaayana-backend.spec")
    python_exe = get_python_exe()
    is_windows = sys.platform == "win32"
    exe_name = "vaayana-backend.exe" if is_windows else "vaayana-backend"

    print(f"[1/3] Using Python environment: {python_exe}")
    
    # Check PyInstaller availability
    try:
        res = subprocess.run([python_exe, "-m", "PyInstaller", "--version"], capture_output=True, text=True)
        if res.returncode == 0:
            print(f"      Found PyInstaller {res.stdout.strip()}")
        else:
            raise ImportError()
    except Exception:
        print("      PyInstaller not found in target Python environment.")
        print("      Attempting to install pyinstaller...")
        try:
            subprocess.check_call([python_exe, "-m", "pip", "install", "pyinstaller"])
        except Exception as e:
            print(f"[!] Could not auto-install PyInstaller: {e}")
            print("    Please install pyinstaller manually: pip install pyinstaller")
            return False

    print("[2/3] Freezing VAAYANA FastAPI backend into standalone executable...")
    cmd = [
        python_exe,
        "-m",
        "PyInstaller",
        "--clean",
        "--noconfirm",
        spec_file
    ]
    
    try:
        subprocess.check_call(cmd, cwd=backend_dir)
    except subprocess.CalledProcessError as e:
        print(f"[!] PyInstaller build failed with exit code {e.returncode}")
        return False

    dist_output = os.path.join(backend_dir, "dist", "vaayana-backend")
    target_exe = os.path.join(dist_output, exe_name)
    
    if os.path.exists(target_exe):
        print(f"[3/3] Build succeeded: {target_exe}")
        
        # Stage executable into electron/bin/vaayana-backend for electron-builder extraResources
        electron_backend_dir = os.path.join(project_root, "electron", "bin", "vaayana-backend")
        os.makedirs(os.path.dirname(electron_backend_dir), exist_ok=True)
        if os.path.exists(electron_backend_dir):
            shutil.rmtree(electron_backend_dir)
        shutil.copytree(dist_output, electron_backend_dir)
        if not is_windows:
            staged_bin = os.path.join(electron_backend_dir, exe_name)
            if os.path.exists(staged_bin):
                os.chmod(staged_bin, 0o755)
        print(f"      Staged for Electron packaging at: {electron_backend_dir}")
        return True
    else:
        print(f"[!] Warning: Expected binary not found at {target_exe}")
        return False

if __name__ == "__main__":
    success = build()
    sys.exit(0 if success else 1)
