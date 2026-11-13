import React, { useState, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Type, 
  PenTool
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SmartboardControlsProps {
  onFontSizeChange?: (scale: number) => void;
  audioTextEn?: string;
  audioTextMl?: string;
  isDrawingEnabled?: boolean;
  onToggleDrawing?: () => void;
}

export const SmartboardControls: React.FC<SmartboardControlsProps> = ({
  onFontSizeChange,
  audioTextEn,
  audioTextMl,
  isDrawingEnabled = false,
  onToggleDrawing,
}) => {
  const { language, t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  // Monitor fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request blocked or not supported:', err);
    }
  };

  const cycleFontSize = () => {
    const nextScale = fontScale >= 1.3 ? 1.0 : fontScale + 0.15;
    const rounded = Math.round(nextScale * 100) / 100;
    setFontScale(rounded);
    if (onFontSizeChange) {
      onFontSizeChange(rounded);
    }
  };

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

    const textToRead = language === 'ml' ? (audioTextMl || audioTextEn) : (audioTextEn || audioTextMl);
    if (!textToRead) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = language === 'ml' ? 'ml-IN' : 'en-IN';
    utterance.rate = 0.9;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-vaayana-darkSurface p-2 rounded-2xl border border-vaayana-darkBorder shadow-darkCard">
      
      {/* Fullscreen Smartboard Mode */}
      <button
        onClick={toggleFullscreen}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
          isFullscreen 
            ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow' 
            : 'bg-vaayana-darkElevated text-vaayana-textLight hover:text-vaayana-lime border border-vaayana-darkBorder'
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
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight text-sm font-bold border border-vaayana-darkBorder transition-all"
        title="Magnify Text for Smartboard"
      >
        <Type className="w-4 h-4 text-vaayana-lime" />
        <span className="text-xs font-mono text-vaayana-lime">{Math.round(fontScale * 100)}%</span>
      </button>

      {/* Audio Narration Toggle */}
      <button
        onClick={toggleAudioNarration}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
          isPlayingAudio
            ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow animate-pulse'
            : 'bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight border border-vaayana-darkBorder'
        }`}
        title="Listen Narration"
      >
        {isPlayingAudio ? <VolumeX className="w-4 h-4 text-vaayana-dark" /> : <Volume2 className="w-4 h-4 text-vaayana-lime" />}
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
              ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
              : 'bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight border border-vaayana-darkBorder'
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
