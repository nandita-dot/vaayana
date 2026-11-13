import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calculator, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

interface SubtractionProblem {
  minuend: number;
  subtrahend: number;
  result: number;
  needsRegrouping: boolean;
}

const PROBLEMS: SubtractionProblem[] = [
  { minuend: 352, subtrahend: 128, result: 224, needsRegrouping: true },
  { minuend: 546, subtrahend: 231, result: 315, needsRegrouping: false },
  { minuend: 624, subtrahend: 285, result: 339, needsRegrouping: true },
  { minuend: 430, subtrahend: 175, result: 255, needsRegrouping: true }
];

export const AbacusSubtraction: React.FC = () => {
  const { language } = useLanguage();

  const [problemIdx, setProblemIdx] = useState(0);
  const currentProblem = PROBLEMS[problemIdx];

  // Abacus state (Th, H, T, O)
  // For 352: Th=0, H=3, T=5, O=2
  const getDigits = (num: number) => ({
    thousands: Math.floor((num % 10000) / 1000),
    hundreds: Math.floor((num % 1000) / 100),
    tens: Math.floor((num % 100) / 10),
    ones: num % 10
  });

  const [beadCounts, setBeadCounts] = useState<{ [key: string]: number }>({
    thousands: 0,
    hundreds: 3,
    tens: 5,
    ones: 2
  });

  // Step-by-step demonstration state (0 to 4)
  const [step, setStep] = useState<number>(0);
  const [isRegrouped, setIsRegrouped] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalValue = 
    beadCounts.thousands * 1000 + 
    beadCounts.hundreds * 100 + 
    beadCounts.tens * 10 + 
    beadCounts.ones;

  const handleReset = () => {
    soundService.play('click');
    const d = getDigits(currentProblem.minuend);
    setBeadCounts(d);
    setStep(0);
    setIsRegrouped(false);
    setFeedback(null);
  };

  const handleNextProblem = () => {
    soundService.play('click');
    const nextIdx = (problemIdx + 1) % PROBLEMS.length;
    setProblemIdx(nextIdx);
    const d = getDigits(PROBLEMS[nextIdx].minuend);
    setBeadCounts(d);
    setStep(0);
    setIsRegrouped(false);
    setFeedback(null);
  };

  // Step 1: Check Ones column
  // Step 2: Regroup 1 Ten into 10 Ones
  // Step 3: Subtract Ones
  // Step 4: Subtract Tens & Hundreds -> Final!
  const advanceStep = () => {
    soundService.play('click');
    if (step === 0) {
      // Show dilemma: 2 - 8 cannot be done without regrouping
      setStep(1);
    } else if (step === 1) {
      // Perform regrouping! 1 Ten -> 10 Ones
      soundService.play('bead');
      setIsRegrouped(true);
      setBeadCounts(prev => ({
        ...prev,
        tens: Math.max(0, prev.tens - 1),
        ones: prev.ones + 10
      }));
      setStep(2);
    } else if (step === 2) {
      // Remove 8 Ones
      soundService.play('bead');
      setBeadCounts(prev => ({
        ...prev,
        ones: Math.max(0, prev.ones - 8)
      }));
      setStep(3);
    } else if (step === 3) {
      // Remove 2 Tens & 1 Hundred
      soundService.play('bead');
      setBeadCounts(prev => ({
        ...prev,
        tens: Math.max(0, prev.tens - 2),
        hundreds: Math.max(0, prev.hundreds - 1)
      }));
      setStep(4);
      soundService.play('celebration');
      try {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const removeManualBead = (rodKey: string) => {
    if (beadCounts[rodKey] > 0) {
      soundService.play('bead');
      setBeadCounts(prev => ({ ...prev, [rodKey]: prev[rodKey] - 1 }));
    }
  };

  const addManualBead = (rodKey: string) => {
    if (beadCounts[rodKey] < 15) {
      soundService.play('bead');
      setBeadCounts(prev => ({ ...prev, [rodKey]: prev[rodKey] + 1 }));
    }
  };

  const RODS = [
    { key: 'thousands', labelEn: 'Thousands (Th)', labelMl: 'ആയിരങ്ങൾ', mult: 1000, color: '#EF4444' },
    { key: 'hundreds', labelEn: 'Hundreds (H)', labelMl: 'നൂറുകൾ', mult: 100, color: '#10B981' },
    { key: 'tens', labelEn: 'Tens (T)', labelMl: 'പത്തുകൾ', mult: 10, color: '#F59E0B' },
    { key: 'ones', labelEn: 'Ones (O)', labelMl: 'ഒന്നുകൾ', mult: 1, color: '#3B82F6' }
  ];

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Top Banner */}
      <div className="bg-vaayana-darkSurface p-4 sm:p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-400 text-rose-950 uppercase tracking-wider">
              {language === 'ml' ? 'പ്രവർത്തനം 1' : 'Activity 1'}
            </span>
            <span className="text-xs font-bold text-vaayana-textLightMuted">
              Class 4 Mathematics • Chapter 6
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-1 font-malayalam">
            {language === 'ml' ? 'അബാക്കസ് ഉപയോഗിച്ച് കുറയ്ക്കൽ (Subtraction Using Abacus)' : 'Subtraction Using Abacus'}
          </h2>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted mt-1">
            {language === 'ml'
              ? 'സ്ഥാനവില അടിസ്ഥാനമാക്കി മുത്തുകൾ മാറ്റി കുറയ്ക്കുന്നതും കൂട്ടം മാറ്റലും (Regrouping) കാണുക.'
              : 'Interactive bead removal, borrowing and place-value regrouping for standard subtraction.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-bold text-xs border border-vaayana-darkBorder transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-vaayana-lime" />
            <span>{language === 'ml' ? 'ആദ്യപടിയാക്കുക' : 'Reset'}</span>
          </button>

          <button
            onClick={handleNextProblem}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-xs shadow-limeGlow transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{language === 'ml' ? 'പുതിയ കണക്ക്' : 'New Problem'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: The Subtraction Abacus Board (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-vaayana-softSurface border border-vaayana-softBorder shadow-card space-y-6">
          
          {/* Problem Display Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">തുടക്കസംഖ്യ</span>
                <div className="text-2xl sm:text-3xl font-black text-navy-900 font-mono">
                  {currentProblem.minuend}
                </div>
              </div>
              <span className="text-3xl font-black text-rose-500">−</span>
              <div className="text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">കുറയ്ക്കേണ്ടത്</span>
                <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
                  {currentProblem.subtrahend}
                </div>
              </div>
              <span className="text-3xl font-black text-slate-400">=</span>
              <div className="text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">ബാക്കി (Current)</span>
                <div className={`text-2xl sm:text-3xl font-black font-mono ${
                  totalValue === currentProblem.result ? 'text-emerald-600' : 'text-slate-800'
                }`}>
                  {totalValue}
                </div>
              </div>
            </div>

            {totalValue === currentProblem.result && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ml' ? 'ശരിയുത്തരം!' : 'Solved!'}</span>
              </span>
            )}
          </div>

          {/* Abacus Stand Graphic */}
          <div className="p-6 rounded-3xl bg-slate-900 border-4 border-amber-900/80 shadow-2xl space-y-6">
            
            {/* 4 Rods Frame */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 pt-4 min-h-[260px] relative items-end pb-4 border-b-8 border-amber-950 rounded-b-xl">
              {RODS.map((rod) => {
                const count = beadCounts[rod.key] || 0;
                return (
                  <div key={rod.key} className="flex flex-col items-center relative">
                    
                    {/* Metal Rod Spine */}
                    <div className="absolute top-0 bottom-0 w-2 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-full z-0" />

                    {/* Stack of Beads */}
                    <div className="flex flex-col-reverse items-center gap-1.5 z-10 w-full mb-1">
                      {Array.from({ length: count }).map((_, bIdx) => (
                        <motion.div
                          key={bIdx}
                          initial={{ scale: 0.8, y: -20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-10 sm:w-14 h-5 sm:h-6 rounded-full shadow-md border border-white/40 flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95"
                          style={{
                            background: `linear-gradient(180deg, ${rod.color} 0%, #000000 120%)`
                          }}
                          onClick={() => removeManualBead(rod.key)}
                          title="Click to remove bead"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Bead Count Badge */}
                    <div className="z-10 mt-2 px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-sm sm:text-base font-black">
                      {count}
                    </div>

                    {/* Rod Label */}
                    <div className="text-center mt-2">
                      <div className="text-xs font-black text-vaayana-lime uppercase tracking-wider font-mono">
                        {rod.key[0].toUpperCase()}
                      </div>
                      <div className="text-[10px] text-slate-300 font-malayalam">
                        {language === 'ml' ? rod.labelMl : rod.labelEn.split(' ')[0]}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick Interactive Bead Helpers */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-1">
              <span>{language === 'ml' ? 'മുത്തുകൾ തൊട്ട് മാറ്റാം (Tap bead to remove)' : 'Tap any bead to remove'}</span>
              <span>10 Ones = 1 Ten (പത്ത്)</span>
            </div>

          </div>

        </div>

        {/* Right: Step-by-Step Regrouping Walkthrough (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder shadow-darkCard space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-vaayana-lime" />
              <h3 className="text-lg font-black text-vaayana-textLight font-malayalam">
                {language === 'ml' ? 'കുറയ്ക്കൽ ഘട്ടങ്ങൾ (Step-by-Step)' : 'Guided Regrouping'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-vaayana-lime bg-vaayana-dark px-2.5 py-1 rounded-lg border border-vaayana-darkBorder">
              Step {step + 1} / 5
            </span>
          </div>

          {/* Current Step Guidance Card */}
          <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-darkBorder space-y-3">
            
            {step === 0 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-vaayana-lime uppercase tracking-wider">
                  {language === 'ml' ? 'ഘട്ടം 1: ഒന്നുകളുടെ സ്ഥാനം' : 'Step 1: Inspect Ones Column'}
                </span>
                <p className="text-sm text-vaayana-textLight font-malayalam leading-relaxed">
                  {language === 'ml'
                    ? '352 ൽ 2 ഒന്നുകളാണുള്ളത്. നമുക്ക് 128 ലെ 8 ഒന്നുകൾ കുറയ്ക്കണം. 2 ൽ നിന്ന് 8 കുറയ്ക്കാൻ കഴിയുമോ? ഇല്ല!'
                    : 'We have 2 ones in 352, but need to subtract 8 ones. We cannot subtract 8 from 2 directly!'}
                </p>
                <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800 text-amber-300 text-xs font-bold">
                  {language === 'ml'
                    ? 'പത്തുകളുടെ സ്ഥാനത്തുനിന്ന് ഒരു പത്ത് കടമെടുത്ത് (Regroup) 10 ഒന്നുകളാക്കി മാറ്റണം!'
                    : 'We must exchange 1 Ten for 10 Ones!'}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-vaayana-lime uppercase tracking-wider">
                  {language === 'ml' ? 'ഘട്ടം 2: കൂട്ടം മാറ്റൽ (Regrouping)' : 'Step 2: Regroup 1 Ten into 10 Ones'}
                </span>
                <p className="text-sm text-vaayana-textLight font-malayalam leading-relaxed">
                  {language === 'ml'
                    ? 'പത്തുകളുടെ സ്ഥാനത്തെ 5 മുത്തുകളിൽ നിന്ന് 1 മുത്തെടുത്ത് ഒന്നുകളുടെ സ്ഥാനത്ത് 10 മുത്തുകൾ ചേർക്കുക. ഇപ്പോൾ: 4 പത്തുകളും 12 ഒന്നുകളും!'
                    : 'Exchange 1 bead from Tens (5 becomes 4) for 10 beads in Ones (2 becomes 12)!'}
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-vaayana-lime uppercase tracking-wider">
                  {language === 'ml' ? 'ഘട്ടം 3: ഒന്നുകൾ കുറയ്ക്കുക' : 'Step 3: Subtract Ones'}
                </span>
                <p className="text-sm text-vaayana-textLight font-malayalam leading-relaxed">
                  {language === 'ml'
                    ? 'ഇപ്പോൾ ഒന്നുകളുടെ സ്ഥാനത്ത് 12 മുത്തുകളുണ്ട്. അതിൽ നിന്ന് 8 മുത്തുകൾ എടുത്തുമാറ്റുക: 12 − 8 = 4 ഒന്നുകൾ!'
                    : 'Now we have 12 ones. Subtract 8 ones: 12 − 8 = 4 ones left!'}
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-vaayana-lime uppercase tracking-wider">
                  {language === 'ml' ? 'ഘട്ടം 4: പത്തുകളും നൂറുകളും കുറയ്ക്കുക' : 'Step 4: Subtract Tens and Hundreds'}
                </span>
                <p className="text-sm text-vaayana-textLight font-malayalam leading-relaxed">
                  {language === 'ml'
                    ? 'പത്തുകളിൽ ബാക്കിയുള്ള 4 ൽ നിന്ന് 2 കുറയ്ക്കുക (4 − 2 = 2). നൂറുകളിൽ 3 ൽ നിന്ന് 1 കുറയ്ക്കുക (3 − 1 = 2).'
                    : 'Subtract 2 from 4 tens (4 − 2 = 2). Subtract 1 from 3 hundreds (3 − 1 = 2).'}
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2 animate-fadeIn">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {language === 'ml' ? 'പൂർത്തിയായി!' : 'Completed!'}
                </span>
                <p className="text-sm text-vaayana-textLight font-malayalam leading-relaxed">
                  {language === 'ml'
                    ? `അവസാന ഫലം: 2 നൂറുകൾ + 2 പത്തുകൾ + 4 ഒന്നുകൾ = ${currentProblem.result}!`
                    : `Final Result: 2 Hundreds + 2 Tens + 4 Ones = ${currentProblem.result}!`}
                </p>
              </div>
            )}

            {/* Advance Step Action Button */}
            {step < 4 ? (
              <button
                onClick={advanceStep}
                className="w-full py-3.5 px-4 rounded-xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-sm shadow-limeGlow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>
                  {step === 1 
                    ? (language === 'ml' ? 'കൂട്ടം മാറ്റുക (Regroup 1 Ten → 10 Ones)' : 'Exchange 1 Ten for 10 Ones')
                    : (language === 'ml' ? 'അടുത്ത ഘട്ടം (Next Step)' : 'Proceed to Next Step')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextProblem}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95"
              >
                {language === 'ml' ? 'അടുത്ത കണക്ക് പരിശീലിക്കുക' : 'Practice Next Problem'}
              </button>
            )}

          </div>

          {/* Place Value Equivalence Fact Card */}
          <div className="p-3.5 rounded-2xl bg-vaayana-darkElevated border border-vaayana-darkBorder text-xs text-vaayana-textLightMuted space-y-1">
            <span className="font-bold text-vaayana-lime font-malayalam">
              {language === 'ml' ? 'ഓർക്കുക (Key Concept):' : 'Key Place-Value Rule:'}
            </span>
            <p className="text-[11px] leading-relaxed font-mono text-slate-300">
              1 Hundred (നൂറ്) = 10 Tens (പത്തുകൾ)<br />
              1 Ten (പത്ത്) = 10 Ones (ഒന്നുകൾ)
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
