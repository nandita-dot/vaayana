import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playCorrectSound, playCoinSound } from '../../services/soundService';
import { Wind, RotateCcw, CheckCircle2, Info, ArrowDown, MoveDiagonal } from 'lucide-react';

export const AirOccupiesSpaceDemo: React.FC = () => {
  const { language } = useLanguage();

  // Glass state: 'outside' | 'submerged_straight' | 'tilted'
  const [glassState, setGlassState] = useState<'outside' | 'submerged_straight' | 'tilted'>('outside');

  const handleSubmergeStraight = () => {
    playClickSound();
    setGlassState('submerged_straight');
    setTimeout(() => playCorrectSound(), 400);
  };

  const handleTiltGlass = () => {
    playCoinSound(); // Bubble pop sound
    setGlassState('tilted');
    setTimeout(() => playCorrectSound(), 500);
  };

  const handleReset = () => {
    playClickSound();
    setGlassState('outside');
  };

  return (
    <div className="bg-vaayana-soft rounded-3xl p-6 sm:p-8 border border-vaayana-softBorder shadow-soft space-y-6">
      
      {/* Activity Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
            EVS • Chapter 1 Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textDark mt-2 font-malayalam">
            {language === 'ml' ? 'വായു സ്ഥലം അപഹരിക്കുന്നു (Air Occupies Space)' : 'Air Occupies Space Interactive Demo'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textDarkMuted">
            {language === 'ml' 
              ? 'കമഴ്ത്തിയ ഗ്ലാസ്സ് വെള്ളത്തിലേക്ക് താഴ്ത്തുമ്പോൾ എന്ത് സംഭവിക്കുന്നു എന്ന് നിരീക്ഷിക്കുക.' 
              : 'Observe the trapped air pocket when an inverted glass is pushed straight down into water.'}
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-vaayana-dark border border-vaayana-softBorder shadow-sm transition-all active:scale-95"
          title="Reset Experiment"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive Water Trough & Glass Stage (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-vaayana-softBorder shadow-inner flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
          
          {/* Status Chip */}
          <div className="absolute top-4 left-4 z-20">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm ${
              glassState === 'outside' ? 'bg-slate-200 text-slate-800' :
              glassState === 'submerged_straight' ? 'bg-teal-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {glassState === 'outside' ? (language === 'ml' ? 'ഗ്ലാസ്സ് വെള്ളത്തിന് പുറത്ത്' : 'Glass Outside Water') :
               glassState === 'submerged_straight' ? (language === 'ml' ? 'നേരെ താഴേക്ക് അമർത്തി: വായു കുടുങ്ങി' : 'Pushed Down Straight: Air Trapped!') :
               (language === 'ml' ? 'ചെരിച്ചപ്പോൾ: കുമിളകൾ പുറത്തേക്ക്!' : 'Tilted: Air Escapes as Bubbles!')}
            </span>
          </div>

          {/* Water Trough Container (Tank) */}
          <div className="relative w-72 h-64 border-4 border-slate-700 rounded-b-3xl bg-blue-50/60 overflow-hidden flex flex-col justify-end mt-12">
            
            {/* Water Level */}
            <div className="w-full h-44 bg-gradient-to-t from-blue-500/80 to-blue-400/70 border-t-2 border-blue-400 relative">
              <span className="absolute top-1 right-2 text-[10px] font-black text-blue-900 opacity-70">
                Water Level (ജലനിരപ്പ്)
              </span>

              {/* Escaping Bubbles when tilted */}
              {glassState === 'tilted' && (
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  <motion.div 
                    animate={{ y: [0, -80], opacity: [0, 1, 0], scale: [0.5, 1.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    className="text-2xl absolute"
                  >
                    🫧
                  </motion.div>
                  <motion.div 
                    animate={{ y: [10, -90], opacity: [0, 1, 0], scale: [0.6, 1.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                    className="text-3xl absolute left-20"
                  >
                    🫧
                  </motion.div>
                  <motion.div 
                    animate={{ y: [5, -75], opacity: [0, 1, 0], scale: [0.4, 1.1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                    className="text-xl absolute right-16"
                  >
                    🫧
                  </motion.div>
                </div>
              )}
            </div>

            {/* Inverted Glass Animation */}
            <motion.div
              animate={{
                y: glassState === 'outside' ? -130 : 10,
                rotate: glassState === 'tilted' ? 32 : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2 z-10 w-28 h-40 border-4 border-slate-800 rounded-t-2xl flex flex-col justify-between p-2 shadow-2xl"
              style={{
                backgroundColor: glassState === 'tilted' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.85)'
              }}
            >
              {/* Dry Paper Ball pinned at the bottom (top when inverted) */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center text-xs font-black shadow-sm ${
                  glassState === 'tilted' ? 'bg-blue-300 text-blue-950 line-through' : 'bg-amber-100 text-amber-900'
                }`}>
                  📄
                </div>
                <span className="text-[9px] font-black mt-0.5 text-slate-800">
                  {glassState === 'tilted' ? (language === 'ml' ? 'നനഞ്ഞ പേപ്പർ' : 'Wet Paper') : (language === 'ml' ? 'ഉണങ്ങിയ പേപ്പർ' : 'Dry Paper')}
                </span>
              </div>

              {/* Trapped Air Space or Inrushing Water */}
              <div className="text-center">
                {glassState === 'submerged_straight' ? (
                  <div className="p-1.5 rounded-lg bg-teal-100/90 border border-teal-300 text-[10px] font-black text-teal-950 animate-pulse">
                    💨 {language === 'ml' ? 'കുടുങ്ങിയ വായു!' : 'Trapped Air Pocket!'}
                  </div>
                ) : glassState === 'tilted' ? (
                  <div className="p-1 rounded-lg bg-blue-600 text-white text-[9px] font-bold">
                    💧 {language === 'ml' ? 'വെള്ളം കയറി' : 'Water Filled In'}
                  </div>
                ) : (
                  <div className="text-[10px] font-bold text-slate-500">
                    {language === 'ml' ? 'വായു നിറഞ്ഞിരിക്കുന്നു' : 'Air inside'}
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Interactive Step Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <button
              onClick={handleSubmergeStraight}
              disabled={glassState === 'submerged_straight'}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <ArrowDown className="w-4 h-4" />
              <span>{language === 'ml' ? '1. നേരെ താഴേക്ക് അമർത്തുക' : '1. Push Straight Down'}</span>
            </button>

            <button
              onClick={handleTiltGlass}
              disabled={glassState !== 'submerged_straight'}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
                glassState === 'submerged_straight'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <MoveDiagonal className="w-4 h-4" />
              <span>{language === 'ml' ? '2. ഗ്ലാസ്സ് ചെറുതായി ചെരിക്കുക' : '2. Tilt the Glass Slightly'}</span>
            </button>
          </div>

        </div>

        {/* Right: Explanatory Science Notes (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-3xl bg-white border border-vaayana-softBorder shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-black text-xs uppercase tracking-wide">
              <Wind className="w-4 h-4 text-teal-600" />
              <span>{language === 'ml' ? 'നിരീക്ഷണ ഫലം (Scientific Observation)' : 'Scientific Observation'}</span>
            </div>

            {glassState === 'outside' && (
              <p className="text-xs text-slate-700 font-medium leading-relaxed font-malayalam">
                {language === 'ml'
                  ? 'ഗ്ലാസ്സ് ശൂന്യമല്ല! കാണാൻ കഴിയില്ലെങ്കിലും അതിൽ നിറയെ വായുവുണ്ട്. ഗ്ലാസ്സിന്റെ അടിയിൽ ഡ്രൈ പേപ്പർ ഒട്ടിച്ചിരിക്കുന്നു.'
                  : 'The glass is not empty! Although invisible, it is full of air. A dry paper ball is stuck at the bottom.'}
              </p>
            )}

            {glassState === 'submerged_straight' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold font-malayalam flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === 'ml' 
                      ? 'പേപ്പർ ഒട്ടും നനഞ്ഞില്ല! ഗ്ലാസ്സിലെ വായു സ്ഥലം അപഹരിച്ചതിനാൽ വെള്ളത്തിന് അകത്തേക്ക് കടക്കാൻ കഴിഞ്ഞില്ല.'
                      : 'The paper stayed 100% dry! Because air occupies space inside the glass, water cannot enter.'}
                  </span>
                </div>
              </div>
            )}

            {glassState === 'tilted' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold font-malayalam flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    {language === 'ml'
                      ? 'ഗ്ലാസ്സ് ചെരിച്ചപ്പോൾ കുടുങ്ങിയ വായു കുമിളകളായി പുറത്തേക്ക് പോയി. വായു ഒഴിഞ്ഞ സ്ഥാനത്തേക്ക് വെള്ളം കയറി പേപ്പർ നനഞ്ഞു.'
                      : 'When tilted, trapped air escaped as bubbles. Water rushed into the space left by the air and wetted the paper.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Key Facts required by Syllabus */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950 font-medium font-malayalam">
            <div className="font-black text-amber-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              <span>{language === 'ml' ? 'വായുവിനെക്കുറിച്ച് ഓർക്കേണ്ടവ:' : 'Facts About Air:'}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900">
              <li>{language === 'ml' ? 'വായു വാതകാവസ്ഥയിലാണ് (Gaseous state).' : 'Air exists in the gaseous state.'}</li>
              <li>{language === 'ml' ? 'വായു സ്ഥലം അപഹരിക്കുന്നു (Air occupies space).' : 'Air occupies space.'}</li>
              <li>{language === 'ml' ? 'വീശുന്ന വായുവിനെ കാറ്റ് എന്ന് വിളിക്കുന്നു (Moving air is wind).' : 'Moving air is called wind.'}</li>
              <li>{language === 'ml' ? 'അന്തരീക്ഷ വായുവിൽ നീരാവിയും സൂക്ഷ്മ ജലകണികകളും അടങ്ങിയിരിക്കുന്നു.' : 'Air contains water vapour and tiny water droplets.'}</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

