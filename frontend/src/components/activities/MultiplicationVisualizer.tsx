import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { 
  Calculator, 
  Grid3X3, 
  Layers, 
  Plus, 
  Minus, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ObjectItem {
  id: string;
  nameEn: string;
  nameMl: string;
  emoji: string;
  color: string;
}

const AVAILABLE_OBJECTS: ObjectItem[] = [
  { id: 'coconut', nameEn: 'Coconuts', nameMl: 'തേങ്ങകൾ', emoji: '🥥', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'apple', nameEn: 'Apples', nameMl: 'ആപ്പിളുകൾ', emoji: '🍎', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  { id: 'star', nameEn: 'Stars', nameMl: 'നക്ഷത്രങ്ങൾ', emoji: '⭐', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'flower', nameEn: 'Flowers', nameMl: 'പൂക്കൾ', emoji: '🌸', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'book', nameEn: 'Books', nameMl: 'പുസ്തകങ്ങൾ', emoji: '📚', color: 'bg-blue-100 text-blue-900 border-blue-300' }
];

interface MultiplicationVisualizerProps {
  initialGroups?: number;
  initialItemsPerGroup?: number;
}

export const MultiplicationVisualizer: React.FC<MultiplicationVisualizerProps> = ({
  initialGroups = 7,
  initialItemsPerGroup = 4
}) => {
  const { language } = useLanguage();

  const [groups, setGroups] = useState<number>(initialGroups);
  const [itemsPerGroup, setItemsPerGroup] = useState<number>(initialItemsPerGroup);
  const [selectedObject, setSelectedObject] = useState<ObjectItem>(AVAILABLE_OBJECTS[0]);
  const [viewLayout, setViewLayout] = useState<'groups' | 'grid'>('groups');
  
  // Challenge mode
  const [challengeMode, setChallengeMode] = useState<boolean>(false);
  const [targetProduct, setTargetProduct] = useState<number>(24);
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);

  const total = groups * itemsPerGroup;

  // Build repeated addition string
  const repeatedAdditionStr = Array.from({ length: groups })
    .map(() => itemsPerGroup)
    .join(' + ');

  const handleVerifyChallenge = () => {
    if (total === targetProduct) {
      setChallengeSuccess(true);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      alert(
        language === 'ml'
          ? `ഇപ്പോൾ ആകെ ${total} ആണ്. നമുക്ക് ${targetProduct} ആണ് വേണ്ടത്. കൂട്ടങ്ങളുടെയോ വസ്തുക്കളുടെയോ എണ്ണം മാറ്റിനോക്കൂ!`
          : `Current total is ${total}. We need ${targetProduct}. Adjust the groups or items!`
      );
    }
  };

  const nextChallenge = () => {
    setChallengeSuccess(false);
    const targets = [12, 18, 20, 24, 30, 36];
    const next = targets[(targets.indexOf(targetProduct) + 1) % targets.length];
    setTargetProduct(next);
  };

  return (
    <div className="bg-surface rounded-4xl border border-surface-subtle shadow-card p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-subtle">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Calculator className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Mathematics • ഗണിതം
              </span>
              <span className="text-xs text-slate-400">Class 3–5</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              {language === 'ml' ? 'ഗുണന ദൃശ്യ സഹായി' : 'Multiplication Visualizer'}
            </h2>
          </div>
        </div>

        {/* Layout & Challenge Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-surface-subtle rounded-2xl text-xs sm:text-sm font-bold">
            <button
              onClick={() => { setViewLayout('groups'); setChallengeMode(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                viewLayout === 'groups' && !challengeMode ? 'bg-vaayana-lime text-vaayana-dark font-black shadow-limeGlow' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{language === 'ml' ? 'കൂട്ടങ്ങൾ' : 'Groups'}</span>
            </button>
            <button
              onClick={() => { setViewLayout('grid'); setChallengeMode(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                viewLayout === 'grid' && !challengeMode ? 'bg-vaayana-lime text-vaayana-dark font-black shadow-limeGlow' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>{language === 'ml' ? 'ഗ്രിഡ് (വരികൾ)' : 'Grid (Array)'}</span>
            </button>
          </div>

          <button
            onClick={() => setChallengeMode(!challengeMode)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              challengeMode
                ? 'bg-vaayana-lime text-vaayana-dark border-vaayana-lime font-black shadow-limeGlow'
                : 'bg-surface hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {language === 'ml' ? 'കളികൾ' : 'Challenges'}
          </button>
        </div>
      </div>

      {/* Object Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          {language === 'ml' ? 'വസ്തുക്കൾ:' : 'Items:'}
        </span>
        {AVAILABLE_OBJECTS.map(obj => (
          <button
            key={obj.id}
            onClick={() => setSelectedObject(obj)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              selectedObject.id === obj.id
                ? `${obj.color} shadow-xs ring-2 ring-navy-900/10 scale-105`
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-base">{obj.emoji}</span>
            <span>{language === 'ml' ? obj.nameMl : obj.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Big Equation Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 p-6 rounded-3xl border border-blue-200/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Mathematical Equation */}
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-3 text-4xl sm:text-6xl font-black text-navy-900 font-mono tracking-tight">
            <span className="text-blue-600">{groups}</span>
            <span className="text-slate-400">×</span>
            <span className="text-amber-600">{itemsPerGroup}</span>
            <span className="text-slate-400">=</span>
            <span className="text-emerald-600 bg-white px-4 py-1 rounded-2xl shadow-sm border border-emerald-200">
              {total}
            </span>
          </div>

          {/* Repeated Addition Line */}
          <div className="text-xs sm:text-sm text-slate-600 font-medium pt-2">
            <span className="font-bold text-navy-800">{language === 'ml' ? 'ആവർത്തന സങ്കലനം:' : 'Repeated Addition:'} </span>
            <span className="font-mono text-blue-900 bg-white/70 px-2 py-0.5 rounded-lg border border-blue-100">
              {repeatedAdditionStr || '0'} = {total}
            </span>
          </div>
        </div>

        {/* Pedagogical Explanation Card */}
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/80 shadow-xs max-w-sm text-xs text-navy-900 space-y-1">
          <span className="font-bold text-blue-700 block text-xs uppercase tracking-wider">
            {language === 'ml' ? 'ആശയം മനസ്സിലാക്കാം' : 'Pedagogical Concept'}
          </span>
          <p className="leading-relaxed">
            {language === 'ml' ? (
              <>
                <strong className="text-blue-700">{groups}</strong> കൂട്ടങ്ങൾ, ഓരോന്നിലും <strong className="text-amber-700">{itemsPerGroup}</strong> {selectedObject.nameMl} വീതം. അതായത് {itemsPerGroup}-നെ {groups} തവണ കൂട്ടിയാൽ ആകെ <strong className="text-emerald-700">{total}</strong> ലഭിക്കുന്നു.
              </>
            ) : (
              <>
                <strong className="text-blue-700">{groups}</strong> groups with <strong className="text-amber-700">{itemsPerGroup}</strong> {selectedObject.nameEn.toLowerCase()} in each group. Adding {itemsPerGroup} repeatedly {groups} times gives <strong className="text-emerald-700">{total}</strong>.
              </>
            )}
          </p>
        </div>

      </div>

      {/* Main Visual Display (Groups vs Array Grid) */}
      <div className="bg-[#FAF9F6] p-6 rounded-3xl border border-slate-200/80 shadow-inner min-h-[300px]">
        {viewLayout === 'groups' ? (
          /* Grouped Plates */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: groups }).map((_, gIdx) => (
              <div
                key={gIdx}
                className="bg-white p-4 rounded-3xl border-2 border-blue-100 shadow-sm flex flex-col items-center justify-between min-h-[140px] hover:border-blue-400 transition-all group"
              >
                <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400 mb-2 border-b pb-1">
                  <span>{language === 'ml' ? `കൂട്ടം ${gIdx + 1}` : `Group ${gIdx + 1}`}</span>
                  <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-mono">{itemsPerGroup}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 flex-1 p-2">
                  {Array.from({ length: itemsPerGroup }).map((_, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="text-2xl sm:text-3xl transform transition-transform hover:scale-125 select-none"
                      title={`${selectedObject.nameEn} #${itemIdx + 1}`}
                    >
                      {selectedObject.emoji}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Array Grid (Rows × Columns) */
          <div className="flex flex-col items-center justify-center p-4 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {groups} Rows (വരികൾ) × {itemsPerGroup} Columns (നിരകൾ)
            </span>
            <div className="inline-block bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-2">
              {Array.from({ length: groups }).map((_, rIdx) => (
                <div key={rIdx} className="flex items-center gap-2 sm:gap-3">
                  <span className="w-6 text-xs font-mono font-bold text-slate-400 text-right">{rIdx + 1}</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {Array.from({ length: itemsPerGroup }).map((_, cIdx) => (
                      <div
                        key={cIdx}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl select-none hover:bg-blue-50 transition-colors"
                      >
                        {selectedObject.emoji}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Touch-Friendly Steppers: Groups & Items Per Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Stepper 1: Number of Groups */}
        <div className="bg-surface-subtle p-5 rounded-3xl border border-surface-subtle space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span>{language === 'ml' ? 'കൂട്ടങ്ങളുടെ എണ്ണം (Number of Groups):' : 'Number of Groups:'}</span>
            <span className="text-blue-700 font-mono text-base font-black">{groups}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setGroups(Math.max(1, groups - 1))}
              disabled={groups <= 1}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-blue-700 flex items-center justify-center font-bold text-2xl shadow-xs transition-all active:scale-95"
              aria-label="Decrease groups"
            >
              <Minus className="w-6 h-6" />
            </button>

            <input
              type="range"
              min="1"
              max="10"
              value={groups}
              onChange={(e) => setGroups(Number(e.target.value))}
              className="flex-1 accent-blue-600 h-3 bg-white rounded-lg appearance-none cursor-pointer"
            />

            <button
              onClick={() => setGroups(Math.min(10, groups + 1))}
              disabled={groups >= 10}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-blue-700 flex items-center justify-center font-bold text-2xl shadow-xs transition-all active:scale-95"
              aria-label="Increase groups"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stepper 2: Items in each group */}
        <div className="bg-surface-subtle p-5 rounded-3xl border border-surface-subtle space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span>{language === 'ml' ? 'ഓരോ കൂട്ടത്തിലെയും വസ്തുക്കൾ (Items/Group):' : 'Items in Each Group:'}</span>
            <span className="text-amber-700 font-mono text-base font-black">{itemsPerGroup}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setItemsPerGroup(Math.max(1, itemsPerGroup - 1))}
              disabled={itemsPerGroup <= 1}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-amber-700 flex items-center justify-center font-bold text-2xl shadow-xs transition-all active:scale-95"
              aria-label="Decrease items"
            >
              <Minus className="w-6 h-6" />
            </button>

            <input
              type="range"
              min="1"
              max="10"
              value={itemsPerGroup}
              onChange={(e) => setItemsPerGroup(Number(e.target.value))}
              className="flex-1 accent-amber-600 h-3 bg-white rounded-lg appearance-none cursor-pointer"
            />

            <button
              onClick={() => setItemsPerGroup(Math.min(10, itemsPerGroup + 1))}
              disabled={itemsPerGroup >= 10}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-amber-700 flex items-center justify-center font-bold text-2xl shadow-xs transition-all active:scale-95"
              aria-label="Increase items"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

      </div>

      {/* Challenge Mode Drawer */}
      {challengeMode && (
        <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <h4 className="text-lg font-black text-navy-900">
                {language === 'ml' ? 'ഗുണന വെല്ലുവിളി!' : 'Smartboard Multiplication Challenge!'}
              </h4>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-full font-mono">
              Target: {targetProduct}
            </span>
          </div>

          <p className="text-sm font-semibold text-amber-950">
            {language === 'ml'
              ? `കൂട്ടങ്ങളുടെയും വസ്തുക്കളുടെയും എണ്ണം മാറ്റി ആകെ ഗുണനഫലം ${targetProduct} ആക്കാമോ?`
              : `Can you set the groups and items so the total product equals exactly ${targetProduct}?`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleVerifyChallenge}
              className="flex-1 py-3.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm rounded-2xl shadow-sm transition-all"
            >
              {language === 'ml' ? 'ഉത്തരം ഉറപ്പുവരുത്തുക' : 'Verify My Equation'}
            </button>
            <button
              onClick={nextChallenge}
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-2xl border border-slate-200 shadow-sm transition-all"
            >
              {language === 'ml' ? 'മറ്റൊരു ചോദ്യം' : 'Try Another Target'}
            </button>
          </div>

          {challengeSuccess && (
            <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-950 text-sm font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                {language === 'ml'
                  ? `ഗംഭീരം! ${groups} × ${itemsPerGroup} = ${targetProduct} ശരിയാണ്!`
                  : `Brilliant! ${groups} × ${itemsPerGroup} = ${targetProduct} is correct!`}
              </span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
