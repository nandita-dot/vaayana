import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundService } from '../services/soundService';

interface SoundControlProps {
  className?: string;
  showSlider?: boolean;
}

export const SoundControl: React.FC<SoundControlProps> = ({ className = '', showSlider = true }) => {
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  const [volume, setVolume] = useState(soundService.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = soundService.subscribe((settings) => {
      setIsMuted(settings.isMuted);
      setVolume(settings.volume);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    const newMuted = soundService.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundService.play('click');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundService.setVolume(val);
    if (isMuted && val > 0) {
      soundService.toggleMute();
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-2 bg-[#17151B] backdrop-blur-md border border-[#2E263B] rounded-2xl px-3 py-1.5 shadow-xs transition-all ${className}`}>
      <button
        onClick={handleToggle}
        onMouseEnter={() => showSlider && setIsExpanded(true)}
        className={`p-2 rounded-xl transition-transform active:scale-95 flex items-center justify-center ${
          isMuted
            ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30 hover:bg-rose-900/60'
            : 'bg-[#1D1A24] text-[#A881E6] border border-[#7950B8]/30 hover:bg-[#2A2038]'
        }`}
        title={isMuted ? 'ശബ്ദം ഓണാക്കുക (Unmute)' : 'ശബ്ദം ഓഫാക്കുക (Mute)'}
        aria-label="Sound Toggle"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {showSlider && (
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            isExpanded ? 'opacity-100 max-w-[120px]' : 'opacity-80 max-w-[90px]'
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 sm:w-20 h-1.5 bg-[#1D1A24] rounded-lg appearance-none cursor-pointer accent-[#7950B8]"
            title={`വോളിയം (Volume): ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
          <span className="text-[10px] font-black text-[#A59CB5] w-6 text-right tabular-nums">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      )}
    </div>
  );
};
