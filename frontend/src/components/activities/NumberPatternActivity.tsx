import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PatternQuestion {
  id: string;
  sequence: (number | null)[];
  missingIndex: number;
  correctAnswer: number;
  options: number[];
  ruleEn: string;
  ruleMl: string;
  level: 'easy' | 'medium' | 'hard';
}

const PATTERNS: PatternQuestion[] = [
  {
    id: 'p1',
    sequence: [9, 10, 11, null],
    missingIndex: 3,
    correctAnswer: 12,
    options: [12, 13, 14, 15],
    ruleEn: 'Adding 1 to each number (+1 pattern)',
    ruleMl: 'ഓരോ സംഖ്യയോടും 1 വീതം കൂട്ടുന്നു (+1 ക്രമം)',
    level: 'easy'
  },
  {
    id: 'p2',
    sequence: [100, null, 110, 115],
    missingIndex: 1,
    correctAnswer: 105,
    options: [102, 105, 108, 112],
    ruleEn: 'Adding 5 to each number (+5 pattern)',
    ruleMl: 'ഓരോ സംഖ്യയോടും 5 വീതം കൂട്ടുന്നു (+5 ക്രമം)',
    level: 'easy'
  },
  {
    id: 'p3',
    sequence: [null, 110, 120, 130],
    missingIndex: 0,
    correctAnswer: 100,
    options: [90, 95, 100, 105],
    ruleEn: 'Tens sequence (+10). 110 - 10 = 100',
    ruleMl: 'പത്തുകൾ വീതം കൂടുന്നു. 110 ൽ നിന്ന് 10 കുറച്ചാൽ 100',
    level: 'medium'
  },
  {
    id: 'p4',
    sequence: [180, 160, null, 120],
    missingIndex: 2,
    correctAnswer: 140,
    options: [130, 140, 150, 155],
    ruleEn: 'Subtracting 20 each step (-20 decreasing pattern)',
    ruleMl: 'ഓരോ ഘട്ടത്തിലും 20 വീതം കുറയുന്നു (-20 ക്രമം)',
    level: 'medium'
  },
  {
    id: 'p5',
    sequence: [250, 500, null, 1000],
    missingIndex: 2,
    correctAnswer: 750,
    options: [650, 700, 750, 800],
    ruleEn: 'Adding 250 each step (Quarters of 1000)',
    ruleMl: '250 വീതം കൂടുന്നു (ആയിരത്തിന്റെ നാലിലൊന്ന്)',
    level: 'hard'
  }
];

export const NumberPatternActivity: React.FC = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const current = PATTERNS[currentIndex];

  const handleSelect = (option: number) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === current.correctAnswer) {
      setScore(s => s + 1);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex(i => (i + 1) % PATTERNS.length);
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime/20 border border-vaayana-lime/40 flex items-center justify-center text-vaayana-lime font-black">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'സംഖ്യാ പാറ്റേണുകൾ (Number Patterns)' : 'Discover Number Sequences'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'വിടവ് വന്ന സംഖ്യ കണ്ടെത്തി ക്രമം പൂർത്തിയാക്കൂ' : 'Find the missing number to complete the mathematical pattern'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-vaayana-dark text-vaayana-lime font-mono font-black text-xs border border-vaayana-darkBorder">
            Score: {score} / {PATTERNS.length}
          </span>
          <button
            onClick={restart}
            className="p-2 rounded-xl bg-vaayana-dark text-vaayana-textLightMuted hover:text-vaayana-textLight"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Pattern Challenge Box */}
      <div className="bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card space-y-8">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-vaayana-textDarkMuted">
            {language === 'ml' ? `ചോദ്യം ${currentIndex + 1} / ${PATTERNS.length}` : `Question ${currentIndex + 1} of ${PATTERNS.length}`}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
            current.level === 'easy' ? 'bg-emerald-100 text-emerald-800' :
            current.level === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {current.level}
          </span>
        </div>

        {/* Animated Sequence Display Cards */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-6">
          {current.sequence.map((num, idx) => {
            const isMissing = idx === current.missingIndex;
            return (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`w-20 sm:w-28 h-24 sm:h-32 rounded-3xl flex flex-col items-center justify-center font-black text-2xl sm:text-4xl shadow-card border-2 transition-all ${
                    isMissing
                      ? isAnswered
                        ? selectedAnswer === current.correctAnswer
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-105'
                          : 'bg-rose-100 border-rose-500 text-rose-950'
                        : 'bg-amber-100 border-amber-400 text-amber-900 border-dashed animate-pulse'
                      : 'bg-vaayana-dark border-vaayana-darkBorder text-vaayana-lime'
                  }`}
                >
                  {isMissing ? (
                    isAnswered ? selectedAnswer : '?'
                  ) : (
                    num
                  )}
                  <span className="text-[10px] font-mono mt-1 opacity-60">
                    Step {idx + 1}
                  </span>
                </motion.div>
                {idx < current.sequence.length - 1 && (
                  <span className="text-2xl font-black text-vaayana-textDarkMuted hidden sm:inline">
                    ➔
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Options Row */}
        <div className="max-w-xl mx-auto space-y-4">
          <p className="text-center text-sm font-bold text-vaayana-textDark font-malayalam">
            {language === 'ml' ? 'വിടവ് വന്ന സ്ഥാനത്ത് ഏത് സംഖ്യ വരും?' : 'Which number fills the blank in the sequence?'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {current.options.map(opt => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = opt === current.correctAnswer;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={isAnswered}
                  className={`py-4 sm:py-5 rounded-2xl font-black text-xl sm:text-2xl font-mono transition-all shadow-soft active:scale-95 ${
                    isAnswered
                      ? isCorrectOpt
                        ? 'bg-emerald-500 text-white border-2 border-emerald-600 scale-105 shadow-md'
                        : isSelected
                          ? 'bg-rose-500 text-white border-2 border-rose-600'
                          : 'bg-vaayana-soft opacity-40 text-vaayana-textDark'
                      : 'bg-vaayana-dark hover:bg-vaayana-darkHover border border-vaayana-darkBorder text-vaayana-lime hover:border-vaayana-lime'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanatory Rule Banner on Answer */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                selectedAnswer === current.correctAnswer
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div>
                <span className="font-extrabold text-xs uppercase tracking-wider block mb-1">
                  {selectedAnswer === current.correctAnswer 
                    ? (language === 'ml' ? 'ശരിയുത്തരം! ക്രമം ഇതാണ്:' : 'Correct! Here is the pattern:')
                    : (language === 'ml' ? 'ശ്രമിക്കൂ! ശരിയായ ക്രമം:' : 'Pattern explanation:')}
                </span>
                <p className="text-base font-bold font-malayalam">
                  {language === 'ml' ? current.ruleMl : current.ruleEn}
                </p>
              </div>

              <button
                onClick={nextQuestion}
                className="px-6 py-3 rounded-2xl bg-vaayana-dark text-vaayana-lime font-black text-sm shadow-soft active:scale-95 transition-all shrink-0"
              >
                {language === 'ml' ? 'അടുത്ത ചോദ്യം ➔' : 'Next Sequence ➔'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
