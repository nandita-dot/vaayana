import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { playClickSound, playCorrectSound, playIncorrectSound } from '../../services/soundService';
import { Compass, RotateCcw, CheckCircle2, HelpCircle, Shield, Magnet, Info } from 'lucide-react';

export const MagneticCompassDemo: React.FC = () => {
  const { language } = useLanguage();

  // Housing rotation angle controlled by student
  const [housingAngle, setHousingAngle] = useState<number>(0);
  const [isNeedleSettling, setIsNeedleSettling] = useState<boolean>(false);
  const [quizAnswered, setQuizAnswered] = useState<boolean | null>(null);

  const handleRotateHousing = (deg: number) => {
    playClickSound();
    setHousingAngle(deg);
  };

  const handleFreeNeedleSettle = () => {
    playClickSound();
    setIsNeedleSettling(true);
    setTimeout(() => {
      setIsNeedleSettling(false);
      playCorrectSound();
    }, 700);
  };

  const handleReset = () => {
    playClickSound();
    setHousingAngle(0);
    setQuizAnswered(null);
  };

  return (
    <div className="bg-vaayana-soft rounded-3xl p-6 sm:p-8 border border-vaayana-softBorder shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
            EVS • Chapter 3 Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textDark mt-2 font-malayalam">
            {language === 'ml' ? 'കാന്തിക കോമ്പസ് പരീക്ഷണം (Magnetic Compass Demo)' : 'Magnetic Compass Simulation'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textDarkMuted">
            {language === 'ml' 
              ? 'കോമ്പസിന്റെ പുറംചട്ട എത്ര തിരിച്ചാലും കാന്തികസൂചി വടക്ക്-തെക്ക് ദിശയിൽ തന്നെ നിൽക്കുന്നത് നിരീക്ഷിക്കുക.' 
              : 'Observe how the magnetic needle remains aligned to North-South even when you rotate the casing.'}
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-vaayana-dark border border-vaayana-softBorder shadow-sm"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive Compass Graphic Stage (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0E1612] rounded-3xl p-6 sm:p-8 border-2 border-emerald-900/60 shadow-2xl relative flex flex-col items-center justify-center min-h-[440px] overflow-hidden">
          
          {/* Earth Magnetic Field Background Glow */}
          <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-b from-blue-500/10 via-transparent to-red-500/10 pointer-events-none" />

          {/* North Direction Marker in Earth's Environment */}
          <div className="absolute top-3 text-center z-20">
            <span className="text-xs font-black uppercase tracking-wider text-rose-500 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              {language === 'ml' ? 'യഥാർത്ഥ വടക്ക് (Earth’s Magnetic North)' : 'True Earth Magnetic North'}
            </span>
          </div>

          {/* ROTATABLE COMPASS HOUSING SVG */}
          <div className="relative w-80 h-80 my-4 flex items-center justify-center">
            
            {/* ROTATABLE DIAL CASING (Students can spin this) */}
            <motion.svg
              width="320"
              height="320"
              viewBox="-160 -160 320 320"
              animate={{ rotate: housingAngle }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              {/* Outer Golden/Brass Housing Bezel */}
              <circle cx="0" cy="0" r="148" fill="#18221B" stroke="#D97706" strokeWidth="6" className="drop-shadow-lg" />
              <circle cx="0" cy="0" r="138" fill="#0C140F" stroke="#92400E" strokeWidth="2" />

              {/* Housing Degree Markings */}
              {Array.from({ length: 36 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="-138"
                  x2="0"
                  y2={i % 3 === 0 ? '-124' : '-130'}
                  stroke={i % 9 === 0 ? '#F59E0B' : '#4B5563'}
                  strokeWidth={i % 9 === 0 ? '2.5' : '1'}
                  transform={`rotate(${i * 10})`}
                />
              ))}

              {/* Housing Printed Letters: N, E, S, W rotate WITH the casing */}
              <text x="0" y="-105" textAnchor="middle" fill="#EF4444" fontSize="16" fontWeight="900">
                N
              </text>
              <text x="105" y="5" textAnchor="middle" fill="#E2E8F0" fontSize="16" fontWeight="900">
                E
              </text>
              <text x="0" y="115" textAnchor="middle" fill="#E2E8F0" fontSize="16" fontWeight="900">
                S
              </text>
              <text x="-105" y="5" textAnchor="middle" fill="#E2E8F0" fontSize="16" fontWeight="900">
                W
              </text>
            </motion.svg>

            {/* MAGNETIC NEEDLE: Always remains pointed approximately North (Angle 0) independent of casing! */}
            <motion.svg
              width="320"
              height="320"
              viewBox="-160 -160 320 320"
              animate={isNeedleSettling ? { rotate: [-15, 12, -6, 2, 0] } : { rotate: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            >
              {/* Red Marked North Needle Tip */}
              <polygon points="0,-115 14,0 0,-18" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
              <polygon points="0,-115 -14,0 0,-18" fill="#DC2626" stroke="#B91C1C" strokeWidth="1.5" />

              {/* Silver South Needle Tip */}
              <polygon points="0,115 14,0 0,18" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
              <polygon points="0,115 -14,0 0,18" fill="#64748B" stroke="#475569" strokeWidth="1.5" />

              {/* Centre Magnetic Pivot */}
              <circle cx="0" cy="0" r="16" fill="#111713" stroke="#D97706" strokeWidth="3" />
              <circle cx="0" cy="0" r="5" fill="#EF4444" />
            </motion.svg>

          </div>

          {/* Quick Rotation Buttons for Housing */}
          <div className="flex flex-wrap items-center justify-center gap-2 z-20 mt-2">
            <span className="text-xs font-bold text-slate-400 mr-2">
              {language === 'ml' ? 'ചട്ട തിരിക്കുക:' : 'Rotate Housing:'}
            </span>
            {[0, 45, 90, 135, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => handleRotateHousing(deg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  housingAngle === deg
                    ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                    : 'bg-vaayana-darkElevated text-vaayana-textLight hover:bg-vaayana-darkBorder border border-vaayana-darkBorder'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>

        </div>

        {/* Right: Scientific Explanations & Mini Quiz (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Key Principle Box */}
          <div className="p-5 rounded-3xl bg-white border border-vaayana-softBorder shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-black text-xs uppercase tracking-wide">
              <Magnet className="w-4 h-4 text-rose-600" />
              <span>{language === 'ml' ? 'കാന്തിക കോമ്പസിന്റെ തത്വം' : 'Scientific Principle'}</span>
            </div>
            
            <p className="text-xs text-slate-800 leading-relaxed font-medium font-malayalam">
              {language === 'ml'
                ? 'കോമ്പസിൽ സ്വതന്ത്രമായി കറങ്ങാൻ കഴിയുന്ന ഒരു കാന്തിക സൂചിയുണ്ട്. ഭൂമി ഒരു വലിയ കാന്തം പോലെ പ്രവർത്തിക്കുന്നതിനാൽ, കാന്തിക സൂചി എപ്പോഴും വടക്ക്-തെക്ക് ദിശയിൽ തന്നെ വന്നുനിൽക്കുന്നു.'
                : 'A magnetic compass contains a freely pivoted magnetic needle. Because Earth behaves like a giant magnet, the needle naturally settles in the North-South direction.'}
            </p>

            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-bold font-malayalam flex items-start gap-2">
              <span className="text-base">🔴</span>
              <span>
                {language === 'ml' 
                  ? 'ചുവന്ന അടയാളമുള്ള വശം എല്ലായ്പ്പോഴും വടക്ക് (North) ദിശയെ കാണിക്കുന്നു.' 
                  : 'The marked (red) tip always indicates North.'}
              </span>
            </div>
          </div>

          {/* Interactive Mini-Check */}
          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
              {language === 'ml' ? 'ക്ലാസ്സ് പരീക്ഷണം:' : 'Quick Classroom Check:'}
            </h4>

            <p className="text-xs font-bold text-amber-950 font-malayalam">
              {language === 'ml' 
                ? 'കോമ്പസിന്റെ പുറംചട്ട ഏത് ദിശയിലേക്ക് തിരിച്ചാലും കാന്തിക സൂചി എന്ത് ചെയ്യും?' 
                : 'What does the magnetic needle do when you rotate the compass housing?'}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  playCorrectSound();
                  setQuizAnswered(true);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold font-malayalam transition-all ${
                  quizAnswered === true 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                    : 'bg-white hover:bg-amber-100/60 text-slate-800 border-amber-300'
                }`}
              >
                ✓ {language === 'ml' 
                  ? 'സൂചി വടക്ക്-തെക്ക് ദിശയിൽ തന്നെ ഉറച്ചുനിൽക്കും' 
                  : 'The needle stays firmly pointing North-South'}
              </button>

              <button
                onClick={() => {
                  playIncorrectSound();
                  setQuizAnswered(false);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold font-malayalam transition-all ${
                  quizAnswered === false 
                    ? 'bg-rose-100 text-rose-900 border-rose-400' 
                    : 'bg-white hover:bg-amber-100/60 text-slate-800 border-amber-300'
                }`}
              >
                ✗ {language === 'ml' 
                  ? 'സൂചി ചട്ടയോടൊപ്പം കറങ്ങിക്കൊണ്ടേയിരിക്കും' 
                  : 'The needle spins along with the casing'}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

