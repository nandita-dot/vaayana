import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Cross, 
  Car, 
  Train, 
  Waves, 
  Wheat, 
  Trees, 
  ShieldCheck, 
  Plane, 
  HelpCircle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Compass
} from 'lucide-react';
import { playClickSound, playCorrectSound, playCelebrationSound } from '../../services/soundService';

interface SymbolItem {
  id: string;
  nameEn: string;
  nameMl: string;
  category: 'institutions' | 'transport' | 'nature' | 'landmarks';
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  descriptionEn: string;
  descriptionMl: string;
  mapCoords: { x: number; y: number }[]; // Coordinates on sample map (percentages)
}

const MAP_SYMBOLS: SymbolItem[] = [
  {
    id: 'school',
    nameEn: 'School',
    nameMl: 'വിദ്യാലയം',
    category: 'institutions',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    borderColor: '#38bdf8',
    icon: <GraduationCap className="w-5 h-5" />,
    descriptionEn: 'Educational institution where students learn.',
    descriptionMl: 'കുട്ടികൾ പഠിക്കുന്ന വിദ്യാലയം.',
    mapCoords: [{ x: 30, y: 35 }]
  },
  {
    id: 'hospital',
    nameEn: 'Hospital',
    nameMl: 'ആശുപത്രി',
    category: 'institutions',
    color: '#dc2626',
    bgColor: '#fee2e2',
    borderColor: '#f87171',
    icon: <Cross className="w-5 h-5 text-red-600" />,
    descriptionEn: 'Healthcare centre for treatment and care.',
    descriptionMl: 'ചികിത്സയ്ക്കുള്ള ആതുരാലയം.',
    mapCoords: [{ x: 72, y: 25 }]
  },
  {
    id: 'house',
    nameEn: 'Building / House',
    nameMl: 'കെട്ടിടം / വീട്',
    category: 'institutions',
    color: '#475569',
    bgColor: '#f1f5f9',
    borderColor: '#94a3b8',
    icon: <Building2 className="w-5 h-5" />,
    descriptionEn: 'Settlement or residential home.',
    descriptionMl: 'താമസസ്ഥലം അല്ലെങ്കിൽ പാർപ്പിട സമുച്ചയം.',
    mapCoords: [{ x: 22, y: 55 }, { x: 42, y: 68 }]
  },
  {
    id: 'road',
    nameEn: 'Road / Highway',
    nameMl: 'റോഡ് / ദേശീയപാത',
    category: 'transport',
    color: '#d97706',
    bgColor: '#fef3c7',
    borderColor: '#fbbf24',
    icon: <Car className="w-5 h-5" />,
    descriptionEn: 'Paved road for vehicular movement.',
    descriptionMl: 'വാഹനങ്ങൾ സഞ്ചരിക്കുന്ന ടാർ ചെയ്ത റോഡ്.',
    mapCoords: [{ x: 50, y: 48 }]
  },
  {
    id: 'railway',
    nameEn: 'Railway Line',
    nameMl: 'റെയിൽവേ പാത',
    category: 'transport',
    color: '#1e293b',
    bgColor: '#e2e8f0',
    borderColor: '#64748b',
    icon: <Train className="w-5 h-5" />,
    descriptionEn: 'Track with sleepers for passenger & goods trains.',
    descriptionMl: 'ട്രെയിനുകൾ ഓടുന്ന റെയിൽ പാളം.',
    mapCoords: [{ x: 50, y: 80 }]
  },
  {
    id: 'river',
    nameEn: 'River / Lake',
    nameMl: 'നദി / പുഴ / തടാകം',
    category: 'nature',
    color: '#2563eb',
    bgColor: '#dbeafe',
    borderColor: '#60a5fa',
    icon: <Waves className="w-5 h-5" />,
    descriptionEn: 'Natural watercourse or lake reservoir.',
    descriptionMl: 'സ്വാഭാവിക ജലാശയം അല്ലെങ്കിൽ ഒഴുകുന്ന പുഴ.',
    mapCoords: [{ x: 80, y: 65 }]
  },
  {
    id: 'paddy',
    nameEn: 'Paddy Field',
    nameMl: 'നെൽവയൽ',
    category: 'nature',
    color: '#16a34a',
    bgColor: '#dcfce7',
    borderColor: '#4ade80',
    icon: <Wheat className="w-5 h-5" />,
    descriptionEn: 'Cultivated agricultural land for rice/crops.',
    descriptionMl: 'നെല്ല് കൃഷി ചെയ്യുന്ന പച്ചവിരിച്ച പാടം.',
    mapCoords: [{ x: 35, y: 82 }]
  },
  {
    id: 'forest',
    nameEn: 'Forest',
    nameMl: 'കാട് / വനം',
    category: 'nature',
    color: '#15803d',
    bgColor: '#dcfce7',
    borderColor: '#22c55e',
    icon: <Trees className="w-5 h-5" />,
    descriptionEn: 'Dense natural forest tree cover.',
    descriptionMl: 'മരങ്ങൾ ഇടതൂർന്നു വളരുന്ന സ്വാഭാവിക വനം.',
    mapCoords: [{ x: 82, y: 80 }]
  },
  {
    id: 'sanctuary',
    nameEn: 'Wildlife Sanctuary',
    nameMl: 'വന്യജീവി സങ്കേതം',
    category: 'nature',
    color: '#047857',
    bgColor: '#d1fae5',
    borderColor: '#10b981',
    icon: <ShieldCheck className="w-5 h-5" />,
    descriptionEn: 'Protected area safeguarding wild animals.',
    descriptionMl: 'വന്യമൃഗങ്ങളെ സംരക്ഷിക്കുന്ന സങ്കേതം.',
    mapCoords: [{ x: 85, y: 38 }]
  },
  {
    id: 'airport',
    nameEn: 'Airport / Station',
    nameMl: 'വിമാനത്താവളം / സ്റ്റേഷൻ',
    category: 'transport',
    color: '#7c3aed',
    bgColor: '#ede9fe',
    borderColor: '#a78bfa',
    icon: <Plane className="w-5 h-5" />,
    descriptionEn: 'Air transport terminal or railway station hub.',
    descriptionMl: 'വിമാന സർവീസുകളുടെ ടെർമിനൽ.',
    mapCoords: [{ x: 18, y: 18 }]
  },
  {
    id: 'bridge',
    nameEn: 'Bridge',
    nameMl: 'പാലം',
    category: 'transport',
    color: '#b45309',
    bgColor: '#fef3c7',
    borderColor: '#f59e0b',
    icon: <span className="font-bold text-sm tracking-tighter">=||=</span>,
    descriptionEn: 'Structure connecting land over water or road.',
    descriptionMl: 'നദിയ്ക്ക് കുറുകെ നിർമ്മിച്ച പാലം.',
    mapCoords: [{ x: 62, y: 65 }]
  }
];

export const MapSymbolsExplorer: React.FC = () => {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('school');
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const selectedSymbol = MAP_SYMBOLS.find(s => s.id === selectedSymbolId) || MAP_SYMBOLS[0];

  const quizQuestions = [
    {
      questionEn: "Which symbol represents a School on a map?",
      questionMl: "ഭൂപടത്തിൽ 'വിദ്യാലയം' കാണിക്കാൻ ഏത് ചിഹ്നമാണ് ഉപയോഗിക്കുന്നത്?",
      correctId: 'school'
    },
    {
      questionEn: "Which symbol shows a Hospital with a red cross?",
      questionMl: "ചുവന്ന ചിഹ്നത്തോടെ 'ആശുപത്രി' കാണിക്കുന്നത് ഏതാണ്?",
      correctId: 'hospital'
    },
    {
      questionEn: "Which symbol represents a Railway line with parallel sleepers?",
      questionMl: "റെയിൽപാളം കാണിക്കാൻ ഉപയോഗിക്കുന്ന ചിഹ്നം ഏത്?",
      correctId: 'railway'
    },
    {
      questionEn: "Which symbol represents Paddy Fields (Agriculture)?",
      questionMl: "നെൽവയലുകളെ പ്രതിനിധീകരിക്കുന്ന ചിഹ്നം ഏതാണ്?",
      correctId: 'paddy'
    },
    {
      questionEn: "What symbol denotes a protected Wildlife Sanctuary?",
      questionMl: "വന്യജീവി സങ്കേതത്തെ അടയാളപ്പെടുത്തുന്ന ചിഹ്നം ഏത്?",
      correctId: 'sanctuary'
    }
  ];

  const handleSelectSymbol = (id: string) => {
    playClickSound();
    setSelectedSymbolId(id);
  };

  const handleQuizAnswer = (answeredId: string) => {
    const currentQ = quizQuestions[quizIndex];
    if (answeredId === currentQ.correctId) {
      playCorrectSound();
      setFeedback({
        message: "ശരിയുത്തരം! Perfectly matched! Standard symbols help everyone read maps.",
        isCorrect: true
      });
      setScore(prev => prev + 1);
      setTimeout(() => {
        setFeedback(null);
        if (quizIndex + 1 < quizQuestions.length) {
          setQuizIndex(prev => prev + 1);
        } else {
          playCelebrationSound();
        }
      }, 1500);
    } else {
      playClickSound();
      setFeedback({
        message: "വീണ്ടും ചിന്തിക്കൂ! Check the legend and try again.",
        isCorrect: false
      });
    }
  };

  const resetQuiz = () => {
    playClickSound();
    setQuizIndex(0);
    setScore(0);
    setFeedback(null);
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full uppercase">
              Activity 4 • EVS Std 4
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-600 text-sm font-medium">സൂചികയും ചിഹ്നങ്ങളും</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            Map Symbols & Legend Explorer (ഭൂപട സൂചികയും ചിഹ്നങ്ങളും)
          </h2>
          <p className="text-slate-600 text-sm">
            Discover why cartographers use standardized symbols and legends (സൂചിക) to make maps readable across the world.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setQuizMode(!quizMode);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              quizMode
                ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {quizMode ? (
              <>
                <RotateCcw className="w-4 h-4" /> Exit Quiz Mode
              </>
            ) : (
              <>
                <HelpCircle className="w-4 h-4 text-amber-600" /> Start Quiz Challenge
              </>
            )}
          </button>
        </div>
      </div>

      {quizMode ? (
        /* Quiz Mode */
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-amber-100 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                Question {quizIndex + 1} of {quizQuestions.length}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-0.5">
                {quizQuestions[quizIndex].questionMl}
              </h3>
              <p className="text-sm text-slate-600">
                {quizQuestions[quizIndex].questionEn}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Score</span>
              <div className="text-2xl font-black text-amber-600">{score}/{quizQuestions.length}</div>
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-fadeIn ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
              {feedback.message}
            </div>
          )}

          {quizIndex < quizQuestions.length ? (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                Select the correct symbol:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {MAP_SYMBOLS.slice(0, 8).map(sym => (
                  <button
                    key={sym.id}
                    onClick={() => handleQuizAnswer(sym.id)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-center group bg-white shadow-sm"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-sm"
                      style={{ backgroundColor: sym.bgColor, color: sym.color }}
                    >
                      {sym.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                      {sym.nameMl}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {sym.nameEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-slate-800">
                അഭിനന്ദനങ്ങൾ! Quiz Complete!
              </h3>
              <p className="text-slate-600">
                You scored {score} out of {quizQuestions.length}! You have mastered map symbols.
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-md inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Explorer Mode: Map + Interactive Legend */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Map canvas (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600" />
                Sample Topographical Map (മാതൃകാ ഭൂപടം)
              </span>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Click any symbol in the legend to spot it
              </span>
            </div>

            {/* Map Representation with SVG background */}
            <div className="relative w-full aspect-[4/3] bg-emerald-50 rounded-xl overflow-hidden border-2 border-slate-300 shadow-inner">
              {/* Natural background features */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* River path */}
                <path
                  d="M 280 0 Q 300 80, 260 140 T 240 220 T 310 320"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                <path
                  d="M 280 0 Q 300 80, 260 140 T 240 220 T 310 320"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="18"
                />
                {/* Railway line */}
                <path
                  d="M 0 240 L 400 240"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="6"
                  strokeDasharray="10 6"
                />
                {/* Main Highway */}
                <path
                  d="M 80 0 Q 160 120, 200 180 T 360 270"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="10"
                />
                <path
                  d="M 80 0 Q 160 120, 200 180 T 360 270"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray="14 10"
                />
                {/* Forest canopy patch */}
                <path
                  d="M 300 220 Q 340 200, 380 230 T 390 290 T 310 300 Z"
                  fill="#86efac"
                  opacity="0.6"
                />
                {/* Paddy patch */}
                <path
                  d="M 90 220 L 160 210 L 180 280 L 100 280 Z"
                  fill="#fef08a"
                  opacity="0.6"
                />
              </svg>

              {/* Placed Symbols on Map */}
              {MAP_SYMBOLS.map(symbol => {
                const isSelected = symbol.id === selectedSymbolId;
                return symbol.mapCoords.map((coord, idx) => (
                  <button
                    key={`${symbol.id}-${idx}`}
                    onClick={() => handleSelectSymbol(symbol.id)}
                    style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300 z-10 ${
                      isSelected
                        ? 'scale-125 ring-4 ring-amber-400 bg-white shadow-xl z-20 animate-bounce'
                        : 'bg-white/90 hover:scale-110 shadow-md border border-slate-300 hover:z-20'
                    }`}
                    title={`${symbol.nameEn} (${symbol.nameMl})`}
                  >
                    <div style={{ color: symbol.color }}>
                      {symbol.icon}
                    </div>
                  </button>
                ));
              })}

              {/* Compass badge on map */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-slate-300 shadow-sm flex flex-col items-center">
                <span className="text-[10px] font-black text-rose-600">N ↑</span>
                <span className="text-[8px] text-slate-500 font-bold">ഉത്തരം</span>
              </div>
            </div>

            {/* Detail Box for Selected Symbol */}
            <div className="mt-4 p-4 rounded-xl border-2 flex items-start gap-4 transition-all"
              style={{ backgroundColor: selectedSymbol.bgColor, borderColor: selectedSymbol.borderColor }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-white"
                style={{ color: selectedSymbol.color }}
              >
                {selectedSymbol.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {selectedSymbol.nameMl} ({selectedSymbol.nameEn})
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-white/80 text-slate-700">
                    {selectedSymbol.category}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1 font-medium">
                  {selectedSymbol.descriptionMl}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedSymbol.descriptionEn}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Map Index / Legend (സൂചിക) (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="border-b border-slate-200 pb-3 mb-3">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Map Index / Legend
              </span>
              <h3 className="text-lg font-black text-slate-800">
                സൂചിക (Map Legend)
              </h3>
              <p className="text-xs text-slate-500">
                The legend explains what each color, line, and symbol represents on the map.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
              {MAP_SYMBOLS.map(symbol => {
                const isSelected = symbol.id === selectedSymbolId;
                return (
                  <button
                    key={symbol.id}
                    onClick={() => handleSelectSymbol(symbol.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: symbol.bgColor, color: symbol.color }}
                    >
                      {symbol.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {symbol.nameMl}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {symbol.nameEn}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSymbolsExplorer;

