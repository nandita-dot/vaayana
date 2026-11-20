import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Download, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowUpCircle 
} from 'lucide-react';
import { UpdateState } from '../vite-env';

export const UpdateNotification: React.FC = () => {
  const [updateState, setUpdateState] = useState<UpdateState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismissTimer = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  };

  useEffect(() => {
    // Only active in packaged desktop environment
    if (!window.vaayanaDesktop?.onUpdateStatusChange) {
      return;
    }

    // Fetch initial status on mount
    window.vaayanaDesktop.getUpdateStatus().then((state) => {
      if (state) {
        setUpdateState(state);
        if (state.status === 'available' || state.status === 'downloading' || state.status === 'downloaded') {
          setIsVisible(true);
        }
      }
    }).catch(() => {});

    // Subscribe to live status changes from main process
    const unsubscribe = window.vaayanaDesktop.onUpdateStatusChange((state) => {
      clearDismissTimer();
      setUpdateState(state);

      if (state.status === 'available') {
        if (!isDismissed || state.updateInfo?.version !== updateState?.updateInfo?.version) {
          setIsVisible(true);
          setIsDismissed(false);
        }
      } else if (state.status === 'downloading' || state.status === 'downloaded') {
        setIsVisible(true);
        setIsDismissed(false);
      } else if (state.status === 'checking') {
        // Only show checking notification if initiated by user click
        if (state.isUserInitiated) {
          setIsVisible(true);
        }
      } else if (state.status === 'not-available') {
        // Only show "up to date" notification if initiated by user click
        if (state.isUserInitiated) {
          setIsVisible(true);
          dismissTimerRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 4000);
        } else {
          setIsVisible(false);
        }
      } else if (state.status === 'error') {
        // Only show error notification if user explicitly initiated check
        if (state.isUserInitiated) {
          setIsVisible(true);
        }
      }
    });

    return () => {
      clearDismissTimer();
      unsubscribe();
    };
  }, [isDismissed, updateState?.updateInfo?.version]);

  if (!window.vaayanaDesktop || !isVisible || !updateState) {
    return null;
  }

  const handleDownload = async () => {
    if (!window.vaayanaDesktop?.downloadUpdate) return;
    setActionLoading(true);
    try {
      await window.vaayanaDesktop.downloadUpdate();
    } finally {
      setActionLoading(false);
    }
  };

  const handleInstall = async () => {
    if (!window.vaayanaDesktop?.quitAndInstall) return;
    setActionLoading(true);
    try {
      await window.vaayanaDesktop.quitAndInstall();
    } finally {
      setActionLoading(false);
    }
  };

  const handleLater = async () => {
    clearDismissTimer();
    setIsVisible(false);
    setIsDismissed(true);
    if (window.vaayanaDesktop?.dismissUpdate && updateState.updateInfo?.version) {
      await window.vaayanaDesktop.dismissUpdate(updateState.updateInfo.version);
    }
  };

  const handleDismiss = () => {
    clearDismissTimer();
    setIsVisible(false);
  };

  const { status, updateInfo, progress, error, currentVersion } = updateState;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#161220] border border-[#7950B8]/50 rounded-2xl p-4 shadow-2xl shadow-purple-950/70 text-[#EDE5F7] backdrop-blur-md"
        role="region"
        aria-label="Software Update Notification"
      >
        {/* Top Header / Close */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2A2338]">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#563580]/50 text-[#72D6B0]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-black tracking-wider uppercase text-[#A59CB5]">
              VAAYANA Desktop
            </span>
          </div>
          <button
            onClick={handleLater}
            className="text-[#A59CB5] hover:text-white p-1 rounded-lg hover:bg-[#282136] transition-colors"
            title="Dismiss / പിന്നീട്"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* State: Checking (Shown on user-initiated manual checks) */}
        {status === 'checking' && (
          <div className="flex items-center gap-3 py-2">
            <RefreshCw className="w-5 h-5 text-[#72D6B0] animate-spin" />
            <div>
              <p className="text-sm font-bold text-white font-malayalam">അപ്‌ഡേറ്റുകൾ പരിശോധിക്കുന്നു...</p>
              <p className="text-xs text-[#A59CB5]">Checking for new releases...</p>
            </div>
          </div>
        )}

        {/* State: Up to date (Auto-dismisses) */}
        {status === 'not-available' && (
          <div className="flex items-center gap-3 py-2">
            <CheckCircle2 className="w-5 h-5 text-[#72D6B0]" />
            <div>
              <p className="text-sm font-bold text-white font-malayalam">ആപ്പ് ഏറ്റവും പുതിയ പതിപ്പാണ്</p>
              <p className="text-xs text-[#A59CB5]">VAAYANA is up to date (v{currentVersion})</p>
            </div>
          </div>
        )}

        {/* State: Update Available */}
        {status === 'available' && updateInfo && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#72D6B0]/15 text-[#72D6B0] mt-0.5">
                <ArrowUpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white font-malayalam">പുതിയ പതിപ്പ് ലഭ്യമാണ്!</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#72D6B0]/20 text-[#72D6B0] border border-[#72D6B0]/30 font-mono">
                    v{updateInfo.version}
                  </span>
                </div>
                <p className="text-xs text-[#E8DDC8]/80 mt-1">
                  A new version of VAAYANA is available with improvements for Class 4 lessons.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownload}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#563580] hover:bg-[#683FA7] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ഡൗൺലോഡ് ചെയ്യുക (Download)</span>
              </button>
              <button
                onClick={handleLater}
                className="py-2 px-3 bg-[#241E30] hover:bg-[#2F273E] text-[#EDE5F7] text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                പിന്നീട് (Later)
              </button>
            </div>
          </div>
        )}

        {/* State: Downloading with Progress */}
        {status === 'downloading' && (
          <div className="space-y-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2 font-malayalam">
                <RefreshCw className="w-3.5 h-3.5 text-[#72D6B0] animate-spin" />
                ഡൗൺലോഡ് ചെയ്യുന്നു...
              </span>
              <span className="font-mono text-[#72D6B0] font-bold">
                {progress?.percent ?? 0}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-[#241E30] h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#563580] to-[#72D6B0] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress?.percent ?? 0}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </div>

            <p className="text-[11px] text-[#A59CB5] text-center">
              Downloading VAAYANA update in background...
            </p>
          </div>
        )}

        {/* State: Downloaded / Ready to Install */}
        {status === 'downloaded' && updateInfo && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#72D6B0]/15 text-[#72D6B0] mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white font-malayalam">അപ്‌ഡേറ്റ് തയ്യാറാണ്!</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#72D6B0]/20 text-[#72D6B0] border border-[#72D6B0]/30 font-mono">
                    v{updateInfo.version}
                  </span>
                </div>
                <p className="text-xs text-[#E8DDC8]/80 mt-1 font-malayalam">
                  പുതിയ ഫീച്ചറുകൾ ലഭ്യമാകാൻ ആപ്പ് പുനരാരംഭിക്കുക.
                </p>
                <p className="text-[11px] text-[#A59CB5]">
                  Restart VAAYANA to complete installation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleInstall}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#72D6B0] hover:bg-[#86E4BF] text-[#09080F] text-xs font-black rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>പുനരാരംഭിക്കുക (Install & Restart)</span>
              </button>
              <button
                onClick={handleLater}
                className="py-2 px-3 bg-[#241E30] hover:bg-[#2F273E] text-[#EDE5F7] text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                പിന്നീട് (Later)
              </button>
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
          <div className="space-y-2 py-1">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white font-malayalam">അപ്‌ഡേറ്റ് പരിശോധിക്കാൻ കഴിഞ്ഞില്ല</h4>
                <p className="text-xs text-[#A59CB5] mt-0.5">
                  Unable to reach update server. Please check your internet connection.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={handleDismiss}
                className="py-1.5 px-3 bg-[#241E30] hover:bg-[#2F273E] text-[#EDE5F7] text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
