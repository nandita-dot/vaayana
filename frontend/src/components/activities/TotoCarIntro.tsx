import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Car, 
  Sparkles, 
  CheckCircle2, 
  Plus,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TotoCarIntro: React.FC = () => {
  const { language } = useLanguage();
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [showOverflow, setShowOverflow] = useState(false);

  const triggerDrive = () => {
    setAnimationStep(0);
    setShowOverflow(false);
    setTimeout(() => setAnimationStep(1), 500);
    setTimeout(() => setAnimationStep(2), 1500);
  };

  const handleAddOne = () => {
    setShowOverflow(true);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'ടോട്ടോയുടെ കാറും 9999 ഉം' : 'Toto the Toy Car & 9999'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'നാലക്ക സംഖ്യകളിലെ ഏറ്റവും വലിയ സംഖ്യ പരിചയപ്പെടാം' : 'Meet Toto and discover the largest four-digit number'}
            </p>
          </div>
        </div>

        <button
          onClick={triggerDrive}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-vaayana-lime text-vaayana-dark font-black text-xs shadow-limeGlow active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'ml' ? 'വീണ്ടും ഓടിക്കുക' : 'Drive Again'}</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card space-y-8">
        
        {/* Animated Road Track Scene */}
        <div className="relative w-full h-56 sm:h-64 rounded-3xl bg-gradient-to-b from-[#18251B] to-[#0D140F] border-4 border-[#25392A] shadow-inner overflow-hidden flex flex-col justify-end p-4">
          
          {/* Road stripes */}
          <div className="absolute bottom-10 inset-x-0 h-1 border-b-2 border-dashed border-amber-400/40" />

          {/* Toto Car Sprite */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: animationStep >= 1 ? 40 : -280 }}
            transition={{ type: 'spring', damping: 14, stiffness: 60 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Cute Cartoon Car SVG */}
            <svg viewBox="0 0 240 120" className="w-48 sm:w-60 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              {/* Wheels */}
              <circle cx="55" cy="95" r="20" fill="#111" stroke="#888" strokeWidth="4" />
              <circle cx="55" cy="95" r="8" fill="#FFF" />
              <circle cx="185" cy="95" r="20" fill="#111" stroke="#888" strokeWidth="4" />
              <circle cx="185" cy="95" r="8" fill="#FFF" />

              {/* Body */}
              <path d="M 20 85 L 220 85 Q 235 85 230 70 L 200 45 Q 180 20 140 20 L 70 20 Q 40 20 30 50 L 10 70 Q 5 85 20 85 Z" fill="#E11D48" />
              
              {/* Roof Window */}
              <path d="M 75 28 L 135 28 Q 165 28 185 48 L 195 48 L 195 55 L 45 55 Q 55 30 75 28 Z" fill="#93C5FD" opacity="0.9" />

              {/* Smile & Headlight */}
              <circle cx="225" cy="70" r="8" fill="#FDE047" />
              <circle cx="160" cy="40" r="5" fill="#1E293B" /> {/* Eyes */}
              <circle cx="115" cy="40" r="5" fill="#1E293B" />

              {/* Character Name */}
              <text x="100" y="78" fill="#FFF" fontSize="16" fontWeight="bold" fontFamily="sans-serif">TOTO</text>
            </svg>
          </motion.div>

          <div className="absolute top-4 right-4 text-xs font-mono font-bold text-vaayana-lime bg-vaayana-dark/80 px-3 py-1.5 rounded-full border border-vaayana-darkBorder">
            KL-04-TOTO
          </div>
        </div>

        {/* Toto's Big Number Plate: 9999 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-lg mx-auto bg-amber-300 p-4 sm:p-6 rounded-3xl border-4 border-amber-600 shadow-[0_8px_0_#B45309] text-center space-y-2 select-none"
        >
          <div className="flex items-center justify-between text-xs font-black uppercase text-amber-900 border-b border-amber-400 pb-1">
            <span>KERALA STATE</span>
            <span>CLASS 4 MATHS</span>
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4 py-2">
            {['9', '9', '9', '9'].map((digit, idx) => (
              <motion.span
                key={idx}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + idx * 0.15 }}
                className="w-14 sm:w-16 h-18 sm:h-20 bg-amber-50 rounded-2xl border-2 border-amber-500 shadow-sm flex items-center justify-center font-black text-4xl sm:text-5xl text-amber-950 font-mono"
              >
                {digit}
              </motion.span>
            ))}
          </div>
          <p className="text-xs sm:text-sm font-black text-amber-950 font-malayalam">
            {language === 'ml' ? 'ഏറ്റവും വലിയ നാലക്ക സംഖ്യ: ഒൻപതിനായിരത്തി തൊള്ളായിരത്തി തൊണ്ണൂറ്റിയൊൻപത്' : 'Largest 4-Digit Number: Nine Thousand Nine Hundred and Ninety-Nine'}
          </p>
        </motion.div>

        {/* Place-value breakdown grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-vaayana-soft border border-vaayana-softBorder text-center">
            <span className="text-xs text-vaayana-textDarkMuted block font-bold">{language === 'ml' ? 'ആയിരങ്ങൾ (Thousands)' : 'Thousands'}</span>
            <span className="text-2xl font-black text-vaayana-textDark font-mono">9 × 1000</span>
            <span className="text-xs font-black text-vaayana-limeDark block mt-1">= 9000</span>
          </div>
          <div className="p-4 rounded-2xl bg-vaayana-soft border border-vaayana-softBorder text-center">
            <span className="text-xs text-vaayana-textDarkMuted block font-bold">{language === 'ml' ? 'നൂറുകൾ (Hundreds)' : 'Hundreds'}</span>
            <span className="text-2xl font-black text-vaayana-textDark font-mono">9 × 100</span>
            <span className="text-xs font-black text-vaayana-limeDark block mt-1">= 900</span>
          </div>
          <div className="p-4 rounded-2xl bg-vaayana-soft border border-vaayana-softBorder text-center">
            <span className="text-xs text-vaayana-textDarkMuted block font-bold">{language === 'ml' ? 'പത്തുകൾ (Tens)' : 'Tens'}</span>
            <span className="text-2xl font-black text-vaayana-textDark font-mono">9 × 10</span>
            <span className="text-xs font-black text-vaayana-limeDark block mt-1">= 90</span>
          </div>
          <div className="p-4 rounded-2xl bg-vaayana-soft border border-vaayana-softBorder text-center">
            <span className="text-xs text-vaayana-textDarkMuted block font-bold">{language === 'ml' ? 'ഒന്നുകൾ (Ones)' : 'Ones'}</span>
            <span className="text-2xl font-black text-vaayana-textDark font-mono">9 × 1</span>
            <span className="text-xs font-black text-vaayana-limeDark block mt-1">= 9</span>
          </div>
        </div>

        {/* Interactive "Why is it the largest?" demonstration */}
        <div className="p-6 rounded-3xl bg-vaayana-dark text-vaayana-textLight space-y-4 text-center">
          <h4 className="text-lg font-black text-vaayana-lime font-malayalam">
            {language === 'ml' ? '9999 കഴിഞ്ഞാൽ എന്ത് സംഭവിക്കും?' : 'Why is 9999 the largest 4-digit number?'}
          </h4>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted max-w-xl mx-auto leading-relaxed">
            {language === 'ml' 
              ? '9999 നേക്കാൾ വലിയ നാലക്ക സംഖ്യ ഉണ്ടോ? 9999 നോട് 1 കൂട്ടി നോക്കൂ!' 
              : 'Can there be any bigger 4-digit number? Try adding 1 to 9999!'}
          </p>

          {!showOverflow ? (
            <button
              onClick={handleAddOne}
              className="px-6 py-3.5 rounded-2xl bg-vaayana-lime text-vaayana-dark font-black text-sm shadow-limeGlow active:scale-95 transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ml' ? '9999 + 1 കൂട്ടി നോക്കൂ' : 'Calculate 9999 + 1'}</span>
            </button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 space-y-2 max-w-md mx-auto"
            >
              <span className="text-3xl font-black text-emerald-300 font-mono block">
                9999 + 1 = 10,000!
              </span>
              <p className="text-sm font-bold text-emerald-100 font-malayalam">
                {language === 'ml' 
                  ? '10,000 എന്നത് 5 അക്കമുള്ള (Five-digit) സംഖ്യയാണ്! അതിനാൽ ഏറ്റവും വലിയ നാലക്ക സംഖ്യ 9999 തന്നെയാണ്!' 
                  : '10,000 has 5 digits! That proves 9999 is strictly the largest 4-digit number!'}
              </p>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};
