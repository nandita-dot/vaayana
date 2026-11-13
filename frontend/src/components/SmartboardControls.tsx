import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Maximize2, 
  Minimize2, 
  Type, 
  Volume2, 
  VolumeX, 
  PenTool, 
  RefreshCcw 
} from 'lucide-react';

interface SmartboardControlsProps {
  onFontSizeChange: (scale: number) => void;
  audioTextEn?: string;
  audioTextMl?: string;
  onToggleDrawing?: () => void;
  isDrawingEnabled?: boolean;
}

export const SmartboardControls: React.FC<SmartboardControlsProps> = ({
  onFontSizeChange,
  audioTextEn = '',
  audioTextMl = '',
  onToggleDrawing,
  isDrawingEnabled = false
}) => {
  const { language, t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Fullscreen toggle for classroom smartboards
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Magnify font size (100% -> 115% -> 130% -> 100%) for back row visibility
  const cycleFontSize = () => {
    let newScale = 1;
    if (fontScale === 1) newScale = 1.15;
    else if (fontScale === 1.15) newScale = 1.3;
    else newScale = 1;

    setFontScale(newScale);
    onFontSizeChange(newScale);
  };

  // Browser offline speech synthesis (Bilingual Malayalam & English fallback)
  const toggleAudioNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = language === 'ml' 
      ? (audioTextMl || audioTextEn) 
      : (audioTextEn || audioTextMl);

    if (!textToSpeak) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'ml' ? 'ml-IN' : 'en-IN';
    utterance.rate = 0.9; // Clear, comfortable teaching pace for primary students

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-[#17151B] p-2 rounded-2xl border border-[#2E263B] shadow-xs">
      
      {/* Fullscreen Smartboard Mode */}
      <button
        onClick={toggleFullscreen}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
          isFullscreen 
            ? 'bg-[#7950B8] text-white shadow-sm' 
            : 'bg-[#111114] text-[#EDE5F7] hover:bg-[#1D1A24] border border-[#2E263B]'
        }`}
        title={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        <span className="hidden sm:inline">
          {isFullscreen ? (language === 'ml' ? 'സാധാരണ സ്ക്രീൻ' : 'Exit Fullscreen') : (language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് മോഡ്' : 'Smartboard Mode')}
        </span>
      </button>

      {/* Font Size Scaling */}
      <button
        onClick={cycleFontSize}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111114] hover:bg-[#1D1A24] text-[#EDE5F7] text-sm font-bold border border-[#2E263B] transition-all"
        title="Magnify Text for Smartboard"
      >
        <Type className="w-4 h-4 text-[#A881E6]" />
        <span className="text-xs font-mono text-[#A881E6]">{Math.round(fontScale * 100)}%</span>
      </button>

      {/* Audio Narration Toggle */}
      <button
        onClick={toggleAudioNarration}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
          isPlayingAudio
            ? 'bg-[#7950B8] text-white shadow-sm animate-pulse'
            : 'bg-[#111114] hover:bg-[#1D1A24] text-[#EDE5F7] border border-[#2E263B]'
        }`}
        title="Listen Narration"
      >
        {isPlayingAudio ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-[#A881E6]" />}
        <span className="hidden md:inline">
          {isPlayingAudio ? (language === 'ml' ? 'നിർത്തുക' : 'Stop') : (language === 'ml' ? 'കേൾക്കാം' : 'Listen')}
        </span>
      </button>

      {/* Interactive Chalk/Pen Mode */}
      {onToggleDrawing && (
        <button
          onClick={onToggleDrawing}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
            isDrawingEnabled
              ? 'bg-[#563580] text-white shadow-sm'
              : 'bg-[#111114] hover:bg-[#1D1A24] text-[#EDE5F7] border border-[#2E263B]'
          }`}
          title="Smartboard Highlighter"
        >
          <PenTool className="w-4 h-4" />
          <span className="hidden sm:inline">
            {language === 'ml' ? 'മാർക്കർ' : 'Highlighter'}
          </span>
        </button>
      )}

    </div>
  );
};

export default SmartboardControls;
