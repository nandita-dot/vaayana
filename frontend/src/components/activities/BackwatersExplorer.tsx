import React, { useState } from 'react';
import { 
  Waves, 
  Ship, 
  MapPin, 
  Droplets, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Compass, 
  RotateCcw 
} from 'lucide-react';
import { playClickSound, playCorrectSound, playCelebrationSound } from '../../services/soundService';

interface BackwaterHighlight {
  id: string;
  nameEn: string;
  nameMl: string;
  district: string;
  districtMl: string;
  type: 'connected' | 'inland';
  typeLabelEn: string;
  typeLabelMl: string;
  specialFeatureEn: string;
  specialFeatureMl: string;
  significanceEn: string;
  significanceMl: string;
  color: string;
  bgLight: string;
}

const FEATURED_LAKES: BackwaterHighlight[] = [
  {
    id: 'vembanad',
    nameEn: 'Vembanad Lake',
    nameMl: 'വേമ്പനാട് കായൽ',
    district: 'Alappuzha, Kottayam, Ernakulam',
    districtMl: 'ആലപ്പുഴ, കോട്ടയം, എറണാകുളം',
    type: 'connected',
    typeLabelEn: 'Connected to Arabian Sea (Lagoon)',
    typeLabelMl: 'അറബിക്കടലുമായി ബന്ധപ്പെട്ട കായൽ',
    specialFeatureEn: 'Largest lake in Kerala (approx 96 km length)',
    specialFeatureMl: 'കേരളത്തിലെ ഏറ്റവും വലിയ കായൽ (ഏകദേശം 96 കി.മീ നീളം)',
    significanceEn: 'Home to the world-famous Nehru Trophy Boat Race (Vallamkali) and Kumarakom bird sanctuary.',
    significanceMl: 'ലോകപ്രശസ്തമായ നെഹ്റു ട്രോഫി വള്ളംകളി നടക്കുന്നതും കുമരകം പക്ഷിസങ്കേതം സ്ഥിതിചെയ്യുന്നതും ഇവിടെയാണ്.',
    color: '#0284c7',
    bgLight: '#e0f2fe'
  },
  {
    id: 'ashtamudi',
    nameEn: 'Ashtamudi Lake',
    nameMl: 'അഷ്ടമുടിക്കായൽ',
    district: 'Kollam',
    districtMl: 'കൊല്ലം',
    type: 'connected',
    typeLabelEn: 'Connected to Arabian Sea (Estuary)',
    typeLabelMl: 'അറബിക്കടലുമായി ബന്ധപ്പെട്ട അഷ്ടശാഖാ കായൽ',
    specialFeatureEn: 'Branching into 8 distinct arms ("Ashta-mudi")',
    specialFeatureMl: 'എട്ട് ശാഖകളായി പിരിയുന്ന മനോഹരമായ കായൽ ("അഷ്ടമുടി")',
    significanceEn: 'Gateway to Kerala backwaters with houseboats and historic mangrove ecosystems.',
    significanceMl: 'കണ്ടൽക്കാടുകളും കെട്ടുവള്ള വിനോദസഞ്ചാരവും നിറഞ്ഞ കൊല്ലത്തിന്റെ ഹൃദയം.',
    color: '#0d9488',
    bgLight: '#ccfbf1'
  },
  {
    id: 'sasthamkotta',
    nameEn: 'Sasthamkotta Lake',
    nameMl: 'ശാസ്താംകോട്ട കായൽ',
    district: 'Kollam',
    districtMl: 'കൊല്ലം',
    type: 'inland',
    typeLabelEn: 'Inland Freshwater Lake',
    typeLabelMl: 'ഉൾനാടൻ ശുദ്ധജല തടാകം',
    specialFeatureEn: 'Largest freshwater lake in Kerala ("Queen of Lakes")',
    specialFeatureMl: 'കേരളത്തിലെ ഏറ്റവും വലിയ ശുദ്ധജല തടാകം ("തടാകങ്ങളുടെ രാജ്ഞി")',
    significanceEn: 'Contains larva (Cavaborus) that naturally cleanses the water, providing drinking water to Kollam.',
    significanceMl: 'ജലം സ്വാഭാവികമായി ശുദ്ധീകരിക്കുന്ന കാവബോറസ് ലാർവകൾ വസിക്കുന്ന ശുദ്ധജല സ്രോതസ്സ്.',
    color: '#16a34a',
    bgLight: '#dcfce7'
  }
];

export const BackwatersExplorer: React.FC = () => {
  const [selectedLakeId, setSelectedLakeId] = useState<string>('vembanad');
  const [activeTab, setActiveTab] = useState<'highlights' | 'sorter' | 'facts'>('highlights');

  // Classification interactive game state
  const [sortingItems, setSortingItems] = useState<Array<{
    id: string;
    name: string;
    nameMl: string;
    actualType: 'sea_connected' | 'inland';
  }>>([
    { id: '1', name: 'Vembanad Kayal', nameMl: 'വേമ്പനാട് കായൽ', actualType: 'sea_connected' },
    { id: '2', name: 'Sasthamkotta Lake', nameMl: 'ശാസ്താംകോട്ട തടാകം', actualType: 'inland' },
    { id: '3', name: 'Ashtamudi Kayal', nameMl: 'അഷ്ടമുടിക്കായൽ', actualType: 'sea_connected' },
    { id: '4', name: 'Kayamkulam Kayal', nameMl: 'കായംകുളം കായൽ', actualType: 'sea_connected' },
    { id: '5', name: 'Pookode Lake (Wayanad)', nameMl: 'പൂക്കോട് തടാകം (വയനാട്)', actualType: 'inland' },
    { id: '6', name: 'Paravur Kayal', nameMl: 'പരവൂർ കായൽ', actualType: 'sea_connected' }
  ]);

  const [classified, setClassified] = useState<{ [id: string]: 'sea_connected' | 'inland' }>({});
  const [sortFeedback, setSortFeedback] = useState<string | null>(null);

  const selectedLake = FEATURED_LAKES.find(l => l.id === selectedLakeId) || FEATURED_LAKES[0];

  const handleClassify = (id: string, bucket: 'sea_connected' | 'inland') => {
    const item = sortingItems.find(i => i.id === id);
    if (!item) return;

    if (item.actualType === bucket) {
      playCorrectSound();
      setClassified(prev => ({ ...prev, [id]: bucket }));
      setSortFeedback(`ശരിയുത്തരം! ${item.nameMl} belongs in this group.`);
      
      const allClassified = Object.keys({ ...classified, [id]: bucket }).length === sortingItems.length;
      if (allClassified) {
        setTimeout(() => {
          playCelebrationSound();
          setSortFeedback('അഭിനന്ദനങ്ങൾ! All backwaters accurately categorized!');
        }, 500);
      }
    } else {
      playClickSound();
      setSortFeedback(`തെറ്റായ വിഭാഗം. ചിന്തിക്കൂ, ${item.nameMl} കടലുമായി ബന്ധപ്പെട്ടിട്ടുണ്ടോ?`);
    }
  };

  const resetSorter = () => {
    playClickSound();
    setClassified({});
    setSortFeedback(null);
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-full uppercase">
              Activity 6 • EVS Std 4
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-600 text-sm font-medium">കായലുകളും തടാകങ്ങളും</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            Kerala Backwaters & Lakes Explorer (കായലുകൾ അറിയാം)
          </h2>
          <p className="text-slate-600 text-sm">
            Learn about Kerala's 34 backwaters — 27 connected to the Arabian Sea and 7 inland freshwater lakes.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { playClickSound(); setActiveTab('highlights'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'highlights'
                ? 'bg-cyan-700 text-white shadow-md shadow-cyan-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Waves className="w-4 h-4" /> Major Lakes
          </button>
          <button
            onClick={() => { playClickSound(); setActiveTab('sorter'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'sorter'
                ? 'bg-cyan-700 text-white shadow-md shadow-cyan-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Droplets className="w-4 h-4 text-cyan-400" /> 27 vs 7 Sorter
          </button>
          <button
            onClick={() => { playClickSound(); setActiveTab('facts'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'facts'
                ? 'bg-cyan-700 text-white shadow-md shadow-cyan-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Ship className="w-4 h-4 text-amber-400" /> Culture & Houseboats
          </button>
        </div>
      </div>

      {/* Stats counter banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black text-2xl">
            34
          </div>
          <div>
            <div className="text-sm font-black text-slate-800">Total Backwaters</div>
            <div className="text-xs text-slate-500">ആകെ കായലുകൾ (കേരളം)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-2xl">
            27
          </div>
          <div>
            <div className="text-sm font-black text-slate-800">Connected to Sea</div>
            <div className="text-xs text-slate-500">കടലുമായി ബന്ധപ്പെട്ടവ</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-2xl">
            7
          </div>
          <div>
            <div className="text-sm font-black text-slate-800">Inland / Closed Lakes</div>
            <div className="text-xs text-slate-500">ഉൾനാടൻ ശുദ്ധജല തടാകങ്ങൾ</div>
          </div>
        </div>
      </div>

      {/* Tab 1: Major Lakes Explorer */}
      {activeTab === 'highlights' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Lake Selector List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Choose a Lake to Explore:
            </span>
            {FEATURED_LAKES.map(lake => {
              const isSelected = lake.id === selectedLakeId;
              return (
                <button
                  key={lake.id}
                  onClick={() => { playClickSound(); setSelectedLakeId(lake.id); }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/70 shadow-md ring-2 ring-cyan-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {lake.district}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: lake.bgLight, color: lake.color }}
                    >
                      {lake.type === 'connected' ? 'Connected (27)' : 'Inland (7)'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {lake.nameMl}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {lake.nameEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Spotlight Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">
                  Lake Profile (കായൽ വിശേഷം)
                </span>
                <h3 className="text-2xl font-black text-slate-800">
                  {selectedLake.nameMl}
                </h3>
                <span className="text-sm font-semibold text-slate-500">
                  {selectedLake.nameEn}
                </span>
              </div>
              <div 
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                style={{ backgroundColor: selectedLake.bgLight, color: selectedLake.color }}
              >
                <MapPin className="w-4 h-4" /> {selectedLake.districtMl}
              </div>
            </div>

            {/* Visual simulation card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-cyan-100 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md">
                {selectedLake.id === 'vembanad' ? (
                  <Trophy className="w-8 h-8 text-amber-300" />
                ) : selectedLake.id === 'ashtamudi' ? (
                  <Ship className="w-8 h-8 text-cyan-200" />
                ) : (
                  <Droplets className="w-8 h-8 text-emerald-200" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {selectedLake.typeLabelMl}
                </span>
                <div className="text-base font-bold text-slate-800">
                  {selectedLake.specialFeatureMl}
                </div>
                <div className="text-xs text-slate-600">
                  {selectedLake.specialFeatureEn}
                </div>
              </div>
            </div>

            {/* Cultural & Environmental significance */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Cultural & Ecological Importance:
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="text-sm font-semibold text-slate-800">
                  {selectedLake.significanceMl}
                </p>
                <p className="text-xs text-slate-600">
                  {selectedLake.significanceEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 27 vs 7 Backwaters Sorting Challenge */}
      {activeTab === 'sorter' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                Sorting Challenge (വർഗ്ഗീകരിക്കാം)
              </span>
              <h3 className="text-lg font-bold text-slate-800">
                Classify: Connected to Sea (27) or Inland Freshwater Lake (7)?
              </h3>
              <p className="text-xs text-slate-500">
                Click the correct category button for each backwater below.
              </p>
            </div>
            <button
              onClick={resetSorter}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Game
            </button>
          </div>

          {sortFeedback && (
            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs font-bold text-cyan-900 animate-fadeIn">
              {sortFeedback}
            </div>
          )}

          {/* Cards to categorize */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortingItems.map(item => {
              const userChoice = classified[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    userChoice
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-sm font-bold text-slate-800">
                    {item.nameMl}
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    {item.name}
                  </div>

                  {userChoice ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      {userChoice === 'sea_connected' ? 'Connected to Sea (27)' : 'Inland Lake (7)'}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleClassify(item.id, 'sea_connected')}
                        className="flex-1 py-1.5 px-2 bg-white hover:bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-xs font-bold transition"
                      >
                        കടലുമായി ബന്ധപ്പെട്ടത്
                      </button>
                      <button
                        onClick={() => handleClassify(item.id, 'inland')}
                        className="flex-1 py-1.5 px-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-lg text-xs font-bold transition"
                      >
                        ഉൾനാടൻ ശുദ്ധജലം
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Cultural Facts & Houseboats */}
      {activeTab === 'facts' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">
              Culture & Tourism (സംസ്കാരവും വിനോദസഞ്ചാരവും)
            </span>
            <h3 className="text-xl font-bold text-slate-800">
              The Backwater Heritage of Kerala
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-bold text-amber-900">
                  Vallamkali (വള്ളംകളി - Snake Boat Races)
                </h4>
              </div>
              <p className="text-xs text-slate-700">
                Held annually during the Onam season on Vembanad and Pamba backwaters. The rhythmic rowing with Vanchipattu songs is a celebration of unity and strength.
              </p>
              <p className="text-xs font-medium text-amber-950">
                നെഹ്റു ട്രോഫി വള്ളംകളി ആലപ്പുഴയിലെ പുന്നമടക്കായലിൽ നടക്കുന്നു.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 space-y-2">
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-sky-600" />
                <h4 className="text-sm font-bold text-sky-900">
                  Kettuvallam (കെട്ടുവള്ളം - Houseboats)
                </h4>
              </div>
              <p className="text-xs text-slate-700">
                Traditional boats constructed using Anjili wood and coir ropes (without nails). Once used for cargo grain transport, they now offer eco-friendly backwater tourism worldwide.
              </p>
              <p className="text-xs font-medium text-sky-950">
                ആണി ഉപയോഗിക്കാതെ കയറുകൊണ്ട് തുന്നിക്കെട്ടി ഉണ്ടാക്കിയ പരമ്പരാഗത വള്ളങ്ങൾ.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackwatersExplorer;

