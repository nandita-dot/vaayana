import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { EducationalVideoConfig, EDUCATIONAL_VIDEOS } from '../config/educationalVideos';
import { Play, Video, WifiOff, Edit3, Check, Maximize2, AlertCircle, RefreshCw } from 'lucide-react';
import { playClickSound } from '../services/soundService';

interface EducationalVideoProps {
  videoId?: string;
  chapterId?: string;
  customConfig?: EducationalVideoConfig;
}

export const EducationalVideo: React.FC<EducationalVideoProps> = ({
  videoId,
  chapterId,
  customConfig
}) => {
  const { language } = useLanguage();

  // Determine initial configuration from props or central config
  const initialConfig = customConfig || 
    (videoId ? EDUCATIONAL_VIDEOS[videoId] : undefined) ||
    (chapterId ? Object.values(EDUCATIONAL_VIDEOS).find(v => v.chapterId === chapterId) : undefined) ||
    EDUCATIONAL_VIDEOS['ch2_solar_system'];

  const [config, setConfig] = useState<EducationalVideoConfig>(initialConfig);
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | undefined>(initialConfig.youtubeId);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [inputUrlOrId, setInputUrlOrId] = useState('');
  const [isLoadedByUser, setIsLoadedByUser] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [iframeError, setIframeError] = useState(false);

  // Check local override in localStorage if teacher previously added a link
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`vaayana_video_${config.id}`);
      if (saved) {
        setActiveYoutubeId(saved);
      }
    } catch (_) {}

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [config.id]);

  const extractYoutubeId = (input: string): string => {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : trimmed;
  };

  const handleSaveCustomId = () => {
    playClickSound();
    const parsed = extractYoutubeId(inputUrlOrId);
    if (parsed) {
      setActiveYoutubeId(parsed);
      try {
        localStorage.setItem(`vaayana_video_${config.id}`, parsed);
      } catch (_) {}
      setIsEditingLink(false);
      setIsLoadedByUser(true);
      setIframeError(false);
    }
  };

  const handleStartPlayback = () => {
    playClickSound();
    setIsLoadedByUser(true);
    setIframeError(false);
  };

  return (
    <div className="bg-vaayana-darkSurface border border-vaayana-darkBorder rounded-3xl p-6 sm:p-8 space-y-6 shadow-darkCard">
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-vaayana-lime/10 text-vaayana-lime flex items-center justify-center">
              <Video className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-vaayana-lime">
              {config.topic} • {language === 'ml' ? 'വിദ്യാഭ്യാസ വീഡിയോ' : 'Educational Video'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textLight font-malayalam">
            {language === 'ml' ? config.titleMl : config.titleEn}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted">
            {language === 'ml' ? config.descriptionMl : config.descriptionEn}
          </p>
        </div>

        {/* Teacher Edit Video Link Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              setIsEditingLink(!isEditingLink);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder border border-vaayana-darkBorder text-xs font-bold text-vaayana-textLight transition-all"
            title="Configure or Replace YouTube Link"
          >
            <Edit3 className="w-3.5 h-3.5 text-vaayana-lime" />
            <span>{isEditingLink ? (language === 'ml' ? 'റദ്ദാക്കുക' : 'Cancel') : (language === 'ml' ? 'ലിങ്ക് മാറ്റുക' : 'Change Video')}</span>
          </button>
        </div>
      </div>

      {/* Teacher Video URL Input Panel */}
      {isEditingLink && (
        <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-lime/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-vaayana-lime">
              {language === 'ml' ? 'യുട്യൂബ് ലിങ്ക് അല്ലെങ്കിൽ വീഡിയോ ഐഡി നൽകുക:' : 'Enter YouTube URL or 11-character Video ID:'}
            </span>
            <span className="text-[11px] text-vaayana-textLightMuted">e.g., https://youtu.be/...</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUrlOrId}
              onChange={(e) => setInputUrlOrId(e.target.value)}
              placeholder="Paste YouTube Link or Video ID"
              className="flex-1 px-4 py-2.5 rounded-xl bg-vaayana-darkSurface border border-vaayana-darkBorder text-xs sm:text-sm text-white focus:outline-none focus:border-vaayana-lime"
            />
            <button
              onClick={handleSaveCustomId}
              className="px-5 py-2.5 rounded-xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'ml' ? 'സംരക്ഷിക്കുക' : 'Save'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Video Viewport / Offline / Placeholder Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/90 border border-vaayana-darkBorder flex items-center justify-center">
        
        {/* State A: Explicit Offline State */}
        {!isOnline ? (
          <div className="p-8 text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
              <WifiOff className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-white font-malayalam">
                {language === 'ml' ? 'ഓഫ്‌ലൈൻ മോഡ് സജീവമാണ്' : 'Offline Mode Active'}
              </h4>
              <p className="text-xs sm:text-sm text-vaayana-textLightMuted mt-1">
                {language === 'ml' 
                  ? 'ഇന്റർനെറ്റ് കണക്ഷൻ ലഭ്യമല്ല. പാഠത്തിന്റെ മറ്റ് എല്ലാ സംവേദനാത്മക കളിക്കളങ്ങളും ഓഫ്‌ലൈനായി ലഭ്യമാണ്.'
                  : 'Internet connection is unavailable. All classroom simulations and interactive manipulatives are working 100% offline.'}
              </p>
            </div>
          </div>
        ) : !activeYoutubeId || (config.isPlaceholder && !activeYoutubeId) ? (
          /* State B: Placeholder (Teacher will add video) */
          <div className="p-8 text-center space-y-4 max-w-lg">
            <div className="w-16 h-16 rounded-3xl bg-vaayana-lime/10 text-vaayana-lime mx-auto flex items-center justify-center border border-vaayana-lime/20">
              <Video className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-vaayana-darkElevated border border-vaayana-lime/30 text-xs font-black text-vaayana-lime">
                {language === 'ml' ? 'അധ്യാപകർ വീഡിയോ ലിങ്ക് നൽകും' : 'Teacher will add video'}
              </div>
              <h4 className="text-base sm:text-lg font-black text-white font-malayalam">
                {language === 'ml' ? config.placeholderMessageMl || config.titleMl : config.placeholderMessageEn || config.titleEn}
              </h4>
              <p className="text-xs text-vaayana-textLightMuted">
                {language === 'ml'
                  ? 'ക്ലാസ്സിൽ അവതരിപ്പിക്കാൻ അനുയോജ്യമായ യുട്യൂബ് ലിങ്ക് മുകളിലെ "ലിങ്ക് മാറ്റുക" ബട്ടൺ വഴി ചേർക്കാവുന്നതാണ്.'
                  : 'Teachers can add any official YouTube educational video using the "Change Video" button above.'}
              </p>
            </div>
          </div>
        ) : !isLoadedByUser ? (
          /* State C: Safe User-Triggered Start (Never auto-requested on activity startup!) */
          <div className="p-8 text-center space-y-4 max-w-md">
            <button
              onClick={handleStartPlayback}
              className="w-20 h-20 rounded-full bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark mx-auto flex items-center justify-center shadow-limeGlow hover:scale-110 active:scale-95 transition-all group"
              aria-label="Play Educational Video"
            >
              <Play className="w-9 h-9 fill-vaayana-dark translate-x-0.5" />
            </button>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-black text-white font-malayalam">
                {language === 'ml' ? 'വീഡിയോ പ്ലേ ചെയ്യുക' : 'Load & Play Video'}
              </h4>
              <p className="text-xs text-vaayana-textLightMuted">
                {language === 'ml'
                  ? 'ക്ലാസ്സ് ഡാറ്റ ലാഭിക്കാനും ഓഫ്‌ലൈൻ വേഗത ഉറപ്പാക്കാനും ഉപയോക്താവ് ക്ലിക്ക് ചെയ്യുമ്പോൾ മാത്രമേ വീഡിയോ ലോഡ് ആവുകയുള്ളൂ.'
                  : 'Click to load player. Does not make external network requests until clicked.'}
              </p>
            </div>
          </div>
        ) : (
          /* State D: Official YouTube Embedded iFrame */
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?rel=0&modestbranding=1`}
            title={config.titleEn}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setIframeError(true)}
          />
        )}
      </div>

      {/* Footer Info & Disclaimers */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-vaayana-textLightMuted pt-2 border-t border-vaayana-darkBorder">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-vaayana-lime"></span>
          <span>{language === 'ml' ? 'യുട്യൂബ് ഔദ്യോഗിക എംബെഡ് പ്ലെയർ' : 'Official YouTube Embedded Player'}</span>
        </span>
        <span>
          {language === 'ml' ? 'ഓഫ്‌ലൈൻ സംവേദനാത്മകതയെ ബാധിക്കില്ല' : 'Safe offline-first container'}
        </span>
      </div>

    </div>
  );
};

