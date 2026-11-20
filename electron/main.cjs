/**
 * VAAYANA (വായന) — Main Electron Process
 * 
 * Cross-platform desktop application for Windows & Ubuntu Linux.
 * Enforces secure defaults, single instance locking, and clean lifecycle management.
 * Integrates bundled FastAPI backend with health monitoring and graceful shutdown.
 */

const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const backendManager = require('./backend-manager.cjs');

// Determine development mode
const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

let mainWindow = null;

// ============================================================================
// 1. SINGLE INSTANCE LOCK
// ============================================================================
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('[VAAYANA Desktop] Another instance is already running. Quitting.');
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Set basic app metadata for taskbar / desktop integration
app.name = 'VAAYANA';
if (process.platform === 'win32') {
  app.setAppUserModelId('org.alpschool.vaayana');
}

/**
 * Check if a URL is currently reachable via HTTP
 */
function isUrlReachable(urlStr, timeoutMs = 2000) {
  return new Promise((resolve) => {
    try {
      const u = new URL(urlStr);
      const req = http.get({
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname || '/',
        timeout: timeoutMs
      }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

/**
 * Resolve application icon based on platform
 */
function getAppIconPath() {
  const iconExt = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  const iconPath = path.join(__dirname, 'icons', iconExt);
  if (fs.existsSync(iconPath)) {
    return iconPath;
  }
  return undefined;
}

/**
 * Create and configure the primary application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#09080F',
    title: 'VAAYANA (വായന) — Smart Classroom Learning Platform',
    icon: getAppIconPath(),
    autoHideMenuBar: true,
    show: false, // Prevents white flash before content renders
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      devTools: isDev
    }
  });

  // Reveal window smoothly once content is drawn
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Security: Prevent arbitrary new window creation, open external URLs in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Security: Guard in-window navigation
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    try {
      const parsedUrl = new URL(navigationUrl);
      if (isDev && (parsedUrl.origin === VITE_DEV_SERVER_URL || parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1')) {
        return; // Allow local dev server
      }
      if (!isDev && parsedUrl.protocol === 'file:') {
        return; // Allow local packaged assets
      }
    } catch {
      // Fall-through to prevent navigation
    }
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });

  initializeAndLoad(mainWindow);
}

/**
 * Show a graceful loading screen while waiting for the backend
 */
function showStartupLoading(win) {
  const loadingHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>VAAYANA — Initializing</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #09080F;
          color: #EDE5F7;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          user-select: none;
        }
        .container {
          text-align: center;
          max-width: 420px;
        }
        .spinner {
          width: 44px;
          height: 44px;
          border: 3.5px solid rgba(121, 80, 184, 0.2);
          border-top-color: #72D6B0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        h2 { font-size: 1.4rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #EDE5F7; }
        p { font-size: 0.9rem; color: #E8DDC8; opacity: 0.85; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="spinner"></div>
        <h2>VAAYANA (വായന)</h2>
        <p>Starting local pedagogical engine & classroom database...</p>
      </div>
    </body>
    </html>
  `;
  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(loadingHtml)}`);
}

/**
 * Show a styled diagnostic error screen if backend startup fails
 */
function showStartupError(win, errorMessage) {
  const userDataDir = backendManager.getPersistentDataDir();
  const errorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>VAAYANA — Backend Startup Error</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background: #09080F; 
          color: #EDE5F7; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          margin: 0; 
        }
        .card { 
          max-width: 560px; 
          padding: 2.5rem; 
          background: #161220; 
          border: 1px solid #7950B8; 
          border-radius: 1.5rem; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.7); 
          text-align: center; 
        }
        h2 { color: #F497B6; margin-top: 0; font-size: 1.4rem; }
        p { color: #E8DDC8; font-size: 0.95rem; line-height: 1.6; }
        .details { 
          background: #09080F; 
          color: #FFD166; 
          padding: 0.75rem 1rem; 
          border-radius: 8px; 
          border: 1px solid #282136; 
          font-family: monospace; 
          font-size: 0.85rem; 
          text-align: left;
          word-break: break-word;
          margin: 1rem 0; 
        }
        .btn {
          margin-top: 1rem;
          padding: 0.75rem 1.75rem;
          background: #563580;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn:hover { background: #683FA7; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Backend Startup Warning</h2>
        <p>The VAAYANA local backend server could not be reached.</p>
        <div class="details">Error: ${errorMessage}<br><br>Data directory: ${userDataDir}</div>
        <p>In development mode, ensure Python dependencies are installed in <code>backend/venv</code> or run the server with <code>npm run desktop:dev</code>.</p>
        <button class="btn" onclick="location.reload()">Retry Startup</button>
      </div>
    </body>
    </html>
  `;
  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
}

/**
 * Initialize backend, await health check, and load the frontend
 */
async function initializeAndLoad(win) {
  // Show temporary initializing state
  showStartupLoading(win);

  // Start backend process
  backendManager.start();

  try {
    console.log('[VAAYANA Desktop] Awaiting backend health endpoint...');
    await backendManager.waitForBackend(25000);
    console.log('[VAAYANA Desktop] Backend is healthy! Loading frontend...');
  } catch (err) {
    console.warn('[VAAYANA Desktop] Backend health check failed:', err.message);
    
    // In dev mode, if user is running static frontend or separate backend, allow fallback
    const distIndex = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    if (isDev && fs.existsSync(distIndex)) {
      console.log('[VAAYANA Desktop] Proceeding with static frontend fallback in development.');
    } else if (isDev && await isUrlReachable(VITE_DEV_SERVER_URL, 1000)) {
      console.log('[VAAYANA Desktop] Proceeding with Vite dev server in development.');
    } else {
      showStartupError(win, err.message);
      return;
    }
  }

  // Load the application
  await loadFrontend(win);
}

/**
 * Load the frontend (Vite dev server in dev, or dist/index.html in production)
 */
async function loadFrontend(win) {
  const distIndex = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');

  if (isDev) {
    console.log(`[VAAYANA Desktop] Checking Vite dev server at ${VITE_DEV_SERVER_URL}...`);
    const viteReady = await isUrlReachable(VITE_DEV_SERVER_URL, 1500);

    if (viteReady) {
      console.log(`[VAAYANA Desktop] Loading Vite dev server at ${VITE_DEV_SERVER_URL}`);
      win.loadURL(VITE_DEV_SERVER_URL);
      return;
    }

    console.log('[VAAYANA Desktop] Vite dev server not detected. Checking for frontend/dist build...');
  }

  // Production or dev fallback
  if (fs.existsSync(distIndex)) {
    console.log(`[VAAYANA Desktop] Loading packaged frontend build from ${distIndex}`);
    win.loadFile(distIndex);
  } else {
    showStartupError(win, `No frontend build found at ${distIndex}. Run 'npm run frontend:build' first.`);
  }
}

// ============================================================================
// 2. IPC HANDLERS
// ============================================================================
ipcMain.handle('app:get-version', () => app.getVersion());
ipcMain.handle('app:get-info', () => ({
  name: app.name,
  version: app.getVersion(),
  platform: process.platform,
  isPackaged: app.isPackaged
}));
ipcMain.handle('app:get-backend-status', async () => {
  const healthy = await backendManager.checkHealth();
  return {
    status: backendManager.status,
    healthy,
    port: backendManager.port,
    host: backendManager.host,
    userDataDir: backendManager.getPersistentDataDir(),
    lastError: backendManager.lastError
  };
});

// ============================================================================
// 3. APPLICATION LIFECYCLE
// ============================================================================
app.whenReady().then(async () => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  backendManager.stop();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  backendManager.stop();
});
