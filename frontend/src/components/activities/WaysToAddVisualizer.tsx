import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WaysToAddVisualizer: React.FC = () => {
  const { language } = useLanguage();
  const [activeStrategy, setActiveStrategy] = useState<'place_value' | 'step_by_step' | 'multiplication' | 'abacus'>('place_value');

  // Interactive challenge mode: ways to make 1000 or 500
  const [userParts, setUserParts] = useState<number[]>([200, 300, 500]);
  const [customInput, setCustomInput] = useState('');

  const targetSum = 1089; // 363 + 363 + 363

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime/20 border border-vaayana-lime/40 flex items-center justify-center text-vaayana-lime font-black">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'കൂട്ടാൻ പല വഴികൾ (Different Ways to Add)' : 'Different Ways to Add: Three 363s'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? '363 + 363 + 363 എന്ന കണക്ക് പല രീതിയിൽ കൂട്ടാം' : 'Explore multiple addition strategies for 363 + 363 + 363'}
            </p>
          </div>
        </div>

        {/* Strategy Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder overflow-x-auto">
          <button
            onClick={() => setActiveStrategy('place_value')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStrategy === 'place_value'
                ? 'bg-vaayana-lime text-vaayana-dark font-black'
                : 'text-vaayana-textLightMuted hover:text-vaayana-textLight'
            }`}
          >
            {language === 'ml' ? 'സ്ഥാനവില വഴി' : 'Place Value'}
          </button>
          <button
            onClick={() => setActiveStrategy('multiplication')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStrategy === 'multiplication'
                ? 'bg-vaayana-lime text-vaayana-dark font-black'
                : 'text-vaayana-textLightMuted hover:text-vaayana-textLight'
            }`}
          >
            {language === 'ml' ? 'ഗുണനം വഴി' : 'Multiplication'}
          </button>
          <button
            onClick={() => setActiveStrategy('step_by_step')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStrategy === 'step_by_step'
                ? 'bg-vaayana-lime text-vaayana-dark font-black'
                : 'text-vaayana-textLightMuted hover:text-vaayana-textLight'
            }`}
          >
            {language === 'ml' ? 'ഘട്ടം ഘട്ടമായി' : 'Step-by-Step'}
          </button>
          <button
            onClick={() => setActiveStrategy('abacus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStrategy === 'abacus'
                ? 'bg-vaayana-lime text-vaayana-dark font-black'
                : 'text-vaayana-textLightMuted hover:text-vaayana-textLight'
            }`}
          >
            {language === 'ml' ? 'അബാക്കസ്' : 'Abacus'}
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card space-y-8">
        
        {/* Core Equation Banner */}
        <div className="p-6 rounded-3xl bg-vaayana-dark border border-vaayana-darkBorder text-center space-y-2">
          <span className="text-xs font-mono font-bold text-vaayana-lime uppercase tracking-wider block">
            {language === 'ml' ? 'പാഠപുസ്തകത്തിലെ കണക്ക് (SCERT Problem):' : 'SCERT Core Addition Problem:'}
          </span>
          <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-3">
            <span className="text-amber-400">363</span>
            <span className="text-vaayana-textLightMuted">+</span>
            <span className="text-amber-400">363</span>
            <span className="text-vaayana-textLightMuted">+</span>
            <span className="text-amber-400">363</span>
            <span className="text-vaayana-textLightMuted">=</span>
            <span className="text-vaayana-lime">1089</span>
          </div>
        </div>

        {/* Dynamic Strategy Demonstrations */}
        <div className="min-h-[220px]">
          
          {/* Strategy 1: Place Value Breakdown */}
          {activeStrategy === 'place_value' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-black text-vaayana-textDark font-malayalam">
                {language === 'ml' ? 'രീതി 1: സ്ഥാനവിലകൾ വേർതിരിച്ച് കൂട്ടാം' : 'Strategy 1: Place Value Decomposition'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <span className="text-xs font-black text-emerald-800 uppercase block">
                    {language === 'ml' ? 'നൂറുകൾ (Hundreds)' : 'Hundreds'}
                  </span>
                  <div className="text-2xl font-mono font-black text-emerald-950">
                    300 + 300 + 300
                  </div>
                  <div className="text-xl font-mono font-black text-emerald-700">
                    = 900
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-2">
                  <span className="text-xs font-black text-amber-800 uppercase block">
                    {language === 'ml' ? 'പത്തുകൾ (Tens)' : 'Tens'}
                  </span>
                  <div className="text-2xl font-mono font-black text-amber-950">
                    60 + 60 + 60
                  </div>
                  <div className="text-xl font-mono font-black text-amber-700">
                    = 180
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-sky-50 border border-sky-200 text-center space-y-2">
                  <span className="text-xs font-black text-sky-800 uppercase block">
                    {language === 'ml' ? 'ഒന്നുകൾ (Ones)' : 'Ones'}
                  </span>
                  <div className="text-2xl font-mono font-black text-sky-950">
                    3 + 3 + 3
                  </div>
                  <div className="text-xl font-mono font-black text-sky-700">
                    = 9
                  </div>
                </div>
              </div>

              {/* Total Combination Row */}
              <div className="p-4 rounded-2xl bg-vaayana-soft border border-vaayana-softBorder text-center font-mono font-black text-lg sm:text-xl text-vaayana-textDark">
                900 + 180 + 9 = <span className="text-vaayana-limeDark font-black">1089</span>
              </div>
            </motion.div>
          )}

          {/* Strategy 2: Multiplication Shortcut */}
          {activeStrategy === 'multiplication' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder text-center space-y-4"
            >
              <h4 className="text-lg font-black text-vaayana-textDark font-malayalam">
                {language === 'ml' ? 'രീതി 2: ഒരേ സംഖ്യ ആവർത്തിച്ചു കൂട്ടുമ്പോൾ ഗുണിക്കാം' : 'Strategy 2: Repeated Addition is Multiplication'}
              </h4>
              <p className="text-sm text-vaayana-textDarkMuted max-w-lg mx-auto">
                {language === 'ml' 
                  ? '363 എന്ന സംഖ്യ 3 തവണ ആവർത്തിച്ച് കൂട്ടിയിരിക്കുന്നു. അതിനാൽ 363 നെ 3 കൊണ്ട് ഗുണിച്ചാലും ഇതേ ഉത്തരം കിട്ടും!' 
                  : '363 is added 3 times. So 363 × 3 yields the exact same answer quickly!'}
              </p>
              <div className="text-4xl sm:text-5xl font-black font-mono text-vaayana-limeDark py-3">
                363 × 3 = 1089
              </div>
            </motion.div>
          )}

          {/* Strategy 3: Step-by-Step Addition */}
          {activeStrategy === 'step_by_step' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="p-6 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder text-center space-y-2">
                <span className="text-xs font-black text-vaayana-textDarkMuted uppercase block">
                  {language === 'ml' ? 'ഘട്ടം 1: ആദ്യ രണ്ട് സംഖ്യകൾ കൂട്ടുക' : 'Step 1: Add first two 363s'}
                </span>
                <div className="text-3xl font-mono font-black text-vaayana-textDark">
                  363 + 363 = 726
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder text-center space-y-2">
                <span className="text-xs font-black text-vaayana-textDarkMuted uppercase block">
                  {language === 'ml' ? 'ഘട്ടം 2: മൂന്നാമത്തെ സംഖ്യ കൂട്ടുക' : 'Step 2: Add third 363 to 726'}
                </span>
                <div className="text-3xl font-mono font-black text-vaayana-limeDark">
                  726 + 363 = 1089
                </div>
              </div>
            </motion.div>
          )}

          {/* Strategy 4: Abacus Representation */}
          {activeStrategy === 'abacus' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-vaayana-dark border border-vaayana-darkBorder text-vaayana-textLight text-center space-y-4"
            >
              <span className="text-xs font-mono font-bold text-vaayana-lime uppercase block">
                {language === 'ml' ? '1089 അബാക്കസിൽ രേഖപ്പെടുത്തുമ്പോൾ:' : '1089 on Abacus Columns:'}
              </span>

              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-rose-500/40">
                  <span className="text-3xl font-black text-rose-400 font-mono block">1</span>
                  <span className="text-[11px] text-vaayana-textLightMuted font-bold">1000 (Th)</span>
                </div>
                <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-emerald-500/40">
                  <span className="text-3xl font-black text-emerald-400 font-mono block">0</span>
                  <span className="text-[11px] text-vaayana-textLightMuted font-bold">0 (H)</span>
                </div>
                <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-amber-500/40">
                  <span className="text-3xl font-black text-amber-400 font-mono block">8</span>
                  <span className="text-[11px] text-vaayana-textLightMuted font-bold">80 (T)</span>
                </div>
                <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-blue-500/40">
                  <span className="text-3xl font-black text-blue-400 font-mono block">9</span>
                  <span className="text-[11px] text-vaayana-textLightMuted font-bold">9 (O)</span>
                </div>
              </div>
              <p className="text-xs text-vaayana-textLightMuted font-malayalam">
                ആയിരത്തിൽ 1 മണി, നൂറിൽ മണികളില്ല, പത്തിൽ 8 മണികൾ, ഒന്നിൽ 9 മണികൾ!
              </p>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
