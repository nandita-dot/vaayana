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
  Eye,
  Columns
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

interface WrittenProblem {
  id: string;
  minuend: number;
  subtrahend: number;
  diff: number;
  columns: {
    name: 'ones' | 'tens' | 'hundreds';
    labelEn: string;
    labelMl: string;
    topOriginal: number;
    topAfterBorrow: number;
    bottom: number;
    result: number;
    borrowsFromNext: boolean;
  }[];
}

const PROBLEMS: WrittenProblem[] = [
  {
    id: 'p1',
    minuend: 352,
    subtrahend: 128,
    diff: 224,
    columns: [
      {
        name: 'ones',
        labelEn: 'Ones (O)',
        labelMl: 'ഒന്നുകൾ',
        topOriginal: 2,
        topAfterBorrow: 12,
        bottom: 8,
        result: 4,
        borrowsFromNext: true
      },
      {
        name: 'tens',
        labelEn: 'Tens (T)',
        labelMl: 'പത്തുകൾ',
        topOriginal: 5,
        topAfterBorrow: 4,
        bottom: 2,
        result: 2,
        borrowsFromNext: false
      },
      {
        name: 'hundreds',
        labelEn: 'Hundreds (H)',
        labelMl: 'നൂറുകൾ',
        topOriginal: 3,
        topAfterBorrow: 3,
        bottom: 1,
        result: 2,
        borrowsFromNext: false
      }
    ]
  },
  {
    id: 'p2',
    minuend: 546,
    subtrahend: 231,
    diff: 315,
    columns: [
      {
        name: 'ones',
        labelEn: 'Ones (O)',
        labelMl: 'ഒന്നുകൾ',
        topOriginal: 6,
        topAfterBorrow: 6,
        bottom: 1,
        result: 5,
        borrowsFromNext: false
      },
      {
        name: 'tens',
        labelEn: 'Tens (T)',
        labelMl: 'പത്തുകൾ',
        topOriginal: 4,
        topAfterBorrow: 4,
        bottom: 3,
        result: 1,
        borrowsFromNext: false
      },
      {
        name: 'hundreds',
        labelEn: 'Hundreds (H)',
        labelMl: 'നൂറുകൾ',
        topOriginal: 5,
        topAfterBorrow: 5,
        bottom: 2,
        result: 3,
        borrowsFromNext: false
      }
    ]
  },
  {
    id: 'p3',
    minuend: 640,
    subtrahend: 285,
    diff: 355,
    columns: [
      {
        name: 'ones',
        labelEn: 'Ones (O)',
        labelMl: 'ഒന്നുകൾ',
        topOriginal: 0,
        topAfterBorrow: 10,
        bottom: 5,
        result: 5,
        borrowsFromNext: true
      },
      {
        name: 'tens',
        labelEn: 'Tens (T)',
        labelMl: 'പത്തുകൾ',
        topOriginal: 4,
        topAfterBorrow: 13, // borrowed 1 from 6 (becomes 5), minus 1 gave to ones -> 3 + 10 = 13
        bottom: 8,
        result: 5,
        borrowsFromNext: true
      },
      {
        name: 'hundreds',
        labelEn: 'Hundreds (H)',
        labelMl: 'നൂറുകൾ',
        topOriginal: 6,
        topAfterBorrow: 5,
        bottom: 2,
        result: 3,
        borrowsFromNext: false
      }
    ]
  }
];

export const WrittenSubtractionBoard: React.FC = () => {
  const { language } = useLanguage();

  const [problemIdx, setProblemIdx] = useState<number>(0);
  const [activeColIdx, setActiveColIdx] = useState<number>(0); // 0 = ones, 1 = tens, 2 = hundreds
  const [isBorrowed, setIsBorrowed] = useState<{ [key: string]: boolean }>({});
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({
    ones: '',
    tens: '',
    hundreds: ''
  });
  const [viewMode, setViewMode] = useState<'written' | 'comparison'>('written');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const problem = PROBLEMS[problemIdx];
  const activeCol = problem.columns[activeColIdx];

  const handleReset = () => {
    soundService.play('click');
    setActiveColIdx(0);
    setIsBorrowed({});
    setUserInputs({ ones: '', tens: '', hundreds: '' });
    setFeedback(null);
  };

  const handleNextProblem = () => {
    soundService.play('click');
    setProblemIdx((idx) => (idx + 1) % PROBLEMS.length);
    setActiveColIdx(0);
    setIsBorrowed({});
    setUserInputs({ ones: '', tens: '', hundreds: '' });
    setFeedback(null);
  };

  const handleBorrow = (colName: string) => {
    soundService.play('bead');
    setIsBorrowed(prev => ({ ...prev, [colName]: true }));
    setFeedback({
      isCorrect: true,
      message: language === 'ml' 
        ? 'കൂട്ടം മാറ്റി! അടുത്ത കോളത്തിൽ നിന്ന് 1 കടമെടുത്ത് 10 ചേർത്തുകഴിഞ്ഞു.' 
        : 'Borrowed! 1 exchanged from next column into 10 here.'
    });
  };

  const handleCheckCol = () => {
    const entered = parseInt(userInputs[activeCol.name].trim(), 10);
    if (isNaN(entered)) {
      soundService.play('incorrect');
      setFeedback({
        isCorrect: false,
        message: language === 'ml' ? 'ദയവായി ഉത്തരം നൽകുക.' : 'Please enter your digit.'
      });
      return;
    }

    if (entered === activeCol.result) {
      soundService.play('correct');
      setFeedback({
        isCorrect: true,
        message: language === 'ml'
          ? `ശരിയാണ്! ${activeCol.labelMl} കോളത്തിലെ ഉത്തരം ${activeCol.result} ആണ്.`
          : `Correct! ${activeCol.labelEn} column result is ${activeCol.result}.`
      });

      if (activeColIdx < problem.columns.length - 1) {
        setTimeout(() => {
          setActiveColIdx(idx => idx + 1);
          setFeedback(null);
        }, 1200);
      } else {
        soundService.play('celebration');
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      soundService.play('incorrect');
      setFeedback({
        isCorrect: false,
        message: language === 'ml'
          ? `ശ്രമിക്കൂ! മുകളിലെ അക്കത്തിൽ നിന്ന് താഴത്തെ അക്കം കുറയ്ക്കുക.`
          : `Try again! Subtract bottom digit from top digit.`
      });
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Top Banner */}
      <div className="bg-vaayana-darkSurface p-4 sm:p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider">
              {language === 'ml' ? 'പ്രവർത്തനം 2' : 'Activity 2'}
            </span>
            <span className="text-xs font-bold text-vaayana-textLightMuted">
              Class 4 Mathematics • Chapter 6
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-1 font-malayalam">
            {language === 'ml' ? 'വരിയായി എഴുതി കുറയ്ക്കൽ (Standard Written Subtraction)' : 'Standard Written Subtraction'}
          </h2>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted mt-1">
            {language === 'ml'
              ? 'ഒന്നുകൾ, പത്തുകൾ, നൂറുകൾ ക്രമത്തിൽ കടമെടുക്കലും കുറയ്ക്കലും പരിശീലിക്കാം.'
              : 'Column-by-column subtraction with visible borrowing slashes and side-by-side comparison.'}
          </p>
        </div>

        {/* View Switcher: Written vs Comparison */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-vaayana-darkElevated p-1 rounded-2xl border border-vaayana-darkBorder">
            <button
              onClick={() => {
                soundService.play('click');
                setViewMode('written');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                viewMode === 'written' 
                  ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow' 
                  : 'text-vaayana-textLight hover:bg-vaayana-darkBorder'
              }`}
            >
              {language === 'ml' ? 'എഴുത്തു രീതി' : 'Written Board'}
            </button>
            <button
              onClick={() => {
                soundService.play('click');
                setViewMode('comparison');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                viewMode === 'comparison' 
                  ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow' 
                  : 'text-vaayana-textLight hover:bg-vaayana-darkBorder'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{language === 'ml' ? 'അബാക്കസ് താരതമ്യം' : 'Method Comparison'}</span>
            </button>
          </div>

          <button
            onClick={handleNextProblem}
            className="p-2.5 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight border border-vaayana-darkBorder transition-all active:scale-95"
            title="Next Subtraction Problem"
          >
            <RefreshCw className="w-4 h-4 text-vaayana-lime" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: The Written Subtraction Board (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-vaayana-softSurface border border-vaayana-softBorder shadow-card space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-vaayana-softMuted">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-navy-900" />
              <h3 className="text-lg font-black text-navy-900 font-malayalam">
                {language === 'ml' ? 'സ്ഥാനക്രമം അനുസരിച്ചുള്ള ബോർഡ്' : 'Vertical Column Alignment'}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>{language === 'ml' ? 'സജീവ കോളം' : 'Active Column'}:</span>
              <span className="px-2.5 py-1 rounded-xl bg-navy-900 text-white font-mono uppercase">
                {activeCol.name}
              </span>
            </div>
          </div>

          {/* Standard Vertical Subtraction Grid */}
          <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-md font-mono select-none">
            
            {/* Column Header Titles (H, T, O) */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-black text-slate-400 mb-2 pb-1 border-b border-slate-100">
              <div />
              <div>H (നൂറ്)</div>
              <div>T (പത്ത്)</div>
              <div>O (ഒന്ന്)</div>
            </div>

            {/* Borrowed Marks Row */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-black text-rose-600 h-6">
              <div />
              {/* Hundreds borrow indicator */}
              <div>{isBorrowed.hundreds ? problem.columns[2].topAfterBorrow : ''}</div>
              {/* Tens borrow indicator */}
              <div>{isBorrowed.tens || isBorrowed.ones ? problem.columns[1].topAfterBorrow : ''}</div>
              {/* Ones borrow indicator */}
              <div>{isBorrowed.ones ? problem.columns[0].topAfterBorrow : ''}</div>
            </div>

            {/* Minuend Row (Top Number) */}
            <div className="grid grid-cols-4 gap-2 text-center text-2xl sm:text-3xl font-black text-navy-900 py-1">
              <div className="text-xl sm:text-2xl text-slate-300 font-sans" />
              {/* Hundreds top */}
              <div className={`relative ${activeColIdx === 2 ? 'text-vaayana-limeDark font-extrabold' : ''}`}>
                <span className={isBorrowed.hundreds ? 'line-through text-slate-400' : ''}>
                  {problem.columns[2].topOriginal}
                </span>
              </div>
              {/* Tens top */}
              <div className={`relative ${activeColIdx === 1 ? 'text-vaayana-limeDark font-extrabold' : ''}`}>
                <span className={isBorrowed.ones || isBorrowed.tens ? 'line-through text-slate-400' : ''}>
                  {problem.columns[1].topOriginal}
                </span>
              </div>
              {/* Ones top */}
              <div className={`relative ${activeColIdx === 0 ? 'text-vaayana-limeDark font-extrabold' : ''}`}>
                <span className={isBorrowed.ones ? 'line-through text-slate-400' : ''}>
                  {problem.columns[0].topOriginal}
                </span>
              </div>
            </div>

            {/* Subtrahend Row (Bottom Number with minus sign) */}
            <div className="grid grid-cols-4 gap-2 text-center text-2xl sm:text-3xl font-black text-rose-600 py-1 border-b-4 border-navy-900">
              <div className="text-2xl text-rose-600 text-left pl-2">−</div>
              <div>{problem.columns[2].bottom}</div>
              <div>{problem.columns[1].bottom}</div>
              <div>{problem.columns[0].bottom}</div>
            </div>

            {/* Results Input Row */}
            <div className="grid grid-cols-4 gap-2 text-center text-2xl sm:text-3xl font-black py-3">
              <div />
              {/* Hundreds result input */}
              <div>
                <input
                  type="text"
                  maxLength={1}
                  value={userInputs.hundreds}
                  onChange={(e) => setUserInputs(prev => ({ ...prev, hundreds: e.target.value }))}
                  onClick={() => setActiveColIdx(2)}
                  className={`w-12 sm:w-14 h-12 sm:h-14 text-center rounded-xl border-2 font-mono text-xl sm:text-2xl font-black focus:outline-none ${
                    activeColIdx === 2 ? 'border-vaayana-lime ring-2 ring-vaayana-lime' : 'border-slate-300 bg-slate-50'
                  }`}
                  placeholder="?"
                />
              </div>

              {/* Tens result input */}
              <div>
                <input
                  type="text"
                  maxLength={1}
                  value={userInputs.tens}
                  onChange={(e) => setUserInputs(prev => ({ ...prev, tens: e.target.value }))}
                  onClick={() => setActiveColIdx(1)}
                  className={`w-12 sm:w-14 h-12 sm:h-14 text-center rounded-xl border-2 font-mono text-xl sm:text-2xl font-black focus:outline-none ${
                    activeColIdx === 1 ? 'border-vaayana-lime ring-2 ring-vaayana-lime' : 'border-slate-300 bg-slate-50'
                  }`}
                  placeholder="?"
                />
              </div>

              {/* Ones result input */}
              <div>
                <input
                  type="text"
                  maxLength={1}
                  value={userInputs.ones}
                  onChange={(e) => setUserInputs(prev => ({ ...prev, ones: e.target.value }))}
                  onClick={() => setActiveColIdx(0)}
                  className={`w-12 sm:w-14 h-12 sm:h-14 text-center rounded-xl border-2 font-mono text-xl sm:text-2xl font-black focus:outline-none ${
                    activeColIdx === 0 ? 'border-vaayana-lime ring-2 ring-vaayana-lime' : 'border-slate-300 bg-slate-50'
                  }`}
                  placeholder="?"
                />
              </div>
            </div>

          </div>

          {/* Column Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {problem.columns.map((col, idx) => (
              <button
                key={col.name}
                onClick={() => {
                  soundService.play('click');
                  setActiveColIdx(idx);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeColIdx === idx 
                    ? 'bg-navy-900 text-white shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {language === 'ml' ? col.labelMl : col.labelEn}
              </button>
            ))}
          </div>

        </div>

        {/* Right: Interactive Helper & Abacus Comparison (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder shadow-darkCard space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-vaayana-lime" />
              <h3 className="text-lg font-black text-vaayana-textLight font-malayalam">
                {language === 'ml' ? 'സഹായവും പരിശോധനയും' : 'Column Action & Hints'}
              </h3>
            </div>
          </div>

          {/* Active Column Task Card */}
          <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-darkBorder space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-vaayana-textLightMuted">
              <span>{language === 'ml' ? 'സ്ഥാനം' : 'Column'}: <strong className="text-vaayana-lime">{activeCol.labelEn}</strong></span>
              <span>Top: {isBorrowed[activeCol.name] ? activeCol.topAfterBorrow : activeCol.topOriginal} | Bottom: {activeCol.bottom}</span>
            </div>

            {/* If borrow is required and not yet done */}
            {activeCol.borrowsFromNext && !isBorrowed[activeCol.name] && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-200 text-xs space-y-2">
                <p className="font-malayalam font-bold leading-relaxed">
                  {language === 'ml'
                    ? `${activeCol.topOriginal} ൽ നിന്ന് ${activeCol.bottom} കുറയ്ക്കാൻ കഴിയില്ല. അടുത്ത കോളത്തിൽ നിന്ന് 1 കടമെടുക്കുക (Borrow)!`
                    : `Cannot subtract ${activeCol.bottom} from ${activeCol.topOriginal}. You need to borrow from next column!`}
                </p>
                <button
                  onClick={() => handleBorrow(activeCol.name)}
                  className="w-full py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs transition-all active:scale-95"
                >
                  {language === 'ml' ? 'കടമെടുക്കുക (Borrow 1)' : 'Click to Borrow (Regroup)'}
                </button>
              </div>
            )}

            <p className="text-xs sm:text-sm font-extrabold text-vaayana-textLight font-malayalam leading-relaxed">
              {language === 'ml'
                ? `${isBorrowed[activeCol.name] ? activeCol.topAfterBorrow : activeCol.topOriginal} − ${activeCol.bottom} = എത്ര?`
                : `What is ${isBorrowed[activeCol.name] ? activeCol.topAfterBorrow : activeCol.topOriginal} − ${activeCol.bottom}?`}
            </p>

            <button
              onClick={handleCheckCol}
              className="w-full py-3.5 px-4 rounded-xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-sm shadow-limeGlow transition-all active:scale-95"
            >
              {language === 'ml' ? 'ഈ കോളം പരിശോധിക്കുക' : 'Validate Column Answer'}
            </button>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-3 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800'
                  : 'bg-rose-950/80 text-rose-200 border border-rose-800'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-vaayana-lime shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="font-malayalam leading-relaxed">{feedback.message}</div>
            </motion.div>
          )}

          {/* Side-by-Side Method Comparison Toggle View */}
          {viewMode === 'comparison' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-lime/30 space-y-3 text-xs text-vaayana-textLight"
            >
              <div className="font-black text-sm text-vaayana-lime flex items-center gap-1.5 font-malayalam">
                <Columns className="w-4 h-4 text-vaayana-lime" />
                <span>{language === 'ml' ? 'രീതികളുടെ താരതമ്യം (Comparison)' : 'Method Comparison'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-vaayana-dark border border-vaayana-darkBorder">
                  <span className="font-bold text-slate-300">Written Board</span>
                  <div className="font-mono text-xs text-amber-300 mt-1">
                    Slash 5 → 4<br />
                    Add 10 → 12<br />
                    12 − 8 = 4
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-vaayana-dark border border-vaayana-darkBorder">
                  <span className="font-bold text-slate-300">Abacus Model</span>
                  <div className="font-mono text-xs text-sky-300 mt-1">
                    Tens: -1 bead<br />
                    Ones: +10 beads<br />
                    Remove 8 beads
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-vaayana-textLightMuted italic text-center font-malayalam">
                {language === 'ml'
                  ? 'രണ്ടു രീതികളും ഒരേ ഗണിത തത്വമാണ് ദൃശ്യവൽക്കരിക്കുന്നത്: 1 Ten = 10 Ones.'
                  : 'Both methods represent the exact same mathematical truth: 1 Ten = 10 Ones.'}
              </p>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
};
