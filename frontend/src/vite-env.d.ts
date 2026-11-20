/// <reference types="vite/client" />

export interface UpdateInfo {
  version: string;
  releaseDate?: string;
  releaseNotes?: string;
}

export interface UpdateProgress {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
}

export interface UpdateState {
  status: 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error' | 'dev-mode';
  currentVersion: string;
  updateInfo: UpdateInfo | null;
  progress: UpdateProgress | null;
  error: string | null;
  dismissedVersion?: string | null;
  isUserInitiated?: boolean;
  isPackaged: boolean;
  platform: string;
}

export interface VaayanaDesktopAPI {
  isDesktop: boolean;
  platform: string;
  getAppVersion: () => Promise<string>;
  getAppInfo: () => Promise<{ name: string; version: string; platform: string; isPackaged: boolean }>;
  getBackendStatus: () => Promise<{ status: string; healthy: boolean; port: number; host: string; userDataDir: string; lastError?: any }>;
  getUpdateStatus: () => Promise<UpdateState>;
  checkForUpdates: () => Promise<any>;
  downloadUpdate: () => Promise<{ success: boolean; error?: string }>;
  quitAndInstall: () => Promise<{ success: boolean; error?: string }>;
  dismissUpdate: (version?: string) => Promise<{ success: boolean }>;
  onUpdateStatusChange: (callback: (state: UpdateState) => void) => () => void;
}

declare global {
  interface Window {
    vaayanaDesktop?: VaayanaDesktopAPI;
  }
}
