import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
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
    } else {
      soundService.stopCelebration();
    }
    return () => {
      soundService.stopCelebration();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden select-none">
        
        {/* =========================================================================
            SLOW, SMOOTH & GENTLE FLYING CARTOON AIRPLANE WITH STREAMING BANNER
            Duration slowed down to 16 seconds for a gentle, pleasing cruise.
           ========================================================================= */}
        {!shouldReduceMotion ? (
          <motion.div
            initial={{ x: '-120vw', y: 35 }}
            animate={{ 
              x: '120vw', 
              y: [35, 18, 30, 22, 35] 
            }}
            transition={{ 
              x: {
                duration: 16, 
                repeat: Infinity, 
                ease: 'linear'
              },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="absolute top-12 sm:top-20 z-40 pointer-events-none flex items-center gap-4 will-change-transform"
          >
            {/* Detailed Cartoon Airplane SVG */}
            <div className="relative filter drop-shadow-[0_10px_20px_rgba(86,53,128,0.35)]">
              <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Airplane Main Fuselage */}
                <ellipse cx="110" cy="55" rx="85" ry="24" fill="#F59E0B" stroke="#78350F" strokeWidth="3.5" />
                <path d="M185 55 Q205 55 210 57 Q205 62 185 62 Z" fill="#7950B8" stroke="#563580" strokeWidth="2.5" />
                
                {/* Cockpit Windshield */}
                <path d="M150 42 Q172 45 178 54 L148 54 Z" fill="#EDE5F7" stroke="#7950B8" strokeWidth="2.5" />
                
                {/* Passenger Windows */}
                <circle cx="75" cy="54" r="5" fill="#FFFFFF" stroke="#563580" strokeWidth="2" />
                <circle cx="95" cy="54" r="5" fill="#FFFFFF" stroke="#563580" strokeWidth="2" />
                <circle cx="115" cy="54" r="5" fill="#FFFFFF" stroke="#563580" strokeWidth="2" />
                <circle cx="135" cy="54" r="5" fill="#FFFFFF" stroke="#563580" strokeWidth="2" />

                {/* Main Wing (Angled down) */}
                <polygon points="90,56 120,56 100,95 75,95" fill="#563580" stroke="#371E56" strokeWidth="3" />
                
                {/* Tail Fin */}
                <polygon points="35,46 55,46 32,15 20,15" fill="#7950B8" stroke="#563580" strokeWidth="3" />

                {/* Spinning Front Propeller Hub & Blades */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '210px 56px' }}
                >
                  <line x1="210" y1="36" x2="210" y2="76" stroke="#563580" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="210" cy="56" r="6" fill="#EDE5F7" stroke="#7950B8" strokeWidth="2" />
                </motion.g>

                {/* Vaayana Emblem on Wing */}
                <text x="78" y="82" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif">വായന</text>
              </svg>
            </div>

            {/* Tow Rope */}
            <div className="w-12 h-0.5 bg-purple-300 rounded" />

            {/* Trailing Celebration Banner */}
            <motion.div 
              animate={{ y: [-2, 2, -2], rotate: [-0.5, 0.5, -0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#17151B] via-[#1D1A24] to-[#17151B] text-[#EDE5F7] border-2 border-[#7950B8] shadow-[0_8px_25px_rgba(121,80,184,0.45)] flex items-center gap-3 whitespace-nowrap"
            >
              <Trophy className="w-6 h-6 text-[#FFD166] shrink-0" />
              <span className="font-extrabold text-sm sm:text-base font-malayalam tracking-tight text-[#EDE5F7]">
                {language === 'ml' 
                  ? 'അഭിനന്ദനങ്ങൾ! ഈ അധ്യായം വിജയകരമായി പൂർത്തിയായി! 🏆' 
                  : 'Congratulations! Chapter Completed Successfully! 🏆'}
              </span>
            </motion.div>
          </motion.div>
        ) : (
          /* Reduced motion static celebration indicator */
          <div className="absolute top-12 z-40 px-6 py-3 rounded-2xl bg-[#17151B] border-2 border-[#7950B8] text-[#EDE5F7] shadow-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFD166]" />
            <span className="font-bold text-sm">Chapter Completed!</span>
          </div>
        )}

        {/* =========================================================================
            CENTRAL MILESTONE CELEBRATION CARD
           ========================================================================= */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="relative z-30 max-w-lg w-full bg-[#111114] border-2 border-[#2E263B] rounded-4xl p-8 sm:p-10 text-center shadow-2xl space-y-6"
        >
          {/* Close X Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#17151B] hover:bg-[#1D1A24] text-[#A59CB5] hover:text-[#EDE5F7] flex items-center justify-center transition-all border border-[#2E263B]"
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

      </div>
    </AnimatePresence>
  );
};

export default ChapterTransition;
