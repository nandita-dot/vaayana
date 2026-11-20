/**
 * VAAYANA Desktop — Automatic Update Manager
 * 
 * Powered by electron-updater with GitHub Releases provider.
 * Manages background checking, non-blocking notifications, user-consented downloads,
 * download progress tracking, and graceful restart/install.
 */

const { app, ipcMain } = require('electron');
const backendManager = require('./backend-manager.cjs');

class UpdaterManager {
  constructor() {
    this.mainWindow = null;
    this._autoUpdater = null;
    this.status = 'idle'; // 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error' | 'dev-mode'
    this.updateInfo = null; // { version, releaseDate, releaseNotes }
    this.progress = null;   // { percent, bytesPerSecond, transferred, total }
    this.error = null;
    this.dismissedVersion = null;
    this.isUserInitiated = false;
    this.checkTimer = null;
    this.checkIntervalMs = 4 * 60 * 60 * 1000; // Check periodically every 4 hours
    this.isDownloading = false;
    this.ipcRegistered = false;
    this.eventsRegistered = false;
  }

  /**
   * Lazily obtain the autoUpdater instance after app is ready
   */
  getAutoUpdater() {
    if (!this._autoUpdater) {
      try {
        const { autoUpdater } = require('electron-updater');
        this._autoUpdater = autoUpdater;

        // Strict user consent: never download or install automatically
        this._autoUpdater.autoDownload = false;
        this._autoUpdater.autoInstallOnAppQuit = false;

        // Custom logger to keep console output clean while logging errors
        this._autoUpdater.logger = {
          info: (msg) => console.log('[UpdaterManager]', msg),
          warn: (msg) => console.warn('[UpdaterManager]', msg),
          error: (msg) => console.error('[UpdaterManager]', msg)
        };
      } catch (err) {
        console.warn('[UpdaterManager] electron-updater could not be loaded:', err.message);
        return null;
      }
    }
    return this._autoUpdater;
  }

  /**
   * Initialize updater with the main window and register listeners
   */
  init(win) {
    this.mainWindow = win;

    // Register handlers and events idempotently (guards against multiple init calls)
    this.registerUpdaterEvents();
    this.registerIpcHandlers();

    // Clear existing timer if any
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }

    // Perform initial check 15 seconds after app startup without blocking UI
    setTimeout(() => {
      this.checkForUpdates(false).catch((err) => {
        console.warn('[UpdaterManager] Initial background check failed:', err.message);
      });
    }, 15000);

    // Periodic background checks every 4 hours
    this.checkTimer = setInterval(() => {
      this.checkForUpdates(false).catch((err) => {
        console.warn('[UpdaterManager] Periodic background check failed:', err.message);
      });
    }, this.checkIntervalMs);
  }

  /**
   * Return current state snapshot
   */
  getState() {
    return {
      status: this.status,
      currentVersion: app.getVersion(),
      updateInfo: this.updateInfo,
      progress: this.progress,
      error: this.error,
      dismissedVersion: this.dismissedVersion,
      isUserInitiated: this.isUserInitiated,
      isPackaged: app.isPackaged,
      platform: process.platform
    };
  }

  /**
   * Broadcast current updater state to the renderer
   */
  sendState() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('updater:status-changed', this.getState());
    }
  }

  /**
   * Register event handlers for electron-updater
   */
  registerUpdaterEvents() {
    if (this.eventsRegistered) return;
    const autoUpdater = this.getAutoUpdater();
    if (!autoUpdater) return;

    this.eventsRegistered = true;

    autoUpdater.on('checking-for-update', () => {
      this.status = 'checking';
      this.error = null;
      console.log('[UpdaterManager] Checking GitHub Releases for updates...');
      this.sendState();
    });

    autoUpdater.on('update-available', (info) => {
      this.status = 'available';
      this.updateInfo = {
        version: info.version,
        releaseDate: info.releaseDate || '',
        releaseNotes: typeof info.releaseNotes === 'string' ? info.releaseNotes : ''
      };
      this.error = null;
      console.log(`[UpdaterManager] Update available: v${info.version} (current: v${app.getVersion()})`);
      this.sendState();
    });

    autoUpdater.on('update-not-available', (info) => {
      this.status = 'not-available';
      this.updateInfo = null;
      this.error = null;
      console.log(`[UpdaterManager] Application is up to date (v${app.getVersion()}).`);
      this.sendState();
    });

    autoUpdater.on('download-progress', (progressObj) => {
      this.status = 'downloading';
      this.isDownloading = true;
      this.progress = {
        percent: Math.round(progressObj.percent || 0),
        bytesPerSecond: Math.round(progressObj.bytesPerSecond || 0),
        transferred: progressObj.transferred || 0,
        total: progressObj.total || 0
      };
      this.sendState();
    });

    autoUpdater.on('update-downloaded', (info) => {
      this.status = 'downloaded';
      this.isDownloading = false;
      this.updateInfo = {
        version: info.version,
        releaseDate: info.releaseDate || '',
        releaseNotes: typeof info.releaseNotes === 'string' ? info.releaseNotes : ''
      };
      console.log(`[UpdaterManager] Update v${info.version} downloaded and ready to install.`);
      this.sendState();
    });

    autoUpdater.on('error', (err) => {
      this.status = 'error';
      this.isDownloading = false;
      this.error = err ? (err.message || String(err)) : 'Unknown update error';
      console.warn('[UpdaterManager] Updater error:', this.error);
      this.sendState();
    });
  }

  /**
   * Register secure IPC handlers (idempotent)
   */
  registerIpcHandlers() {
    if (this.ipcRegistered) return;
    this.ipcRegistered = true;

    ipcMain.handle('updater:get-status', () => this.getState());

    ipcMain.handle('updater:check', async () => {
      return await this.checkForUpdates(true);
    });

    ipcMain.handle('updater:download', async () => {
      return await this.startDownload();
    });

    ipcMain.handle('updater:install', async () => {
      return await this.quitAndInstall();
    });

    ipcMain.handle('updater:dismiss', (_event, version) => {
      this.dismissedVersion = version || (this.updateInfo && this.updateInfo.version) || null;
      this.sendState();
      return { success: true };
    });
  }

  /**
   * Check for updates
   */
  async checkForUpdates(isUserInitiated = false) {
    this.isUserInitiated = Boolean(isUserInitiated);

    if (!app.isPackaged) {
      console.log('[UpdaterManager] App is running in development mode. Skipping live update check.');
      this.status = 'dev-mode';
      this.sendState();
      return { status: 'dev-mode', currentVersion: app.getVersion() };
    }

    // In Linux, electron-updater requires running inside an AppImage (process.env.APPIMAGE set)
    if (process.platform === 'linux' && !process.env.APPIMAGE) {
      console.log('[UpdaterManager] AppImage environment variable (APPIMAGE) not detected. Skipping auto-update.');
      this.status = 'not-available';
      this.sendState();
      return { status: 'not-available', message: 'Not running as AppImage' };
    }

    if (this.isDownloading) {
      return { status: 'downloading', progress: this.progress };
    }

    const autoUpdater = this.getAutoUpdater();
    if (!autoUpdater) {
      this.status = 'error';
      this.error = 'Updater is unavailable in this environment';
      this.sendState();
      return { status: 'error', error: this.error };
    }

    try {
      this.status = 'checking';
      this.error = null;
      this.sendState();

      const result = await autoUpdater.checkForUpdates();
      return {
        status: this.status,
        updateInfo: result ? result.updateInfo : null
      };
    } catch (err) {
      this.status = 'error';
      this.error = err.message || String(err);
      console.warn('[UpdaterManager] checkForUpdates error:', this.error);
      this.sendState();
      return { status: 'error', error: this.error };
    }
  }

  /**
   * Start downloading update with user consent
   */
  async startDownload() {
    if (!app.isPackaged) {
      return { success: false, error: 'Cannot download update in development mode' };
    }

    if (process.platform === 'linux' && !process.env.APPIMAGE) {
      return { success: false, error: 'Cannot download update: not running from an AppImage' };
    }

    if (this.isDownloading) {
      return { success: true, message: 'Download already in progress' };
    }

    const autoUpdater = this.getAutoUpdater();
    if (!autoUpdater) {
      return { success: false, error: 'Updater is unavailable' };
    }

    try {
      this.status = 'downloading';
      this.isDownloading = true;
      this.progress = { percent: 0, bytesPerSecond: 0, transferred: 0, total: 0 };
      this.sendState();

      await autoUpdater.downloadUpdate();
      return { success: true };
    } catch (err) {
      this.status = 'error';
      this.isDownloading = false;
      this.error = err.message || String(err);
      this.sendState();
      return { success: false, error: this.error };
    }
  }

  /**
   * Terminate backend cleanly and restart to apply update
   */
  async quitAndInstall() {
    if (this.status !== 'downloaded') {
      return { success: false, error: 'No update downloaded yet' };
    }

    console.log('[UpdaterManager] Terminating backend process tree before restarting...');
    try {
      backendManager.stop();
    } catch (e) {
      console.warn('[UpdaterManager] Error stopping backend:', e);
    }

    // Allow 500ms for process termination and file handle release
    setTimeout(() => {
      try {
        console.log('[UpdaterManager] Executing autoUpdater.quitAndInstall()...');
        const autoUpdater = this.getAutoUpdater();
        if (autoUpdater) {
          autoUpdater.quitAndInstall(false, true);
        }
      } catch (err) {
        console.error('[UpdaterManager] Failed to quit and install:', err);
        this.status = 'error';
        this.error = err.message || String(err);
        this.sendState();
      }
    }, 500);

    return { success: true };
  }

  /**
   * Cleanup timer resources
   */
  destroy() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }
}

module.exports = new UpdaterManager();
