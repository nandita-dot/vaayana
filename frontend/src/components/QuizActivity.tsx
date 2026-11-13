import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';
import { 
  CheckCircle, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  Clock,
  Eye,
  Pause,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizActivityProps {
  questions: QuizQuestion[];
  onFinish?: () => void;
}

const QUIZ_TILE_SCHEMES = [
  { shape: '▲', label: 'A' },
  { shape: '◆', label: 'B' },
  { shape: '●', label: 'C' },
  { shape: '■', label: 'D' }
];

export const QuizActivity: React.FC<QuizActivityProps> = ({ questions, onFinish }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Classroom timer: 30 seconds countdown
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    setTimeLeft(30);
    setIsTimerPaused(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isAnswered || quizFinished || isTimerPaused) return;

    if (timeLeft <= 0) {
      setIsAnswered(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, quizFinished, isTimerPaused]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      soundService.play('correct');
      setScore(s => s + 1);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      soundService.play('incorrect');
    }
  };

  const handleRevealAnswer = () => {
    soundService.play('click');
    setIsAnswered(true);
  };

  const handleNext = () => {
    soundService.play('click');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      soundService.play('celebration');
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    soundService.play('click');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setTimeLeft(30);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-vaayana-textLightMuted font-malayalam">
        ചോദ്യങ്ങൾ ലഭ്യമല്ല (No quiz questions available).
      </div>
    );
  }

  // Quiz Finished Screen (Celebration Podium)
  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-vaayana-darkSurface text-vaayana-textLight p-8 sm:p-12 rounded-4xl border border-vaayana-darkBorder shadow-lifted text-center max-w-2xl mx-auto space-y-6 select-none animate-fadeIn"
      >
        <div className="w-24 h-24 bg-vaayana-lime text-vaayana-dark rounded-3xl mx-auto flex items-center justify-center shadow-limeGlow font-black">
          <Trophy className="w-14 h-14" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-vaayana-darkElevated text-vaayana-lime font-black border border-vaayana-lime/30">
            Classroom Challenge Complete
          </span>
          <h3 className="text-3xl sm:text-4xl font-black font-malayalam text-vaayana-textLight">
            {language === 'ml' ? 'അഭിനന്ദനങ്ങൾ കുട്ടികളേ!' : 'Congratulations Class 4!'}
          </h3>
          <p className="text-vaayana-lime text-lg sm:text-2xl font-bold font-malayalam">
            {language === 'ml'
              ? `${questions.length} ചോദ്യങ്ങളിൽ ${score} എണ്ണം ശരിയായി!`
              : `Class scored ${score} out of ${questions.length} (${percentage}%)`}
          </p>
        </div>

        {/* Score Stars */}
        <div className="flex justify-center gap-2.5 py-2">
          {Array.from({ length: questions.length }).map((_, i) => (
            <div 
              key={i} 
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                i < score ? 'bg-vaayana-lime text-vaayana-dark font-black shadow-limeGlow' : 'bg-vaayana-darkElevated text-vaayana-textLightMuted/30 border border-vaayana-darkBorder'
              }`}
            >
              ★
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-bold transition-all border border-vaayana-darkBorder active:scale-95"
          >
            <RotateCcw className="w-5 h-5 text-vaayana-lime" />
            <span className="font-malayalam">{language === 'ml' ? 'വീണ്ടും കളിക്കാം' : 'Play Again'}</span>
          </button>

          {onFinish && (
            <button
              onClick={onFinish}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black transition-all shadow-limeGlow active:scale-95 text-base"
            >
              <span className="font-malayalam">{language === 'ml' ? 'പാഠത്തിലേക്ക് മടങ്ങുക' : 'Return to Lesson'}</span>
              <ArrowRight className="w-5 h-5 text-vaayana-dark" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  const questionText = language === 'ml' ? (currentQ.questionMl || currentQ.questionEn) : (currentQ.questionEn || currentQ.questionMl);
  const options = language === 'ml' ? (currentQ.optionsMl.length ? currentQ.optionsMl : currentQ.optionsEn) : (currentQ.optionsEn.length ? currentQ.optionsEn : currentQ.optionsMl);
  const explanation = language === 'ml' ? (currentQ.explanationMl || currentQ.explanationEn) : (currentQ.explanationEn || currentQ.explanationMl);

  return (
    <div className="bg-vaayana-soft p-5 sm:p-8 rounded-4xl border border-vaayana-softBorder shadow-lifted space-y-6 max-w-4xl mx-auto select-none">
      
      {/* Top Game Bar: Progress, Timer & Teacher Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-vaayana-softMuted">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-vaayana-dark text-vaayana-lime flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-vaayana-textDark font-sans">
            VAAYANA CLASSROOM CHALLENGE
          </span>
          {currentQ.sourcePageRef && (
            <span className="hidden sm:inline-block text-[11px] font-bold text-vaayana-textDarkMuted bg-vaayana-softSurface px-2.5 py-0.5 rounded-lg border border-vaayana-softBorder">
              {currentQ.sourcePageRef}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Animated Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs sm:text-sm font-black border transition-colors ${
            timeLeft <= 5 
              ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' 
              : 'bg-vaayana-dark text-vaayana-lime border-vaayana-darkBorder'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          <button
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="p-2 rounded-xl bg-vaayana-softSurface text-vaayana-textDark hover:bg-vaayana-softMuted border border-vaayana-softBorder transition-all"
            title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
          >
            {isTimerPaused ? <Play className="w-4 h-4 text-vaayana-limeDark" /> : <Pause className="w-4 h-4" />}
          </button>

          {!isAnswered && (
            <button
              onClick={handleRevealAnswer}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-vaayana-softSurface hover:bg-vaayana-softMuted text-vaayana-textDark text-xs font-extrabold border border-vaayana-softBorder shadow-sm"
              title="Reveal Answer for Class"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reveal</span>
            </button>
          )}

          <span className="text-xs font-black text-vaayana-dark px-3 py-1 bg-vaayana-lime rounded-full font-mono shadow-sm">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Large Smartboard Question Banner */}
      <div className="bg-vaayana-dark text-vaayana-textLight p-6 sm:p-10 rounded-3xl text-center shadow-card relative overflow-hidden border border-vaayana-darkBorder">
        <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black leading-snug font-malayalam`}>
          {questionText}
        </h3>
        {language === 'ml' && currentQ.questionEn && currentQ.questionEn !== currentQ.questionMl && (
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted mt-2 italic">
            {currentQ.questionEn}
          </p>
        )}
      </div>

      {/* 4 Accessible Tile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {options.map((opt, idx) => {
          const scheme = QUIZ_TILE_SCHEMES[idx % QUIZ_TILE_SCHEMES.length];
          const isSelected = selectedOption === idx;
          const isCorrectChoice = idx === currentQ.correctIndex;

          let tileClass = 'bg-vaayana-softSurface text-vaayana-textDark border-2 border-vaayana-softBorder hover:border-vaayana-limeDark/60 shadow-soft';
          let shapeBadgeClass = 'bg-vaayana-dark text-vaayana-lime';

          if (isAnswered) {
            if (isCorrectChoice) {
              tileClass = 'bg-emerald-50 text-emerald-950 border-2 border-emerald-500 ring-4 ring-emerald-300 shadow-lifted scale-[1.02]';
              shapeBadgeClass = 'bg-emerald-600 text-white';
            } else if (isSelected) {
              tileClass = 'bg-rose-50 text-rose-950 border-2 border-rose-500 opacity-90 ring-2 ring-rose-300';
              shapeBadgeClass = 'bg-rose-600 text-white';
            } else {
              tileClass = 'opacity-40 bg-vaayana-softSurface text-slate-400 border-slate-200';
            }
          }

          return (
            <motion.button
              key={idx}
              whileTap={{ scale: isAnswered ? 1 : 0.98 }}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`p-5 sm:p-6 rounded-3xl text-left font-bold transition-all min-h-[90px] sm:min-h-[110px] flex items-center justify-between gap-4 text-lg sm:text-2xl cursor-pointer ${tileClass}`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shrink-0 shadow-sm ${shapeBadgeClass}`}>
                  {isAnswered && isCorrectChoice ? '✓' : isAnswered && isSelected ? '✕' : scheme.label}
                </span>
                <span className="font-malayalam leading-relaxed">{opt}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Answer Feedback & Pedagogical Explanation Banner */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl border shadow-card animate-fadeIn ${
            selectedOption === currentQ.correctIndex
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {selectedOption === currentQ.correctIndex ? (
              <span className="px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase flex items-center gap-1.5 font-malayalam shadow-sm">
                <CheckCircle className="w-4 h-4" /> ശരിയുത്തരം! (CORRECT!)
              </span>
            ) : (
              <span className="px-3.5 py-1 rounded-full bg-amber-600 text-white text-xs font-black uppercase flex items-center gap-1.5 font-malayalam shadow-sm">
                <Sparkles className="w-4 h-4" /> നമുക്ക് ഒരുമിച്ച് മനസ്സിലാക്കാം (LET'S LEARN!)
              </span>
            )}
          </div>

          <p className="text-base sm:text-xl font-bold font-malayalam leading-relaxed mt-2 text-vaayana-textDark">
            {explanation}
          </p>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-vaayana-dark hover:bg-black text-vaayana-lime font-black text-sm sm:text-base shadow-card transition-all active:scale-95"
            >
              <span className="font-malayalam">
                {currentIndex === questions.length - 1 ? 'ഫലം കാണാം (Finish)' : 'അടുത്ത ചോദ്യം (Next)'}
              </span>
              <ArrowRight className="w-5 h-5 text-vaayana-lime" />
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default QuizActivity;
