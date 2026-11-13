import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmphasisWord, EmphasisAnimationEffect } from '../../types';
import { RotateCcw, Volume2, Sparkles, Flame, Snowflake, ArrowUp, ArrowDown, Zap, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmphasisWordAnimatorProps {
  emphasisWord: EmphasisWord;
  onComplete?: () => void;
}

export const EmphasisWordAnimator: React.FC<EmphasisWordAnimatorProps> = ({
  emphasisWord,
  onComplete
}) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const replay = () => {
    setAnimationKey(prev => prev + 1);
    setIsPlaying(true);
    if (emphasisWord.effect === 'enormous' || emphasisWord.effect === 'huge') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const getEffectVariants = (effect: EmphasisAnimationEffect) => {
    switch (effect) {
      case 'enormous':
      case 'huge':
        return {
          initial: { scale: 0.15, opacity: 0, rotate: -5 },
          animate: { 
            scale: [0.15, 1.45, 1.15, 1.3], 
            opacity: 1, 
            rotate: [-5, 4, -2, 0],
            transition: { 
              duration: 1.8, 
              times: [0, 0.5, 0.75, 1],
              ease: "easeOut"
            } 
          }
        };

      case 'tiny':
        return {
          initial: { scale: 2.2, opacity: 0 },
          animate: { 
            scale: [2.2, 0.25, 0.4], 
            opacity: 1,
            transition: { duration: 1.6, times: [0, 0.7, 1], ease: "easeInOut" } 
          }
        };

      case 'fast':
        return {
          initial: { x: -600, opacity: 0, skewX: 20 },
          animate: { 
            x: [ -600, 40, -15, 0 ], 
            opacity: 1,
            skewX: [20, -10, 0],
            transition: { duration: 0.8, ease: "backOut" } 
          }
        };

      case 'slow':
        return {
          initial: { x: -300, opacity: 0 },
          animate: { 
            x: 0, 
            opacity: 1,
            transition: { duration: 3.2, ease: "linear" } 
          }
        };

      case 'up':
        return {
          initial: { y: 250, opacity: 0 },
          animate: { 
            y: [250, -30, 0], 
            opacity: 1,
            transition: { duration: 1.4, ease: "easeOut" } 
          }
        };

      case 'down':
        return {
          initial: { y: -250, opacity: 0 },
          animate: { 
            y: [-250, 30, 0], 
            opacity: 1,
            transition: { duration: 1.2, type: "spring", bounce: 0.6 } 
          }
        };

      case 'hot':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { 
            scale: [0.8, 1.1, 1.05], 
            opacity: 1,
            filter: [
              "drop-shadow(0px 0px 0px rgba(239,68,68,0))", 
              "drop-shadow(0px 0px 30px rgba(239,68,68,0.8))", 
              "drop-shadow(0px 0px 15px rgba(245,158,11,0.6))"
            ],
            transition: { duration: 1.6, repeat: Infinity, repeatType: "reverse" as const } 
          }
        };

      case 'cold':
        return {
          initial: { scale: 0.9, opacity: 0 },
          animate: { 
            scale: [0.9, 1.02, 1], 
            opacity: 1,
            filter: [
              "drop-shadow(0px 0px 0px rgba(59,130,246,0))", 
              "drop-shadow(0px 0px 25px rgba(59,130,246,0.8))", 
              "drop-shadow(0px 0px 10px rgba(147,197,253,0.5))"
            ],
            transition: { duration: 2.0, repeat: Infinity, repeatType: "reverse" as const } 
          }
        };

      case 'bounce':
      default:
        return {
          initial: { y: -100, opacity: 0 },
          animate: { 
            y: [ -100, 0, -30, 0, -10, 0 ], 
            opacity: 1,
            transition: { duration: 1.4, ease: "easeOut" } 
          }
        };
    }
  };

  const effectStyleConfig: Record<EmphasisAnimationEffect, {
    bg: string;
    border: string;
    textColor: string;
    badgeBg: string;
    icon: React.ReactNode;
  }> = {
    enormous: {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100',
      border: 'border-amber-300',
      textColor: 'text-amber-900',
      badgeBg: 'bg-amber-200 text-amber-950',
      icon: <Sparkles className="w-6 h-6 text-amber-600" />
    },
    huge: {
      bg: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100',
      border: 'border-purple-300',
      textColor: 'text-purple-950',
      badgeBg: 'bg-purple-200 text-purple-950',
      icon: <Sparkles className="w-6 h-6 text-purple-600" />
    },
    tiny: {
      bg: 'bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50',
      border: 'border-teal-300',
      textColor: 'text-teal-900',
      badgeBg: 'bg-teal-200 text-teal-950',
      icon: <Sparkles className="w-4 h-4 text-teal-600" />
    },
    fast: {
      bg: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-red-50',
      border: 'border-yellow-400',
      textColor: 'text-red-900',
      badgeBg: 'bg-yellow-200 text-yellow-950',
      icon: <Zap className="w-6 h-6 text-yellow-600" />
    },
    slow: {
      bg: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50',
      border: 'border-blue-300',
      textColor: 'text-blue-900',
      badgeBg: 'bg-blue-200 text-blue-950',
      icon: <Clock className="w-6 h-6 text-blue-600" />
    },
    up: {
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      border: 'border-emerald-300',
      textColor: 'text-emerald-950',
      badgeBg: 'bg-emerald-200 text-emerald-950',
      icon: <ArrowUp className="w-6 h-6 text-emerald-600" />
    },
    down: {
      bg: 'bg-gradient-to-br from-stone-50 to-amber-50',
      border: 'border-amber-300',
      textColor: 'text-amber-950',
      badgeBg: 'bg-amber-200 text-amber-950',
      icon: <ArrowDown className="w-6 h-6 text-amber-600" />
    },
    hot: {
      bg: 'bg-gradient-to-br from-red-50 via-orange-50 to-amber-100',
      border: 'border-red-300',
      textColor: 'text-red-950',
      badgeBg: 'bg-red-200 text-red-950',
      icon: <Flame className="w-6 h-6 text-red-600" />
    },
    cold: {
      bg: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100',
      border: 'border-cyan-300',
      textColor: 'text-blue-950',
      badgeBg: 'bg-cyan-200 text-cyan-950',
      icon: <Snowflake className="w-6 h-6 text-cyan-600" />
    },
    bounce: {
      bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50',
      border: 'border-fuchsia-300',
      textColor: 'text-fuchsia-950',
      badgeBg: 'bg-fuchsia-200 text-fuchsia-950',
      icon: <Sparkles className="w-6 h-6 text-fuchsia-600" />
    },
    none: {
      bg: 'bg-surface',
      border: 'border-slate-200',
      textColor: 'text-navy-900',
      badgeBg: 'bg-slate-200 text-slate-800',
      icon: <Sparkles className="w-6 h-6 text-slate-500" />
    }
  };

  const style = effectStyleConfig[emphasisWord.effect] || effectStyleConfig.enormous;
  const variants = getEffectVariants(emphasisWord.effect);

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 border-2 ${style.border} ${style.bg} shadow-lifted flex flex-col items-center justify-center min-h-[360px] text-center select-none`}>
      
      {/* Top Tag & Effect Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 text-navy-900 border border-slate-200 shadow-sm flex items-center gap-1.5">
          {style.icon}
          <span>Word Power: {emphasisWord.effect.toUpperCase()}</span>
        </span>
      </div>

      {/* Top Right Replay Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={replay}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-navy-900 font-bold text-xs border border-slate-200 shadow-sm transition-all active:scale-95"
          title="Replay animation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-navy-800" />
          <span>Replay</span>
        </button>
      </div>

      {/* Main Animated Word Display */}
      <div className="my-auto py-8 cursor-pointer" onClick={replay}>
        <AnimatePresence mode="wait">
          <motion.div
            key={animationKey}
            initial={variants.initial}
            animate={variants.animate}
            className="flex flex-col items-center justify-center"
          >
            <h1 className={`font-black tracking-tight ${style.textColor} leading-none ${
              emphasisWord.effect === 'enormous' || emphasisWord.effect === 'huge'
                ? 'text-6xl sm:text-8xl md:text-9xl'
                : emphasisWord.effect === 'tiny'
                ? 'text-4xl sm:text-5xl'
                : 'text-5xl sm:text-7xl md:text-8xl'
            }`}>
              {emphasisWord.word}
            </h1>
          </motion.div>
        </AnimatePresence>

        {/* Malayalam Meaning Reveal Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <div className={`px-5 py-2.5 rounded-2xl font-malayalam font-extrabold text-xl sm:text-2xl shadow-card border border-white/40 ${style.badgeBg}`}>
            {emphasisWord.meaningMl}
          </div>
          {emphasisWord.exampleSentenceEn && (
            <p className="text-sm sm:text-base font-semibold text-slate-700 mt-2 italic max-w-lg">
              "{emphasisWord.exampleSentenceEn}"
            </p>
          )}
          {emphasisWord.exampleSentenceMl && (
            <p className="text-xs sm:text-sm font-malayalam text-slate-500 max-w-lg">
              {emphasisWord.exampleSentenceMl}
            </p>
          )}
        </motion.div>
      </div>

      {/* Bottom Hint */}
      <div className="text-[11px] font-bold text-slate-400 mt-2">
        Touch anywhere to re-trigger smartboard animation
      </div>

    </div>
  );
};
