import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Trophy, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

interface ChapterTransitionProps {
  isOpen: boolean;
  chapterTitleEn: string;
  chapterTitleMl: string;
  nextChapterTitleEn?: string;
  nextChapterTitleMl?: string;
  onProceed?: () => void;
  onClose?: () => void;
}

export const ChapterTransition: React.FC<ChapterTransitionProps> = ({
  isOpen,
  chapterTitleEn,
  chapterTitleMl,
  nextChapterTitleEn,
  nextChapterTitleMl,
  onProceed,
  onClose
}) => {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'flying' | 'milestone'>('flying');

  useEffect(() => {
    if (isOpen) {
      setPhase(shouldReduceMotion ? 'milestone' : 'flying');

      // Lock background scrolling and prevent interaction while celebration is active
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Trigger airplane fly-by whoosh sound and celebration fanfare
      soundService.play('whoosh');
      setTimeout(() => {
        soundService.play('celebration');
      }, 400);

      // Fire confetti salvo on smartboard with playful child-friendly palette
      try {
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { x: 0.3, y: 0.5 },
          colors: ['#7950B8', '#FFD166', '#FF8066', '#65C7F7', '#72D6B0', '#F5A6C8', '#FFA552']
        });
        setTimeout(() => {
          confetti({
            particleCount: 65,
            spread: 90,
            origin: { x: 0.7, y: 0.5 },
            colors: ['#7950B8', '#FFD166', '#FF8066', '#65C7F7', '#72D6B0', '#F5A6C8', '#FFA552']
          });
        }, 350);
      } catch (_) {}

      // Automatic timer fallback to milestone card after flight (4.2 seconds)
      const flightTimer = setTimeout(() => {
        setPhase('milestone');
      }, 4200);

      return () => {
        clearTimeout(flightTimer);
        document.body.style.overflow = originalOverflow;
        soundService.stopCelebration();
      };
    } else {
      soundService.stopCelebration();
    }
  }, [isOpen, shouldReduceMotion]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#090909]/95 backdrop-blur-2xl overflow-hidden select-none transition-all duration-300"
        onClick={() => {
          // Allow teacher/child to click anywhere during flight to advance immediately to milestone card
          if (phase === 'flying') {
            setPhase('milestone');
          }
        }}
      >
        {/* =========================================================================
            PHASE 1: THE AIRPLANE AS THE SOLE VISUAL FOCUS
            All buttons, cards, text, navigation, and other UI disappear completely.
           ========================================================================= */}
        {phase === 'flying' && !shouldReduceMotion && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            
            {/* Soft background clouds drifting in depth behind airplane */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              className="absolute inset-0 overflow-hidden"
            >
              <div className="absolute top-1/4 left-1/4 w-32 h-12 bg-white/10 rounded-full blur-xl" />
              <div className="absolute bottom-1/3 right-1/4 w-44 h-16 bg-white/10 rounded-full blur-xl" />
            </motion.div>

            {/* Cruising Cartoon Airplane with Streaming Banner right through center */}
            <motion.div
              initial={{ x: '-120vw', y: 0 }}
              animate={{ 
                x: '120vw', 
                y: [0, -25, 15, -15, 0] 
              }}
              transition={{ 
                x: {
                  duration: 4.0, 
                  ease: [0.22, 1, 0.36, 1]
                },
                y: {
                  duration: 4.0,
                  ease: 'easeInOut'
                }
              }}
              onAnimationComplete={() => setPhase('milestone')}
              className="flex items-center gap-6 scale-110 sm:scale-125 will-change-transform"
            >
              {/* Detailed Cartoon Airplane SVG */}
              <div className="relative filter drop-shadow-[0_15px_30px_rgba(121,80,184,0.45)]">
                <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Airplane Main Fuselage */}
                  <ellipse cx="120" cy="60" rx="92" ry="26" fill="#F59E0B" stroke="#78350F" strokeWidth="3.5" />
                  <path d="M202 60 Q224 60 228 62 Q224 67 202 67 Z" fill="#7950B8" stroke="#563580" strokeWidth="2.5" />
                  
                  {/* Cockpit Windshield */}
                  <path d="M165 46 Q188 49 194 59 L162 59 Z" fill="#EDE5F7" stroke="#7950B8" strokeWidth="2.5" />
                  
                  {/* Passenger Windows */}
                  <circle cx="82" cy="58" r="5.5" fill="#FFFFFF" stroke="#563580" strokeWidth="2" />
                  <circle cx="104" cy="58" r="5.5" fill="#FFFFFF" stroke="#563580" strokeWidth="2" />
                  <circle cx="126" cy="58" r="5.5" fill="#FFFFFF" stroke="#563580" strokeWidth="2" />
                  <circle cx="148" cy="58" r="5.5" fill="#FFFFFF" stroke="#563580" strokeWidth="2" />

                  {/* Main Wing (Angled down) */}
                  <polygon points="98,60 132,60 110,104 82,104" fill="#563580" stroke="#371E56" strokeWidth="3" />
                  
                  {/* Tail Fin */}
                  <polygon points="38,50 60,50 35,16 22,16" fill="#7950B8" stroke="#563580" strokeWidth="3" />

                  {/* Spinning Front Propeller Hub & Blades */}
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.28, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '228px 61px' }}
                  >
                    <line x1="228" y1="38" x2="228" y2="84" stroke="#563580" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="228" cy="61" r="6.5" fill="#EDE5F7" stroke="#7950B8" strokeWidth="2" />
                  </motion.g>

                  {/* Vaayana Emblem on Wing */}
                  <text x="86" y="89" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="sans-serif">വായന</text>
                </svg>
              </div>

              {/* Tow Rope */}
              <div className="w-14 h-0.5 bg-[#EDE5F7]/80 rounded shadow-sm" />

              {/* Trailing Celebration Banner */}
              <motion.div 
                animate={{ y: [-3, 3, -3], rotate: [-0.6, 0.6, -0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#17151B] via-[#1D1A24] to-[#17151B] text-[#EDE5F7] border-2 border-[#7950B8] shadow-[0_10px_35px_rgba(121,80,184,0.6)] flex items-center gap-3.5 whitespace-nowrap"
              >
                <Trophy className="w-7 h-7 text-[#FFD166] shrink-0" />
                <span className="font-extrabold text-base sm:text-lg font-malayalam tracking-tight text-[#EDE5F7]">
                  {language === 'ml' 
                    ? 'അഭിനന്ദനങ്ങൾ! ഈ അധ്യായം വിജയകരമായി പൂർത്തിയായി! 🏆' 
                    : 'Congratulations! Chapter Completed Successfully! 🏆'}
                </span>
              </motion.div>
            </motion.div>

            {/* Subtle tap prompt at bottom */}
            <div className="absolute bottom-10 text-xs font-medium text-[#A59CB5] tracking-wider uppercase opacity-75">
              {language === 'ml' ? 'തുടരാൻ ടാപ്പ് ചെയ്യുക' : 'Tap anywhere to continue'}
            </div>
          </div>
        )}

        {/* =========================================================================
            PHASE 2: CENTRAL MILESTONE CELEBRATION CARD
            Appears smoothly after the airplane finishes its flight.
           ========================================================================= */}
        {phase === 'milestone' && (
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative z-30 max-w-lg w-full bg-[#111114] border-2 border-[#2E263B] rounded-4xl p-8 sm:p-10 text-center shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#17151B] hover:bg-[#1D1A24] text-[#A59CB5] hover:text-[#EDE5F7] flex items-center justify-center transition-all border border-[#2E263B]"
                title="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Golden Trophy Icon Badge */}
            <div className="relative inline-block">
              <div className="w-22 h-22 rounded-3xl bg-[#1D1A24] border-2 border-[#FFD166]/30 flex items-center justify-center text-[#FFD166] shadow-sm mx-auto p-4">
                <Trophy className="w-12 h-12 text-[#FFD166]" />
              </div>
              <Sparkles className="w-7 h-7 text-[#FFD166] absolute -top-2 -right-2 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#1D1A24] text-[#A881E6] font-black text-xs uppercase tracking-wider border border-[#7950B8]/30">
                {language === 'ml' ? 'അധ്യായ പൂർത്തീകരണം' : 'Chapter Mastered!'}
              </span>
              
              <h3 className="text-2xl sm:text-3xl font-black text-[#EDE5F7] font-malayalam pt-2 leading-tight">
                {language === 'ml' ? chapterTitleMl : chapterTitleEn}
              </h3>

              <p className="text-xs sm:text-sm text-[#A59CB5] font-medium font-malayalam leading-relaxed pt-1">
                {language === 'ml' 
                  ? 'നിങ്ങൾ ഈ പാഠത്തിലെ എല്ലാ ആശയങ്ങളും സംവേദനാത്മക പ്രവർത്തനങ്ങളും വിജയകരമായി പഠിച്ചു!' 
                  : 'You have mastered all concepts, visual activities, and interactive challenges in this chapter!'}
              </p>
            </div>

            {/* Next Chapter Destination Card */}
            {nextChapterTitleEn && (
              <div className="p-4 rounded-2xl bg-[#17151B] border border-[#2E263B] text-left space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#72D6B0] uppercase tracking-wider block">
                  {language === 'ml' ? 'അടുത്ത പാഠം (Next Destination):' : 'Next Destination:'}
                </span>
                <p className="text-base font-black text-[#EDE5F7] font-malayalam">
                  {language === 'ml' ? nextChapterTitleMl : nextChapterTitleEn}
                </p>
              </div>
            )}

            {/* Smartboard-Friendly Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto flex-1 py-4 px-5 rounded-2xl bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] font-bold text-xs sm:text-sm border border-[#2E263B] transition-all active:scale-95"
                >
                  {language === 'ml' ? 'പാഠത്തിൽ തുടരുക' : 'Stay in Lesson'}
                </button>
              )}

              {onProceed && (
                <button
                  onClick={onProceed}
                  className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-xs sm:text-sm shadow-lg shadow-purple-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>{language === 'ml' ? 'അടുത്ത പാഠത്തിലേക്ക് പറക്കാം ➔' : 'Fly to Next Chapter ➔'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </AnimatePresence>
  );
};

export default ChapterTransition;
