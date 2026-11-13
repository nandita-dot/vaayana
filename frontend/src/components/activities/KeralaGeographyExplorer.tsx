import React, { useState } from 'react';
import { 
  Mountain, 
  Waves, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Info,
  Layers,
  MapPin
} from 'lucide-react';
import { playClickSound, playCorrectSound, playCelebrationSound } from '../../services/soundService';

interface EastRiver {
  id: string;
  nameEn: string;
  nameMl: string;
  originDistrict: string;
  originDistrictMl: string;
  flowsTo: string;
  flowsToMl: string;
  joinsWith: string;
  joinsWithMl: string;
  color: string;
  lengthKm: number;
  highlightCoordinates: { x: number; y: number }; // Relative position on map
  description: string;
  descriptionMl: string;
}

const EAST_FLOWING_RIVERS: EastRiver[] = [
  {
    id: 'kabani',
    nameEn: 'Kabani River',
    nameMl: 'കബനി നദി',
    originDistrict: 'Wayanad',
    originDistrictMl: 'വയനാട്',
    flowsTo: 'Karnataka',
    flowsToMl: 'കർണ്ണാടക',
    joinsWith: 'Kaveri River',
    joinsWithMl: 'കാവേരി നദി',
    color: '#0284c7',
    lengthKm: 240, // Length within & beyond Kerala
    highlightCoordinates: { x: 55, y: 22 },
    description: 'Kabani originates in the lush high ranges of Wayanad and flows eastward into Karnataka to merge with the sacred Kaveri River.',
    descriptionMl: 'വയനാടൻ മലനിരകളിൽ നിന്ന് ഉത്ഭവിച്ച് കിഴക്കോട്ട് ഒഴുകി കർണാടകയിലെത്തി കാവേരി നദിയിൽ ചേരുന്നു.'
  },
  {
    id: 'bhavani',
    nameEn: 'Bhavani River',
    nameMl: 'ഭവാനി നദി',
    originDistrict: 'Palakkad',
    originDistrictMl: 'പാലക്കാട്',
    flowsTo: 'Tamil Nadu',
    flowsToMl: 'തമിഴ്നാട്',
    joinsWith: 'Kaveri River',
    joinsWithMl: 'കാവേരി നദി',
    color: '#059669',
    lengthKm: 217,
    highlightCoordinates: { x: 62, y: 46 },
    description: 'Bhavani originates in the Attappadi and Silent Valley hills of Palakkad, coursing east into Tamil Nadu to join the Kaveri.',
    descriptionMl: 'പാലക്കാട്ടെ അട്ടപ്പാടി മലനിരകളിൽ ഉത്ഭവിച്ച് കിഴക്കോട്ട് ഒഴുകി തമിഴ്നാട്ടിലെത്തി കാവേരി നദിയിൽ ലയിക്കുന്നു.'
  },
  {
    id: 'pambar',
    nameEn: 'Pambar River',
    nameMl: 'പാമ്പാർ നദി',
    originDistrict: 'Idukki',
    originDistrictMl: 'ഇടുക്കി',
    flowsTo: 'Tamil Nadu',
    flowsToMl: 'തമിഴ്നാട്',
    joinsWith: 'Amaravathi River (Kaveri Basin)',
    joinsWithMl: 'അമരാവതി നദി (കാവേരി നദീതടം)',
    color: '#d97706',
    lengthKm: 31,
    highlightCoordinates: { x: 68, y: 64 },
    description: 'Pambar originates near Devikulam/Anamudi in Idukki, flowing east into Tamil Nadu to join the Amaravathi River.',
    descriptionMl: 'ഇടുക്കി ജില്ലയിലെ ദേവികുളം മലനിരകളിൽ നിന്ന് ഉത്ഭവിച്ച് കിഴക്കോട്ട് ഒഴുകി തമിഴ്നാട്ടിലെ അമരാവതി നദിയിൽ ചേരുന്നു.'
  }
];

export const KeralaGeographyExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'eastRivers' | 'crossSection' | 'quiz'>('overview');
  const [selectedRiverId, setSelectedRiverId] = useState<string>('kabani');
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const selectedRiver = EAST_FLOWING_RIVERS.find(r => r.id === selectedRiverId) || EAST_FLOWING_RIVERS[0];

  const quizQuestions = [
    {
      questionEn: "How many rivers flow in total across Kerala?",
      questionMl: "കേരളത്തിൽ ആകെ എത്ര നദികൾ ഒഴുകുന്നുണ്ട്?",
      options: [
        { label: "44 Rivers (44 നദികൾ)", isCorrect: true },
        { label: "41 Rivers (41 നദികൾ)", isCorrect: false },
        { label: "3 Rivers (3 നദികൾ)", isCorrect: false },
        { label: "14 Rivers (14 നദികൾ)", isCorrect: false }
      ]
    },
    {
      questionEn: "How many rivers in Kerala flow eastwards?",
      questionMl: "കേരളത്തിൽ കിഴക്കോട്ട് ഒഴുകുന്ന നദികൾ എത്ര?",
      options: [
        { label: "3 Rivers (കബനി, ഭവാനി, പാമ്പാർ)", isCorrect: true },
        { label: "41 Rivers (41 നദികൾ)", isCorrect: false },
        { label: "44 Rivers (44 നദികൾ)", isCorrect: false },
        { label: "7 Rivers (7 നദികൾ)", isCorrect: false }
      ]
    },
    {
      questionEn: "In which district does the Kabani River originate?",
      questionMl: "കബനി നദി ഉത്ഭവിക്കുന്നത് ഏത് ജില്ലയിലാണ്?",
      options: [
        { label: "Wayanad (വയനാട്)", isCorrect: true },
        { label: "Palakkad (പാലക്കാട്)", isCorrect: false },
        { label: "Idukki (ഇടുക്കി)", isCorrect: false },
        { label: "Kollam (കൊല്ലം)", isCorrect: false }
      ]
    },
    {
      questionEn: "Why do 41 rivers of Kerala flow westwards into the Arabian Sea?",
      questionMl: "കേരളത്തിലെ 41 നദികളും പടിഞ്ഞാറേക്ക് ഒഴുകാൻ പ്രധാന കാരണം എന്ത്?",
      options: [
        { label: "Land slopes from East (Western Ghats) down to West (Sea)", isCorrect: true },
        { label: "Strong ocean winds push the water", isCorrect: false },
        { label: "Rain only falls on the seashore", isCorrect: false },
        { label: "All mountains are located in the Arabian Sea", isCorrect: false }
      ]
    }
  ];

  const handleAnswerQuiz = (isCorrect: boolean) => {
    if (isCorrect) {
      playCorrectSound();
      setQuizFeedback({
        message: "ശരിയുത്തരം! Excellent! You understand Kerala's physical landscape.",
        isCorrect: true
      });
      setQuizScore(prev => prev + 1);
      setTimeout(() => {
        setQuizFeedback(null);
        if (quizStep + 1 < quizQuestions.length) {
          setQuizStep(prev => prev + 1);
        } else {
          playCelebrationSound();
        }
      }, 1400);
    } else {
      playClickSound();
      setQuizFeedback({
        message: "ശ്രമിക്കൂ! Not quite. Think about Kerala's slope and geography.",
        isCorrect: false
      });
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase">
              Activity 5 • EVS Std 4
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-600 text-sm font-medium">കേരളത്തിന്റെ ഭൂപ്രകൃതിയും നദികളും</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            Kerala Geography & Rivers Explorer (കേരള ഭൂപ്രകൃതിയും നദികളും)
          </h2>
          <p className="text-slate-600 text-sm">
            Learn about Kerala's slope from the Sahyadri mountains down to the Arabian Sea, and explore all 44 rivers (41 west-flowing, 3 east-flowing).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { playClickSound(); setActiveTab('overview'); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" /> Overview & Rivers
          </button>
          <button
            onClick={() => { playClickSound(); setActiveTab('eastRivers'); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'eastRivers'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowRight className="w-4 h-4 text-amber-500" /> 3 East-Flowing Rivers
          </button>
          <button
            onClick={() => { playClickSound(); setActiveTab('crossSection'); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'crossSection'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" /> East-West Slope
          </button>
          <button
            onClick={() => { playClickSound(); setActiveTab('quiz'); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Quiz ({quizScore}/{quizQuestions.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map schematic (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                Kerala Physical Schematic (കേരള ഭൂപടം)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                West: Arabian Sea | East: Sahyadri
              </span>
            </div>

            {/* Schematic SVG Map */}
            <div className="relative w-full aspect-[3/4] max-h-[480px] bg-slate-50 rounded-xl overflow-hidden border-2 border-slate-200">
              <svg viewBox="0 0 400 520" className="w-full h-full">
                {/* Arabian Sea on West */}
                <rect x="0" y="0" width="130" height="520" fill="#e0f2fe" opacity="0.8" />
                <text x="25" y="260" fill="#0284c7" fontSize="14" fontWeight="bold" transform="rotate(-90 25 260)">
                  ARABIAN SEA (അറബിക്കടൽ)
                </text>

                {/* Kerala Landmass Polygon */}
                <path
                  d="M 120 40 Q 170 30, 240 50 L 260 90 L 250 140 L 280 200 L 280 250 L 250 280 L 290 340 L 270 420 L 230 480 L 190 490 L 170 470 L 140 380 L 130 250 L 120 130 Z"
                  fill="#dcfce7"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                />

                {/* Western Ghats / Sahyadri Mountain Range on East */}
                <path
                  d="M 235 50 Q 255 100, 245 140 Q 275 190, 275 250 Q 245 280, 285 340 Q 265 410, 225 480"
                  fill="none"
                  stroke="#92400e"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="4 8"
                  opacity="0.85"
                />
                <text x="310" y="270" fill="#78350f" fontSize="13" fontWeight="bold" transform="rotate(90 310 270)">
                  SAHYADRI / WESTERN GHATS (പശ്ചിമഘട്ടം)
                </text>

                {/* 41 West Flowing Rivers (Schematic blue streams flowing left to sea) */}
                <g stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.7">
                  <path d="M 240 60 Q 180 65, 122 70" />
                  <path d="M 245 100 Q 180 110, 125 115" />
                  <path d="M 240 130 Q 180 135, 126 140" />
                  <path d="M 255 160 Q 180 165, 127 175" />
                  <path d="M 265 210 Q 190 220, 128 230" />
                  <path d="M 270 240 Q 200 245, 130 260" />
                  <path d="M 255 275 Q 190 280, 132 290" />
                  <path d="M 275 320 Q 200 325, 134 330" />
                  <path d="M 280 350 Q 200 360, 137 375" />
                  <path d="M 260 390 Q 200 400, 142 410" />
                  <path d="M 240 430 Q 190 440, 155 450" />
                  <path d="M 220 465 Q 180 470, 168 475" />
                </g>

                {/* 3 East Flowing Rivers (Prominently styled flowing eastwards) */}
                {/* Kabani in Wayanad */}
                <path
                  d="M 220 110 Q 240 105, 290 100"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="220" cy="110" r="4" fill="#0284c7" />
                <text x="250" y="94" fill="#0369a1" fontSize="10" fontWeight="bold">Kabani →</text>

                {/* Bhavani in Palakkad */}
                <path
                  d="M 250 240 Q 275 235, 320 230"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="250" cy="240" r="4" fill="#059669" />
                <text x="280" y="224" fill="#047857" fontSize="10" fontWeight="bold">Bhavani →</text>

                {/* Pambar in Idukki */}
                <path
                  d="M 265 330 Q 285 332, 330 338"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="265" cy="330" r="4" fill="#d97706" />
                <text x="285" y="325" fill="#b45309" fontSize="10" fontWeight="bold">Pambar →</text>

                {/* District labels for the 3 origins */}
                <text x="180" y="105" fill="#1e293b" fontSize="9" fontWeight="bold">വയനാട് (Wayanad)</text>
                <text x="190" y="235" fill="#1e293b" fontSize="9" fontWeight="bold">പാലക്കാട് (Palakkad)</text>
                <text x="200" y="325" fill="#1e293b" fontSize="9" fontWeight="bold">ഇടുക്കി (Idukki)</text>
              </svg>
            </div>
          </div>

          {/* Facts and key highlights (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* 44 Rivers Counter Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                Key River Statistics (നദീ വിവരങ്ങൾ)
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <div className="text-2xl font-black text-emerald-700">44</div>
                  <div className="text-[11px] font-bold text-slate-700">Total Rivers</div>
                  <div className="text-[9px] text-slate-500">ആകെ നദികൾ</div>
                </div>
                <div className="bg-sky-50 rounded-xl p-3 border border-sky-200">
                  <div className="text-2xl font-black text-sky-700">41</div>
                  <div className="text-[11px] font-bold text-slate-700">West-Flowing</div>
                  <div className="text-[9px] text-slate-500">പടിഞ്ഞാറോട്ട്</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                  <div className="text-2xl font-black text-amber-700">3</div>
                  <div className="text-[11px] font-bold text-slate-700">East-Flowing</div>
                  <div className="text-[9px] text-slate-500">കിഴക്കോട്ട്</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">Slope of the Land:</div>
                <p>
                  Because the Western Ghats (Sahyadri) rise high in the East and slope downward to the Arabian Sea in the West, water naturally flows downhill towards the west!
                </p>
                <p className="font-medium text-emerald-800 pt-1">
                  കിഴക്ക് പശ്ചിമഘട്ടവും പടിഞ്ഞാറ് അറബിക്കടലും സ്ഥിതി ചെയ്യുന്നതിനാൽ ഭൂമിയുടെ ചെരിവ് പടിഞ്ഞാറോട്ടാണ്.
                </p>
              </div>
            </div>

            {/* The 3 East Rivers Spotlight */}
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900 uppercase">
                  Special 3 East-Flowing Rivers:
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-800">
                <div className="p-2 bg-white rounded-lg border border-amber-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sky-700">1. Kabani (കബനി)</span>
                    <span className="text-slate-500 ml-1">• Wayanad → Karnataka → Kaveri</span>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-emerald-700">2. Bhavani (ഭവാനി)</span>
                    <span className="text-slate-500 ml-1">• Palakkad → Tamil Nadu → Kaveri</span>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-amber-700">3. Pambar (പാമ്പാർ)</span>
                    <span className="text-slate-500 ml-1">• Idukki → Tamil Nadu → Amaravathi</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { playClickSound(); setActiveTab('eastRivers'); }}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              Explore 3 East Rivers in Detail <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: 3 East-Flowing Rivers Deep Dive */}
      {activeTab === 'eastRivers' && (
        <div className="space-y-6">
          {/* Selector pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EAST_FLOWING_RIVERS.map(river => {
              const isSelected = river.id === selectedRiverId;
              return (
                <button
                  key={river.id}
                  onClick={() => { playClickSound(); setSelectedRiverId(river.id); }}
                  className={`p-4 rounded-xl text-left border-2 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {river.originDistrict} District
                    </span>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: river.color }} />
                  </div>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {river.nameMl}
                  </div>
                  <div className="text-xs text-slate-600">
                    {river.nameEn}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected River Detail Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  East-Flowing River Profile (കിഴക്കോട്ടൊഴുകുന്ന നദി)
                </span>
                <h3 className="text-2xl font-black text-slate-800">
                  {selectedRiver.nameMl} ({selectedRiver.nameEn})
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold">
                <Mountain className="w-4 h-4" /> Origin: {selectedRiver.originDistrict} ({selectedRiver.originDistrictMl})
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase">1. Originates In (ഉത്ഭവം)</div>
                <div className="text-lg font-bold text-slate-800 mt-1">{selectedRiver.originDistrictMl}</div>
                <div className="text-xs text-slate-600">{selectedRiver.originDistrict} District, Kerala</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase">2. Flows Into (പ്രവഹിക്കുന്ന സംസ്ഥാനം)</div>
                <div className="text-lg font-bold text-slate-800 mt-1">{selectedRiver.flowsToMl}</div>
                <div className="text-xs text-slate-600">Crosses border into {selectedRiver.flowsTo}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase">3. Merges With (ലയിക്കുന്ന നദി)</div>
                <div className="text-lg font-bold text-slate-800 mt-1">{selectedRiver.joinsWithMl}</div>
                <div className="text-xs text-slate-600">{selectedRiver.joinsWith}</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <p className="text-sm font-semibold text-emerald-950">
                {selectedRiver.descriptionMl}
              </p>
              <p className="text-xs text-emerald-800">
                {selectedRiver.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: East-West Slope Cross Section */}
      {activeTab === 'crossSection' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Cross-Section Diagram
            </span>
            <h3 className="text-xl font-bold text-slate-800">
              The East-to-West Downward Slope (കിഴക്ക് നിന്ന് പടിഞ്ഞാറോട്ടുള്ള ചെരിവ്)
            </h3>
            <p className="text-xs text-slate-500">
              Understanding why gravity carries 41 of Kerala's 44 rivers towards the Arabian Sea in the West.
            </p>
          </div>

          {/* Cross section SVG diagram */}
          <div className="relative w-full aspect-[21/9] bg-gradient-to-b from-sky-50 to-slate-100 rounded-xl overflow-hidden border border-slate-200 p-4">
            <svg viewBox="0 0 800 320" className="w-full h-full">
              {/* Sky background */}
              <rect x="0" y="0" width="800" height="320" fill="transparent" />

              {/* Arabian Sea on far left (West) */}
              <rect x="0" y="180" width="160" height="140" fill="#38bdf8" opacity="0.4" />
              <path d="M 0 180 Q 40 175, 80 180 T 160 180 L 160 320 L 0 320 Z" fill="#0284c7" opacity="0.5" />
              <text x="20" y="240" fill="#0369a1" fontSize="16" fontWeight="bold">Arabian Sea</text>
              <text x="20" y="260" fill="#0369a1" fontSize="12">പടിഞ്ഞാറ് (West)</text>

              {/* Slope profile: Highlands -> Midlands -> Lowlands */}
              {/* Highlands on right (East) at 700, 40 -> Midland at 400, 160 -> Lowland at 160, 200 */}
              <path
                d="M 160 200 Q 280 195, 380 170 T 560 110 Q 640 40, 720 30 L 800 30 L 800 320 L 160 320 Z"
                fill="#86efac"
                stroke="#15803d"
                strokeWidth="4"
              />

              {/* Mountain peaks in Sahyadri on far right */}
              <polygon points="680,80 720,20 760,80" fill="#78350f" opacity="0.6" />
              <polygon points="620,120 660,50 700,120" fill="#92400e" opacity="0.7" />
              <polygon points="730,90 770,30 810,90" fill="#451a03" opacity="0.5" />

              {/* Mountain label */}
              <text x="640" y="20" fill="#78350f" fontSize="15" fontWeight="bold">Sahyadri / Western Ghats</text>
              <text x="640" y="40" fill="#78350f" fontSize="12">കിഴക്ക് (East) - ഉയരം കൂടിയ മലനിരകൾ</text>

              {/* Downward slope arrow & river stream */}
              <path
                d="M 680 70 Q 500 130, 170 190"
                fill="none"
                stroke="#2563eb"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="12 6"
              />
              <text x="360" y="125" fill="#1d4ed8" fontSize="14" fontWeight="bold">
                ← 41 Rivers flow down the westward slope into the Sea ←
              </text>
              <text x="360" y="145" fill="#1e40af" fontSize="11">
                ഭൂമിയുടെ ചെരിവ് അനുസരിച്ച് നദികൾ പടിഞ്ഞാറേക്ക് ഒഴുകുന്നു
              </text>

              {/* Zone divisions */}
              <line x1="260" y1="180" x2="260" y2="320" stroke="#16a34a" strokeDasharray="4 4" strokeWidth="2" />
              <line x1="520" y1="110" x2="520" y2="320" stroke="#16a34a" strokeDasharray="4 4" strokeWidth="2" />

              <text x="175" y="295" fill="#14532d" fontSize="13" fontWeight="bold">തീരദേശം (Lowland)</text>
              <text x="350" y="295" fill="#14532d" fontSize="13" fontWeight="bold">ഇടനാട് (Midland)</text>
              <text x="590" y="295" fill="#14532d" fontSize="13" fontWeight="bold">മലനാട് (Highland)</text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-900">1. മലനാട് (Highland - East)</span>
              <p className="text-slate-600 mt-1">
                Highest altitude. Heavy rainfall in the Western Ghats feeds the river sources.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-900">2. ഇടനാട് (Midland)</span>
              <p className="text-slate-600 mt-1">
                Rolling hills, valleys, and fertile rubber/spice plantations through which rivers surge.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-900">3. തീരദേശം (Lowland / Coast - West)</span>
              <p className="text-slate-600 mt-1">
                Sandy beaches, paddy plains, backwaters and lagoons meeting the Arabian Sea.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Geography Quiz Question {quizStep + 1} of {quizQuestions.length}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-0.5">
                {quizQuestions[quizStep].questionMl}
              </h3>
              <p className="text-sm text-slate-600">
                {quizQuestions[quizStep].questionEn}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Score</span>
              <div className="text-2xl font-black text-emerald-600">{quizScore}/{quizQuestions.length}</div>
            </div>
          </div>

          {quizFeedback && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-fadeIn ${
              quizFeedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {quizFeedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Info className="w-5 h-5 text-rose-600" />}
              {quizFeedback.message}
            </div>
          )}

          {quizStep < quizQuestions.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizQuestions[quizStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerQuiz(opt.isCorrect)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left font-bold text-slate-800 text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Sparkles className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-slate-800">
                അഭിനന്ദനങ്ങൾ! Quiz Completed!
              </h3>
              <p className="text-slate-600">
                You scored {quizScore} out of {quizQuestions.length}! You understand Kerala's physical geography and rivers.
              </p>
              <button
                onClick={() => {
                  playClickSound();
                  setQuizStep(0);
                  setQuizScore(0);
                  setQuizFeedback(null);
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KeralaGeographyExplorer;

