import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

interface Runner {
  id: string;
  nameEn: string;
  nameMl: string;
  color: string;
  accent: string;
  finishTimeStr: string;
  finishHours: number;
  finishMinutes: number;
  finishSeconds: number;
  elapsedMin: number;
  elapsedSec: number;
  durationMs: number; // for animation pacing
}

const RUNNERS: Runner[] = [
  {
    id: 'girl-1',
    nameEn: 'Ananya',
    nameMl: 'അനന്യ',
    color: '#EC4899', // Pink
    accent: '#F472B6',
    finishTimeStr: '09:02:15 AM',
    finishHours: 9,
    finishMinutes: 2,
    finishSeconds: 15,
    elapsedMin: 2,
    elapsedSec: 15,
    durationMs: 3800
  },
  {
    id: 'girl-2',
    nameEn: 'Fatima',
    nameMl: 'ഫാത്തിമ',
    color: '#8B5CF6', // Purple
    accent: '#A78BFA',
    finishTimeStr: '09:03:05 AM',
    finishHours: 9,
    finishMinutes: 3,
    finishSeconds: 5,
    elapsedMin: 3,
    elapsedSec: 5,
    durationMs: 5400
  },
  {
    id: 'girl-3',
    nameEn: 'Meera',
    nameMl: 'മീര',
    color: '#10B981', // Emerald
    accent: '#34D399',
    finishTimeStr: '09:04:30 AM',
    finishHours: 9,
    finishMinutes: 4,
    finishSeconds: 30,
    elapsedMin: 4,
    elapsedSec: 30,
    durationMs: 7200
  }
];

export const GirlsRaceActivity: React.FC = () => {
  const { language } = useLanguage();

  // Race State
  const [raceState, setRaceState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [selectedRunnerIdx, setSelectedRunnerIdx] = useState<number>(0);
  const [finishedRunners, setFinishedRunners] = useState<string[]>([]);

  // Synchronized Interactive Clock State
  const [clockHours, setClockHours] = useState(9);
  const [clockMinutes, setClockMinutes] = useState(0);
  const [clockSeconds, setClockSeconds] = useState(0);

  // Student Input State for Challenge
  const [inputMin, setInputMin] = useState<string>('');
  const [inputSec, setInputSec] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const activeRunner = RUNNERS[selectedRunnerIdx];

  // Start the Race Walking animation
  const handleStartRace = () => {
    soundService.play('click');
    setRaceState('running');
    setFinishedRunners([]);
    setFeedback(null);
    setShowExplanation(false);
    setInputMin('');
    setInputSec('');

    // Runner 1 finishes
    setTimeout(() => {
      setFinishedRunners(prev => [...prev, RUNNERS[0].id]);
      soundService.play('tick');
    }, RUNNERS[0].durationMs);

    // Runner 2 finishes
    setTimeout(() => {
      setFinishedRunners(prev => [...prev, RUNNERS[1].id]);
      soundService.play('tick');
    }, RUNNERS[1].durationMs);

    // Runner 3 finishes -> Race complete
    setTimeout(() => {
      setFinishedRunners(prev => [...prev, RUNNERS[2].id]);
      setRaceState('finished');
      soundService.play('celebration');
      try {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      // Select first runner for examination
      loadRunnerClock(0);
    }, RUNNERS[2].durationMs);
  };

  const handleReset = () => {
    soundService.play('click');
    setRaceState('idle');
    setFinishedRunners([]);
    setSelectedRunnerIdx(0);
    setClockHours(9);
    setClockMinutes(0);
    setClockSeconds(0);
    setInputMin('');
    setInputSec('');
    setFeedback(null);
    setShowExplanation(false);
  };

  const loadRunnerClock = (idx: number) => {
    setSelectedRunnerIdx(idx);
    const r = RUNNERS[idx];
    setClockHours(r.finishHours);
    setClockMinutes(r.finishMinutes);
    setClockSeconds(r.finishSeconds);
    setInputMin('');
    setInputSec('');
    setFeedback(null);
    setShowExplanation(false);
    soundService.play('tick');
  };

  // Synchronized clock adjustments
  const adjustTime = (deltaSec: number) => {
    soundService.play('tick');
    let totalSec = clockHours * 3600 + clockMinutes * 60 + clockSeconds + deltaSec;
    if (totalSec < 0) totalSec = 12 * 3600 - 1;
    const h = Math.floor(totalSec / 3600) % 12 || 12;
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    setClockHours(h);
    setClockMinutes(m);
    setClockSeconds(s);
  };

  // Validate student's elapsed time answer
  const handleCheckAnswer = () => {
    const minVal = parseInt(inputMin, 10);
    const secVal = parseInt(inputSec, 10);

    if (isNaN(minVal) || isNaN(secVal)) {
      soundService.play('incorrect');
      setFeedback({
        isCorrect: false,
        message: language === 'ml' 
          ? 'ദയവായി മിനിറ്റും സെക്കൻഡും നൽകുക.' 
          : 'Please enter both minutes and seconds.'
      });
      return;
    }

    if (minVal === activeRunner.elapsedMin && secVal === activeRunner.elapsedSec) {
      soundService.play('correct');
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
      setFeedback({
        isCorrect: true,
        message: language === 'ml' 
          ? `തികച്ചും ശരിയാണ്! ${activeRunner.nameMl} ഓടിയ സമയം: ${minVal} മിനിറ്റ് ${secVal} സെക്കൻഡ്!` 
          : `Brilliant! ${activeRunner.nameEn} took ${minVal} min ${secVal} sec!`
      });
      setShowExplanation(true);
    } else {
      soundService.play('incorrect');
      setFeedback({
        isCorrect: false,
        message: language === 'ml'
          ? `ശ്രമിക്കൂ! ആരംഭ സമയം 09:00:00 AM ആണ്. പൂർത്തിയാക്കിയ സമയം ${activeRunner.finishTimeStr} ആണ്.`
          : `Try again! Start time was 09:00:00 AM, finish time was ${activeRunner.finishTimeStr}.`
      });
    }
  };

  // Clock Hand Angles:
  // Second hand: 360 / 60 = 6 deg/sec
  // Minute hand: 6 deg/min + 0.1 deg/sec
  // Hour hand: 30 deg/hr + 0.5 deg/min
  const secAngle = clockSeconds * 6;
  const minAngle = clockMinutes * 6 + clockSeconds * 0.1;
  const hrAngle = (clockHours % 12) * 30 + clockMinutes * 0.5;

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Top Banner & Instructions */}
      <div className="bg-vaayana-darkSurface p-4 sm:p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider">
              {language === 'ml' ? 'പ്രവർത്തനം 1' : 'Activity 1'}
            </span>
            <span className="text-xs font-bold text-vaayana-textLightMuted">
              Class 4 Mathematics • Chapter 5
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-1 font-malayalam">
            {language === 'ml' ? 'പെൺകുട്ടികളുടെ നടത്ത മത്സരം (The Girls\' Race Walk)' : 'The Girls\' Race Walk'}
          </h2>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted mt-1">
            {language === 'ml'
              ? 'ആരംഭ സമയം, അവസാന സമയം, ഓടിയ സമയം (Elapsed Time) എന്നിവ അളക്കാൻ ക്ലോക്കുകൾ ശ്രദ്ധിക്കൂ.'
              : 'Observe the start time, finish times, and calculate the elapsed time using analogue and digital clocks.'}
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {raceState === 'idle' ? (
            <button
              onClick={handleStartRace}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-sm shadow-limeGlow transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-vaayana-dark" />
              <span>{language === 'ml' ? 'മത്സരം ആരംഭിക്കുക (Start Race)' : 'Start Race'}</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-bold text-xs border border-vaayana-darkBorder transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-vaayana-lime" />
              <span>{language === 'ml' ? 'വീണ്ടും ക്രമീകരിക്കുക' : 'Reset Race'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Racetrack Section */}
      <div className="p-5 sm:p-7 rounded-3xl bg-vaayana-softSurface border border-vaayana-softBorder shadow-card space-y-4">
        
        {/* Race Start Clock & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-vaayana-softMuted">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-vaayana-dark text-vaayana-lime">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                {language === 'ml' ? 'മത്സരം ആരംഭിച്ച സമയം (Start Time)' : 'Race Start Time'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-navy-900 font-mono">
                09:00:00 AM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className={`px-3 py-1 rounded-full ${
              raceState === 'running' 
                ? 'bg-amber-100 text-amber-800 animate-pulse' 
                : raceState === 'finished' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {raceState === 'running' 
                ? (language === 'ml' ? 'മത്സരം പുരോഗമിക്കുന്നു...' : 'Race in progress...')
                : raceState === 'finished'
                ? (language === 'ml' ? 'മത്സരം പൂർത്തിയായി!' : 'All finished!')
                : (language === 'ml' ? 'സ്റ്റാർട്ടിംഗ് ലൈനിൽ തയ്യാറാണ്' : 'Ready at start line')}
            </span>
          </div>
        </div>

        {/* The Track Lanes */}
        <div className="space-y-4 relative py-2 overflow-hidden">
          
          {/* Finish Line Ribbon */}
          <div className="absolute right-12 top-0 bottom-0 w-4 z-20 flex flex-col justify-between pointer-events-none">
            <div className="w-full h-full bg-[repeating-linear-gradient(0deg,#111713,#111713_12px,#ffffff_12px,#ffffff_24px)] opacity-60 rounded-full" />
            <span className="absolute -top-3 -right-2 text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
              FINISH
            </span>
          </div>

          {/* Three Runner Lanes */}
          {RUNNERS.map((runner, index) => {
            const isFinished = finishedRunners.includes(runner.id);
            const isSelected = raceState === 'finished' && selectedRunnerIdx === index;

            return (
              <div 
                key={runner.id}
                onClick={() => raceState === 'finished' && loadRunnerClock(index)}
                className={`relative p-3 rounded-2xl border transition-all ${
                  isSelected 
                    ? 'bg-vaayana-limeLight/40 border-vaayana-limeDark ring-2 ring-vaayana-lime' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                } ${raceState === 'finished' ? 'cursor-pointer' : ''}`}
              >
                {/* Lane Marker & Runner Info */}
                <div className="flex items-center justify-between text-xs font-black text-slate-600 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {index + 1}
                    </span>
                    <span className="text-sm font-extrabold text-navy-900 font-malayalam">
                      {language === 'ml' ? runner.nameMl : runner.nameEn}
                    </span>
                  </div>

                  {isFinished && (
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 animate-fadeIn">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>{runner.finishTimeStr}</span>
                    </div>
                  )}
                </div>

                {/* Track Ground */}
                <div className="relative h-14 bg-slate-100 rounded-xl overflow-hidden flex items-center px-2">
                  {/* Distance meter markers */}
                  <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
                    <div className="border-r border-slate-400 h-full" />
                    <div className="border-r border-slate-400 h-full" />
                    <div className="border-r border-slate-400 h-full" />
                    <div className="border-r border-slate-400 h-full" />
                  </div>

                  {/* Animated Girl Avatar */}
                  <motion.div
                    className="relative z-10 flex items-center gap-2"
                    initial={{ x: 0 }}
                    animate={{ 
                      x: raceState === 'running' || isFinished ? 'calc(100vw - 260px)' : 0 
                    }}
                    transition={{ 
                      duration: runner.durationMs / 1000, 
                      ease: 'easeInOut' 
                    }}
                    style={{ maxWidth: 'calc(100% - 70px)' }}
                  >
                    {/* Cartoon Girl SVG */}
                    <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                      {/* Head */}
                      <circle cx="24" cy="14" r="9" fill="#FDDCB1" />
                      {/* Hair with twin pigtails */}
                      <path d="M15 14C15 8 33 8 33 14C33 16 31 18 24 18C17 18 15 16 15 14Z" fill="#4B271B" />
                      <circle cx="13" cy="17" r="4" fill="#4B271B" />
                      <circle cx="35" cy="17" r="4" fill="#4B271B" />
                      {/* Smiling Face */}
                      <circle cx="21" cy="14" r="1.2" fill="#1E293B" />
                      <circle cx="27" cy="14" r="1.2" fill="#1E293B" />
                      <path d="M22 18Q24 20 26 18" stroke="#E11D48" strokeWidth="1.2" strokeLinecap="round" />
                      {/* Runner Jersey */}
                      <path d="M17 23H31L33 34H15L17 23Z" fill={runner.color} />
                      <text x="24" y="31" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                        {index + 1}
                      </text>
                      {/* Running Legs */}
                      <motion.line 
                        x1="20" y1="34" x2="16" y2="44" 
                        stroke="#FDDCB1" strokeWidth="3" strokeLinecap="round" 
                        animate={raceState === 'running' ? { x2: [14, 22, 14] } : {}}
                        transition={{ repeat: Infinity, duration: 0.3 }}
                      />
                      <motion.line 
                        x1="28" y1="34" x2="32" y2="44" 
                        stroke="#FDDCB1" strokeWidth="3" strokeLinecap="round" 
                        animate={raceState === 'running' ? { x2: [34, 26, 34] } : {}}
                        transition={{ repeat: Infinity, duration: 0.3 }}
                      />
                    </svg>

                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white/90 shadow-sm border border-slate-200">
                      {language === 'ml' ? runner.nameMl : runner.nameEn}
                    </span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synchronized Clocks & Interactive Problem Solving */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Synchronized Analogue Clock & Digital Time (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder shadow-darkCard space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-vaayana-lime" />
              <h3 className="text-lg font-black text-vaayana-textLight font-malayalam">
                {language === 'ml' ? 'സമന്വയിപ്പിച്ച ക്ലോക്കുകൾ (Synchronized Clocks)' : 'Synchronized Clocks'}
              </h3>
            </div>
            <span className="text-xs font-bold text-vaayana-lime bg-vaayana-dark px-3 py-1 rounded-full border border-vaayana-darkBorder">
              {language === 'ml' ? 'സെക്കൻഡ് സൂചി സഹിതം' : 'With Second Hand'}
            </span>
          </div>

          {/* Dual Clock Showcase */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
            
            {/* Analogue Clock SVG */}
            <div className="relative">
              <svg width="230" height="230" viewBox="0 0 200 200" className="drop-shadow-xl select-none">
                {/* Outer Rim */}
                <circle cx="100" cy="100" r="95" fill="#1E293B" stroke="#9ACD32" strokeWidth="6" />
                <circle cx="100" cy="100" r="88" fill="#F8FAFC" />

                {/* 60 Minute/Second Tick Marks */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const angle = (i * 6 * Math.PI) / 180;
                  const isHourTick = i % 5 === 0;
                  const innerR = isHourTick ? 74 : 81;
                  const x1 = 100 + 84 * Math.sin(angle);
                  const y1 = 100 - 84 * Math.cos(angle);
                  const x2 = 100 + innerR * Math.sin(angle);
                  const y2 = 100 - innerR * Math.cos(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isHourTick ? '#0F172A' : '#94A3B8'}
                      strokeWidth={isHourTick ? 2.5 : 1}
                    />
                  );
                })}

                {/* 12 Hour Numbers */}
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x = 100 + 64 * Math.sin(angle);
                  const y = 100 - 64 * Math.cos(angle) + 4.5;
                  return (
                    <text
                      key={n}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="900"
                      fill="#0F172A"
                    >
                      {n}
                    </text>
                  );
                })}

                {/* Hour Hand (Dark, short & thick) */}
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 44 * Math.sin((hrAngle * Math.PI) / 180)}
                  y2={100 - 44 * Math.cos((hrAngle * Math.PI) / 180)}
                  stroke="#0F172A"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Minute Hand (Blue, longer) */}
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 62 * Math.sin((minAngle * Math.PI) / 180)}
                  y2={100 - 62 * Math.cos((minAngle * Math.PI) / 180)}
                  stroke="#2563EB"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Second Hand (Red, thin with counterweight) */}
                <line
                  x1={100 - 14 * Math.sin((secAngle * Math.PI) / 180)}
                  y1={100 + 14 * Math.cos((secAngle * Math.PI) / 180)}
                  x2={100 + 72 * Math.sin((secAngle * Math.PI) / 180)}
                  y2={100 - 72 * Math.cos((secAngle * Math.PI) / 180)}
                  stroke="#E11D48"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Center Hub Nut */}
                <circle cx="100" cy="100" r="4.5" fill="#E11D48" />
                <circle cx="100" cy="100" r="2" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Digital Clock Readout Display */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-bold text-vaayana-textLightMuted uppercase tracking-wider">
                {language === 'ml' ? 'ഡിജിറ്റൽ ഡിസ്പ്ലേ' : 'Digital Clock Display'}
              </span>
              
              <div className="p-4 rounded-3xl bg-black/90 border-2 border-vaayana-lime/40 text-vaayana-lime shadow-limeGlow text-center">
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest">
                  {clockHours.toString().padStart(2, '0')}:
                  {clockMinutes.toString().padStart(2, '0')}:
                  {clockSeconds.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] font-bold text-vaayana-lime/70 mt-1 uppercase tracking-widest">
                  {language === 'ml' ? 'മണിക്കൂർ : മിനിറ്റ് : സെക്കൻഡ്' : 'Hours : Minutes : Seconds'}
                </div>
              </div>

              {/* Quick Steppers for Smartboard manipulation */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => adjustTime(-60)}
                  className="px-3 py-1.5 rounded-xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-mono text-xs font-bold border border-vaayana-darkBorder"
                  title="Minus 1 minute"
                >
                  -1 min
                </button>
                <button
                  onClick={() => adjustTime(-1)}
                  className="px-3 py-1.5 rounded-xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-mono text-xs font-bold border border-vaayana-darkBorder"
                  title="Minus 1 second"
                >
                  -1 sec
                </button>
                <button
                  onClick={() => adjustTime(1)}
                  className="px-3 py-1.5 rounded-xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-mono text-xs font-bold border border-vaayana-darkBorder"
                  title="Plus 1 second"
                >
                  +1 sec
                </button>
                <button
                  onClick={() => adjustTime(60)}
                  className="px-3 py-1.5 rounded-xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-mono text-xs font-bold border border-vaayana-darkBorder"
                  title="Plus 1 minute"
                >
                  +1 min
                </button>
              </div>
            </div>
          </div>

          {/* Time Relationships Scaffolding Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-vaayana-darkElevated rounded-2xl border border-vaayana-darkBorder text-xs text-vaayana-textLight">
            <div className="p-2 rounded-xl bg-vaayana-dark text-center">
              <span className="font-extrabold text-vaayana-lime">1 Hour (മണിക്കൂർ)</span>
              <p className="font-mono text-vaayana-textLightMuted mt-0.5">= 60 Minutes</p>
            </div>
            <div className="p-2 rounded-xl bg-vaayana-dark text-center">
              <span className="font-extrabold text-vaayana-lime">1 Minute (മിനിറ്റ്)</span>
              <p className="font-mono text-vaayana-textLightMuted mt-0.5">= 60 Seconds</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-vaayana-dark text-center">
              <span className="font-extrabold text-vaayana-lime">Elapsed Time</span>
              <p className="font-mono text-vaayana-textLightMuted mt-0.5">Finish − Start</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Race Question & Explanation (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-vaayana-softSurface border border-vaayana-softBorder shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black text-navy-900 font-malayalam">
                {language === 'ml' ? 'സമയ കണക്കുകൂട്ടൽ (Time Challenge)' : 'Calculate Elapsed Time'}
              </h3>
            </div>
          </div>

          {/* Runner Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {RUNNERS.map((r, i) => (
              <button
                key={r.id}
                onClick={() => loadRunnerClock(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedRunnerIdx === i 
                    ? 'bg-navy-900 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'ml' ? r.nameMl : r.nameEn}
              </button>
            ))}
          </div>

          {/* Question Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{language === 'ml' ? 'ഓട്ടക്കാരൻ' : 'Runner'}: <strong className="text-navy-900">{language === 'ml' ? activeRunner.nameMl : activeRunner.nameEn}</strong></span>
              <span>{language === 'ml' ? 'പൂർത്തിയായ സമയം' : 'Finish Time'}: <strong className="text-navy-900">{activeRunner.finishTimeStr}</strong></span>
            </div>

            <p className="text-sm font-extrabold text-navy-900 font-malayalam leading-relaxed">
              {language === 'ml'
                ? `മത്സരം രാവിലെ 09:00:00 ന് ആരംഭിച്ചു. ${activeRunner.nameMl} മത്സരം പൂർത്തിയാക്കാൻ എടുത്ത സമയം എത്ര?`
                : `The race started at 09:00:00 AM. How much time did ${activeRunner.nameEn} take to finish the race?`}
            </p>

            {/* Answer Input Controls */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">
                  {language === 'ml' ? 'മിനിറ്റ് (Minutes)' : 'Minutes'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={inputMin}
                  onChange={(e) => setInputMin(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-center text-lg font-black text-navy-900 focus:outline-none focus:ring-2 focus:ring-vaayana-limeDark"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">
                  {language === 'ml' ? 'സെക്കൻഡ് (Seconds)' : 'Seconds'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={inputSec}
                  onChange={(e) => setInputSec(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-center text-lg font-black text-navy-900 focus:outline-none focus:ring-2 focus:ring-vaayana-limeDark"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCheckAnswer}
                className="flex-1 py-3 px-4 rounded-xl bg-vaayana-dark hover:bg-black text-vaayana-lime font-black text-sm shadow-md transition-all active:scale-95"
              >
                {language === 'ml' ? 'ഉത്തരം ശരിയാണോ എന്ന് നോക്കുക' : 'Check Answer'}
              </button>
            </div>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-start gap-3 ${
                feedback.isCorrect
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="font-malayalam leading-relaxed">{feedback.message}</div>
            </motion.div>
          )}

          {/* Guided Step-by-Step Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950 font-medium"
            >
              <div className="font-black text-sm text-amber-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>{language === 'ml' ? 'വിശദീകരണം (Step-by-Step Explanation)' : 'Step-by-Step Explanation'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'ml' ? (
                  <>
                    ആരംഭ സമയം = <strong>09:00:00 AM</strong><br />
                    അവസാനിച്ച സമയം = <strong>{activeRunner.finishTimeStr}</strong><br />
                    ഓടിയ സമയം = അവസാനിച്ച സമയം − ആരംഭ സമയം<br />
                    = (9 hr {activeRunner.elapsedMin} min {activeRunner.elapsedSec} sec) − (9 hr 0 min 0 sec)<br />
                    = <strong>{activeRunner.elapsedMin} മിനിറ്റ് {activeRunner.elapsedSec} സെക്കൻഡ്!</strong>
                  </>
                ) : (
                  <>
                    Start Time = <strong>09:00:00 AM</strong><br />
                    Finish Time = <strong>{activeRunner.finishTimeStr}</strong><br />
                    Time Taken = Finish Time − Start Time<br />
                    = <strong>{activeRunner.elapsedMin} minutes {activeRunner.elapsedSec} seconds!</strong>
                  </>
                )}
              </p>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
};
