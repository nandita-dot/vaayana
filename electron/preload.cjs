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
  getBackendStatus: () => ipcRenderer.invoke('app:get-backend-status')
});
