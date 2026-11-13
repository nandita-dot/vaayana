import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playCorrectSound, playIncorrectSound, playCelebrationSound } from '../../services/soundService';
import { MapPin, Navigation, RotateCcw, CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight } from 'lucide-react';

interface VillageLandmark {
  id: string;
  nameEn: string;
  nameMl: string;
  row: number; // 0 to 2
  col: number; // 0 to 2
  icon: string;
  descEn: string;
  descMl: string;
}

const VILLAGE_GRID: VillageLandmark[] = [
  { id: 'forest', nameEn: 'Sacred Grove / Forest', nameMl: 'കാവ് / പച്ചപ്പ്', row: 0, col: 0, icon: '🌲', descEn: 'Dense woods at North-West', descMl: 'വടക്കുപടിഞ്ഞാറൻ വനം' },
  { id: 'school', nameEn: 'ALP School', nameMl: 'എ.എൽ.പി സ്കൂൾ', row: 0, col: 1, icon: '🏫', descEn: 'School at the North', descMl: 'വടക്കുഭാഗത്തെ സ്കൂൾ' },
  { id: 'temple', nameEn: 'Village Temple', nameMl: 'ഗ്രാമക്ഷേത്രം', row: 0, col: 2, icon: '🛕', descEn: 'Temple at North-East', descMl: 'വടക്കുകിഴക്കൻ ക്ഷേത്രം' },
  { id: 'river', nameEn: 'Meenachil River', nameMl: 'ഗ്രാമപ്പുഴ', row: 1, col: 0, icon: '🌊', descEn: 'River flowing in West', descMl: 'പടിഞ്ഞാറൻ പുഴ' },
  { id: 'home', nameEn: 'Anu’s Home', nameMl: 'അനുവിന്റെ വീട്', row: 1, col: 1, icon: '🏡', descEn: 'Central village home', descMl: 'മധ്യഭാഗത്തെ വീട്' },
  { id: 'bus_stop', nameEn: 'Junction Bus Stop', nameMl: 'ബസ് സ്റ്റോപ്പ്', row: 1, col: 2, icon: '🚏', descEn: 'Bus stop in East', descMl: 'കിഴക്കൻ കവല' },
  { id: 'paddy', nameEn: 'Paddy Fields', nameMl: 'നെൽപ്പാടം', row: 2, col: 0, icon: '🌾', descEn: 'Fields at South-West', descMl: 'തെക്കുപടിഞ്ഞാറൻ പാടം' },
  { id: 'hospital', nameEn: 'Primary Health Centre', nameMl: 'പ്രാഥമികാരോഗ്യകേന്ദ്രം', row: 2, col: 1, icon: '🏥', descEn: 'Hospital in South', descMl: 'തെക്ക് ഭാഗത്തെ ആശുപത്രി' },
  { id: 'playground', nameEn: 'Football Ground', nameMl: 'കളിക്കളം', row: 2, col: 2, icon: '⚽', descEn: 'Playground at South-East', descMl: 'തെക്കുകിഴക്കൻ മൈതാനം' }
];

interface NavigationQuestion {
  id: string;
  fromId: string;
  toId: string;
  correctDir: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';
  hintEn: string;
  hintMl: string;
}

const QUESTIONS: NavigationQuestion[] = [
  { id: 'q1', fromId: 'home', toId: 'school', correctDir: 'N', hintEn: 'Look straight up towards the top of the map.', hintMl: 'ഭൂപടത്തിന്റെ മുകൾഭാഗത്തേക്ക് (വടക്കോട്ട്) നോക്കൂ.' },
  { id: 'q2', fromId: 'home', toId: 'bus_stop', correctDir: 'E', hintEn: 'Look towards where the morning sun rises.', hintMl: 'സൂര്യൻ ഉദിക്കുന്ന കിഴക്ക് ഭാഗത്തേക്ക് നോക്കൂ.' },
  { id: 'q3', fromId: 'home', toId: 'hospital', correctDir: 'S', hintEn: 'Look straight down towards the bottom.', hintMl: 'താഴേക്ക് (തെക്ക് ഭാഗത്തേക്ക്) നോക്കൂ.' },
  { id: 'q4', fromId: 'home', toId: 'river', correctDir: 'W', hintEn: 'Look towards where the sun sets in the evening.', hintMl: 'സൂര്യൻ അസ്തമിക്കുന്ന പടിഞ്ഞാറ് ഭാഗത്തേക്ക് നോക്കൂ.' },
  { id: 'q5', fromId: 'home', toId: 'temple', correctDir: 'NE', hintEn: 'Between North and East.', hintMl: 'വടക്കിനും കിഴക്കിനും ഇടയിലുള്ള കോൺ (വടക്കുകിഴക്ക്).' },
  { id: 'q6', fromId: 'home', toId: 'paddy', correctDir: 'SW', hintEn: 'Between South and West.', hintMl: 'തെക്കിനും പടിഞ്ഞാറിനും ഇടയിലുള്ള കോൺ (തെക്കുപടിഞ്ഞാറ്).' },
  { id: 'q7', fromId: 'school', toId: 'home', correctDir: 'S', hintEn: 'From School, move downwards towards the center.', hintMl: 'സ്കൂളിൽ നിന്ന് താഴേക്ക് വീട്ടിനടുത്തേക്ക് നോക്കൂ.' },
  { id: 'q8', fromId: 'bus_stop', toId: 'playground', correctDir: 'S', hintEn: 'From Bus Stop, look down.', hintMl: 'ബസ് സ്റ്റോപ്പിൽ നിന്ന് താഴേക്ക് നോക്കൂ.' },
];

const DIR_LABELS: Record<string, { en: string; ml: string }> = {
  'N': { en: 'North (വടക്ക്)', ml: 'വടക്ക് (N)' },
  'S': { en: 'South (തെക്ക്)', ml: 'തെക്ക് (S)' },
  'E': { en: 'East (കിഴക്ക്)', ml: 'കിഴക്ക് (E)' },
  'W': { en: 'West (പടിഞ്ഞാറ്)', ml: 'പടിഞ്ഞാറ് (W)' },
  'NE': { en: 'North-East (വടക്കുകിഴക്ക്)', ml: 'വടക്കുകിഴക്ക് (NE)' },
  'NW': { en: 'North-West (വടക്കുപടിഞ്ഞാറ്)', ml: 'വടക്കുപടിഞ്ഞാറ് (NW)' },
  'SE': { en: 'South-East (തെക്കുകിഴക്ക്)', ml: 'തെക്കുകിഴക്ക് (SE)' },
  'SW': { en: 'South-West (തെക്കുപടിഞ്ഞാറ്)', ml: 'തെക്കുപടിഞ്ഞാറ് (SW)' },
};

export const VillageNavigationMap: React.FC = () => {
  const { language } = useLanguage();

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong' | null; messageEn: string; messageMl: string }>({
    status: null,
    messageEn: '',
    messageMl: ''
  });

  const activeQ = QUESTIONS[questionIndex];
  const fromLandmark = VILLAGE_GRID.find(l => l.id === activeQ.fromId)!;
  const toLandmark = VILLAGE_GRID.find(l => l.id === activeQ.toId)!;

  const handleSelectDirection = (dir: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW') => {
    playClickSound();

    if (dir === activeQ.correctDir) {
      playCorrectSound();
      setScore(s => s + 1);
      setFeedback({
        status: 'correct',
        messageEn: `Excellent! From ${fromLandmark.nameEn}, ${toLandmark.nameEn} is in the ${DIR_LABELS[dir].en}!`,
        messageMl: `മികച്ചത്! ${fromLandmark.nameMl}ൽ നിന്ന് ${toLandmark.nameMl} സ്ഥിതി ചെയ്യുന്നത് ${DIR_LABELS[dir].ml} ഭാഗത്താണ്!`
      });

      setTimeout(() => {
        setQuestionIndex(prev => (prev + 1) % QUESTIONS.length);
        setShowHint(false);
        setFeedback({ status: null, messageEn: '', messageMl: '' });
      }, 1600);
    } else {
      playIncorrectSound();
      setFeedback({
        status: 'wrong',
        messageEn: `Not quite! Check the map compass and try again.`,
        messageMl: `ശ്രമിക്കൂ! ഭൂപടത്തിലെ ദിശാസൂചിക നോക്കി വീണ്ടും തിരഞ്ഞെടുക്കൂ.`
      });
    }
  };

  const handleReset = () => {
    playClickSound();
    setQuestionIndex(0);
    setScore(0);
    setShowHint(false);
    setFeedback({ status: null, messageEn: '', messageMl: '' });
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
            {language === 'ml' ? 'വഴിയറിയാം: ഗ്രാമ ഭൂപട നാവിഗേഷൻ (Find Your Way)' : 'Find Your Way: Village Map Navigation'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textDarkMuted">
            {language === 'ml' 
              ? 'ഒരു സ്ഥാനത്ത് നിന്ന് മറ്റൊരു സ്ഥാനത്തേക്കുള്ള ശരിയായ ദിശ കണ്ടെത്തുക.' 
              : 'Identify relative directions between landmarks on our village map.'}
          </p>
        </div>

        {/* Progress & Reset */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-vaayana-dark text-vaayana-lime font-mono font-black text-sm shadow-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{score} Solved</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-vaayana-dark border border-vaayana-softBorder shadow-sm"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Question Banner */}
      <div className="p-5 rounded-3xl bg-white border-2 border-vaayana-lime shadow-soft space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vaayana-dark text-vaayana-lime flex items-center justify-center font-black">
              Q{questionIndex + 1}
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-limeDark">
                {language === 'ml' ? 'നാവിഗേഷൻ ചോദ്യം:' : 'Navigation Question:'}
              </span>
              <h4 className="text-base sm:text-lg font-black text-vaayana-textDark font-malayalam">
                {language === 'ml' 
                  ? `"${fromLandmark.nameMl}"ൽ നിന്ന് "${toLandmark.nameMl}" ഏത് ദിശയിലാണ്?` 
                  : `From "${fromLandmark.nameEn}", in which direction is the "${toLandmark.nameEn}"?`}
              </h4>
            </div>
          </div>

          <button
            onClick={() => { playClickSound(); setShowHint(!showHint); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{showHint ? (language === 'ml' ? 'സൂചന മറയ്ക്കുക' : 'Hide Hint') : (language === 'ml' ? 'സൂചന കാണുക' : 'Show Hint')}</span>
          </button>
        </div>

        {/* Hint text */}
        {showHint && (
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 font-medium font-malayalam animate-fadeIn">
            💡 {language === 'ml' ? activeQ.hintMl : activeQ.hintEn}
          </div>
        )}
      </div>

      {/* Main Grid Map & Direction Pad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Illustrated Village 3x3 Grid Map (7 Cols) */}
        <div className="lg:col-span-7 bg-[#E8EFE5] rounded-3xl p-6 border-2 border-emerald-300 shadow-inner relative min-h-[420px] flex flex-col justify-between">
          
          {/* Compass Rose in Corner */}
          <div className="absolute top-3 right-3 p-2 bg-white/90 rounded-2xl border border-slate-300 shadow-sm flex flex-col items-center z-10 text-[10px] font-black text-slate-800 pointer-events-none">
            <span className="text-rose-600">▲ N</span>
            <div className="flex gap-2">
              <span>W</span>
              <span>•</span>
              <span>E</span>
            </div>
            <span>▼ S</span>
          </div>

          {/* 3x3 Grid of Landmarks */}
          <div className="grid grid-cols-3 gap-3 w-full my-auto">
            {VILLAGE_GRID.map((lm) => {
              const isSource = lm.id === fromLandmark.id;
              const isDestination = lm.id === toLandmark.id;

              return (
                <div
                  key={lm.id}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center relative transition-all ${
                    isSource 
                      ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400 scale-102'
                      : isDestination
                      ? 'bg-emerald-100 border-emerald-500 shadow-md ring-2 ring-emerald-400 animate-pulse'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Highlight badges */}
                  {isSource && (
                    <span className="absolute -top-2 left-2 text-[9px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase shadow-xs">
                      {language === 'ml' ? 'തുടക്കം' : 'From'}
                    </span>
                  )}
                  {isDestination && (
                    <span className="absolute -top-2 right-2 text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase shadow-xs">
                      {language === 'ml' ? 'ലക്ഷ്യം' : 'To'}
                    </span>
                  )}

                  <span className="text-3xl sm:text-4xl my-1">{lm.icon}</span>
                  <div className="text-xs font-black text-slate-900 font-malayalam line-clamp-1">
                    {language === 'ml' ? lm.nameMl : lm.nameEn}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                    {language === 'ml' ? lm.descMl : lm.descEn}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-slate-600 font-medium pt-2">
            {language === 'ml' ? 'ഭൂപടത്തിന്റെ മുകൾഭാഗം എല്ലായ്പ്പോഴും വടക്ക് (North) ആയിരിക്കും.' : 'The top of a map always points North.'}
          </div>
        </div>

        {/* Right: Direction Response Buttons (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Feedback notice */}
          {feedback.status && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-2xl text-xs font-bold font-malayalam flex items-center gap-2 ${
                feedback.status === 'correct' 
                  ? 'bg-emerald-100 border border-emerald-300 text-emerald-950' 
                  : 'bg-rose-100 border border-rose-300 text-rose-950'
              }`}
            >
              {feedback.status === 'correct' ? <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />}
              <span>{language === 'ml' ? feedback.messageMl : feedback.messageEn}</span>
            </motion.div>
          )}

          <div className="space-y-2">
            <span className="text-xs font-bold text-vaayana-textDarkMuted">
              {language === 'ml' ? 'ശരിയായ ദിശ തിരഞ്ഞെടുക്കുക:' : 'Select Correct Navigation Direction:'}
            </span>

            {/* Direction Keypad */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                onClick={() => handleSelectDirection('NW')}
                className="p-3 rounded-2xl bg-white hover:bg-slate-100 border border-vaayana-softBorder font-black text-xs shadow-xs active:scale-95 transition-all"
              >
                <div>↖ NW</div>
                <div className="text-[10px] text-vaayana-textDarkMuted font-malayalam">വടക്കുപടിഞ്ഞാറ്</div>
              </button>

              <button
                onClick={() => handleSelectDirection('N')}
                className="p-3 rounded-2xl bg-vaayana-dark text-vaayana-lime hover:bg-[#1a251e] font-black text-xs shadow-sm active:scale-95 transition-all border border-vaayana-lime/30"
              >
                <div>▲ North</div>
                <div className="text-[10px] text-vaayana-lime font-malayalam">വടക്ക്</div>
              </button>

              <button
                onClick={() => handleSelectDirection('NE')}
                className="p-3 rounded-2xl bg-white hover:bg-slate-100 border border-vaayana-softBorder font-black text-xs shadow-xs active:scale-95 transition-all"
              >
                <div>↗ NE</div>
                <div className="text-[10px] text-vaayana-textDarkMuted font-malayalam">വടക്കുകിഴക്ക്</div>
              </button>

              <button
                onClick={() => handleSelectDirection('W')}
                className="p-3 rounded-2xl bg-vaayana-dark text-vaayana-lime hover:bg-[#1a251e] font-black text-xs shadow-sm active:scale-95 transition-all border border-vaayana-lime/30"
              >
                <div>◀ West</div>
                <div className="text-[10px] text-vaayana-lime font-malayalam">പടിഞ്ഞാറ്</div>
              </button>

              <div className="p-3 rounded-2xl bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center">
                <Navigation className="w-5 h-5 text-slate-400" />
              </div>

              <button
                onClick={() => handleSelectDirection('E')}
                className="p-3 rounded-2xl bg-vaayana-dark text-vaayana-lime hover:bg-[#1a251e] font-black text-xs shadow-sm active:scale-95 transition-all border border-vaayana-lime/30"
              >
                <div>East ▶</div>
                <div className="text-[10px] text-vaayana-lime font-malayalam">കിഴക്ക്</div>
              </button>

              <button
                onClick={() => handleSelectDirection('SW')}
                className="p-3 rounded-2xl bg-white hover:bg-slate-100 border border-vaayana-softBorder font-black text-xs shadow-xs active:scale-95 transition-all"
              >
                <div>↙ SW</div>
                <div className="text-[10px] text-vaayana-textDarkMuted font-malayalam">തെക്കുപടിഞ്ഞാറ്</div>
              </button>

              <button
                onClick={() => handleSelectDirection('S')}
                className="p-3 rounded-2xl bg-vaayana-dark text-vaayana-lime hover:bg-[#1a251e] font-black text-xs shadow-sm active:scale-95 transition-all border border-vaayana-lime/30"
              >
                <div>▼ South</div>
                <div className="text-[10px] text-vaayana-lime font-malayalam">തെക്ക്</div>
              </button>

              <button
                onClick={() => handleSelectDirection('SE')}
                className="p-3 rounded-2xl bg-white hover:bg-slate-100 border border-vaayana-softBorder font-black text-xs shadow-xs active:scale-95 transition-all"
              >
                <div>↘ SE</div>
                <div className="text-[10px] text-vaayana-textDarkMuted font-malayalam">തെക്കുകിഴക്ക്</div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

