import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  useEffect(() => {
    if (isOpen) {
      // Trigger airplane fly-by whoosh sound and celebration fanfare
      soundService.play('whoosh');
      setTimeout(() => {
        soundService.play('celebration');
      }, 350);

      // Fire double confetti salvo on smartboard
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { x: 0.3, y: 0.5 },
          colors: ['#9ACD32', '#FACC15', '#38BDF8', '#F43F5E', '#A855F7']
        });
        setTimeout(() => {
          confetti({
            particleCount: 70,
            spread: 90,
            origin: { x: 0.7, y: 0.5 },
            colors: ['#9ACD32', '#FACC15', '#38BDF8', '#F43F5E', '#A855F7']
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden select-none">
        
        {/* =========================================================================
            LARGE ANIMATED FLYING CARTOON AIRPLANE WITH STREAMING BANNER
           ========================================================================= */}
        <motion.div
          initial={{ x: '-130vw', y: 40 }}
          animate={{ x: '130vw', y: -20 }}
          transition={{ 
            duration: 5.5, 
            repeat: Infinity, 
            ease: 'linear'
          }}
          className="absolute top-16 sm:top-24 z-40 pointer-events-none flex items-center gap-4"
        >
          {/* Detailed Cartoon Airplane SVG (180px wide) */}
          <div className="relative filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
            <svg width="220" height="110" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Airplane Main Fuselage */}
              <ellipse cx="110" cy="55" rx="85" ry="24" fill="#F59E0B" stroke="#78350F" strokeWidth="4" />
              <path d="M185 55 Q205 55 210 57 Q205 62 185 62 Z" fill="#EF4444" stroke="#78350F" strokeWidth="3" />
              
              {/* Cockpit Windshield */}
              <path d="M150 42 Q172 45 178 54 L148 54 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
              
              {/* Passenger Windows */}
              <circle cx="75" cy="54" r="5" fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />
              <circle cx="95" cy="54" r="5" fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />
              <circle cx="115" cy="54" r="5" fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />
              <circle cx="135" cy="54" r="5" fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />

              {/* Main Wing (Angled down) */}
              <polygon points="90,56 120,56 100,95 75,95" fill="#D97706" stroke="#78350F" strokeWidth="4" />
              
              {/* Tail Fin */}
              <polygon points="35,46 55,46 32,15 20,15" fill="#EF4444" stroke="#78350F" strokeWidth="4" />

              {/* Spinning Front Propeller Hub & Blades */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 0.15, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '210px 56px' }}
              >
                <line x1="210" y1="36" x2="210" y2="76" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
                <circle cx="210" cy="56" r="6" fill="#FACC15" stroke="#78350F" strokeWidth="2" />
              </motion.g>

              {/* Vaayana Emblem on Wing */}
              <text x="78" y="82" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif">വായന</text>
            </svg>
          </div>

          {/* Tow Rope */}
          <div className="w-12 h-1 bg-amber-200/80 rounded" />

          {/* Large Trailing Celebration Banner */}
          <motion.div 
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 via-vaayana-lime to-lime-300 text-vaayana-dark border-3 border-white shadow-[0_8px_20px_rgba(154,205,50,0.5)] flex items-center gap-3 whitespace-nowrap"
          >
            <Trophy className="w-6 h-6 text-vaayana-dark shrink-0" />
            <span className="font-extrabold text-sm sm:text-base font-malayalam tracking-tight">
              {language === 'ml' 
                ? 'അഭിനന്ദനങ്ങൾ! ഈ അധ്യായം വിജയകരമായി പൂർത്തിയായി! 🏆' 
                : 'Congratulations! Chapter Completed Successfully! 🏆'}
            </span>
          </motion.div>
        </motion.div>

        {/* =========================================================================
            CENTRAL MILESTONE CELEBRATION CARD
           ========================================================================= */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative z-30 max-w-lg w-full bg-vaayana-darkSurface border-3 border-vaayana-lime/60 rounded-4xl p-8 sm:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6"
        >
          {/* Close X Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-vaayana-dark border border-vaayana-darkBorder text-vaayana-textLightMuted hover:text-white flex items-center justify-center transition-all"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Golden Trophy Icon Badge */}
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-3xl bg-vaayana-lime/20 border-3 border-vaayana-lime flex items-center justify-center text-vaayana-lime shadow-limeGlow mx-auto">
              <Trophy className="w-12 h-12" />
            </div>
            <Sparkles className="w-7 h-7 text-amber-300 absolute -top-2 -right-2 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-vaayana-lime text-vaayana-dark font-black text-xs uppercase tracking-wider shadow-sm">
              {language === 'ml' ? 'അധ്യായ പൂർത്തീകരണം' : 'Chapter Mastered!'}
            </span>
            
            <h3 className="text-2xl sm:text-3xl font-black text-vaayana-textLight font-malayalam pt-2 leading-tight">
              {language === 'ml' ? chapterTitleMl : chapterTitleEn}
            </h3>

            <p className="text-xs sm:text-sm text-vaayana-textLightMuted font-medium font-malayalam leading-relaxed pt-1">
              {language === 'ml' 
                ? 'നിങ്ങൾ ഈ പാഠത്തിലെ എല്ലാ ആശയങ്ങളും സംവേദനാത്മക പ്രവർത്തനങ്ങളും വിജയകരമായി പഠിച്ചു!' 
                : 'You have mastered all concepts, visual activities, and interactive challenges in this chapter!'}
            </p>
          </div>

          {/* Next Chapter Destination Card */}
          {nextChapterTitleEn && (
            <div className="p-4 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder text-left space-y-1">
              <span className="text-[10px] font-mono font-bold text-vaayana-lime uppercase tracking-wider block">
                {language === 'ml' ? 'അടുത്ത പാഠം (Next Destination):' : 'Next Destination:'}
              </span>
              <p className="text-base font-black text-white font-malayalam">
                {language === 'ml' ? nextChapterTitleMl : nextChapterTitleEn}
              </p>
            </div>
          )}

          {/* Smartboard-Friendly Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {onClose && (
              <button
                onClick={onClose}
                className="w-full sm:w-auto flex-1 py-4 px-5 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-bold text-xs sm:text-sm border border-vaayana-darkBorder transition-all active:scale-95"
              >
                {language === 'ml' ? 'പാഠത്തിൽ തുടരുക' : 'Stay in Lesson'}
              </button>
            )}

            {onProceed && (
              <button
                onClick={onProceed}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black text-xs sm:text-sm shadow-limeGlow active:scale-95 transition-all flex items-center justify-center gap-2"
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
