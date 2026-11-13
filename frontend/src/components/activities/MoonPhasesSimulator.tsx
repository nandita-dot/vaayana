import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { playClickSound, playCorrectSound } from '../../services/soundService';
import { ChevronLeft, ChevronRight, RotateCcw, Info, Moon, Sun, AlertTriangle } from 'lucide-react';

interface MoonPhaseInfo {
  index: number;
  nameEn: string;
  nameMl: string;
  illuminationPct: number;
  orbitAngleDeg: number;
  visibleShape: string; // SVG path or circle description
  descEn: string;
  descMl: string;
}

const PHASES: MoonPhaseInfo[] = [
  {
    index: 0,
    nameEn: '1. New Moon',
    nameMl: '1. അമാവാസി (New Moon)',
    illuminationPct: 0,
    orbitAngleDeg: 0,
    visibleShape: 'new_moon',
    descEn: 'The Moon is between Earth and Sun. Its illuminated side faces away from Earth, making it invisible to us.',
    descMl: 'ചന്ദ്രൻ ഭൂമിക്കും സൂര്യനും ഇടയിലാണ്. പ്രകാശിതമായ വശം ഭൂമിക്ക് എതിർദിശയിലായതിനാൽ ചന്ദ്രനെ കാണാൻ സാധിക്കുന്നില്ല.'
  },
  {
    index: 1,
    nameEn: '2. Waxing Crescent',
    nameMl: '2. വളരുന്ന ചന്ദ്രക്കല (Waxing Crescent)',
    illuminationPct: 25,
    orbitAngleDeg: 45,
    visibleShape: 'waxing_crescent',
    descEn: 'A slender silver sliver of the sunlit side begins to appear in the evening sky. "Waxing" means growing.',
    descMl: 'പ്രകാശിതമായ ഭാഗത്തിന്റെ നേർത്ത ഒരു ചന്ദ്രക്കല പടിഞ്ഞാറൻ ആകാശത്ത് ദൃശ്യമാകുന്നു. "വളരുന്ന" ഘട്ടം ആരംഭിക്കുന്നു.'
  },
  {
    index: 2,
    nameEn: '3. First Quarter',
    nameMl: '3. ഒന്നാം പാദം / അർദ്ധചന്ദ്രൻ (First Quarter)',
    illuminationPct: 50,
    orbitAngleDeg: 90,
    visibleShape: 'first_quarter',
    descEn: 'Half of the Moon’s visible disk is illuminated by sunlight. One quarter through the lunar orbit.',
    descMl: 'ചന്ദ്രന്റെ നേർപകുതി പ്രകാശിതമായി കാണപ്പെടുന്നു. ചാന്ദ്ര മാസത്തിന്റെ നാലിലൊന്ന് ഭാഗം പൂർത്തിയായി.'
  },
  {
    index: 3,
    nameEn: '4. Waxing Gibbous',
    nameMl: '4. വളരുന്ന ഗിബ്ബസ് (Waxing Gibbous)',
    illuminationPct: 75,
    orbitAngleDeg: 135,
    visibleShape: 'waxing_gibbous',
    descEn: 'More than half of the visible surface is lit, approaching a round Full Moon.',
    descMl: 'പകുതിയിലധികം ഭാഗം പ്രകാശിതമായി വലുതായി കാണപ്പെടുന്നു. പൗർണ്ണമിയിലേക്ക് അടുക്കുന്നു.'
  },
  {
    index: 4,
    nameEn: '5. Full Moon',
    nameMl: '5. പൗർണ്ണമി / വെളുത്തവാവ് (Full Moon)',
    illuminationPct: 100,
    orbitAngleDeg: 180,
    visibleShape: 'full_moon',
    descEn: 'Earth is between the Sun and Moon. The entire sunlit half faces Earth, showing a brilliant bright round disk.',
    descMl: 'ഭൂമി സൂര്യനും ചന്ദ്രനും ഇടയിലാണ്. പ്രകാശിതമായ മുഴുവൻ വശവും ഭൂമിക്ക് അഭിമുഖമായി വന്ന് പൂർണ്ണചന്ദ്രനായി തിളങ്ങുന്നു.'
  },
  {
    index: 5,
    nameEn: '6. Waning Gibbous',
    nameMl: '6. കുറയുന്ന ഗിബ്ബസ് (Waning Gibbous)',
    illuminationPct: 75,
    orbitAngleDeg: 225,
    visibleShape: 'waning_gibbous',
    descEn: 'The illuminated portion starts decreasing. "Waning" means shrinking.',
    descMl: 'പ്രകാശിത ഭാഗം ക്രമേണ കുറഞ്ഞുതുടങ്ങുന്നു. "കുറയുന്ന" ഘട്ടം ആരംഭിക്കുന്നു.'
  },
  {
    index: 6,
    nameEn: '7. Last Quarter',
    nameMl: '7. മൂന്നാം പാദം / അർദ്ധചന്ദ്രൻ (Last Quarter)',
    illuminationPct: 50,
    orbitAngleDeg: 270,
    visibleShape: 'last_quarter',
    descEn: 'The opposite half of the Moon is illuminated as it continues its orbit back towards New Moon.',
    descMl: 'ചന്ദ്രന്റെ എതിർപകുതി മാത്രം പ്രകാശിതമായി കാണപ്പെടുന്നു.'
  },
  {
    index: 7,
    nameEn: '8. Waning Crescent',
    nameMl: '8. കുറയുന്ന ചന്ദ്രക്കല (Waning Crescent)',
    illuminationPct: 25,
    orbitAngleDeg: 315,
    visibleShape: 'waning_crescent',
    descEn: 'A thin crescent visible just before sunrise, after which the cycle repeats from New Moon.',
    descMl: 'പുലർച്ചെ കാണുന്ന നേർത്ത ചന്ദ്രക്കല. ഇതിനുശേഷം വീണ്ടും അമാവാസി എത്തി പുതിയ ചാന്ദ്രമാസം ആരംഭിക്കുന്നു.'
  }
];

export const MoonPhasesSimulator: React.FC = () => {
  const { language } = useLanguage();
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(4); // Default Full Moon

  const activePhase = PHASES[currentPhaseIndex];

  const handlePrev = () => {
    playClickSound();
    setCurrentPhaseIndex((prev) => (prev > 0 ? prev - 1 : PHASES.length - 1));
  };

  const handleNext = () => {
    playClickSound();
    setCurrentPhaseIndex((prev) => (prev < PHASES.length - 1 ? prev + 1 : 0));
  };

  const handleSelectPhase = (index: number) => {
    playClickSound();
    setCurrentPhaseIndex(index);
  };

  return (
    <div className="bg-vaayana-darkSurface border border-vaayana-darkBorder rounded-3xl p-6 sm:p-8 space-y-6 shadow-darkCard">
      
      {/* Activity Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
            EVS • Chapter 2 Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-2 font-malayalam">
            {language === 'ml' ? 'ചന്ദ്രന്റെ വിവിധ കലകൾ (Moon Phases Simulator)' : 'Moon Phases Simulator'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted">
            {language === 'ml' 
              ? 'ഭൂമിയിൽ നിന്നുള്ള വീക്ഷണത്തിനനുസരിച്ച് ചന്ദ്രന്റെ പ്രകാശിത ഭാഗം മാറുന്നത് കാണുക.' 
              : 'Interactive demonstration of the 8 principal phases of the Moon.'}
          </p>
        </div>

        {/* Phase Counter */}
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-2xl bg-vaayana-darkElevated border border-vaayana-darkBorder text-vaayana-lime font-mono font-black text-xs">
            {currentPhaseIndex + 1} / {PHASES.length}
          </span>
        </div>
      </div>

      {/* Main Dual Stage Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Dual View — Top-Down Orbit vs View From Earth (7 Cols) */}
        <div className="lg:col-span-7 bg-[#070B08] rounded-3xl p-6 border border-vaayana-darkBorder shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
          
          {/* Sunlight beams streaming from right to left */}
          <div className="absolute top-0 bottom-0 right-0 w-36 bg-gradient-to-l from-amber-500/20 to-transparent pointer-events-none" />

          {/* DUAL VIEW CONTAINER */}
          <div className="w-full flex flex-col items-center gap-6">
            
            {/* View A: View of Moon as Seen From Earth */}
            <div className="flex flex-col items-center gap-2 z-10">
              <span className="text-xs font-black uppercase tracking-wider text-vaayana-lime">
                {language === 'ml' ? '👁️ ഭൂമിയിൽ നിന്നുള്ള കാഴ്ച (View from Earth)' : '👁️ View as Seen From Earth'}
              </span>

              {/* Render Realistic Moon Disk with phase clipping */}
              <div className="w-36 h-36 rounded-full bg-[#0D1510] border-2 border-slate-700 relative overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center">
                
                {/* Full Moon Glow */}
                {activePhase.visibleShape === 'full_moon' && (
                  <div className="w-full h-full rounded-full bg-[#F1F5F9] shadow-[0_0_35px_#F8FAFC] flex items-center justify-center text-4xl">
                    🌕
                  </div>
                )}

                {/* New Moon */}
                {activePhase.visibleShape === 'new_moon' && (
                  <div className="w-full h-full rounded-full bg-[#090D0A] flex items-center justify-center text-4xl opacity-40">
                    🌑
                  </div>
                )}

                {/* First Quarter */}
                {activePhase.visibleShape === 'first_quarter' && (
                  <div className="w-full h-full flex">
                    <div className="w-1/2 h-full bg-[#090D0A]" />
                    <div className="w-1/2 h-full bg-[#F1F5F9] shadow-md" />
                  </div>
                )}

                {/* Last Quarter */}
                {activePhase.visibleShape === 'last_quarter' && (
                  <div className="w-full h-full flex">
                    <div className="w-1/2 h-full bg-[#F1F5F9] shadow-md" />
                    <div className="w-1/2 h-full bg-[#090D0A]" />
                  </div>
                )}

                {/* Waxing Crescent */}
                {activePhase.visibleShape === 'waxing_crescent' && (
                  <div className="text-6xl flex items-center justify-center text-slate-100">
                    🌒
                  </div>
                )}

                {/* Waxing Gibbous */}
                {activePhase.visibleShape === 'waxing_gibbous' && (
                  <div className="text-6xl flex items-center justify-center text-slate-100">
                    🌔
                  </div>
                )}

                {/* Waning Gibbous */}
                {activePhase.visibleShape === 'waning_gibbous' && (
                  <div className="text-6xl flex items-center justify-center text-slate-100">
                    🌖
                  </div>
                )}

                {/* Waning Crescent */}
                {activePhase.visibleShape === 'waning_crescent' && (
                  <div className="text-6xl flex items-center justify-center text-slate-100">
                    🌘
                  </div>
                )}
              </div>

              <div className="text-center">
                <span className="text-lg font-black text-white font-malayalam">
                  {language === 'ml' ? activePhase.nameMl : activePhase.nameEn}
                </span>
                <span className="text-xs text-vaayana-lime block font-bold">
                  {activePhase.illuminationPct}% {language === 'ml' ? 'പ്രകാശിത ഭാഗം' : 'Illuminated Disk'}
                </span>
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-4 z-20">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-black text-xs border border-vaayana-darkBorder shadow-sm active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-vaayana-lime" />
                <span>{language === 'ml' ? 'മുമ്പത്തെ ഘട്ടം' : 'Previous Phase'}</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black text-xs shadow-limeGlow active:scale-95 transition-all"
              >
                <span>{language === 'ml' ? 'അടുത്ത ഘട്ടം' : 'Next Phase'}</span>
                <ChevronRight className="w-4 h-4 text-vaayana-dark" />
              </button>
            </div>

          </div>

        </div>

        {/* Right: Scientific Explanations & Misconception Clarifier (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Phase Details Card */}
          <div className="p-5 rounded-3xl bg-vaayana-darkElevated border border-vaayana-darkBorder shadow-darkCard space-y-3">
            <h4 className="text-base font-black text-white font-malayalam">
              {language === 'ml' ? activePhase.nameMl : activePhase.nameEn}
            </h4>
            <p className="text-xs text-vaayana-textLight leading-relaxed font-medium font-malayalam">
              {language === 'ml' ? activePhase.descMl : activePhase.descEn}
            </p>
          </div>

          {/* CRITICAL SYLLABUS SCIENTIFIC ACCURACY REQUIREMENT:
              Earth's shadow DOES NOT cause Moon phases! Moon phases occur because we see varying amounts of the sunlit side! */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 space-y-2 text-xs font-medium font-malayalam">
            <div className="flex items-center gap-2 text-amber-400 font-black uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{language === 'ml' ? 'ശാസ്ത്രീയ കൃത്യത (Scientific Accuracy)' : 'Key Scientific Distinction'}</span>
            </div>
            <p className="text-amber-100 text-[11px] leading-relaxed">
              {language === 'ml'
                ? 'തെറ്റിദ്ധാരണ ഒഴിവാക്കുക: ഭൂമിയുടെ നിഴൽ ചന്ദ്രനിൽ വീഴുന്നതുകൊണ്ടല്ല ചന്ദ്രക്കലകൾ ഉണ്ടാകുന്നത്! ചന്ദ്രന്റെ സൂര്യപ്രകാശം തട്ടുന്ന പകുതി ഭാഗം നമ്മൾ പല കോണുകളിൽ നിന്ന് കാണുന്നതിനാലാണ് കലകൾ മാറുന്നത്. ഭൂമിയുടെ നിഴൽ വീഴുന്നത് ചന്ദ്രഗ്രഹണത്തിൽ (Lunar Eclipse) മാത്രമാണ്.'
                : 'Scientific Fact: Moon phases are NOT caused by Earth’s shadow! They are caused by our changing view of the Moon’s sunlit half as it orbits Earth. Earth’s shadow only falls on the Moon during a Lunar Eclipse.'}
            </p>
          </div>

          {/* Phase Quick Select Bar */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-vaayana-textLightMuted">
              {language === 'ml' ? '8 ഘട്ടങ്ങളിലേക്കും നേരിട്ട് പോകാം:' : 'Jump to Any of 8 Phases:'}
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {PHASES.map((p) => {
                const isSelected = p.index === currentPhaseIndex;
                return (
                  <button
                    key={p.index}
                    onClick={() => handleSelectPhase(p.index)}
                    className={`p-2 rounded-xl text-[10px] font-bold border transition-all truncate ${
                      isSelected
                        ? 'bg-vaayana-lime text-vaayana-dark border-vaayana-lime font-black shadow-xs'
                        : 'bg-vaayana-darkElevated text-vaayana-textLightMuted border-vaayana-darkBorder'
                    }`}
                  >
                    #{p.index + 1}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

