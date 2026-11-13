import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Droplet, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Waves
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

export const WaterLeakSimulation: React.FC = () => {
  const { language } = useLanguage();

  // Simulation Parameters
  const [targetMinutes, setTargetMinutes] = useState<number>(10);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 5x, 30x, 60x

  // Interactive Student Question State
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const targetTotalSeconds = targetMinutes * 60;
  const targetTotalMl = targetTotalSeconds; // 1 sec = 1 mL
  const currentMl = elapsedSeconds; // 1 sec = 1 mL

  const fillPercentage = Math.min(100, (currentMl / targetTotalMl) * 100);

  // Simulation loop with accurate delta timing
  useEffect(() => {
    if (!isRunning) return;

    const intervalMs = 100; // update 10 times a sec for smooth fluid
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + (simSpeed * (intervalMs / 1000));
        if (next >= targetTotalSeconds) {
          setIsRunning(false);
          soundService.play('correct');
          return targetTotalSeconds;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isRunning, simSpeed, targetTotalSeconds]);

  const handleStart = () => {
    soundService.play('click');
    setIsRunning(true);
  };

  const handlePause = () => {
    soundService.play('click');
    setIsRunning(false);
  };

  const handleReset = () => {
    soundService.play('click');
    setIsRunning(false);
    setElapsedSeconds(0);
    setFeedback(null);
    setShowExplanation(false);
    setUserAnswer('');
  };

  const handleFastForward = () => {
    soundService.play('whoosh');
    setElapsedSeconds(targetTotalSeconds);
    setIsRunning(false);
    soundService.play('correct');
  };

  const handleCheckAnswer = () => {
    const val = parseInt(userAnswer.trim(), 10);
    if (isNaN(val)) {
      soundService.play('incorrect');
      setFeedback({
        isCorrect: false,
        message: language === 'ml' ? 'ദയവായി ഒരു സംഖ്യ നൽകുക.' : 'Please enter a valid number.'
      });
      return;
    }

    if (val === targetTotalMl) {
      soundService.play('celebration');
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      setFeedback({
        isCorrect: true,
        message: language === 'ml'
          ? `തികച്ചും ശരിയാണ്! ${targetMinutes} മിനിറ്റിൽ കൃത്യമായി ${targetTotalMl} മില്ലിലിറ്റർ (mL) വെള്ളം പാഴാകും!`
          : `Spot on! Exactly ${targetTotalMl} millilitres (mL) leaks out in ${targetMinutes} minutes!`
      });
      setShowExplanation(true);
    } else {
      soundService.play('incorrect');
      setFeedback({
        isCorrect: false,
        message: language === 'ml'
          ? `ശ്രമിക്കൂ! 1 മിനിറ്റ് = 60 സെക്കൻഡ്. അങ്ങനെയെങ്കിൽ ${targetMinutes} മിനിറ്റിൽ എത്ര സെക്കൻഡ് ഉണ്ടാകും?`
          : `Try again! Remember 1 minute = 60 seconds. How many seconds in ${targetMinutes} minutes?`
      });
    }
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Top Banner & Heading */}
      <div className="bg-vaayana-darkSurface p-4 sm:p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-400 text-sky-950 uppercase tracking-wider">
              {language === 'ml' ? 'പ്രവർത്തനം 2' : 'Activity 2'}
            </span>
            <span className="text-xs font-bold text-vaayana-textLightMuted">
              Class 4 Mathematics • Chapter 5
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-1 font-malayalam">
            {language === 'ml' ? 'തുള്ളികൾ ചേർന്ന് മഹാസമുദ്രം (Little Drops, Mighty Ocean)' : 'Little Drops, Mighty Ocean'}
          </h2>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted mt-1">
            {language === 'ml'
              ? 'ഒരു സെക്കൻഡിൽ ഒരു മില്ലിലിറ്റർ വെള്ളം ഇറ്റുവീഴുന്ന ടാപ്പ്. സമയവും ജലസംരക്ഷണവും മനസ്സിലാക്കുക.'
              : 'A dripping tap leaks 1 mL of water every single second. Explore time conversion and water conservation.'}
          </p>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center gap-2 bg-vaayana-darkElevated p-1.5 rounded-2xl border border-vaayana-darkBorder">
          <span className="text-xs font-bold text-vaayana-textLightMuted px-2">
            {language === 'ml' ? 'സമയം' : 'Duration'}:
          </span>
          {[1, 5, 10, 15].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                soundService.play('click');
                setTargetMinutes(mins);
                setElapsedSeconds(0);
                setIsRunning(false);
                setFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                targetMinutes === mins 
                  ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow' 
                  : 'text-vaayana-textLight hover:bg-vaayana-darkBorder'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Cartoon Water Tap & Graduated Container Simulation (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-vaayana-softSurface border border-vaayana-softBorder shadow-card space-y-6">
          
          <div className="flex items-center justify-between border-b border-vaayana-softMuted pb-4">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-sky-500 fill-sky-500" />
              <h3 className="text-lg font-black text-navy-900 font-malayalam">
                {language === 'ml' ? 'തുള്ളി ചോർച്ച സിമുലേഷൻ' : 'Water Leak Simulation'}
              </h3>
            </div>

            {/* Live Digital Timer Display */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-slate-900 text-sky-400 font-mono text-xl sm:text-2xl font-black shadow-inner flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Visual Scene: Cartoon Tap and Measuring Beaker */}
          <div className="relative h-72 sm:h-80 bg-gradient-to-b from-sky-50/60 to-white rounded-2xl border border-sky-100 flex items-center justify-around px-4 overflow-hidden">
            
            {/* The Cartoon Tap on Wall */}
            <div className="flex flex-col items-center">
              <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
                {/* Horizontal Pipe */}
                <rect x="0" y="24" width="60" height="20" rx="3" fill="#64748B" stroke="#334155" strokeWidth="2" />
                {/* Pipe Joint Ring */}
                <rect x="52" y="20" width="10" height="28" rx="2" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
                {/* Valve Head Knob */}
                <rect x="68" y="4" width="28" height="10" rx="2" fill="#E11D48" stroke="#9F1239" strokeWidth="2" />
                <rect x="78" y="14" width="8" height="12" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
                {/* Spout Body */}
                <path d="M60 24H94C97 24 100 27 100 30V48C100 52 96 56 92 56H82C78 56 74 60 74 64V76H60V34C60 28 60 24 60 24Z" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
                {/* Spout Mouth */}
                <rect x="58" y="74" width="18" height="6" rx="2" fill="#475569" />
              </svg>

              {/* Falling Droplets Animation */}
              <div className="relative w-12 h-32 flex flex-col items-center justify-start overflow-hidden">
                {isRunning && (
                  <motion.div
                    className="w-3.5 h-4.5 bg-sky-400 rounded-full rounded-t-none"
                    initial={{ y: 0, opacity: 0.9, scale: 0.8 }}
                    animate={{ y: 110, opacity: 0.2, scale: 1.2 }}
                    transition={{ repeat: Infinity, duration: 0.55 / Math.min(simSpeed, 10), ease: 'easeIn' }}
                  />
                )}
                <div className="text-[11px] font-bold text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-full mt-auto">
                  1 sec = 1 mL
                </div>
              </div>
            </div>

            {/* The Graduated Measuring Jar Container */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 sm:w-44 h-56 sm:h-64 border-4 border-slate-700 border-t-0 rounded-b-3xl bg-slate-50/70 overflow-hidden flex flex-col justify-end shadow-card">
                
                {/* Water Liquid Filling from Bottom */}
                <motion.div 
                  className="w-full bg-gradient-to-t from-sky-500 to-sky-300 relative transition-all"
                  style={{ height: `${fillPercentage}%` }}
                >
                  {/* Gentle Surface Wave */}
                  {fillPercentage > 2 && (
                    <div className="absolute -top-2 left-0 right-0 h-4 bg-sky-200/60 rounded-full animate-pulse" />
                  )}
                </motion.div>

                {/* Measurement Markings on Jar Glass */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 px-2 pointer-events-none">
                  {[100, 75, 50, 25, 0].map((pct) => {
                    const mlAtMark = Math.round((pct / 100) * targetTotalMl);
                    return (
                      <div key={pct} className="flex items-center justify-between text-[10px] font-black font-mono text-slate-700">
                        <span className="w-5 border-b-2 border-slate-600" />
                        <span className="bg-white/80 px-1 rounded shadow-xs">{mlAtMark} mL</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Volume Label */}
              <div className="mt-2 text-center">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  {language === 'ml' ? 'ശേഖരിച്ച വെള്ളം' : 'Leaked Volume'}:
                </span>
                <div className="text-xl sm:text-2xl font-black text-sky-700 font-mono">
                  {Math.round(currentMl)} mL
                </div>
              </div>
            </div>

          </div>

          {/* Simulation Controls & Speed Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            
            {/* Play/Pause/Reset */}
            <div className="flex items-center gap-2">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  disabled={elapsedSeconds >= targetTotalSeconds}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-vaayana-dark hover:bg-black text-vaayana-lime font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-40"
                >
                  <Play className="w-4 h-4 fill-vaayana-lime" />
                  <span>{elapsedSeconds > 0 ? (language === 'ml' ? 'തുടരുക (Resume)' : 'Resume') : (language === 'ml' ? 'തുടങ്ങുക (Start)' : 'Start')}</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <Pause className="w-4 h-4 fill-white" />
                  <span>{language === 'ml' ? 'നിർത്തുക (Pause)' : 'Pause'}</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleFastForward}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs transition-all active:scale-95"
                title="Fast forward to end time"
              >
                <FastForward className="w-4 h-4" />
                <span>{language === 'ml' ? 'പൂർണ്ണ സമയം' : 'Fast-Forward'}</span>
              </button>
            </div>

            {/* Simulation Speed Pill Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-[11px] font-black text-slate-500 px-1.5">Speed:</span>
              {[1, 5, 30, 60].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    soundService.play('click');
                    setSimSpeed(s);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
                    simSpeed === s ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Right: The Educational Challenge & Mathematics Breakdown (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder shadow-darkCard space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-vaayana-lime" />
              <h3 className="text-lg font-black text-vaayana-textLight font-malayalam">
                {language === 'ml' ? 'ഗണിത സമസ്യ (Math Challenge)' : 'Classroom Math Question'}
              </h3>
            </div>
          </div>

          {/* Scenario Problem Card */}
          <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-darkBorder space-y-3">
            <span className="text-xs font-black text-vaayana-lime uppercase tracking-wider">
              {language === 'ml' ? 'ചോദ്യം' : 'Problem Statement'}:
            </span>
            <p className="text-sm font-extrabold text-vaayana-textLight font-malayalam leading-relaxed">
              {language === 'ml'
                ? `ഒരു സെക്കൻഡിൽ ഒരു മില്ലിലിറ്റർ (1 mL) വെള്ളം ഈ ടാപ്പിൽ നിന്ന് ഇറ്റുവീഴുന്നു. ${targetMinutes} മിനിറ്റിൽ എത്ര മില്ലിലിറ്റർ വെള്ളം പാഴാകും?`
                : `Each second, one millilitre (1 mL) of water leaks out of this tap. How many millilitres of water will leak out in ${targetMinutes} minutes?`}
            </p>

            {/* Answer Input Field */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-vaayana-textLightMuted mb-1.5">
                {language === 'ml' ? 'നിങ്ങളുടെ ഉത്തരം (മില്ലിലിറ്ററിൽ):' : 'Your Answer (in millilitres / mL):'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="e.g. 600"
                  className="flex-1 p-3.5 rounded-xl border border-vaayana-darkBorder bg-vaayana-dark font-mono text-lg font-black text-vaayana-lime focus:outline-none focus:ring-2 focus:ring-vaayana-lime"
                />
                <span className="text-sm font-black text-vaayana-textLight px-2">mL</span>
              </div>
            </div>

            <button
              onClick={handleCheckAnswer}
              className="w-full py-3.5 px-4 rounded-xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-sm shadow-limeGlow transition-all active:scale-95"
            >
              {language === 'ml' ? 'ഉത്തരം ഉറപ്പിക്കുക' : 'Submit Answer'}
            </button>
          </div>

          {/* Dynamic Feedback Box */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-3 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800'
                  : 'bg-rose-950/80 text-rose-200 border border-rose-800'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-vaayana-lime shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="font-malayalam leading-relaxed">{feedback.message}</div>
            </motion.div>
          )}

          {/* Guided SCERT Mathematical Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-lime/30 space-y-2.5 text-xs text-vaayana-textLight"
            >
              <div className="font-black text-sm text-vaayana-lime flex items-center gap-1.5 font-malayalam">
                <Waves className="w-4 h-4 text-vaayana-lime" />
                <span>{language === 'ml' ? 'കണക്കുകൂട്ടൽ ഘട്ടങ്ങൾ (Guided Calculation)' : 'Guided Calculation'}</span>
              </div>

              <div className="font-mono bg-vaayana-dark p-3 rounded-xl border border-vaayana-darkBorder space-y-1.5 leading-relaxed text-slate-300">
                <p>1 minute = 60 seconds</p>
                <p>{targetMinutes} minutes = {targetMinutes} × 60 = <strong className="text-vaayana-lime">{targetTotalSeconds} seconds</strong></p>
                <p>1 second = 1 mL of water</p>
                <p className="border-t border-slate-700 pt-1 text-vaayana-lime font-bold">
                  Therefore: {targetTotalSeconds} × 1 mL = {targetTotalMl} mL
                </p>
              </div>

              <p className="text-[11px] text-vaayana-textLightMuted italic leading-relaxed">
                {language === 'ml'
                  ? 'ഓരോ തുള്ളി ജലവും വിലപ്പെട്ടതാണ്. ഉപയോഗത്തിന് ശേഷം ടാപ്പ് കൃത്യമായി അടയ്ക്കുക!'
                  : 'Every single drop counts. Always turn off the tap securely after use!'}
              </p>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
};
