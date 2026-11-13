import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Car, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Trophy, 
  Flag,
  Calculator
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RaceRound {
  roundNumber: number;
  cars: {
    id: string;
    nameEn: string;
    nameMl: string;
    points: number;
    color: string;
  }[];
  expectedTotal: number; // strictly 1000
}

const RACE_ROUNDS: RaceRound[] = [
  {
    roundNumber: 1,
    cars: [
      { id: 'c1', nameEn: 'Red Rocket', nameMl: 'ചുവപ്പ് കാർ', points: 450, color: '#EF4444' },
      { id: 'c2', nameEn: 'Blue Comet', nameMl: 'നീല കാർ', points: 350, color: '#3B82F6' },
      { id: 'c3', nameEn: 'Green Flash', nameMl: 'പച്ച കാർ', points: 200, color: '#10B981' }
    ],
    expectedTotal: 1000 // 450 + 350 + 200 = 1000
  },
  {
    roundNumber: 2,
    cars: [
      { id: 'c1', nameEn: 'Red Rocket', nameMl: 'ചുവപ്പ് കാർ', points: 520, color: '#EF4444' },
      { id: 'c2', nameEn: 'Blue Comet', nameMl: 'നീല കാർ', points: 280, color: '#3B82F6' },
      { id: 'c3', nameEn: 'Green Flash', nameMl: 'പച്ച കാർ', points: 200, color: '#10B981' }
    ],
    expectedTotal: 1000 // 520 + 280 + 200 = 1000
  },
  {
    roundNumber: 3,
    cars: [
      { id: 'c1', nameEn: 'Red Rocket', nameMl: 'ചുവപ്പ് കാർ', points: 600, color: '#EF4444' },
      { id: 'c2', nameEn: 'Blue Comet', nameMl: 'നീല കാർ', points: 400, color: '#3B82F6' }
    ],
    expectedTotal: 1000 // 600 + 400 = 1000
  },
  {
    roundNumber: 4,
    cars: [
      { id: 'c1', nameEn: 'Red Rocket', nameMl: 'ചുവപ്പ് കാർ', points: 375, color: '#EF4444' },
      { id: 'c2', nameEn: 'Blue Comet', nameMl: 'നീല കാർ', points: 325, color: '#3B82F6' },
      { id: 'c3', nameEn: 'Green Flash', nameMl: 'പച്ച കാർ', points: 300, color: '#10B981' }
    ],
    expectedTotal: 1000 // 375 + 325 + 300 = 1000
  }
];

export const CarRaceActivity: React.FC = () => {
  const { language } = useLanguage();
  const [roundIdx, setRoundIdx] = useState(0);
  const [userSum, setUserSum] = useState<string>('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mini abacus beads for the 1000 total representation
  const [abacusBeads, setAbacusBeads] = useState({ th: 0, h: 0, t: 0, o: 0 });

  const currentRound = RACE_ROUNDS[roundIdx];

  const handleVerify = () => {
    const val = parseInt(userSum, 10);
    if (isNaN(val)) {
      setErrorMessage(language === 'ml' ? 'ദയവായി ആകെ പോയിന്റ് രേഖപ്പെടുത്തൂ' : 'Please enter the total points');
      return;
    }

    if (val === currentRound.expectedTotal) {
      setIsCalculated(true);
      setErrorMessage(null);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
      // Set abacus to 1000 automatically
      setAbacusBeads({ th: 1, h: 0, t: 0, o: 0 });
    } else {
      setErrorMessage(language === 'ml' 
        ? `തെറ്റാണ്! വീണ്ടും കൂട്ടി നോക്കൂ. ആകെ കിട്ടേണ്ടത്: 1000` 
        : `Incorrect sum! Calculate carefully to reach 1000`);
    }
  };

  const nextRound = () => {
    if (roundIdx < RACE_ROUNDS.length - 1) {
      setRoundIdx(r => r + 1);
      setUserSum('');
      setIsCalculated(false);
      setErrorMessage(null);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    }
  };

  const resetAll = () => {
    setRoundIdx(0);
    setUserSum('');
    setIsCalculated(false);
    setIsFinished(false);
    setErrorMessage(null);
    setAbacusBeads({ th: 0, h: 0, t: 0, o: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'ടോട്ടോയുടെ കാറോട്ട മത്സരം (Car Race)' : "Toto's Grand Car Race"}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'ഓരോ റൗണ്ടിലെയും ആകെ പോയിന്റ് 1000 തികയ്ക്കുക' : 'Calculate cumulative scores to reach exactly 1000 points'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full bg-vaayana-dark text-vaayana-lime font-mono font-black text-xs border border-vaayana-darkBorder">
            Round {roundIdx + 1} / {RACE_ROUNDS.length}
          </span>
          <button
            onClick={resetAll}
            className="p-2 rounded-xl bg-vaayana-dark text-vaayana-textLightMuted hover:text-vaayana-textLight"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Race Track & Scoreboard */}
      <div className="bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card space-y-6">
        
        {/* Race Track Canvas */}
        <div className="relative w-full h-56 sm:h-64 rounded-3xl bg-[#1B231D] border-4 border-[#2D3C30] shadow-inner p-4 flex flex-col justify-around overflow-hidden">
          {/* Finish Line Checkered Banner */}
          <div className="absolute right-8 top-0 bottom-0 w-8 flex flex-col opacity-60">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`h-full w-full ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
            ))}
          </div>

          {/* Cars on Tracks */}
          {currentRound.cars.map((car, idx) => {
            const progressPercent = isCalculated ? 82 : 15 + idx * 10;
            return (
              <div key={car.id} className="relative flex items-center h-14 border-b border-dashed border-white/10 last:border-none">
                <motion.div
                  animate={{ x: `${progressPercent * 4.5}px` }}
                  transition={{ type: 'spring', damping: 12, stiffness: 40 }}
                  className="relative z-10 flex items-center gap-2"
                >
                  <div 
                    className="p-2.5 rounded-2xl shadow-md flex items-center gap-2 border border-black/40"
                    style={{ backgroundColor: car.color }}
                  >
                    <Car className="w-6 h-6 text-white" />
                    <span className="font-mono font-black text-white text-sm">
                      {car.points} pts
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Calculation Challenge Box */}
        <div className="p-6 rounded-3xl bg-vaayana-dark border border-vaayana-darkBorder text-vaayana-textLight space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-vaayana-darkBorder pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-vaayana-lime uppercase tracking-wider block">
                {language === 'ml' ? 'ഈ റൗണ്ടിലെ സ്കോർബോർഡ്:' : 'Round Scoreboard:'}
              </span>
              <div className="flex items-center gap-3 mt-1 text-lg sm:text-2xl font-mono font-black">
                {currentRound.cars.map((car, i) => (
                  <span key={car.id} style={{ color: car.color }}>
                    {car.points} {i < currentRound.cars.length - 1 ? '+ ' : ''}
                  </span>
                ))}
                <span>=</span>
                <span className="text-amber-400">?</span>
              </div>
            </div>

            {/* Input Box and Button */}
            {!isCalculated ? (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={userSum}
                  onChange={e => setUserSum(e.target.value)}
                  placeholder="Total"
                  className="w-32 px-4 py-3 rounded-2xl bg-vaayana-darkElevated border-2 border-vaayana-darkBorder focus:border-vaayana-lime text-vaayana-lime font-mono font-black text-xl text-center outline-none shadow-inner"
                />
                <button
                  onClick={handleVerify}
                  className="px-6 py-3.5 rounded-2xl bg-vaayana-lime text-vaayana-dark font-black text-sm shadow-limeGlow active:scale-95 transition-all"
                >
                  {language === 'ml' ? 'പരിശോധിക്കുക' : 'Verify'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-400 text-emerald-300 font-mono font-black text-xl">
                  1000 ✓
                </div>
                <button
                  onClick={nextRound}
                  className="px-6 py-3.5 rounded-2xl bg-vaayana-lime text-vaayana-dark font-black text-sm shadow-limeGlow active:scale-95 transition-all"
                >
                  {language === 'ml' ? 'അടുത്ത റൗണ്ട് ➔' : 'Next Round ➔'}
                </button>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-xs font-bold text-rose-200 font-malayalam text-center">
              {errorMessage}
            </div>
          )}

          {/* Abacus Representation of the 1000 Total */}
          <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-darkBorder space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-vaayana-lime font-malayalam">
                {language === 'ml' ? 'ആകെ പോയിന്റ് (1000) അബാക്കസിൽ കാണിക്കാം:' : 'Represent 1000 on Abacus:'}
              </span>
              <span className="font-mono text-vaayana-textLightMuted">
                1 Thousand + 0 Hundreds + 0 Tens + 0 Ones
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-vaayana-dark border border-rose-500/40">
                <span className="text-2xl font-black text-rose-400 font-mono block">1</span>
                <span className="text-[10px] text-vaayana-textLightMuted">{language === 'ml' ? 'ആയിരം' : 'Thousands'}</span>
              </div>
              <div className="p-3 rounded-xl bg-vaayana-dark border border-emerald-500/40">
                <span className="text-2xl font-black text-emerald-400 font-mono block">0</span>
                <span className="text-[10px] text-vaayana-textLightMuted">{language === 'ml' ? 'നൂറ്' : 'Hundreds'}</span>
              </div>
              <div className="p-3 rounded-xl bg-vaayana-dark border border-amber-500/40">
                <span className="text-2xl font-black text-amber-400 font-mono block">0</span>
                <span className="text-[10px] text-vaayana-textLightMuted">{language === 'ml' ? 'പത്ത്' : 'Tens'}</span>
              </div>
              <div className="p-3 rounded-xl bg-vaayana-dark border border-blue-500/40">
                <span className="text-2xl font-black text-blue-400 font-mono block">0</span>
                <span className="text-[10px] text-vaayana-textLightMuted">{language === 'ml' ? 'ഒന്ന്' : 'Ones'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grand Championship Completion */}
        {isFinished && (
          <div className="p-8 bg-amber-100 border-2 border-amber-400 rounded-3xl text-center space-y-3 shadow-card">
            <Trophy className="w-16 h-16 text-amber-600 mx-auto" />
            <h4 className="text-2xl font-black text-amber-950 font-malayalam">
              {language === 'ml' ? 'കാറോട്ട മത്സരം പൂർത്തിയായി! ഒന്നാം സ്ഥാനം!' : 'Race Championship Completed! 1st Place!'}
            </h4>
            <p className="text-sm text-amber-900 font-medium">
              {language === 'ml' ? 'എല്ലാ റൗണ്ടുകളിലെയും 1000 പോയിന്റ് കൃത്യമായി കണക്കുകൂട്ടി!' : 'All 4 rounds of 1000 points calculated with 100% precision!'}
            </p>
            <button
              onClick={resetAll}
              className="px-6 py-3 rounded-2xl bg-vaayana-dark text-vaayana-lime font-black text-sm shadow-limeGlow"
            >
              {language === 'ml' ? 'വീണ്ടും മത്സരിക്കാം' : 'Race Again'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
