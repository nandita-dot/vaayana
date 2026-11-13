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
          origin: { y: 0.5 },
          colors: ['#7950B8', '#FFD166', '#FF8066', '#65C7F7', '#72D6B0', '#F5A6C8', '#FFA552']
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
        className="bg-[#111114] text-[#EDE5F7] p-8 sm:p-12 rounded-4xl border border-[#2E263B] shadow-2xl text-center max-w-2xl mx-auto space-y-6 select-none animate-fadeIn"
      >
        <div className="w-24 h-24 bg-[#7950B8] text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-purple-900/50 font-black">
          <Trophy className="w-14 h-14 text-[#FFD166]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#1D1A24] text-[#A881E6] font-black border border-[#7950B8]/30">
            Classroom Challenge Complete
          </span>
          <h3 className="text-3xl sm:text-4xl font-black font-malayalam text-[#EDE5F7]">
            {language === 'ml' ? 'അഭിനന്ദനങ്ങൾ കുട്ടികളേ!' : 'Congratulations Class 4!'}
          </h3>
          <p className="text-[#A881E6] text-lg sm:text-2xl font-black font-malayalam">
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
                i < score ? 'bg-[#FFD166]/20 text-[#FFD166] border border-[#FFD166]/40 font-black shadow-md shadow-amber-900/40' : 'bg-[#1D1A24] text-[#A59CB5]/30 border border-[#2E263B]'
              }`}
            >
              ★
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] font-bold transition-all border border-[#2E263B] active:scale-95"
          >
            <RotateCcw className="w-5 h-5 text-[#7950B8]" />
            <span className="font-malayalam">{language === 'ml' ? 'വീണ്ടും കളിക്കാം' : 'Play Again'}</span>
          </button>

          {onFinish && (
            <button
              onClick={onFinish}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black transition-all shadow-lg shadow-purple-950/50 active:scale-95 text-base"
            >
              <span className="font-malayalam">{language === 'ml' ? 'പാഠത്തിലേക്ക് മടങ്ങുക' : 'Return to Lesson'}</span>
              <ArrowRight className="w-5 h-5 text-white" />
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
    <div className="bg-[#111114] p-5 sm:p-8 rounded-4xl border border-[#2E263B] shadow-2xl space-y-6 max-w-4xl mx-auto select-none">
      
      {/* Top Game Bar: Progress, Timer & Teacher Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2E263B]">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#1D1A24] text-[#A881E6] flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-[#A881E6] font-sans">
            VAAYANA CLASSROOM CHALLENGE
          </span>
          {currentQ.sourcePageRef && (
            <span className="hidden sm:inline-block text-[11px] font-bold text-[#A59CB5] bg-[#17151B] px-2.5 py-0.5 rounded-lg border border-[#2E263B]">
              {currentQ.sourcePageRef}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Animated Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs sm:text-sm font-black border transition-colors ${
            timeLeft <= 5 
              ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse' 
              : 'bg-[#17151B] text-[#EDE5F7] border-[#2E263B]'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          <button
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="p-2 rounded-xl bg-[#17151B] text-[#EDE5F7] hover:bg-[#1D1A24] border border-[#2E263B] transition-all"
            title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
          >
            {isTimerPaused ? <Play className="w-4 h-4 text-[#A881E6]" /> : <Pause className="w-4 h-4" />}
          </button>

          {!isAnswered && (
            <button
              onClick={handleRevealAnswer}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] text-xs font-extrabold border border-[#2E263B] shadow-sm"
              title="Reveal Answer for Class"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reveal</span>
            </button>
          )}

          <span className="text-xs font-black text-white px-3.5 py-1 bg-[#7950B8] rounded-full font-mono shadow-sm">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Large Smartboard Question Banner */}
      <div className="bg-gradient-to-br from-[#1D1A24] to-[#17151B] text-[#EDE5F7] p-6 sm:p-10 rounded-3xl text-center shadow-xl relative overflow-hidden border border-[#3D2D56]">
        <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black leading-snug font-malayalam text-[#EDE5F7]`}>
          {questionText}
        </h3>
        {language === 'ml' && currentQ.questionEn && currentQ.questionEn !== currentQ.questionMl && (
          <p className="text-xs sm:text-sm text-[#A59CB5] mt-2 italic">
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

          const playfulBadgeColors = [
            'bg-[#FFD166]/15 text-[#FFD166] border border-[#FFD166]/30',
            'bg-[#65C7F7]/15 text-[#65C7F7] border border-[#65C7F7]/30',
            'bg-[#72D6B0]/15 text-[#72D6B0] border border-[#72D6B0]/30',
            'bg-[#F5A6C8]/15 text-[#F5A6C8] border border-[#F5A6C8]/30',
          ];

          let tileClass = 'bg-[#17151B] text-[#EDE5F7] border-2 border-[#2E263B] hover:border-[#7950B8] shadow-sm hover:shadow-md';
          let shapeBadgeClass = playfulBadgeColors[idx % playfulBadgeColors.length];

          if (isAnswered) {
            if (isCorrectChoice) {
              tileClass = 'bg-emerald-950/60 text-emerald-100 border-2 border-emerald-500 ring-4 ring-emerald-500/30 shadow-lifted scale-[1.02]';
              shapeBadgeClass = 'bg-emerald-600 text-white border-transparent';
            } else if (isSelected) {
              tileClass = 'bg-rose-950/60 text-rose-100 border-2 border-rose-500 opacity-90 ring-2 ring-rose-500/30';
              shapeBadgeClass = 'bg-rose-600 text-white border-transparent';
            } else {
              tileClass = 'opacity-30 bg-[#111114] text-neutral-500 border-[#2E263B]';
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
              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100'
              : 'bg-amber-950/60 border-amber-500/60 text-amber-100'
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

          <p className="text-base sm:text-xl font-bold font-malayalam leading-relaxed mt-2 text-[#EDE5F7]">
            {explanation}
          </p>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-sm sm:text-base shadow-lg shadow-purple-950/50 transition-all active:scale-95"
            >
              <span className="font-malayalam">
                {currentIndex === questions.length - 1 ? 'ഫലം കാണാം (Finish)' : 'അടുത്ത ചോദ്യം (Next)'}
              </span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default QuizActivity;
