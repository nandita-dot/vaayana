@echo off
title VAAYANA (വായന) - Smart Classroom Teaching Platform
echo ===================================================
echo   VAAYANA (വായന) - Kerala Class 4 Smart Classroom
echo   Mathematics * Environmental Studies * English
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Initializing SQLite database and environment...
if not exist "backend\data" mkdir "backend\data"

echo [2/3] Starting VAAYANA FastAPI Backend on port 8000 (0.0.0.0)...
start "Vaayana Backend (Port 8000)" cmd /k "cd backend && (if exist venv\Scripts\python.exe (venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000) else (python -m uvicorn main:app --host 0.0.0.0 --port 8000))"

echo [3/3] Starting VAAYANA Frontend on port 5173 (0.0.0.0)...
start "Vaayana Frontend (Port 5173)" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0"

echo.
echo Waiting for servers to initialize...
timeout /t 4 /nobreak > nul

echo Launching browser to http://localhost:5173 ...
start http://localhost:5173

echo.
echo ===================================================
echo VAAYANA is now running!
echo Classroom Smartboard URL: http://localhost:5173
echo Backend API Docs:         http://localhost:8000/docs
echo ===================================================
echo Keep the background server terminal windows open.
echo.
pause
