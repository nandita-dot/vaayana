import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Languages,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NumberEntry {
  num: number;
  th: number;
  h: number;
  t: number;
  o: number;
  nameEn: string;
  nameMl: string;
}

const SAMPLE_NUMBERS: NumberEntry[] = [
  {
    num: 5250,
    th: 5,
    h: 2,
    t: 5,
    o: 0,
    nameEn: 'Five thousand two hundred and fifty',
    nameMl: 'അയ്യായിരത്തി ഇരുനൂറ്റി അൻപത്'
  },
  {
    num: 3045,
    th: 3,
    h: 0,
    t: 4,
    o: 5,
    nameEn: 'Three thousand and forty-five',
    nameMl: 'മൂവായിരത്തി നാല്പത്തിയഞ്ച്'
  },
  {
    num: 7008,
    th: 7,
    h: 0,
    t: 0,
    o: 8,
    nameEn: 'Seven thousand and eight',
    nameMl: 'ഏഴായിരത്തി എട്ട്'
  },
  {
    num: 9999,
    th: 9,
    h: 9,
    t: 9,
    o: 9,
    nameEn: 'Nine thousand nine hundred and ninety-nine',
    nameMl: 'ഒൻപതിനായിരത്തി തൊള്ളായിരത്തി തൊണ്ണൂറ്റിയൊൻപത്'
  }
];

export const NumberNameExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  // Mini quiz matching mode
  const [matchingScore, setMatchingScore] = useState(0);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<{ num?: number; nameMl?: string }>({});

  const current = SAMPLE_NUMBERS[selectedIdx];

  const handleMatchSelect = (num: number, nameMl: string) => {
    if (current.num === num) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      setMatchingScore(s => s + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime/20 border border-vaayana-lime/40 flex items-center justify-center text-vaayana-lime font-black">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'സംഖ്യകളും അക്ഷരങ്ങളും (Number Names)' : 'Numbers & Number Names'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'നാലക്ക സംഖ്യകളെ അക്ഷരങ്ങളിലും സ്ഥാനവിലയിലും മാറ്റിയെഴുതാം' : 'Explore place-value breakdowns and names in English and Malayalam'}
            </p>
          </div>
        </div>

        {/* Number Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder overflow-x-auto">
          {SAMPLE_NUMBERS.map((item, idx) => (
            <button
              key={item.num}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-xl font-mono font-black text-xs transition-all ${
                selectedIdx === idx 
                  ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow' 
                  : 'text-vaayana-textLightMuted hover:text-vaayana-textLight'
              }`}
            >
              {item.num}
            </button>
          ))}
        </div>
      </div>

      {/* Main Exploration Box */}
      <div className="bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card space-y-8">
        
        {/* Big Number Transformation Display */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-vaayana-textDarkMuted">
            {language === 'ml' ? 'തിരഞ്ഞെടുത്ത സംഖ്യ' : 'Selected Numeral'}
          </span>
          <div className="text-6xl sm:text-7xl font-black font-mono text-vaayana-textDark tracking-tight">
            {current.num}
          </div>
        </div>

        {/* Place-value Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder text-center space-y-1 shadow-sm"
          >
            <span className="text-xs font-bold text-rose-600 uppercase block">
              {language === 'ml' ? 'ആയിരങ്ങൾ (Th)' : 'Thousands'}
            </span>
            <span className="text-3xl font-black text-vaayana-textDark font-mono block">
              {current.th * 1000}
            </span>
            <span className="text-xs text-vaayana-textDarkMuted font-bold">
              ({current.th} × 1000)
            </span>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder text-center space-y-1 shadow-sm"
          >
            <span className="text-xs font-bold text-emerald-600 uppercase block">
              {language === 'ml' ? 'നൂറുകൾ (H)' : 'Hundreds'}
            </span>
            <span className="text-3xl font-black text-vaayana-textDark font-mono block">
              {current.h * 100}
            </span>
            <span className="text-xs text-vaayana-textDarkMuted font-bold">
              ({current.h} × 100)
            </span>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder text-center space-y-1 shadow-sm"
          >
            <span className="text-xs font-bold text-amber-600 uppercase block">
              {language === 'ml' ? 'പത്തുകൾ (T)' : 'Tens'}
            </span>
            <span className="text-3xl font-black text-vaayana-textDark font-mono block">
              {current.t * 10}
            </span>
            <span className="text-xs text-vaayana-textDarkMuted font-bold">
              ({current.t} × 10)
            </span>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-5 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder text-center space-y-1 shadow-sm"
          >
            <span className="text-xs font-bold text-blue-600 uppercase block">
              {language === 'ml' ? 'ഒന്നുകൾ (O)' : 'Ones'}
            </span>
            <span className="text-3xl font-black text-vaayana-textDark font-mono block">
              {current.o}
            </span>
            <span className="text-xs text-vaayana-textDarkMuted font-bold">
              ({current.o} × 1)
            </span>
          </motion.div>
        </div>

        {/* Number Names in Both Languages Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-vaayana-dark border border-vaayana-darkBorder text-vaayana-textLight space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-vaayana-lime uppercase tracking-wider block">
              മലയാളത്തിൽ (Malayalam Number Name):
            </span>
            <p className="text-2xl sm:text-3xl font-black font-malayalam text-vaayana-textLight leading-relaxed">
              {current.nameMl}
            </p>
          </div>

          <div className="border-t border-vaayana-darkBorder pt-3 space-y-1">
            <span className="text-xs font-mono font-bold text-vaayana-textLightMuted uppercase tracking-wider block">
              In English:
            </span>
            <p className="text-lg sm:text-xl font-bold text-amber-300 font-serif italic">
              "{current.nameEn}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
