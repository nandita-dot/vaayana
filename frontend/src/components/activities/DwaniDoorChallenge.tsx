import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Key, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  DoorClosed, 
  DoorOpen,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DoorLevel {
  levelNumber: number;
  stones: number[];
  validPair: [number, number];
  hintEn: string;
  hintMl: string;
}

const LEVELS: DoorLevel[] = [
  {
    levelNumber: 1,
    stones: [400, 600, 350, 520, 280, 150],
    validPair: [400, 600],
    hintEn: 'Find two numbers that add up to 1000 (Hint: 400 + ?)',
    hintMl: 'കൂട്ടുമ്പോൾ 1000 ആകുന്ന 2 കല്ലുകൾ തിരഞ്ഞെടുക്കൂ (400 + ? = 1000)'
  },
  {
    levelNumber: 2,
    stones: [250, 750, 300, 650, 450, 100],
    validPair: [250, 750],
    hintEn: 'Quarter & Three-quarters of 1000',
    hintMl: 'ആയിരത്തിന്റെ കാലും മുക്കാലും (250 + 750)'
  },
  {
    levelNumber: 3,
    stones: [125, 875, 225, 725, 500, 350],
    validPair: [125, 875],
    hintEn: '125 + what makes 1000?',
    hintMl: '125 നോട് എത്ര കൂട്ടിയാൽ 1000 കിട്ടും?'
  },
  {
    levelNumber: 4,
    stones: [550, 450, 500, 350, 650, 400],
    validPair: [550, 450],
    hintEn: '550 + ? = 1000',
    hintMl: '550 നോട് എത്ര കൂട്ടിയാൽ 1000 കിട്ടും?'
  }
];

export const DwaniDoorChallenge: React.FC = () => {
  const { language } = useLanguage();
  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedStones, setSelectedStones] = useState<number[]>([]);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentLevel = LEVELS[levelIdx];

  const handleStoneClick = (stone: number) => {
    if (isDoorOpen) return;

    if (selectedStones.includes(stone)) {
      setSelectedStones(selectedStones.filter(s => s !== stone));
      setFeedback(null);
      return;
    }

    if (selectedStones.length < 2) {
      const nextSelected = [...selectedStones, stone];
      setSelectedStones(nextSelected);

      if (nextSelected.length === 2) {
        const sum = nextSelected[0] + nextSelected[1];
        if (sum === 1000) {
          setIsDoorOpen(true);
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
          setFeedback(language === 'ml' 
            ? `മാന്ത്രിക വാതിൽ തുറന്നു! ${nextSelected[0]} + ${nextSelected[1]} = 1000!` 
            : `The Magical Door Opens! ${nextSelected[0]} + ${nextSelected[1]} = 1000!`);
        } else {
          const diff = 1000 - sum;
          setFeedback(language === 'ml' 
            ? `വാതിൽ തുറന്നില്ല! ${nextSelected[0]} + ${nextSelected[1]} = ${sum} (${diff > 0 ? `${diff} കുറവാണ്` : `${Math.abs(diff)} കൂടുതലാണ്`})` 
            : `Door remains locked! Sum is ${sum}`);
          setTimeout(() => setSelectedStones([]), 1500);
        }
      }
    }
  };

  const nextLevel = () => {
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(l => l + 1);
      setSelectedStones([]);
      setIsDoorOpen(false);
      setFeedback(null);
    }
  };

  const resetAll = () => {
    setLevelIdx(0);
    setSelectedStones([]);
    setIsDoorOpen(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'ധ്വനിയുടെ മാന്ത്രിക വാതിൽ (Dwani\'s Magical Door)' : 'Dwani\'s Magical Door Challenge'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'കൂട്ടുമ്പോൾ 1000 ആകുന്ന രണ്ട് രത്നങ്ങൾ തൊട്ട് വാതിൽ തുറക്കൂ' : 'Unlock the ancient temple door by finding two stones that sum to 1000'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full bg-vaayana-dark text-vaayana-lime font-mono font-black text-xs border border-vaayana-darkBorder">
            Door Level {levelIdx + 1} / {LEVELS.length}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Illustrated Magical Door & Dwani Character */}
        <div className="lg:col-span-7 bg-[#17211A] p-6 sm:p-10 rounded-4xl border-4 border-[#283C2D] shadow-2xl flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden select-none">
          
          {/* Ancient Temple Arch Border */}
          <div className="w-full max-w-[340px] aspect-[4/5] bg-[#0E1510] rounded-t-full border-8 border-[#3A4E3F] p-4 flex flex-col items-center justify-center relative shadow-[inset_0_8px_32px_rgba(0,0,0,0.8)]">
            
            {/* Door Wing Panels */}
            <div className="relative w-full h-full rounded-t-full overflow-hidden flex items-stretch">
              
              {/* Left Door Half */}
              <motion.div
                animate={{ rotateY: isDoorOpen ? -85 : 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
                className="w-1/2 h-full bg-[#3D2817] border-r-2 border-[#1E130B] flex flex-col items-center justify-center p-2 shadow-2xl relative"
              >
                <div className="w-8 h-8 rounded-full border-2 border-amber-500 bg-amber-950 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
              </motion.div>

              {/* Right Door Half */}
              <motion.div
                animate={{ rotateY: isDoorOpen ? 85 : 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ transformOrigin: "right" }}
                className="w-1/2 h-full bg-[#3D2817] border-l-2 border-[#1E130B] flex flex-col items-center justify-center p-2 shadow-2xl relative"
              >
                <div className="w-8 h-8 rounded-full border-2 border-amber-500 bg-amber-950 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
              </motion.div>

              {/* Glowing Portal Behind Opened Door */}
              {isDoorOpen && (
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 via-vaayana-lime to-yellow-200 opacity-90 rounded-t-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-20 h-20 text-emerald-950 animate-bounce" />
                </div>
              )}

              {/* Center Ancient Lock */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`p-4 rounded-full border-4 shadow-xl transition-all ${
                  isDoorOpen ? 'bg-emerald-500 border-white scale-125' : 'bg-amber-600 border-amber-900'
                }`}>
                  {isDoorOpen ? <Unlock className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-amber-950" />}
                </div>
              </div>
            </div>

          </div>

          {/* Animated Dwani Character Sprite */}
          <div className="mt-4 flex items-center gap-3 bg-vaayana-dark/80 px-4 py-2 rounded-2xl border border-vaayana-darkBorder">
            <span className="text-2xl">👧🏽</span>
            <div>
              <span className="font-black text-vaayana-lime text-xs block font-malayalam">
                {language === 'ml' ? 'ധ്വനി (Dwani)' : 'Dwani'}
              </span>
              <span className="text-[11px] text-vaayana-textLightMuted">
                {isDoorOpen 
                  ? (language === 'ml' ? 'ഹൂറേ! വാതിൽ തുറന്നു!' : 'Hooray! The door is open!')
                  : (language === 'ml' ? '1000 ആകുന്ന 2 സംഖ്യകൾ തരൂ!' : 'Find me 2 numbers summing to 1000!')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Magic Number Stones & Controls */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-vaayana-softSurface p-6 rounded-3xl border border-vaayana-softBorder shadow-card space-y-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-vaayana-textDarkMuted block">
                {language === 'ml' ? 'മാന്ത്രിക രത്നങ്ങൾ (Magic Stones)' : 'Ancient Number Stones'}
              </span>
              <p className="text-sm font-bold text-vaayana-textDark font-malayalam mt-1">
                {language === 'ml' ? currentLevel.hintMl : currentLevel.hintEn}
              </p>
            </div>

            {/* Selected Stones Formula Preview */}
            <div className="p-4 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder flex items-center justify-center gap-3 text-xl font-mono font-black text-vaayana-lime">
              <span>{selectedStones[0] !== undefined ? selectedStones[0] : '___'}</span>
              <span>+</span>
              <span>{selectedStones[1] !== undefined ? selectedStones[1] : '___'}</span>
              <span>=</span>
              <span className="text-amber-400">1000</span>
            </div>

            {/* Stones Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentLevel.stones.map(stone => {
                const isSelected = selectedStones.includes(stone);
                return (
                  <motion.button
                    key={stone}
                    onClick={() => handleStoneClick(stone)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-5 rounded-2xl font-mono font-black text-2xl transition-all shadow-md border-2 ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950 border-amber-600 scale-105 shadow-limeGlow'
                        : 'bg-vaayana-dark hover:bg-vaayana-darkHover border-vaayana-darkBorder text-vaayana-textLight'
                    }`}
                  >
                    {stone}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold font-malayalam text-center ${
                isDoorOpen
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  : 'bg-rose-100 text-rose-950 border border-rose-300'
              }`}>
                {feedback}
              </div>
            )}

            {/* Next Level Button when door opened */}
            {isDoorOpen && (
              <button
                onClick={nextLevel}
                className="w-full py-4 rounded-2xl bg-vaayana-lime text-vaayana-dark font-black text-sm shadow-limeGlow active:scale-95 transition-all"
              >
                {levelIdx < LEVELS.length - 1 
                  ? (language === 'ml' ? 'അടുത്ത മാന്ത്രിക വാതിലിലേക്ക് ➔' : 'Proceed to Next Door ➔')
                  : (language === 'ml' ? 'എല്ലാ വാതിലുകളും തുറന്നു! വിജയം!' : 'All Doors Unlocked! Great Job!')}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
