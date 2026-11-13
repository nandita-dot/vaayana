import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WHEEL_NUMBERS = [100, 200, 300, 400, 500, 600, 700, 800];
const SECTOR_ANGLE = 360 / WHEEL_NUMBERS.length; // 45 deg

export const NumberWheel: React.FC = () => {
  const { language } = useLanguage();
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [landedNumber, setLandedNumber] = useState<number>(WHEEL_NUMBERS[0]);
  const [questionType, setQuestionType] = useState<'before' | 'after' | 'half'>('after');
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setUserGuess(null);
    setFeedback(null);

    // Random rotations: between 3 and 6 full spins + sector offset
    const randomSpins = Math.floor(Math.random() * 4) + 3;
    const randomSector = Math.floor(Math.random() * WHEEL_NUMBERS.length);
    const targetDeg = wheelRotation + randomSpins * 360 + randomSector * SECTOR_ANGLE;

    setWheelRotation(targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      // Calculate which number landed at the top pointer (index based on modulo)
      const normalized = (targetDeg % 360);
      const sectorIndex = Math.floor((360 - (normalized % 360)) / SECTOR_ANGLE) % WHEEL_NUMBERS.length;
      const landed = WHEEL_NUMBERS[sectorIndex];
      setLandedNumber(landed);

      // Randomize challenge
      const types: ('before' | 'after' | 'half')[] = ['before', 'after', 'half'];
      setQuestionType(types[Math.floor(Math.random() * types.length)]);
    }, 2800);
  };

  const getExpectedAnswer = () => {
    if (questionType === 'before') return landedNumber - 100;
    if (questionType === 'after') return landedNumber + 100;
    if (questionType === 'half') return landedNumber / 2;
    return landedNumber;
  };

  const handleGuess = (val: number) => {
    setUserGuess(val);
    const expected = getExpectedAnswer();
    if (val === expected) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      setFeedback(language === 'ml' ? 'ശരിയാണ്! വെരി ഗുഡ്!' : 'Correct! Great mathematical thinking!');
    } else {
      setFeedback(language === 'ml' 
        ? `ശ്രമിക്കൂ! ശരിയായ ഉത്തരം: ${expected}` 
        : `Try again! Correct answer is ${expected}`);
    }
  };

  const expected = getExpectedAnswer();
  const optionChoices = [expected, expected - 50, expected + 50, expected + 100]
    .filter(n => n >= 0)
    .sort(() => Math.random() - 0.5);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'സംഖ്യാ ചക്രം (Number Wheel)' : 'Interactive Number Wheel'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'ചക്രം കറക്കി സംഖ്യാ ബന്ധങ്ങൾ കണ്ടെത്താം' : 'Spin the wheel and discover number sequences & order'}
            </p>
          </div>
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="px-6 py-2.5 rounded-2xl bg-vaayana-lime disabled:opacity-50 text-vaayana-dark font-black text-xs sm:text-sm shadow-limeGlow active:scale-95 transition-all flex items-center gap-2"
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? (language === 'ml' ? 'കറങ്ങുന്നു...' : 'Spinning...') : (language === 'ml' ? 'ചക്രം കറക്കൂ!' : 'Spin the Wheel!')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Rotating Wheel Canvas */}
        <div className="lg:col-span-7 bg-vaayana-softSurface p-6 sm:p-8 rounded-4xl border border-vaayana-softBorder shadow-card flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden select-none">
          
          {/* Top Pointer Needle */}
          <div className="absolute top-4 z-20 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-rose-600 drop-shadow-md" />
          </div>

          {/* The Circular SVG Wheel */}
          <motion.div
            animate={{ rotate: wheelRotation }}
            transition={{ duration: 2.8, ease: [0.15, 0.9, 0.2, 1] }}
            className="w-72 sm:w-84 aspect-square rounded-full border-8 border-[#1B231D] shadow-[0_12px_28px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {WHEEL_NUMBERS.map((num, idx) => {
                const startAngle = idx * SECTOR_ANGLE;
                const endAngle = (idx + 1) * SECTOR_ANGLE;
                const x1 = 100 + 100 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 100 + 100 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 100 + 100 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 100 + 100 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;

                const colors = ['#38BDF8', '#FB923C', '#9ACD32', '#C084FC', '#FBBF24', '#34D399', '#F472B6', '#60A5FA'];

                return (
                  <g key={num}>
                    <path d={pathData} fill={colors[idx % colors.length]} stroke="#1B231D" strokeWidth="2" />
                    {/* Number text placed inside sector */}
                    <text
                      x="100"
                      y="45"
                      fill="#111827"
                      fontSize="14"
                      fontWeight="900"
                      fontFamily="monospace"
                      textAnchor="middle"
                      transform={`rotate(${startAngle + SECTOR_ANGLE / 2}, 100, 100)`}
                    >
                      {num}
                    </text>
                  </g>
                );
              })}
              {/* Center Cap */}
              <circle cx="100" cy="100" r="24" fill="#1B231D" stroke="#FFF" strokeWidth="3" />
              <circle cx="100" cy="100" r="10" fill="#9ACD32" />
            </svg>
          </motion.div>

          <div className="text-xs font-bold text-vaayana-textDarkMuted mt-6">
            {language === 'ml' ? 'ചക്രം കറക്കാൻ മുകളിലെ ബട്ടൺ അമർത്തൂ' : 'Click the button above to spin'}
          </div>
        </div>

        {/* Right Challenge & Information Column */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-vaayana-darkSurface p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard space-y-4 text-vaayana-textLight">
            <span className="text-xs font-mono font-bold text-vaayana-lime uppercase tracking-wider block">
              {language === 'ml' ? 'ചക്രം നിന്ന സംഖ്യ:' : 'Landed Number:'}
            </span>
            <div className="text-5xl font-black text-vaayana-lime font-mono">
              {landedNumber}
            </div>

            {/* Dynamic Question based on landed number */}
            <div className="p-4 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder space-y-2">
              <span className="text-xs font-bold text-amber-400 block font-malayalam">
                {language === 'ml' ? 'ചോദ്യം:' : 'Question:'}
              </span>
              <p className="text-base font-black font-malayalam leading-relaxed">
                {questionType === 'before' && (
                  language === 'ml' 
                    ? `${landedNumber} ന് തൊട്ടു മുൻപിലെ സംഖ്യ (100 കുറച്ചാൽ) ഏതാണ്?` 
                    : `What number comes 100 before ${landedNumber}?`
                )}
                {questionType === 'after' && (
                  language === 'ml' 
                    ? `${landedNumber} ന് തൊട്ടു ശേഷമുള്ള സംഖ്യ (100 കൂട്ടിയാൽ) ഏതാണ്?` 
                    : `What number comes 100 after ${landedNumber}?`
                )}
                {questionType === 'half' && (
                  language === 'ml' 
                    ? `${landedNumber} ന്റെ പകുതി (Half) എത്രയാണ്?` 
                    : `What is half of ${landedNumber}?`
                )}
              </p>
            </div>

            {/* Multiple Choice Chips */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {optionChoices.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleGuess(opt)}
                  disabled={isSpinning || userGuess !== null}
                  className={`p-3 rounded-xl font-mono font-black text-lg transition-all active:scale-95 ${
                    userGuess === opt
                      ? opt === expected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                      : 'bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-lime border border-vaayana-darkBorder'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-xs font-bold font-malayalam text-center ${
                  userGuess === expected
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                    : 'bg-rose-950 text-rose-300 border border-rose-500'
                }`}
              >
                {feedback}
              </motion.div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
