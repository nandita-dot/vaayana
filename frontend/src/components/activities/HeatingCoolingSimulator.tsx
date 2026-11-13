import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playCorrectSound } from '../../services/soundService';
import { 
  Flame, 
  Snowflake, 
  Thermometer, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  RefreshCw,
  Sun,
  CloudRain
} from 'lucide-react';

type MatterState = 'solid' | 'liquid' | 'gas';

export const HeatingCoolingSimulator: React.FC = () => {
  const { language } = useLanguage();

  // Temperature ranges: -10 (ice) -> 25 (water) -> 100 (vapour)
  const [temperature, setTemperature] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Derived state of matter
  const currentState: MatterState = 
    temperature <= 0 ? 'solid' : 
    temperature >= 100 ? 'gas' : 'liquid';

  // Last process name
  const [lastProcess, setLastProcess] = useState<{
    nameEn: string;
    nameMl: string;
    type: 'heating' | 'cooling';
    descEn: string;
    descMl: string;
  }>({
    nameEn: 'At Freezing Point',
    nameMl: 'തുടക്ക അവസ്ഥ: ഐസ്',
    type: 'cooling',
    descEn: 'Water freezes into ice at 0°C.',
    descMl: '0°C-ൽ വെള്ളം ഉറഞ്ഞ് ഐസ് ആകുന്നു.'
  });

  const handleHeat = () => {
    playClickSound();
    setIsTransitioning(true);

    if (temperature <= 0) {
      // Ice -> Water (Melting / ദ്രവീകരണം)
      setTemperature(35);
      setLastProcess({
        nameEn: 'Melting (ദ്രവീകരണം)',
        nameMl: 'ദ്രവീകരണം (Melting)',
        type: 'heating',
        descEn: 'Ice absorbs heat and melts into liquid water.',
        descMl: 'ചൂടാക്കുമ്പോൾ ഐസ് ഉരുകി ദ്രാവകാവസ്ഥയിലുള്ള വെള്ളമായി മാറുന്നു.'
      });
    } else if (temperature < 100) {
      // Water -> Water Vapour (Evaporation / ബാഷ്പീകരണം)
      setTemperature(100);
      setLastProcess({
        nameEn: 'Evaporation / Boiling (ബാഷ്പീകരണം)',
        nameMl: 'ബാഷ്പീകരണം (Evaporation)',
        type: 'heating',
        descEn: 'Water changes into gaseous water vapour upon heating.',
        descMl: 'വെള്ളം ചൂടാകുമ്പോൾ നീരാവിയായി അന്തരീക്ഷത്തിലേക്ക് മാറുന്നു.'
      });
    }

    setTimeout(() => {
      setIsTransitioning(false);
      playCorrectSound();
    }, 500);
  };

  const handleCool = () => {
    playClickSound();
    setIsTransitioning(true);

    if (temperature >= 100) {
      // Water Vapour -> Water (Condensation / സാന്ദ്രീകരണം)
      setTemperature(40);
      setLastProcess({
        nameEn: 'Condensation (സാന്ദ്രീകരണം)',
        nameMl: 'സാന്ദ്രീകരണം (Condensation)',
        type: 'cooling',
        descEn: 'Water vapour cools down and condenses back into liquid water droplets.',
        descMl: 'തണുപ്പിക്കുമ്പോൾ നീരാവി തണുത്ത് വീണ്ടും വെള്ളമായി മാറുന്നു.'
      });
    } else if (temperature > 0) {
      // Water -> Ice (Freezing / ഖരീഭവനം)
      setTemperature(-5);
      setLastProcess({
        nameEn: 'Freezing (ഖരീഭവനം)',
        nameMl: 'ഖരീഭവനം (Freezing)',
        type: 'cooling',
        descEn: 'Water cools below 0°C and solidifies into ice.',
        descMl: 'വെള്ളം 0°C-ൽ താഴെ തണുക്കുമ്പോൾ ഖരരൂപത്തിലുള്ള ഐസ് ആയി മാറുന്നു.'
      });
    }

    setTimeout(() => {
      setIsTransitioning(false);
      playCorrectSound();
    }, 500);
  };

  const handleReset = () => {
    playClickSound();
    setTemperature(0);
    setLastProcess({
      nameEn: 'Reset to Ice (0°C)',
      nameMl: 'തുടക്ക അവസ്ഥ: ഐസ് (0°C)',
      type: 'cooling',
      descEn: 'Ready for heating experiments.',
      descMl: 'ചൂടാക്കൽ പരീക്ഷണം വീണ്ടും ആരംഭിക്കാൻ തയ്യാറാണ്.'
    });
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
            {language === 'ml' ? 'അവസ്ഥാന്തര സിമുലേറ്റർ (Heating & Cooling Simulator)' : 'Heating & Cooling State Transitions'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textDarkMuted">
            {language === 'ml' 
              ? 'ചൂടാക്കുമ്പോഴും തണുപ്പിക്കുമ്പോഴും ഐസ്, വെള്ളം, നീരാവി എന്നിവയുടെ മാറ്റങ്ങൾ പരീക്ഷിക്കുക.' 
              : 'Interactive thermal transitions between Ice (Solid), Water (Liquid), and Vapour (Gas).'}
          </p>
        </div>

        {/* Temperature Badge & Reset */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 rounded-2xl bg-vaayana-dark text-vaayana-lime font-mono font-black text-sm flex items-center gap-2 shadow-sm">
            <Thermometer className="w-5 h-5 text-vaayana-lime animate-pulse" />
            <span>{temperature}°C</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-vaayana-dark border border-vaayana-softBorder shadow-sm transition-all active:scale-95"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive Beaker / Thermal Stage (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-vaayana-softBorder shadow-inner flex flex-col items-center justify-center relative min-h-[350px]">
          
          {/* Active State Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-sm ${
              currentState === 'solid' ? 'bg-cyan-600' :
              currentState === 'liquid' ? 'bg-blue-600' : 'bg-amber-600'
            }`}>
              {currentState === 'solid' ? (language === 'ml' ? 'ഖരം (ഐസ്)' : 'Solid (Ice)') :
               currentState === 'liquid' ? (language === 'ml' ? 'ദ്രാവകം (വെള്ളം)' : 'Liquid (Water)') :
               (language === 'ml' ? 'വാതകം (നീരാവി)' : 'Gas (Water Vapour)')}
            </span>
          </div>

          {/* Thermal Graphic Representation */}
          <div className="relative w-64 h-64 flex items-center justify-center my-4">
            
            {/* SOLID (ICE CUBES) */}
            {currentState === 'solid' && (
              <motion.div
                key="ice"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="grid grid-cols-2 gap-2 p-4 bg-cyan-50 border-2 border-cyan-300 rounded-3xl shadow-md">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-300 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner">
                    🧊
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-200 to-cyan-400 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner">
                    🧊
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-200 to-cyan-400 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner">
                    🧊
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-300 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner">
                    🧊
                  </div>
                </div>
                <span className="text-xs font-extrabold text-cyan-900 bg-cyan-100 px-3 py-1 rounded-full">
                  {language === 'ml' ? 'കട്ടിയുള്ള രൂപം • ആകൃതി മാറുന്നില്ല' : 'Rigid Structure • Definite Shape'}
                </span>
              </motion.div>
            )}

            {/* LIQUID (WATER IN BEAKER) */}
            {currentState === 'liquid' && (
              <motion.div
                key="water"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-2 w-full"
              >
                <div className="w-48 h-44 rounded-b-3xl border-4 border-slate-700 bg-slate-50 relative overflow-hidden shadow-inner flex flex-col justify-end p-2">
                  <motion.div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-b-2xl h-28 relative"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute top-2 left-4 text-white text-xs opacity-80">💧 💧 💧</div>
                  </motion.div>
                </div>
                <span className="text-xs font-extrabold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                  {language === 'ml' ? 'ദ്രാവകം ഒഴുകുന്നു • പാത്രത്തിന്റെ ആകൃതി' : 'Flows Freely • Takes Container Shape'}
                </span>
              </motion.div>
            )}

            {/* GAS (STEAM / VAPOUR) */}
            {currentState === 'gas' && (
              <motion.div
                key="gas"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-2 w-full"
              >
                {/* Rising Steam Clouds */}
                <div className="flex gap-4">
                  <motion.div 
                    animate={{ y: [-10, -45], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    className="text-4xl"
                  >
                    💨
                  </motion.div>
                  <motion.div 
                    animate={{ y: [-15, -55], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                    className="text-4xl"
                  >
                    💨
                  </motion.div>
                  <motion.div 
                    animate={{ y: [-10, -45], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                    className="text-4xl"
                  >
                    💨
                  </motion.div>
                </div>

                <div className="w-44 h-24 rounded-b-3xl border-4 border-amber-600 bg-amber-50 relative flex items-center justify-center">
                  <span className="text-xs font-black text-amber-900">100°C Boiling Water</span>
                </div>

                <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                  {language === 'ml' ? 'വാതകാവസ്ഥ • വായുവിൽ പടരുന്നു' : 'Gaseous State • Expands in Air'}
                </span>
              </motion.div>
            )}

          </div>

          {/* Interactive Heat & Cool Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-2">
            <button
              onClick={handleHeat}
              disabled={temperature >= 100}
              className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 ${
                temperature >= 100
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
              }`}
            >
              <Flame className="w-5 h-5 fill-white" />
              <span>{language === 'ml' ? 'ചൂടാക്കുക (Heat 🔥)' : 'Heat (+Temp)'}</span>
            </button>

            <button
              onClick={handleCool}
              disabled={temperature <= -5}
              className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 ${
                temperature <= -5
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200'
              }`}
            >
              <Snowflake className="w-5 h-5" />
              <span>{language === 'ml' ? 'തണുപ്പിക്കുക (Cool ❄️)' : 'Cool (-Temp)'}</span>
            </button>
          </div>

        </div>

        {/* Right: Flowchart of 4 Transitions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Process Explainer Card */}
          <div className={`p-5 rounded-3xl border shadow-sm space-y-2 ${
            lastProcess.type === 'heating' ? 'bg-rose-50 border-rose-200' : 'bg-cyan-50 border-cyan-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                lastProcess.type === 'heating' ? 'bg-rose-600 text-white' : 'bg-cyan-600 text-white'
              }`}>
                {lastProcess.type === 'heating' ? <Flame className="w-4 h-4 fill-white" /> : <Snowflake className="w-4 h-4" />}
              </span>
              <h4 className="text-base font-black text-slate-900 font-malayalam">
                {language === 'ml' ? lastProcess.nameMl : lastProcess.nameEn}
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium font-malayalam">
              {language === 'ml' ? lastProcess.descMl : lastProcess.descEn}
            </p>
          </div>

          {/* Animated 4-Step Transition Flowchart Required by Syllabus */}
          <div className="p-5 rounded-3xl bg-white border border-vaayana-softBorder shadow-sm space-y-3">
            <h5 className="text-xs font-black text-vaayana-dark uppercase tracking-wider">
              {language === 'ml' ? 'അവസ്ഥാന്തര സൈക്കിൾ (State Transition Cycle)' : 'State Transition Cycle'}
            </h5>

            <div className="space-y-2.5 text-xs font-bold font-malayalam">
              
              {/* Step 1: Ice -> Water */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                currentState === 'liquid' && temperature <= 40 ? 'bg-amber-100 border-amber-400 text-amber-950 scale-102 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span>🧊 ഐസ് (Ice)</span>
                <span className="text-rose-600 font-black">ചൂടാക്കൽ ➔</span>
                <span>💧 വെള്ളം (Water)</span>
              </div>

              {/* Step 2: Water -> Vapour */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                currentState === 'gas' ? 'bg-amber-100 border-amber-400 text-amber-950 scale-102 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span>💧 വെള്ളം (Water)</span>
                <span className="text-rose-600 font-black">ചൂടാക്കൽ ➔</span>
                <span>💨 നീരാവി (Vapour)</span>
              </div>

              {/* Step 3: Vapour -> Water */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                lastProcess.nameEn.includes('Condensation') ? 'bg-cyan-100 border-cyan-400 text-cyan-950 scale-102 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span>💨 നീരാവി (Vapour)</span>
                <span className="text-cyan-600 font-black">തണുപ്പിക്കൽ ➔</span>
                <span>💧 വെള്ളം (Water)</span>
              </div>

              {/* Step 4: Water -> Ice */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                currentState === 'solid' ? 'bg-cyan-100 border-cyan-400 text-cyan-950 scale-102 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span>💧 വെള്ളം (Water)</span>
                <span className="text-cyan-600 font-black">തണുപ്പിക്കൽ ➔</span>
                <span>🧊 ഐസ് (Ice)</span>
              </div>

            </div>

            <p className="text-[11px] text-vaayana-textDarkMuted pt-1 leading-normal font-malayalam">
              {language === 'ml'
                ? 'ബാഷ്പീകരണം: ദ്രാവകം ചൂടായി നീരാവിയാകുന്ന പ്രക്രിയ. സാന്ദ്രീകരണം: നീരാവി തണുത്ത് വീണ്ടും വെള്ളമാകുന്ന പ്രക്രിയ.'
                : 'Evaporation: Liquid turning into vapour. Condensation: Vapour cooling into liquid.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

