/**
 * VAAYANA Desktop — Cross-Platform Backend Process Manager
 * 
 * Manages the lifecycle of the local Python FastAPI backend:
 * - Detects standalone bundled executable (Windows & Linux) or falls back to development runner.
 * - Routes all persistent data (SQLite, uploads, cache) to OS user-data directory.
 * - Monitors startup health and shuts down cleanly to prevent orphaned processes.
 */

const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn, execSync } = require('child_process');

class BackendManager {
  constructor() {
    this.process = null;
    this.port = process.env.PORT || 8000;
    this.host = '127.0.0.1';
    this.status = 'stopped'; // 'stopped' | 'starting' | 'running' | 'error' | 'unavailable'
    this.lastError = null;
  }

  /**
   * Resolves the OS persistent data directory:
   * - Windows: %APPDATA%/VAAYANA
   * - Ubuntu/Linux: ~/.local/share/VAAYANA ($XDG_DATA_HOME/VAAYANA)
   */
  getPersistentDataDir() {
    if (process.platform === 'win32') {
      const appData = process.env.APPDATA || (process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Roaming') : app.getPath('appData'));
      return path.join(appData, 'VAAYANA');
    } else {
      const xdgData = process.env.XDG_DATA_HOME || (process.env.HOME ? path.join(process.env.HOME, '.local', 'share') : path.join(app.getPath('home'), '.local', 'share'));
      return path.join(xdgData, 'VAAYANA');
    }
  }

  /**
   * Resolve launch target based on platform and packaging state
   */
  getLaunchConfig() {
    const isPackaged = app.isPackaged;
    // Store all persistent state in OS user-data directory (never in app installation or temp dir)
    const userDataDir = this.getPersistentDataDir();

    if (!fs.existsSync(userDataDir)) {
      try {
        fs.mkdirSync(userDataDir, { recursive: true });
      } catch (e) {
        console.error('[BackendManager] Failed to create user-data directory:', e);
      }
    }

    const env = {
      ...process.env,
      PORT: String(this.port),
      HOST: this.host,
      VAAYANA_DATA_DIR: userDataDir
    };

    const isWindows = process.platform === 'win32';
    const exeName = isWindows ? 'vaayana-backend.exe' : 'vaayana-backend';

    // 1. Packaged application: located in process.resourcesPath/bin/vaayana-backend/
    if (isPackaged) {
      const packagedExe = path.join(process.resourcesPath, 'bin', 'vaayana-backend', exeName);
      if (fs.existsSync(packagedExe)) {
        return { command: packagedExe, args: [], env, isExecutable: true, description: 'Packaged Standalone Executable' };
      }
    }

    // 2. Unpackaged / Staged standalone build: located in electron/bin/vaayana-backend/
    const stagedExe = path.join(__dirname, 'bin', 'vaayana-backend', exeName);
    if (fs.existsSync(stagedExe)) {
      return { command: stagedExe, args: [], env, isExecutable: true, description: 'Staged Standalone Executable' };
    }

    // 3. Development fallback: python virtualenv or system python running backend/run_server.py
    const projectRoot = path.resolve(__dirname, '..');
    const venvPythonWin = path.join(projectRoot, 'backend', 'venv', 'Scripts', 'python.exe');
    const venvPythonLinux = path.join(projectRoot, 'backend', 'venv', 'bin', 'python');
    
    let pythonCmd = isWindows ? 'python' : 'python3';
    if (isWindows && fs.existsSync(venvPythonWin)) {
      pythonCmd = venvPythonWin;
    } else if (!isWindows && fs.existsSync(venvPythonLinux)) {
      pythonCmd = venvPythonLinux;
    }

    const serverScript = path.join(projectRoot, 'backend', 'run_server.py');
    const hasScript = fs.existsSync(serverScript);

    return { 
      command: pythonCmd, 
      args: hasScript ? [serverScript] : [], 
      env, 
      isExecutable: false,
      description: hasScript ? 'Development Python Server' : 'None'
    };
  }

  /**
   * Start the backend process
   */
  start() {
    if (this.process) {
      console.log(`[BackendManager] Backend already running (PID: ${this.process.pid})`);
      return;
    }

    const config = this.getLaunchConfig();
    if (!config.command || (!config.isExecutable && config.args.length === 0)) {
      const msg = 'No valid backend executable or server script found.';
      console.warn(`[BackendManager] ${msg}`);
      this.status = 'unavailable';
      this.lastError = msg;
      return;
    }

    console.log(`[BackendManager] Starting backend [${config.description}]: ${config.command} ${config.args.join(' ')}`);
    console.log(`[BackendManager] Persistent user-data directory: ${config.env.VAAYANA_DATA_DIR}`);
    this.status = 'starting';
    this.lastError = null;

    try {
      this.process = spawn(config.command, config.args, {
        env: config.env,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false
      });

      this.process.stdout.on('data', (data) => {
        const text = data.toString().trim();
        if (text) console.log(`[Backend]: ${text}`);
      });

      this.process.stderr.on('data', (data) => {
        const text = data.toString().trim();
        if (text) console.error(`[Backend Err]: ${text}`);
      });

      this.process.on('exit', (code, signal) => {
        console.log(`[BackendManager] Process exited (Code: ${code}, Signal: ${signal})`);
        this.process = null;
        if (this.status !== 'stopped') {
          this.status = 'error';
          this.lastError = `Backend process exited unexpectedly with code ${code}`;
        }
      });

      this.process.on('error', (err) => {
        console.error(`[BackendManager] Failed to spawn backend process:`, err);
        this.process = null;
        this.status = 'error';
        this.lastError = err.message;
      });
    } catch (err) {
      console.error(`[BackendManager] Spawn exception:`, err);
      this.status = 'error';
      this.lastError = err.message;
    }
  }

  /**
   * Poll backend /api/health until ready or timeout
   */
  waitForBackend(timeoutMs = 25000) {
    const startTime = Date.now();
    const healthUrl = `http://${this.host}:${this.port}/api/health`;

    return new Promise((resolve, reject) => {
      const check = () => {
        // If the process already died, stop waiting
        if (!this.process && this.status === 'error') {
          return reject(new Error(this.lastError || 'Backend process terminated prematurely during startup.'));
        }

        const req = http.get(healthUrl, (res) => {
          if (res.statusCode === 200) {
            this.status = 'running';
            resolve(true);
          } else {
            retry();
          }
        });

        req.on('error', () => retry());
        req.setTimeout(1200, () => {
          req.destroy();
          retry();
        });
      };

      const retry = () => {
        if (Date.now() - startTime > timeoutMs) {
          this.status = 'error';
          this.lastError = `Timed out after ${Math.round(timeoutMs / 1000)}s waiting for backend at ${healthUrl}`;
          reject(new Error(this.lastError));
        } else {
          setTimeout(check, 350);
        }
      };

      check();
    });
  }

  /**
   * Health check probe for IPC query
   */
  checkHealth(timeoutMs = 1500) {
    return new Promise((resolve) => {
      const req = http.get(`http://${this.host}:${this.port}/api/health`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Cleanly terminate backend process and any children to prevent orphaned processes
   */
  stop() {
    if (!this.process || !this.process.pid) {
      this.status = 'stopped';
      return;
    }

    const pid = this.process.pid;
    console.log(`[BackendManager] Terminating backend process tree (PID: ${pid})...`);

    try {
      if (process.platform === 'win32') {
        // Force kill process tree on Windows
        execSync(`taskkill /pid ${pid} /T /F`);
      } else {
        // Graceful SIGTERM on Linux, followed by SIGKILL if necessary
        this.process.kill('SIGTERM');
      }
    } catch (e) {
      // Process may already have closed
    }

    this.process = null;
    this.status = 'stopped';
  }
}

module.exports = new BackendManager();
