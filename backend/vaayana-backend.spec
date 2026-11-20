# -*- mode: python ; coding: utf-8 -*-
"""
VAAYANA Standalone Backend PyInstaller Specification
Packages FastAPI, PyMuPDF, Uvicorn, and dependencies for Windows (.exe) & Linux.
"""
import os
import sys

block_cipher = None
backend_dir = os.path.abspath(SPECPATH)

is_windows = sys.platform == 'win32'
exe_name = 'vaayana-backend.exe' if is_windows else 'vaayana-backend'

hidden_imports = [
    'uvicorn',
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespans',
    'uvicorn.lifespans.on',
    'uvicorn.lifespans.off',
    'fastapi',
    'fastapi.staticfiles',
    'fastapi.responses',
    'pydantic',
    'fitz',
    'pymupdf',
    'pytesseract',
    'PIL',
    'PIL.Image',
    'sqlite3',
    'google',
    'google.genai',
    'google.genai.types',
    'dotenv',
    'python_multipart'
]

datas = []
# Include sample data or default assets if they exist
data_folder = os.path.join(backend_dir, 'data')
if os.path.exists(data_folder):
    datas.append((data_folder, 'data'))

a = Analysis(
    ['run_server.py'],
    pathex=[backend_dir],
    binaries=[],
    datas=datas,
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['matplotlib', 'scipy', 'tkinter'],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name=exe_name,
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True, # Allows backend output capture via stdout/stderr in Electron
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='vaayana-backend',
)
