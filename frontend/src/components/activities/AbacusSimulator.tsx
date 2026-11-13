import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calculator, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Minus,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

interface RodData {
  key: 'thousands' | 'hundreds' | 'tens' | 'ones';
  labelEn: string;
  labelMl: string;
  multiplier: number;
  color: string;
}

const RODS: RodData[] = [
  { key: 'thousands', labelEn: 'Thousands (Th)', labelMl: 'ആയിരങ്ങൾ', multiplier: 1000, color: '#EF4444' },
  { key: 'hundreds', labelEn: 'Hundreds (H)', labelMl: 'നൂറുകൾ', multiplier: 100, color: '#10B981' },
  { key: 'tens', labelEn: 'Tens (T)', labelMl: 'പത്തുകൾ', multiplier: 10, color: '#F59E0B' },
  { key: 'ones', labelEn: 'Ones (O)', labelMl: 'ഒന്നുകൾ', multiplier: 1, color: '#3B82F6' },
];

export const AbacusSimulator: React.FC = () => {
  const { language } = useLanguage();
  const [beadCounts, setBeadCounts] = useState<{ [key: string]: number }>({
    thousands: 0,
    hundreds: 4,
    tens: 5,
    ones: 8
  });

  const [challengeTarget, setChallengeTarget] = useState<number | null>(734);
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalValue = 
    beadCounts.thousands * 1000 + 
    beadCounts.hundreds * 100 + 
    beadCounts.tens * 10 + 
    beadCounts.ones * 1;

  const addBead = (rodKey: string) => {
    if (beadCounts[rodKey] < 9) {
      soundService.play('bead');
      setBeadCounts(prev => ({ ...prev, [rodKey]: prev[rodKey] + 1 }));
    }
  };

  const removeBead = (rodKey: string) => {
    if (beadCounts[rodKey] > 0) {
      soundService.play('bead');
      setBeadCounts(prev => ({ ...prev, [rodKey]: prev[rodKey] - 1 }));
    }
  };

  const setExactBeads = (th: number, h: number, t: number, o: number) => {
    soundService.play('click');
    setBeadCounts({ thousands: th, hundreds: h, tens: t, ones: o });
  };

  const clearAbacus = () => {
    soundService.play('click');
    setBeadCounts({ thousands: 0, hundreds: 0, tens: 0, ones: 0 });
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (challengeTarget !== null) {
      if (totalValue === challengeTarget) {
        soundService.play('correct');
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        setFeedback(language === 'ml' ? 'ശരിയാണ്! വെരി ഗുഡ്!' : 'Correct! Challenge Solved!');
      } else {
        soundService.play('incorrect');
        setFeedback(language === 'ml' 
          ? `ശ്രമിക്കൂ! നിലവിലെ സംഖ്യ: ${totalValue}. ലക്ഷ്യം: ${challengeTarget}` 
          : `Try again! Current is ${totalValue}, target is ${challengeTarget}`);
      }
    }
  };

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
              {language === 'ml' ? 'അബാക്കസ് സിമുലേറ്റർ (Abacus Simulator)' : 'Interactive Classroom Abacus'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'മണികൾ തൊട്ട് സ്ഥാനവിലയും സംഖ്യകളും കണ്ടെത്താം' : 'Touch or click beads to build numbers with place values'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setChallengeTarget(Math.floor(Math.random() * 900) + 100)}
            className="px-3.5 py-2 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder text-vaayana-lime hover:bg-vaayana-darkBorder text-xs font-bold transition-all"
          >
            {language === 'ml' ? 'പുതിയ ചലഞ്ച് ➔' : 'New Target ➔'}
          </button>
          <button
            onClick={clearAbacus}
            className="p-2 rounded-xl bg-vaayana-dark text-vaayana-textLightMuted hover:text-vaayana-textLight"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Abacus Stage */}
      <div className="bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card space-y-8">
        
        {/* Dynamic Display of Represented Number */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-vaayana-dark border border-vaayana-darkBorder text-center sm:text-left">
          <div>
            <span className="text-xs font-bold text-vaayana-textLightMuted uppercase tracking-wider block">
              {language === 'ml' ? 'അബാക്കസ് കാണിക്കുന്ന സംഖ്യ:' : 'Number on Abacus:'}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-vaayana-lime font-mono tracking-tight mt-1">
              {totalValue}
            </div>
          </div>

          {/* Place Value Expansion Equation */}
          <div className="text-xs sm:text-sm font-bold text-vaayana-textLight font-mono bg-vaayana-darkElevated px-4 py-3 rounded-2xl border border-vaayana-darkBorder">
            {beadCounts.thousands > 0 && <span className="text-rose-400">{beadCounts.thousands * 1000} + </span>}
            <span className="text-emerald-400">{beadCounts.hundreds * 100}</span> +{' '}
            <span className="text-amber-400">{beadCounts.tens * 10}</span> +{' '}
            <span className="text-blue-400">{beadCounts.ones * 1}</span>
            {' = '}<span className="text-vaayana-lime font-black text-base">{totalValue}</span>
          </div>
        </div>

        {/* Target Challenge Prompt if active */}
        {challengeTarget !== null && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="text-xs sm:text-sm font-bold text-amber-950 font-malayalam">
                {language === 'ml' ? `ലക്ഷ്യം: അബാക്കസിൽ ${challengeTarget} ഉണ്ടാക്കുക!` : `Target: Place beads to form ${challengeTarget}!`}
              </span>
            </div>
            <button
              onClick={checkAnswer}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs active:scale-95 transition-all shadow-sm"
            >
              {language === 'ml' ? 'ശരിയാണോ എന്ന് നോക്കുക' : 'Check Answer'}
            </button>
          </div>
        )}

        {feedback && (
          <div className="p-3 bg-vaayana-dark text-vaayana-lime rounded-xl text-center text-xs font-bold font-malayalam">
            {feedback}
          </div>
        )}

        {/* The Abacus Frame with Rods and Beads */}
        <div className="relative w-full max-w-2xl mx-auto bg-[#2E1F14] rounded-3xl border-8 border-[#1C120A] shadow-[0_12px_24px_rgba(0,0,0,0.4)] p-6 select-none">
          
          {/* Top Wooden Beam */}
          <div className="w-full h-4 bg-[#4A3222] rounded mb-6 border-b border-[#1C120A] shadow-inner" />

          {/* Columns Grid */}
          <div className="grid grid-cols-4 gap-4 items-stretch relative min-h-[300px]">
            {RODS.map(rod => {
              const count = beadCounts[rod.key];
              return (
                <div key={rod.key} className="flex flex-col items-center justify-between relative">
                  
                  {/* Metal Rod (Vertical line) */}
                  <div className="absolute top-0 bottom-0 w-1.5 bg-gradient-to-r from-slate-400 via-white to-slate-500 rounded shadow" />

                  {/* Top Add Button */}
                  <button
                    onClick={() => addBead(rod.key)}
                    disabled={count >= 9}
                    className="relative z-10 w-9 h-9 rounded-full bg-vaayana-dark hover:bg-black disabled:opacity-30 border border-vaayana-darkBorder text-vaayana-lime flex items-center justify-center font-black text-sm active:scale-95 shadow-sm"
                    title="Add Bead"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Beads Container (Up to 9 beads stacked vertically) */}
                  <div className="relative z-10 flex-1 flex flex-col-reverse items-center justify-start py-4 gap-1 w-full">
                    {Array.from({ length: count }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.6, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-12 sm:w-16 h-6 rounded-full border-2 border-black/40 shadow-[0_3px_6px_rgba(0,0,0,0.5)] cursor-pointer"
                        style={{ backgroundColor: rod.color }}
                        onClick={() => removeBead(rod.key)}
                        title="Click to remove bead"
                      />
                    ))}
                  </div>

                  {/* Bottom Remove Button */}
                  <button
                    onClick={() => removeBead(rod.key)}
                    disabled={count <= 0}
                    className="relative z-10 w-9 h-9 rounded-full bg-vaayana-dark hover:bg-black disabled:opacity-30 border border-vaayana-darkBorder text-rose-400 flex items-center justify-center font-black text-sm active:scale-95 shadow-sm mt-2"
                    title="Remove Bead"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                </div>
              );
            })}
          </div>

          {/* Bottom Wooden Base */}
          <div className="w-full h-5 bg-[#4A3222] rounded mt-6 border-t border-[#1C120A] shadow-inner" />

          {/* Rod Labels at Bottom */}
          <div className="grid grid-cols-4 gap-4 mt-4 text-center">
            {RODS.map(rod => (
              <div key={rod.key} className="space-y-1">
                <span className="text-xl font-black text-vaayana-lime font-mono block">
                  {beadCounts[rod.key]}
                </span>
                <span className="text-[11px] font-black text-amber-100 font-malayalam block">
                  {language === 'ml' ? rod.labelMl : rod.labelEn}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Quick Pre-set Buttons for Classroom Demonstration */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-bold text-vaayana-textDarkMuted mr-2">
            {language === 'ml' ? 'ഉദാഹരണങ്ങൾ കാണാം:' : 'Demonstrate:'}
          </span>
          <button
            onClick={() => setExactBeads(0, 3, 6, 3)}
            className="px-3 py-1.5 rounded-xl bg-vaayana-dark text-vaayana-lime text-xs font-bold font-mono active:scale-95"
          >
            363
          </button>
          <button
            onClick={() => setExactBeads(1, 0, 0, 0)}
            className="px-3 py-1.5 rounded-xl bg-vaayana-dark text-vaayana-lime text-xs font-bold font-mono active:scale-95"
          >
            1000
          </button>
          <button
            onClick={() => setExactBeads(0, 7, 5, 0)}
            className="px-3 py-1.5 rounded-xl bg-vaayana-dark text-vaayana-lime text-xs font-bold font-mono active:scale-95"
          >
            750
          </button>
          <button
            onClick={() => setExactBeads(0, 9, 9, 9)}
            className="px-3 py-1.5 rounded-xl bg-vaayana-dark text-vaayana-lime text-xs font-bold font-mono active:scale-95"
          >
            999
          </button>
        </div>

      </div>
    </div>
  );
};
