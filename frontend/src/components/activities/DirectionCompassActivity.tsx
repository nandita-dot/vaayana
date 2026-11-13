import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playCorrectSound, playIncorrectSound, playCelebrationSound } from '../../services/soundService';
import { Compass, RotateCcw, CheckCircle2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface LandmarkItem {
  id: string;
  nameEn: string;
  nameMl: string;
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  angleDeg: number;
  icon: string;
}

const LANDMARKS: LandmarkItem[] = [
  { id: 'school', nameEn: 'School', nameMl: 'സ്കൂൾ', direction: 'N', angleDeg: 0, icon: '🏫' },
  { id: 'temple', nameEn: 'Temple', nameMl: 'ക്ഷേത്രം', direction: 'NE', angleDeg: 45, icon: '🛕' },
  { id: 'rising_sun', nameEn: 'Sunrise (East)', nameMl: 'ഉദയസൂര്യൻ (കിഴക്ക്)', direction: 'E', angleDeg: 90, icon: '🌅' },
  { id: 'river', nameEn: 'River Bridge', nameMl: 'പുഴപ്പാലം', direction: 'SE', angleDeg: 135, icon: '🌉' },
  { id: 'hospital', nameEn: 'Hospital', nameMl: 'ആശുപത്രി', direction: 'S', angleDeg: 180, icon: '🏥' },
  { id: 'paddy', nameEn: 'Paddy Field', nameMl: 'നെൽവയൽ', direction: 'SW', angleDeg: 225, icon: '🌾' },
  { id: 'sunset', nameEn: 'Sunset (West)', nameMl: 'അസ്തമയസൂര്യൻ (പടിഞ്ഞാറ്)', direction: 'W', angleDeg: 270, icon: '🌇' },
  { id: 'forest', nameEn: 'Mountain Forest', nameMl: 'പർവ്വത വനം', direction: 'NW', angleDeg: 315, icon: '🌲' },
];

const DIRECTION_LABELS: Record<string, { en: string; ml: string; short: string }> = {
  'N': { en: 'North', ml: 'വടക്ക്', short: 'N' },
  'NE': { en: 'North-East', ml: 'വടക്കുകിഴക്ക്', short: 'NE' },
  'E': { en: 'East', ml: 'കിഴക്ക്', short: 'E' },
  'SE': { en: 'South-East', ml: 'തെക്കുകിഴക്ക്', short: 'SE' },
  'S': { en: 'South', ml: 'തെക്ക്', short: 'S' },
  'SW': { en: 'South-West', ml: 'തെക്കുപടിഞ്ഞാറ്', short: 'SW' },
  'W': { en: 'West', ml: 'പടിഞ്ഞാറ്', short: 'W' },
  'NW': { en: 'North-West', ml: 'വടക്കുപടിഞ്ഞാറ്', short: 'NW' },
};

export const DirectionCompassActivity: React.FC = () => {
  const { language } = useLanguage();

  const [activeAngle, setActiveAngle] = useState<number>(0);
  const [targetChallengeIndex, setTargetChallengeIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong' | null; messageEn: string; messageMl: string }>({
    status: null,
    messageEn: '',
    messageMl: ''
  });

  const currentChallenge = LANDMARKS[targetChallengeIndex];

  // Find active direction based on pointer angle
  const activeDirectionKey = Object.keys(DIRECTION_LABELS).find(key => {
    const l = LANDMARKS.find(lm => lm.direction === key);
    return l && (l.angleDeg % 360) === (activeAngle % 360);
  }) || 'N';

  const activeLabel = DIRECTION_LABELS[activeDirectionKey];

  const handleRotatePointer = (deg: number) => {
    playClickSound();
    const newAngle = (deg + 360) % 360;
    setActiveAngle(newAngle);

    // Verify if pointed at current challenge
    if (newAngle === currentChallenge.angleDeg) {
      playCorrectSound();
      setScore(s => s + 1);
      setFeedback({
        status: 'correct',
        messageEn: `Correct! ${currentChallenge.nameEn} is in the ${DIRECTION_LABELS[currentChallenge.direction].en}!`,
        messageMl: `ശരിയുത്തരം! ${currentChallenge.nameMl} സ്ഥിതി ചെയ്യുന്നത് ${DIRECTION_LABELS[currentChallenge.direction].ml} ദിശയിലാണ്!`
      });

      setTimeout(() => {
        setTargetChallengeIndex(prev => (prev + 1) % LANDMARKS.length);
        setFeedback({ status: null, messageEn: '', messageMl: '' });
      }, 1500);
    } else {
      setFeedback({ status: null, messageEn: '', messageMl: '' });
    }
  };

  const handleReset = () => {
    playClickSound();
    setActiveAngle(0);
    setTargetChallengeIndex(0);
    setScore(0);
    setFeedback({ status: null, messageEn: '', messageMl: '' });
  };

  return (
    <div className="bg-vaayana-soft rounded-3xl p-6 sm:p-8 border border-vaayana-softBorder shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
            EVS • Chapter 3 Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textDark mt-2 font-malayalam">
            {language === 'ml' ? 'ദിശാ കോമ്പസ് കളിക്കളം (8 Directions Compass)' : 'Interactive 8-Direction Compass Rose'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textDarkMuted">
            {language === 'ml' 
              ? '4 പ്രധാന ദിശകളും (വടക്ക്, തെക്ക്, കിഴക്ക്, പടിഞ്ഞാറ്) 4 കോണുകളും (NE, NW, SE, SW) കണ്ടെത്തുക.' 
              : 'Explore the 4 cardinal directions and 4 intermediate directions.'}
          </p>
        </div>

        {/* Score & Reset */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#1D1A24] text-[#A881E6] font-mono font-black text-sm shadow-sm flex items-center gap-2 border border-[#2E263B]">
            <CheckCircle2 className="w-4 h-4 text-[#7950B8]" />
            <span>{score} Solved</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] border border-[#2E263B] shadow-sm transition-all active:scale-95"
            title="Reset Compass"
          >
            <RotateCcw className="w-5 h-5 text-[#A881E6]" />
          </button>
        </div>
      </div>

      {/* Challenge Prompt Banner */}
      <div className="p-4 rounded-2xl bg-[#17151B] border-2 border-[#7950B8]/50 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentChallenge.icon}</span>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#A881E6]">
              {language === 'ml' ? 'ലക്ഷ്യ ദിശ കണ്ടെത്തുക:' : 'Target Challenge:'}
            </span>
            <h4 className="text-lg font-black text-[#EDE5F7] font-malayalam">
              {language === 'ml' 
                ? `കോമ്പസ് സൂചി "${currentChallenge.nameMl}" ഉള്ള ദിശയിലേക്ക് തിരിക്കുക:` 
                : `Rotate the compass needle towards the "${currentChallenge.nameEn}":`}
            </h4>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs font-black text-amber-200">
          {language === 'ml' ? `ലക്ഷ്യം: ${DIRECTION_LABELS[currentChallenge.direction].ml}` : `Target: ${DIRECTION_LABELS[currentChallenge.direction].en}`}
        </div>
      </div>

      {/* Main Interactive Compass Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive 8-Direction Compass Rose SVG (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111114] rounded-3xl p-6 sm:p-8 border border-[#2E263B] shadow-inner flex flex-col items-center justify-center relative min-h-[440px]">
          
          <svg
            width="380"
            height="380"
            viewBox="-190 -190 380 380"
            className="w-full h-auto max-w-[360px] max-h-[360px] overflow-visible relative z-10"
          >
            {/* Compass Outer Ring with Degree Ticks */}
            <circle cx="0" cy="0" r="140" fill="#17151B" stroke="#2E263B" strokeWidth="4" />
            <circle cx="0" cy="0" r="125" fill="#111114" stroke="#2E263B" strokeWidth="2" />

            {/* 8 Direction Rays & Landmark Badges */}
            {LANDMARKS.map((lm) => {
              const rad = (lm.angleDeg - 90) * (Math.PI / 180);
              const xPos = 160 * Math.cos(rad);
              const yPos = 160 * Math.sin(rad);
              const isTarget = lm.id === currentChallenge.id;
              const isSelected = (lm.angleDeg % 360) === (activeAngle % 360);

              return (
                <g 
                  key={lm.id}
                  className="cursor-pointer"
                  onClick={() => handleRotatePointer(lm.angleDeg)}
                >
                  {/* Radial line */}
                  <line
                    x1="0"
                    y1="0"
                    x2={120 * Math.cos(rad)}
                    y2={120 * Math.sin(rad)}
                    stroke={isSelected ? '#7950B8' : '#3D2D56'}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    strokeDasharray={isSelected ? undefined : '3 3'}
                  />

                  {/* Landmark Node Badge */}
                  <g transform={`translate(${xPos}, ${yPos})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill={isSelected ? '#7950B8' : isTarget ? '#78350F' : '#17151B'}
                      stroke={isSelected ? '#EDE5F7' : isTarget ? '#F59E0B' : '#2E263B'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      className="transition-all"
                    />
                    <text x="0" y="5" textAnchor="middle" fontSize="16">
                      {lm.icon}
                    </text>
                    <text
                      x="0"
                      y={yPos > 0 ? 34 : -26}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#EDE5F7"
                    >
                      {lm.direction}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* ROTATING COMPASS NEEDLE POINTER */}
            <motion.g
              animate={{ rotate: activeAngle }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {/* North Pointer (Red / Marked) */}
              <polygon points="0,-115 12,0 0,-15" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
              <polygon points="0,-115 -12,0 0,-15" fill="#DC2626" stroke="#B91C1C" strokeWidth="1.5" />

              {/* South Pointer (Silver/Charcoal) */}
              <polygon points="0,115 12,0 0,15" fill="#746C80" stroke="#563580" strokeWidth="1.5" />
              <polygon points="0,115 -12,0 0,15" fill="#563580" stroke="#3D2D56" strokeWidth="1.5" />

              {/* Center Pivot Boss */}
              <circle cx="0" cy="0" r="14" fill="#090909" stroke="#7950B8" strokeWidth="3" />
              <circle cx="0" cy="0" r="4" fill="#7950B8" />
            </motion.g>

            {/* Center Student Character standing at origin */}
            <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#FFFFFF" fontWeight="900" pointerEvents="none">
              🚶
            </text>
          </svg>

          {/* Active Direction Output Display */}
          <div className="mt-4 text-center">
            <span className="text-xs font-bold text-vaayana-textDarkMuted uppercase tracking-wider">
              {language === 'ml' ? 'സൂചി ചൂണ്ടുന്ന ദിശ:' : 'Current Heading:'}
            </span>
            <div className="text-xl font-black text-vaayana-textDark font-malayalam flex items-center justify-center gap-2 mt-0.5">
              <span className="px-3 py-1 rounded-xl bg-vaayana-dark text-vaayana-lime font-mono text-sm">
                {activeLabel.short}
              </span>
              <span>{language === 'ml' ? activeLabel.ml : activeLabel.en}</span>
            </div>
          </div>

        </div>

        {/* Right: Quick Direction Click Buttons (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Feedback Banner */}
          {feedback.status && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 font-bold text-xs font-malayalam flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{language === 'ml' ? feedback.messageMl : feedback.messageEn}</span>
            </motion.div>
          )}

          {/* 8 Direction Selector Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-vaayana-textDarkMuted">
              {language === 'ml' ? 'സൂചി തിരിക്കാൻ ദിശ തിരഞ്ഞെടുക്കൂ:' : 'Select Direction to Point Needle:'}
            </span>

            <div className="grid grid-cols-2 gap-2 font-malayalam">
              {LANDMARKS.map((lm) => {
                const isSelected = (lm.angleDeg % 360) === (activeAngle % 360);
                const label = DIRECTION_LABELS[lm.direction];

                return (
                  <button
                    key={lm.id}
                    onClick={() => handleRotatePointer(lm.angleDeg)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[#563580] text-white border-[#7950B8] shadow-md ring-2 ring-[#7950B8]'
                        : 'bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] border-[#2E263B] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lm.icon}</span>
                      <div>
                        <div className="text-xs font-black">
                          {language === 'ml' ? label.ml : label.en}
                        </div>
                        <div className="text-[10px] text-vaayana-textDarkMuted">
                          {language === 'ml' ? lm.nameMl : lm.nameEn}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono opacity-80">
                      {label.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 font-medium font-malayalam space-y-1">
            <div className="font-black text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'ml' ? 'ദിശകൾ ഓർക്കാൻ എളുപ്പവഴി:' : 'Quick Direction Tip:'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {language === 'ml'
                ? 'സൂര്യൻ ഉദിക്കുന്ന ദിശ കിഴക്ക് (East). അസ്തമിക്കുന്ന ദിശ പടിഞ്ഞാറ് (West). ഉദയസൂര്യന് നേരെ തിരിഞ്ഞുനിന്നാൽ പുറകിൽ പടിഞ്ഞാറും, ഇടതുവശത്ത് വടക്കും (North), വലതുവശത്ത് തെക്കും (South) ആയിരിക്കും.'
                : 'Facing the rising Sun in the East: West is behind you, North is to your left, and South is to your right!'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

