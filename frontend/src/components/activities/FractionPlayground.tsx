import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { 
  PieChart, 
  Square, 
  Plus, 
  Minus, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  HelpCircle,
  Scale,
  Equal
} from 'lucide-react';

interface FractionPlaygroundProps {
  initialNumerator?: number;
  initialDenominator?: number;
  mode?: 'explore' | 'equivalent' | 'compare' | 'challenge';
}

export const FractionPlayground: React.FC<FractionPlaygroundProps> = ({
  initialNumerator = 2,
  initialDenominator = 4,
  mode: initialMode = 'explore'
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'explore' | 'equivalent' | 'compare' | 'challenge'>(initialMode);
  
  // Primary fraction state
  const [shape, setShape] = useState<'circle' | 'rectangle'>('circle');
  const [denominator, setDenominator] = useState<number>(initialDenominator);
  const [shadedIndices, setShadedIndices] = useState<Set<number>>(
    new Set(Array.from({ length: Math.min(initialNumerator, initialDenominator) }, (_, i) => i))
  );

  // Comparison fraction state (Fraction B)
  const [compareNumerator, setCompareNumerator] = useState<number>(3);
  const [compareDenominator, setCompareDenominator] = useState<number>(6);

  // Challenge state
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const numerator = shadedIndices.size;

  // Toggle a single piece's shaded state
  const togglePiece = (index: number) => {
    setShadedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Adjust denominator
  const setDenominatorSafe = (newDenom: number) => {
    const clamped = Math.max(1, Math.min(12, newDenom));
    setDenominator(clamped);
    // Adjust shaded indices to not exceed new denominator
    setShadedIndices(prev => {
      const next = new Set<number>();
      prev.forEach(idx => {
        if (idx < clamped) next.add(idx);
      });
      return next;
    });
  };

  // Set numerator directly via buttons
  const setNumeratorCount = (count: number) => {
    const clamped = Math.max(0, Math.min(denominator, count));
    const next = new Set<number>();
    for (let i = 0; i < clamped; i++) {
      next.add(i);
    }
    setShadedIndices(next);
  };

  // Clear all or fill all
  const clearAll = () => setShadedIndices(new Set());
  const fillAll = () => {
    const all = new Set<number>();
    for (let i = 0; i < denominator; i++) all.add(i);
    setShadedIndices(all);
  };

  // Pre-calculated circle SVG sectors
  const circleSlices = useMemo(() => {
    const center = 100;
    const radius = 80;
    const slices = [];

    if (denominator === 1) {
      slices.push({
        path: `M ${center - radius} ${center} A ${radius} ${radius} 0 1 0 ${center + radius} ${center} A ${radius} ${radius} 0 1 0 ${center - radius} ${center} Z`,
        index: 0
      });
      return slices;
    }

    const anglePerSlice = (2 * Math.PI) / denominator;

    for (let i = 0; i < denominator; i++) {
      const startAngle = i * anglePerSlice - Math.PI / 2;
      const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArc = anglePerSlice > Math.PI ? 1 : 0;
      const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      slices.push({ path, index: i });
    }
    return slices;
  }, [denominator]);

  // Challenges list
  const challenges = [
    {
      id: 1,
      targetNumerator: 3,
      targetDenominator: 4,
      instructionEn: 'Shade exactly 3 out of 4 parts (3/4).',
      instructionMl: '4 തുല്യ ഭാഗങ്ങളിൽ 3 ഭാഗം കൃത്യമായി നിറം നൽകുക (3/4).',
      explanationEn: '3/4 means 3 parts selected out of 4 equal parts (75%).',
      explanationMl: '3/4 എന്നാൽ 4 തുല്യ ഭാഗങ്ങളിൽ നിന്ന് തിരഞ്ഞെടുത്ത 3 ഭാഗങ്ങൾ.'
    },
    {
      id: 2,
      targetNumerator: 1,
      targetDenominator: 2,
      instructionEn: 'Create a fraction equal to one half (1/2).',
      instructionMl: 'പകുതിക്ക് (1/2) തുല്യമായ ഒരു ഭിന്നസംഖ്യ ഉണ്ടാക്കുക.',
      check: (num: number, den: number) => num > 0 && num / den === 0.5,
      explanationEn: 'Any fraction where numerator is half of denominator equals 1/2 (e.g. 2/4, 3/6, 4/8)!',
      explanationMl: 'ഛേദത്തിന്റെ പകുതി അംശമായി വരുന്ന ഏത് ഭിന്നസംഖ്യയും 1/2 ന് തുല്യമാണ് (ഉദാ: 2/4, 3/6, 4/8)!'
    },
    {
      id: 3,
      targetNumerator: 4,
      targetDenominator: 6,
      instructionEn: 'Make the fraction 4/6 or any fraction equivalent to 2/3.',
      instructionMl: '4/6 അല്ലെങ്കിൽ 2/3 ന് തുല്യമായ ഒരു ഭിന്നസംഖ്യ നിർമ്മിക്കുക.',
      check: (num: number, den: number) => Math.abs(num / den - 2/3) < 0.01,
      explanationEn: '4/6 simplifies to 2/3 by dividing numerator and denominator by 2.',
      explanationMl: '4/6 ന്റെ അംശത്തെയും ഛേദത്തെയും 2 കൊണ്ട് ഭാഗിച്ചാൽ 2/3 ലഭിക്കുന്നു.'
    }
  ];

  const currentChallenge = challenges[currentChallengeIdx];

  // Verify challenge
  const handleCheckChallenge = () => {
    const isSuccess = currentChallenge.check
      ? currentChallenge.check(numerator, denominator)
      : numerator === currentChallenge.targetNumerator && denominator === currentChallenge.targetDenominator;

    if (isSuccess) {
      setChallengeCompleted(true);
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } else {
      alert(language === 'ml' ? 'വീണ്ടും പരിശോധിച്ച് ഭാഗങ്ങൾ ശരിയാക്കൂ!' : 'Not quite yet! Check the shaded parts and try again.');
    }
  };

  const nextChallenge = () => {
    setChallengeCompleted(false);
    setCurrentChallengeIdx(i => (i + 1) % challenges.length);
  };

  // Math fraction values
  const decimalVal = denominator > 0 ? (numerator / denominator).toFixed(2) : '0';
  const percentVal = denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;

  // Comparison math
  const valA = denominator > 0 ? numerator / denominator : 0;
  const valB = compareDenominator > 0 ? compareNumerator / compareDenominator : 0;
  const comparisonSymbol = Math.abs(valA - valB) < 0.001 ? '=' : valA > valB ? '>' : '<';

  return (
    <div className="bg-surface rounded-4xl border border-surface-subtle shadow-card p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Playground Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-subtle">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
            <PieChart className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Mathematics • ഗണിതം
              </span>
              <span className="text-xs text-slate-400">Class 4–6</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              {language === 'ml' ? 'ഭിന്നസംഖ്യാ കളിക്കളം' : 'Fraction Playground'}
            </h2>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex p-1 bg-surface-subtle rounded-2xl text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'explore' ? 'bg-vaayana-lime text-vaayana-dark font-black shadow-limeGlow' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            {language === 'ml' ? 'പര്യവേക്ഷണം' : 'Visualizer'}
          </button>
          <button
            onClick={() => setActiveTab('equivalent')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'equivalent' ? 'bg-vaayana-lime text-vaayana-dark font-black shadow-limeGlow' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            {language === 'ml' ? 'തുല്യ ഭിന്നസംഖ്യകൾ' : 'Equivalents'}
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'compare' ? 'bg-vaayana-lime text-vaayana-dark font-black shadow-limeGlow' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            {language === 'ml' ? 'താരതമ്യം' : 'Compare'}
          </button>
          <button
            onClick={() => setActiveTab('challenge')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'challenge' ? 'bg-vaayana-lime text-vaayana-dark font-black shadow-limeGlow' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            {language === 'ml' ? 'ചോദ്യങ്ങൾ' : 'Challenges'}
          </button>
        </div>
      </div>

      {/* Tab 1 & Tab 4: Visual Explorer & Challenges */}
      {(activeTab === 'explore' || activeTab === 'challenge') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Interactive Visual Canvas (Circle or Bar) */}
          <div className="lg:col-span-7 bg-[#FAF9F6] p-6 rounded-3xl border border-amber-200/60 shadow-inner flex flex-col items-center justify-center min-h-[360px] relative">
            
            {/* Shape Switcher */}
            <div className="absolute top-4 left-4 flex gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setShape('circle')}
                className={`p-2 rounded-lg transition-all ${shape === 'circle' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                title="Circle View (വട്ടം)"
              >
                <PieChart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShape('rectangle')}
                className={`p-2 rounded-lg transition-all ${shape === 'rectangle' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                title="Rectangle Bar View (ചതുരം)"
              >
                <Square className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Pills: Clear / Fill */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={clearAll}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 transition-all shadow-xs"
              >
                {language === 'ml' ? 'മായ്ക്കുക' : 'Clear'}
              </button>
              <button
                onClick={fillAll}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-xs font-bold text-amber-900 transition-all shadow-xs"
              >
                {language === 'ml' ? 'പൂർണ്ണമാക്കുക' : 'Fill All'}
              </button>
            </div>

            {/* Visual Canvas Rendering */}
            <div className="my-6 flex items-center justify-center w-full max-w-xs sm:max-w-sm">
              {shape === 'circle' ? (
                /* Dynamic SVG Circle */
                <svg viewBox="0 0 200 200" className="w-64 h-64 sm:w-72 sm:h-72 drop-shadow-md select-none touch-none">
                  {circleSlices.map(slice => {
                    const isShaded = shadedIndices.has(slice.index);
                    return (
                      <path
                        key={slice.index}
                        d={slice.path}
                        fill={isShaded ? '#9ACD32' : '#FFFFFF'}
                        stroke="#111713"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        onClick={() => togglePiece(slice.index)}
                        className="cursor-pointer transition-colors duration-150 hover:opacity-90 active:scale-98"
                      />
                    );
                  })}
                  {/* Center Dot */}
                  <circle cx="100" cy="100" r="4" fill="#111713" />
                </svg>
              ) : (
                /* Dynamic Rectangle Strip */
                <div className="w-full flex border-4 border-vaayana-dark rounded-2xl overflow-hidden shadow-md h-32 bg-white">
                  {Array.from({ length: denominator }).map((_, idx) => {
                    const isShaded = shadedIndices.has(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => togglePiece(idx)}
                        className={`flex-1 border-r last:border-r-0 border-vaayana-dark flex items-center justify-center cursor-pointer transition-colors font-black text-sm select-none ${
                          isShaded ? 'bg-vaayana-lime text-vaayana-dark font-black' : 'bg-white hover:bg-vaayana-limeLight/30 text-slate-400'
                        }`}
                      >
                        1/{denominator}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {language === 'ml' ? 'ഭാഗങ്ങളിൽ തൊട്ട് നിറം നൽകുക / മാറ്റുക' : 'Tap any segment to shade or unshade directly on smartboard'}
            </p>
          </div>

          {/* Right: Smartboard Controls & Big Fraction Readout */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Big Fraction Card */}
            <div className="bg-surface-subtle/80 p-6 rounded-3xl border border-surface-subtle flex items-center justify-around shadow-soft">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'ml' ? 'അംശം (Numerator)' : 'Numerator'}
                </span>
                <span className="text-5xl font-black text-amber-600 font-mono">
                  {numerator}
                </span>
                <div className="w-20 h-1.5 bg-navy-900 rounded-full my-2" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'ml' ? 'ഛേദം (Denominator)' : 'Denominator'}
                </span>
                <span className="text-5xl font-black text-navy-900 font-mono">
                  {denominator}
                </span>
              </div>

              <div className="h-28 w-px bg-slate-300 mx-2" />

              <div className="space-y-3 text-left">
                <div>
                  <span className="text-xs text-slate-500 block">Decimal / ദശാംശം:</span>
                  <span className="text-xl font-black text-navy-900 font-mono">{decimalVal}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Percentage / ശതമാനം:</span>
                  <span className="text-xl font-black text-emerald-700 font-mono">{percentVal}%</span>
                </div>
              </div>
            </div>

            {/* Denominator Stepper Controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                {language === 'ml' ? 'ആകെ തുല്യ ഭാഗങ്ങൾ (ഛേദം / Denominator):' : 'Total Equal Slices (Denominator):'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDenominatorSafe(denominator - 1)}
                  disabled={denominator <= 1}
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-navy-900 flex items-center justify-center font-bold text-xl shadow-xs transition-all active:scale-95"
                  aria-label="Decrease denominator"
                >
                  <Minus className="w-6 h-6" />
                </button>

                <div className="flex-1 py-3 bg-white rounded-2xl border border-slate-200 text-center text-2xl font-black text-navy-900 shadow-xs">
                  {denominator}
                </div>

                <button
                  onClick={() => setDenominatorSafe(denominator + 1)}
                  disabled={denominator >= 12}
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-navy-900 flex items-center justify-center font-bold text-xl shadow-xs transition-all active:scale-95"
                  aria-label="Increase denominator"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Numerator Quick Stepper */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                {language === 'ml' ? 'നിറം നൽകിയ ഭാഗങ്ങൾ (അംശം / Numerator):' : 'Shaded Parts (Numerator):'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNumeratorCount(numerator - 1)}
                  disabled={numerator <= 0}
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-amber-700 flex items-center justify-center font-bold text-xl shadow-xs transition-all active:scale-95"
                  aria-label="Decrease numerator"
                >
                  <Minus className="w-6 h-6" />
                </button>

                <div className="flex-1 py-3 bg-white rounded-2xl border border-slate-200 text-center text-2xl font-black text-amber-600 shadow-xs">
                  {numerator}
                </div>

                <button
                  onClick={() => setNumeratorCount(numerator + 1)}
                  disabled={numerator >= denominator}
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-amber-700 flex items-center justify-center font-bold text-xl shadow-xs transition-all active:scale-95"
                  aria-label="Increase numerator"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Challenge Action Banner if in challenge tab */}
            {activeTab === 'challenge' && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">
                      {language === 'ml' ? `ലക്ഷ്യം ${currentChallengeIdx + 1}:` : `Goal ${currentChallengeIdx + 1}:`}
                    </h4>
                    <p className="text-sm font-semibold text-amber-950 mt-0.5">
                      {language === 'ml' ? currentChallenge.instructionMl : currentChallenge.instructionEn}
                    </p>
                  </div>
                </div>

                {challengeCompleted ? (
                  <div className="space-y-2 pt-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>{language === 'ml' ? 'ശരിയാണ്! അഭിനന്ദനങ്ങൾ!' : 'Correct! Outstanding work!'}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {language === 'ml' ? currentChallenge.explanationMl : currentChallenge.explanationEn}
                    </p>
                    <button
                      onClick={nextChallenge}
                      className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      {language === 'ml' ? 'അടുത്ത വെല്ലുവിളി' : 'Next Challenge'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckChallenge}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-navy-950 font-black text-sm rounded-xl shadow-sm transition-all"
                  >
                    {language === 'ml' ? 'ഉത്തരം ശരിയാണോ എന്ന് പരിശോധിക്കുക' : 'Verify Answer'}
                  </button>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* Tab 2: Equivalent Fractions Visualizer */}
      {activeTab === 'equivalent' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl font-bold text-navy-900">
              {language === 'ml' ? 'തുല്യ ഭിന്നസംഖ്യകൾ എങ്ങനെ രൂപപ്പെടുന്നു?' : 'How Equivalent Fractions Work'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'ml'
                ? 'അംശത്തെയും ഛേദത്തെയും ഒരേ സംഖ്യ കൊണ്ട് ഗുണിച്ചാലും വിസ്തീർണ്ണം തുല്യമായിരിക്കും.'
                : 'Multiplying numerator and denominator by the same number keeps the total shaded area identical!'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Visual 1: 1/2 */}
            <div className="bg-[#FAF9F6] p-5 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Base Fraction</span>
              <div className="w-36 h-36 mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                  <path d="M 100 20 A 80 80 0 0 0 100 180 Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
                  <path d="M 100 20 A 80 80 0 0 1 100 180 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="text-2xl font-black text-navy-900 font-mono">1 / 2</div>
              <span className="text-xs text-slate-500 font-medium">1 of 2 slices (50%)</span>
            </div>

            {/* Visual 2: 2/4 */}
            <div className="bg-[#FAF9F6] p-5 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                Multiply by 2
              </span>
              <div className="w-36 h-36 mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                  <path d="M 100 100 L 100 20 A 80 80 0 0 0 20 100 Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
                  <path d="M 100 100 L 20 100 A 80 80 0 0 0 100 180 Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
                  <path d="M 100 100 L 100 180 A 80 80 0 0 0 180 100 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                  <path d="M 100 100 L 180 100 A 80 80 0 0 0 100 20 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="text-2xl font-black text-navy-900 font-mono">2 / 4</div>
              <span className="text-xs text-slate-500 font-medium">2 of 4 slices (50%)</span>
            </div>

            {/* Visual 3: 4/8 */}
            <div className="bg-[#FAF9F6] p-5 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 uppercase">
                Multiply by 4
              </span>
              <div className="w-36 h-36 mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                  {/* 8 equal slices, first 4 shaded (half circle) */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const startA = (i * Math.PI) / 4 - Math.PI / 2;
                    const endA = ((i + 1) * Math.PI) / 4 - Math.PI / 2;
                    const x1 = 100 + 80 * Math.cos(startA);
                    const y1 = 100 + 80 * Math.sin(startA);
                    const x2 = 100 + 80 * Math.cos(endA);
                    const y2 = 100 + 80 * Math.sin(endA);
                    const path = `M 100 100 L ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} Z`;
                    return (
                      <path
                        key={i}
                        d={path}
                        fill={i < 4 ? '#F59E0B' : '#FFFFFF'}
                        stroke="#0F172A"
                        strokeWidth="2.5"
                      />
                    );
                  })}
                </svg>
              </div>
              <div className="text-2xl font-black text-navy-900 font-mono">4 / 8</div>
              <span className="text-xs text-slate-500 font-medium">4 of 8 slices (50%)</span>
            </div>

          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-sm font-bold text-emerald-900 flex items-center justify-center gap-2">
            <Equal className="w-5 h-5 text-emerald-600" />
            <span>1/2 = 2/4 = 4/8 — {language === 'ml' ? 'വിസ്തീർണ്ണം ഒന്നുതന്നെ!' : 'The shaded area remains identical!'}</span>
          </div>
        </div>
      )}

      {/* Tab 3: Compare Fractions Side-by-Side */}
      {activeTab === 'compare' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl font-bold text-navy-900">
              {language === 'ml' ? 'രണ്ട് ഭിന്നസംഖ്യകൾ താരതമ്യം ചെയ്യുക' : 'Visually Compare Two Fractions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'ml' ? 'ഏതാണ് കൂടുതൽ വലുത് എന്ന് നേരിട്ട് കണ്ടറിയാം' : 'Observe which shaded portion covers more area.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* Fraction A Card */}
            <div className="md:col-span-5 bg-surface-subtle p-6 rounded-3xl border border-slate-200 text-center space-y-4">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
                Fraction A
              </span>
              <div className="w-full bg-white h-14 rounded-2xl border-2 border-navy-900 overflow-hidden flex">
                {Array.from({ length: denominator }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => togglePiece(i)}
                    className={`flex-1 border-r last:border-r-0 border-navy-900 cursor-pointer ${
                      shadedIndices.has(i) ? 'bg-amber-400' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
              <div className="text-3xl font-black text-navy-900 font-mono">
                {numerator} / {denominator}
              </div>
              <span className="text-xs text-slate-500 font-medium">({Math.round(valA * 100)}%)</span>
            </div>

            {/* Center Comparator Symbol Badge */}
            <div className="md:col-span-1 flex justify-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-black text-2xl shadow-md font-mono">
                {comparisonSymbol}
              </div>
            </div>

            {/* Fraction B Card */}
            <div className="md:col-span-5 bg-surface-subtle p-6 rounded-3xl border border-slate-200 text-center space-y-4">
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full uppercase">
                Fraction B
              </span>
              <div className="w-full bg-white h-14 rounded-2xl border-2 border-navy-900 overflow-hidden flex">
                {Array.from({ length: compareDenominator }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCompareNumerator(i < compareNumerator ? i : i + 1)}
                    className={`flex-1 border-r last:border-r-0 border-navy-900 cursor-pointer ${
                      i < compareNumerator ? 'bg-blue-400' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
              <div className="text-3xl font-black text-navy-900 font-mono">
                {compareNumerator} / {compareDenominator}
              </div>
              <span className="text-xs text-slate-500 font-medium">({Math.round(valB * 100)}%)</span>

              {/* Adjust Fraction B controls */}
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setCompareNumerator(Math.max(0, compareNumerator - 1))}
                  className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold text-navy-900"
                >
                  - Shaded
                </button>
                <button
                  onClick={() => setCompareNumerator(Math.min(compareDenominator, compareNumerator + 1))}
                  className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold text-navy-900"
                >
                  + Shaded
                </button>
              </div>
            </div>

          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center text-sm font-bold text-navy-900">
            {comparisonSymbol === '=' ? (
              <span>{language === 'ml' ? 'രണ്ട് ഭിന്നസംഖ്യകളും തുല്യമാണ്!' : 'Both fractions are equal in value!'}</span>
            ) : comparisonSymbol === '>' ? (
              <span>{language === 'ml' ? `${numerator}/${denominator} ആണ് ${compareNumerator}/${compareDenominator} നേക്കാൾ വലുത്.` : `${numerator}/${denominator} is greater than ${compareNumerator}/${compareDenominator}.`}</span>
            ) : (
              <span>{language === 'ml' ? `${numerator}/${denominator} ആണ് ${compareNumerator}/${compareDenominator} നേക്കാൾ ചെറുത്.` : `${numerator}/${denominator} is less than ${compareNumerator}/${compareDenominator}.`}</span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
