import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConceptAnimationData } from '../../types';
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2,
  TreePine,
  ArrowRight,
  Calculator
} from 'lucide-react';

interface ConceptAnimatorProps {
  conceptAnimation: ConceptAnimationData;
}

export const ConceptAnimator: React.FC<ConceptAnimatorProps> = ({ conceptAnimation }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = conceptAnimation.steps || [];
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  if (!steps.length) return null;

  return (
    <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-surface-subtle shadow-card space-y-6">
      
      {/* Header with Title and Step Dots */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-subtle">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-kerala-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Concept Visualizer
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-navy-900 mt-2 font-malayalam">
            {conceptAnimation.titleMl || conceptAnimation.titleEn}
          </h3>
          <p className="text-xs text-slate-500">{conceptAnimation.titleEn}</p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`transition-all ${
                idx === currentStepIndex
                  ? 'w-7 h-3 bg-kerala-blue rounded-full'
                  : idx < currentStepIndex
                  ? 'w-3 h-3 bg-emerald-500 rounded-full'
                  : 'w-3 h-3 bg-slate-200 rounded-full'
              }`}
              title={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Interactive Stage for the Animated Step */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-6 min-h-[220px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full space-y-4"
          >
            {/* Step Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-navy-900 font-bold text-xs shadow-sm border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-kerala-gold text-navy-900 flex items-center justify-center text-[11px] font-black">
                {currentStep.stepNumber}
              </span>
              <span className="font-malayalam">{currentStep.labelMl}</span>
              <span className="text-slate-400">({currentStep.labelEn})</span>
            </div>

            {/* Visual Subject Stage representation */}
            {conceptAnimation.type === 'plant_growth' && (
              <div className="py-4 flex justify-center items-end gap-6 h-28">
                {steps.map((s, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: idx === currentStepIndex ? 1.25 : 0.85,
                      opacity: idx <= currentStepIndex ? 1 : 0.25
                    }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                      idx === currentStepIndex ? 'bg-emerald-600 text-white shadow-card' : 'bg-white text-slate-400'
                    }`}>
                      {idx === 0 ? '🌱' : idx === 1 ? '🌿' : idx === 2 ? '🪴' : '🌸'}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 mt-1 font-malayalam">{s.labelMl}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {conceptAnimation.type === 'food_chain' && (
              <div className="py-4 flex flex-wrap justify-center items-center gap-3">
                {steps.map((s, idx) => (
                  <React.Fragment key={idx}>
                    <motion.div
                      animate={{
                        scale: idx === currentStepIndex ? 1.15 : 0.9,
                        opacity: idx <= currentStepIndex ? 1 : 0.3
                      }}
                      className={`p-3 rounded-2xl border font-bold text-xs flex items-center gap-2 shadow-sm ${
                        idx === currentStepIndex
                          ? 'bg-white border-kerala-blue text-navy-900 ring-2 ring-kerala-blue/30'
                          : 'bg-white/60 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="text-base">{idx === 0 ? '🌾' : idx === 1 ? '🦗' : idx === 2 ? '🐸' : idx === 3 ? '🐍' : '🦅'}</span>
                      <span className="font-malayalam">{s.labelMl}</span>
                    </motion.div>
                    {idx < steps.length - 1 && (
                      <ArrowRight className={`w-4 h-4 transition-opacity ${idx < currentStepIndex ? 'text-emerald-500' : 'text-slate-300'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {conceptAnimation.type === 'count_group' && (
              <div className="py-2 flex flex-wrap justify-center gap-3">
                {Array.from({ length: currentStep.stepNumber || 3 }).map((_, gIdx) => (
                  <motion.div
                    key={gIdx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-3 bg-white rounded-2xl border border-blue-200 shadow-sm flex items-center gap-2"
                  >
                    <span className="text-lg">🥥</span>
                    <span className="text-lg">🥥</span>
                    <span className="text-lg">🥥</span>
                    <span className="text-xs font-bold text-navy-900">3 nos</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Malayalam and English Explanation */}
            <div className="space-y-1 max-w-xl mx-auto pt-2">
              <p className="text-base sm:text-lg font-bold text-navy-900 font-malayalam leading-relaxed">
                {currentStep.descriptionMl}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                {currentStep.descriptionEn}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-slate-200 disabled:opacity-30 text-navy-900 font-bold text-xs transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>മുൻപത്തേത് (Previous)</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-400">
          Step {currentStepIndex + 1} of {steps.length}
        </span>

        {currentStepIndex < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs transition-all shadow-card"
          >
            <span>അടുത്ത ഘട്ടം (Next Step)</span>
            <ChevronRight className="w-4 h-4 text-kerala-gold" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-kerala-gold hover:bg-amber-400 text-navy-900 font-bold text-xs transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>വീണ്ടും കാണാം (Replay)</span>
          </button>
        )}
      </div>

    </div>
  );
};
