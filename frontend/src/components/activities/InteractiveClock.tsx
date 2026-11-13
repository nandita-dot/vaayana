import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Clock, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Minus,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

interface TimeChallenge {
  targetHours: number;
  targetMinutes: number;
  labelEn: string;
  labelMl: string;
}

const CHALLENGES: TimeChallenge[] = [
  { targetHours: 8, targetMinutes: 30, labelEn: 'Half past eight (8:30)', labelMl: 'എട്ടര (8:30)' },
  { targetHours: 9, targetMinutes: 15, labelEn: 'Quarter past nine (9:15)', labelMl: 'ഒമ്പതേകാൽ (9:15)' },
  { targetHours: 10, targetMinutes: 45, labelEn: 'Quarter to eleven (10:45)', labelMl: 'പത്തേമുക്കാൽ (10:45)' },
  { targetHours: 3, targetMinutes: 0, labelEn: "Three o'clock (3:00)", labelMl: 'മൂന്ന് മണി (3:00)' },
  { targetHours: 1, targetMinutes: 30, labelEn: 'Half past one (1:30)', labelMl: 'ഒന്നര (1:30)' },
  { targetHours: 6, targetMinutes: 0, labelEn: "Six o'clock (6:00)", labelMl: 'ആറ് മണി (6:00)' },
];

export const InteractiveClock: React.FC = () => {
  const { language } = useLanguage();
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(30);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDraggingRef = useRef(false);

  const currentChallenge = CHALLENGES[challengeIdx];

  // Adjust time functions
  const addMinutes = (amount: number) => {
    soundService.play('tick');
    let newMin = minutes + amount;
    let newHr = hours;
    if (newMin >= 60) {
      newHr = (newHr % 12) + 1;
      newMin = newMin % 60;
    } else if (newMin < 0) {
      newHr = newHr - 1 <= 0 ? 12 : newHr - 1;
      newMin = 60 + newMin;
    }
    setMinutes(newMin);
    setHours(newHr);
    setFeedback(null);
  };

  const addHours = (amount: number) => {
    soundService.play('tick');
    let newHr = hours + amount;
    if (newHr > 12) newHr = 1;
    if (newHr < 1) newHr = 12;
    setHours(newHr);
    setFeedback(null);
  };

  // Pointer drag to position hands directly
  const updateTimeFromPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < 12) return;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const normalizedRadius = dist / (rect.width / 2);
    if (normalizedRadius > 0.42) {
      // Outer ring controls minute hand
      const nearestMin = Math.round(angle / 6) % 60;
      setMinutes(nearestMin);
    } else {
      // Inner ring controls hour hand
      let nearestHr = Math.round(angle / 30) % 12;
      if (nearestHr === 0) nearestHr = 12;
      setHours(nearestHr);
    }
    setFeedback(null);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    isDraggingRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateTimeFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDraggingRef.current) {
      updateTimeFromPointer(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  const checkChallenge = () => {
    if (hours === currentChallenge.targetHours && minutes === currentChallenge.targetMinutes) {
      soundService.play('correct');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setFeedback(language === 'ml' ? 'ശരിയാണ്! വെരി ഗുഡ്!' : 'Correct time set! Amazing!');
    } else {
      soundService.play('incorrect');
      setFeedback(language === 'ml' 
        ? `ശ്രമിക്കൂ! നിലവിലെ സമയം ${formatTime(hours, minutes)}. ലക്ഷ്യം: ${currentChallenge.labelMl}` 
        : `Try again! Current is ${formatTime(hours, minutes)}, target is ${currentChallenge.labelEn}`);
    }
  };

  const nextChallenge = () => {
    soundService.play('click');
    setChallengeIdx(c => (c + 1) % CHALLENGES.length);
    setFeedback(null);
  };

  const formatTime = (h: number, m: number) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  // Clock Hand Angles:
  // Minute hand: 360 deg / 60 min = 6 deg per minute
  // Hour hand: 360 deg / 12 hr = 30 deg per hour + 0.5 deg per minute
  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'ഘടികാരവും സമയവും (Clock & Time)' : 'Interactive Smartboard Clock'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'സൂചികൾ തിരിച്ച് സമയം പഠിക്കാം: മണിക്കൂറും മിനിറ്റും' : 'Drag hands or tap numbers to explore analogue and digital time'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setHours(12); setMinutes(0); setFeedback(null); }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder text-vaayana-lime hover:bg-vaayana-darkBorder text-xs font-bold transition-all"
            title="Reset to 12:00"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'ml' ? 'റീസെറ്റ് (12:00)' : 'Reset (12:00)'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Large Analogue Clock Stage */}
        <div className="lg:col-span-7 bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card flex flex-col items-center justify-center min-h-[460px]">
          
          <div className="text-xs font-black text-vaayana-textDarkMuted uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === 'ml' ? 'ക്ലോക്ക് ഡയലിൽ തൊട്ട് സൂചികൾ തിരിക്കാം (Touch & Drag):' : 'Touch or Drag hands anywhere on clock dial:'}</span>
          </div>

          {/* Large Clock Dial (360px - 400px diameter) */}
          <div className="relative w-80 sm:w-96 aspect-square rounded-full bg-white border-8 border-slate-800 shadow-[0_16px_36px_rgba(0,0,0,0.3)] p-2 flex items-center justify-center touch-none">
            
            <svg 
              ref={svgRef}
              viewBox="0 0 200 200" 
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Outer dial background ring */}
              <circle cx="100" cy="100" r="95" fill="#FAFAFA" stroke="#CBD5E1" strokeWidth="2.5" />

              {/* Minute tick marks (60 ticks) */}
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i * 6 - 90) * (Math.PI / 180);
                const isMajor = i % 5 === 0;
                const rInner = isMajor ? 84 : 88;
                const rOuter = 92;
                const x1 = 100 + rInner * Math.cos(angle);
                const y1 = 100 + rInner * Math.sin(angle);
                const x2 = 100 + rOuter * Math.cos(angle);
                const y2 = 100 + rOuter * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#0F172A' : '#94A3B8'}
                    strokeWidth={isMajor ? 2.5 : 1}
                  />
                );
              })}

              {/* Numbers 1-12 with touch buttons */}
              {Array.from({ length: 12 }).map((_, i) => {
                const num = i + 1;
                const angle = (num * 30 - 90) * (Math.PI / 180);
                const x = 100 + 72 * Math.cos(angle);
                const y = 100 + 72 * Math.sin(angle);
                const isSelected = hours === num;
                return (
                  <g 
                    key={num} 
                    className="cursor-pointer" 
                    onClick={(e) => { e.stopPropagation(); setHours(num); setFeedback(null); }}
                  >
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="11" 
                      fill={isSelected ? '#6B21A8' : 'transparent'} 
                      className="transition-colors hover:fill-purple-200"
                    />
                    <text
                      x={x}
                      y={y + 4.5}
                      fill={isSelected ? '#FFFFFF' : '#0F172A'}
                      fontSize="14"
                      fontWeight="900"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {num}
                    </text>
                  </g>
                );
              })}

              {/* Hour Hand (Thick, Purple, shorter) */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="52"
                stroke="#6B21A8"
                strokeWidth="8"
                strokeLinecap="round"
                transform={`rotate(${hourAngle}, 100, 100)`}
                className="transition-transform duration-100 filter drop-shadow"
              />

              {/* Minute Hand (Long, Cyan/Sky Blue) */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="24"
                stroke="#0284C7"
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${minuteAngle}, 100, 100)`}
                className="transition-transform duration-100 filter drop-shadow"
              />

              {/* Center Pin */}
              <circle cx="100" cy="100" r="8" fill="#0F172A" />
              <circle cx="100" cy="100" r="3.5" fill="#FACC15" />
            </svg>

          </div>

          {/* Quick Adjustment Smartboard Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => addHours(-1)}
              className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-xs active:scale-95 transition-all shadow-sm"
            >
              -1 Hr
            </button>
            <button
              onClick={() => addHours(1)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs active:scale-95 transition-all shadow-sm"
            >
              +1 Hour (മണിക്കൂർ)
            </button>
            <button
              onClick={() => addMinutes(-15)}
              className="px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-black text-xs active:scale-95 transition-all shadow-sm"
            >
              -15 Mins
            </button>
            <button
              onClick={() => addMinutes(15)}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs active:scale-95 transition-all shadow-sm"
            >
              +15 Mins (കാൽ)
            </button>
            <button
              onClick={() => addMinutes(30)}
              className="px-3.5 py-2 rounded-xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black text-xs active:scale-95 transition-all shadow-sm"
            >
              +30 Mins (അര)
            </button>
          </div>

        </div>

        {/* Right Digital Display & Challenge Column */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Synchronized Digital Display */}
          <div className="bg-vaayana-darkSurface p-6 sm:p-8 rounded-4xl border border-vaayana-darkBorder shadow-darkCard text-center space-y-3">
            <span className="text-xs font-mono font-bold text-vaayana-lime uppercase tracking-wider block">
              {language === 'ml' ? 'ഡിജിറ്റൽ സമയം (Digital Time):' : 'Synchronized Digital Time:'}
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono text-vaayana-lime tracking-tight py-1">
              {formatTime(hours, minutes)}
            </div>

            <div className="text-base font-bold font-malayalam text-vaayana-textLight border-t border-vaayana-darkBorder pt-3">
              {minutes === 0 && `${hours} മണി`}
              {minutes === 15 && `${hours}േകാൽ (Quarter past ${hours})`}
              {minutes === 30 && `${hours}ര (Half Past ${hours})`}
              {minutes === 45 && `${hours === 12 ? 1 : hours + 1} മുക്കാൽ (Quarter to ${hours === 12 ? 1 : hours + 1})`}
              {minutes !== 0 && minutes !== 15 && minutes !== 30 && minutes !== 45 && `${hours} മണി കഴിഞ്ഞ് ${minutes} മിനിറ്റ്`}
            </div>
          </div>

          {/* Time Challenge Card */}
          <div className="bg-vaayana-darkSurface p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard space-y-4 text-vaayana-textLight">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-vaayana-lime/20 text-vaayana-lime font-mono font-black text-xs">
                Challenge {challengeIdx + 1} of {CHALLENGES.length}
              </span>
              <button
                onClick={nextChallenge}
                className="text-xs font-bold text-vaayana-lime hover:underline"
              >
                {language === 'ml' ? 'അടുത്ത വെല്ലുവിളി ➔' : 'Next Challenge ➔'}
              </button>
            </div>

            <div>
              <span className="text-xs text-amber-400 font-bold block">
                {language === 'ml' ? 'ലക്ഷ്യം (Target):' : 'Target Time:'}
              </span>
              <h4 className="text-xl font-black font-malayalam text-white mt-1">
                {language === 'ml' ? `ഘടികാരത്തിൽ ${currentChallenge.labelMl} ആക്കുക` : `Set the clock to ${currentChallenge.labelEn}`}
              </h4>
            </div>

            <button
              onClick={checkChallenge}
              className="w-full py-3.5 rounded-2xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black text-sm shadow-limeGlow active:scale-95 transition-all"
            >
              {language === 'ml' ? 'സമയം പരിശോധിക്കുക ✓' : 'Check Time ✓'}
            </button>

            {feedback && (
              <div className="p-3 bg-vaayana-dark rounded-xl text-center text-xs font-bold font-malayalam text-vaayana-lime border border-vaayana-lime/30">
                {feedback}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default InteractiveClock;
