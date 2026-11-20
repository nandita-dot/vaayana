/**
 * VAAYANA Desktop — Preload Bridge Script
 * 
 * Safely exposes a minimal desktop API to the renderer process.
 * Enforces strict security: zero Node.js primitives leaked to window.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vaayanaDesktop', {
  isDesktop: true,
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
  getAppInfo: () => ipcRenderer.invoke('app:get-info'),
  getBackendStatus: () => ipcRenderer.invoke('app:get-backend-status'),

  // Automatic Updates API
  getUpdateStatus: () => ipcRenderer.invoke('updater:get-status'),
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  downloadUpdate: () => ipcRenderer.invoke('updater:download'),
  quitAndInstall: () => ipcRenderer.invoke('updater:install'),
  dismissUpdate: (version) => ipcRenderer.invoke('updater:dismiss', version),
  onUpdateStatusChange: (callback) => {
    if (typeof callback !== 'function') return () => {};
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('updater:status-changed', listener);
    return () => {
      ipcRenderer.removeListener('updater:status-changed', listener);
    };
  }
});
