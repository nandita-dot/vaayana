import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  RotateCcw, 
  Layers, 
  ArrowRight,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NumberPair {
  numA: number;
  numB: number;
  labelEn: string;
  labelMl: string;
}

const PRESET_PAIRS: NumberPair[] = [
  { numA: 500, numB: 500, labelEn: '500 + 500 (Equal Halves)', labelMl: '500 + 500 (തുല്യ പകുതികൾ)' },
  { numA: 600, numB: 400, labelEn: '600 + 400 (Hundreds)', labelMl: '600 + 400 (നൂറുകൾ)' },
  { numA: 700, numB: 300, labelEn: '700 + 300', labelMl: '700 + 300' },
  { numA: 250, numB: 750, labelEn: '250 + 750 (Quarters & Three-Quarters)', labelMl: '250 + 750 (കാലും മുക്കാലും)' },
  { numA: 125, numB: 875, labelEn: '125 + 875 (Eighths)', labelMl: '125 + 875' },
  { numA: 550, numB: 450, labelEn: '550 + 450', labelMl: '550 + 450' },
  { numA: 999, numB: 1, labelEn: '999 + 1 (Largest 3-digit + 1)', labelMl: '999 + 1 (വലിയ മൂന്നക്ക സംഖ്യ + 1)' }
];

export const NumberPairExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPair, setSelectedPair] = useState<NumberPair>(PRESET_PAIRS[0]);
  const [customA, setCustomA] = useState<number>(400);

  const customB = Math.max(0, 1000 - customA);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCustomA(val);
  };

  const handlePresetSelect = (pair: NumberPair) => {
    setSelectedPair(pair);
    setCustomA(pair.numA);
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime/20 border border-vaayana-lime/40 flex items-center justify-center text-vaayana-lime font-black">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'സംഖ്യാ ജോടികൾ (Number Pairs to 1000)' : 'Number Pairs Explorer: Target 1000'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? '1000 തികയ്ക്കുന്ന വിവിധ സംഖ്യാ കൂട്ടുകളെ ദൃശ്യമായി കാണാം' : 'Discover complementary pairs of numbers that produce exactly 1000'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Bar Representation Box */}
      <div className="bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card space-y-8">
        
        {/* Dynamic Formula Display */}
        <div className="p-6 rounded-3xl bg-vaayana-dark border border-vaayana-darkBorder text-center space-y-2">
          <span className="text-xs font-mono font-bold text-vaayana-lime uppercase tracking-wider block">
            {language === 'ml' ? 'സംഖ്യാ സമവാക്യം' : 'Addition Formula'}
          </span>
          <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-3">
            <span className="text-sky-400">{customA}</span>
            <span className="text-vaayana-textLightMuted">+</span>
            <span className="text-amber-400">{customB}</span>
            <span className="text-vaayana-textLightMuted">=</span>
            <span className="text-vaayana-lime">1000</span>
          </div>
        </div>

        {/* Visual 1000-Unit Dual Color Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-mono font-bold text-vaayana-textDarkMuted px-1">
            <span>0</span>
            <span>250</span>
            <span>500</span>
            <span>750</span>
            <span>1000</span>
          </div>

          <div className="h-16 sm:h-20 w-full bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-inner overflow-hidden flex items-stretch p-1 relative">
            {/* Left portion (A) */}
            <motion.div
              style={{ width: `${(customA / 1000) * 100}%` }}
              className="bg-gradient-to-r from-sky-500 to-sky-400 h-full rounded-2xl flex items-center justify-center font-mono font-black text-white text-base sm:text-xl shadow transition-all relative overflow-hidden"
            >
              {customA >= 100 && <span>{customA}</span>}
            </motion.div>

            {/* Right portion (B) */}
            <motion.div
              style={{ width: `${(customB / 1000) * 100}%` }}
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-2xl flex items-center justify-center font-mono font-black text-amber-950 text-base sm:text-xl shadow transition-all relative overflow-hidden ml-1"
            >
              {customB >= 100 && <span>{customB}</span>}
            </motion.div>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="space-y-2 max-w-lg mx-auto text-center">
          <input
            type="range"
            min="0"
            max="1000"
            step="25"
            value={customA}
            onChange={handleSliderChange}
            className="w-full accent-[#9ACD32] h-3 bg-vaayana-soft rounded-lg cursor-pointer"
          />
          <span className="text-xs font-bold text-vaayana-textDarkMuted block">
            {language === 'ml' ? 'സ്ലൈഡർ നീക്കി സംഖ്യാ ജോടികൾ മാറ്റാം' : 'Drag slider to dynamically balance the two numbers to 1000'}
          </span>
        </div>

        {/* Preset Pairs Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-vaayana-textDark font-malayalam">
            {language === 'ml' ? 'പ്രധാന സംഖ്യാ ജോടികൾ (Standard SCERT Pairs):' : 'Key Curriculum Pairs:'}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {PRESET_PAIRS.map((pair, idx) => {
              const isSelected = customA === pair.numA && customB === pair.numB;
              return (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(pair)}
                  className={`p-3.5 rounded-2xl text-left border transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-vaayana-dark text-vaayana-lime border-vaayana-lime shadow-soft'
                      : 'bg-vaayana-soft hover:bg-vaayana-softBorder border-vaayana-softBorder text-vaayana-textDark'
                  }`}
                >
                  <span className="font-mono font-black text-sm block">
                    {pair.numA} + {pair.numB} = 1000
                  </span>
                  <span className="text-[10px] font-bold text-vaayana-textDarkMuted font-malayalam block mt-0.5 line-clamp-1">
                    {language === 'ml' ? pair.labelMl : pair.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
