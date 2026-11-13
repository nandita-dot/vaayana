import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  playCorrectSound, 
  playIncorrectSound, 
  playCelebrationSound, 
  playClickSound 
} from '../../services/soundService';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Droplet, 
  Wind,
  Check,
  X
} from 'lucide-react';

interface ClassifierItem {
  id: string;
  nameEn: string;
  nameMl: string;
  state: 'solid' | 'liquid' | 'gas';
  icon: string;
  categoryHintEn: string;
  categoryHintMl: string;
}

const ITEMS_POOL: ClassifierItem[] = [
  { id: 'stone', nameEn: 'Granite Stone', nameMl: 'കരിങ്കല്ല്', state: 'solid', icon: '🪨', categoryHintEn: 'Has definite shape & volume', categoryHintMl: 'നിർദ്ദിഷ്ട ആകൃതിയും വ്യാപ്തിയുമുണ്ട്' },
  { id: 'tender_coconut', nameEn: 'Tender Coconut Water', nameMl: 'കരിക്കിൻ വെള്ളം', state: 'liquid', icon: '🥥', categoryHintEn: 'Takes container shape, can flow', categoryHintMl: 'പാത്രത്തിന്റെ ആകൃതി സ്വീകരിക്കുന്നു, ഒഴുകുന്നു' },
  { id: 'balloon_air', nameEn: 'Air in Balloon', nameMl: 'ബലൂണിലെ വായു', state: 'gas', icon: '🎈', categoryHintEn: 'Fills the whole space, invisible', categoryHintMl: 'മുഴുവൻ സ്ഥലവും അപഹരിക്കുന്നു' },
  { id: 'wooden_table', nameEn: 'Wooden Bench', nameMl: 'മര ബെഞ്ച്', state: 'solid', icon: '🪑', categoryHintEn: 'Hard and rigid object', categoryHintMl: 'ദൃഢമായ ഖരവസ്തു' },
  { id: 'coconut_oil', nameEn: 'Coconut Oil', nameMl: 'വെളിച്ചെണ്ണ', state: 'liquid', icon: '🫗', categoryHintEn: 'Flows easily into bottles', categoryHintMl: 'കുപ്പിയിലേക്ക് എളുപ്പത്തിൽ ഒഴിക്കാം' },
  { id: 'steam_tea', nameEn: 'Steam from Hot Tea', nameMl: 'ചൂടുചായയിലെ ആവി', state: 'gas', icon: '☕', categoryHintEn: 'Water vapour rising in air', categoryHintMl: 'വായുവിലേക്ക് ഉയരുന്ന നീരാവി' },
  { id: 'textbook', nameEn: 'Class 4 Reader', nameMl: 'പാഠപുസ്തകം', state: 'solid', icon: '📚', categoryHintEn: 'Solid object with fixed edges', categoryHintMl: 'കൃത്യമായ അരികുകളുള്ള ഖരവസ്തു' },
  { id: 'rainwater', nameEn: 'Raindrops', nameMl: 'മഴവെള്ളം', state: 'liquid', icon: '🌧️', categoryHintEn: 'Forms puddles of different shapes', categoryHintMl: 'വിവിധ രൂപങ്ങളിൽ തളംകെട്ടുന്നു' },
  { id: 'football_air', nameEn: 'Air in Football', nameMl: 'ഫുട്ബോളിലെ കാറ്റ്', state: 'gas', icon: '⚽', categoryHintEn: 'Moving air pumped inside under pressure', categoryHintMl: 'പന്തിനകത്ത് നിറച്ചിരിക്കുന്ന വായു' },
];

export const SolidLiquidGasClassifier: React.FC = () => {
  const { language } = useLanguage();

  const [unclassified, setUnclassified] = useState<ClassifierItem[]>(ITEMS_POOL);
  const [selectedItem, setSelectedItem] = useState<ClassifierItem | null>(ITEMS_POOL[0]);
  const [baskets, setBaskets] = useState<{
    solid: ClassifierItem[];
    liquid: ClassifierItem[];
    gas: ClassifierItem[];
  }>({
    solid: [],
    liquid: [],
    gas: []
  });

  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong' | null;
    messageEn: string;
    messageMl: string;
  }>({ status: null, messageEn: '', messageMl: '' });

  const totalClassified = baskets.solid.length + baskets.liquid.length + baskets.gas.length;
  const isFinished = totalClassified === ITEMS_POOL.length;

  const handleSelectObject = (item: ClassifierItem) => {
    playClickSound();
    setSelectedItem(item);
    setFeedback({ status: null, messageEn: '', messageMl: '' });
  };

  const handleClassify = (targetState: 'solid' | 'liquid' | 'gas') => {
    if (!selectedItem) return;

    if (selectedItem.state === targetState) {
      playCorrectSound();
      setFeedback({
        status: 'correct',
        messageEn: `Correct! ${selectedItem.nameEn} is a ${targetState.toUpperCase()}!`,
        messageMl: `ശരിയുത്തരം! ${selectedItem.nameMl} ഒരു ${targetState === 'solid' ? 'ഖര' : targetState === 'liquid' ? 'ദ്രാവക' : 'വാതക'} രൂപമാണ്!`
      });

      // Move from unclassified to basket
      const nextUnclassified = unclassified.filter(i => i.id !== selectedItem.id);
      setUnclassified(nextUnclassified);
      setBaskets(prev => ({
        ...prev,
        [targetState]: [...prev[targetState], selectedItem]
      }));

      // Select next item automatically
      if (nextUnclassified.length > 0) {
        setSelectedItem(nextUnclassified[0]);
      } else {
        setSelectedItem(null);
        playCelebrationSound();
      }
    } else {
      playIncorrectSound();
      setFeedback({
        status: 'wrong',
        messageEn: `Not quite! Remember: ${selectedItem.categoryHintEn}`,
        messageMl: `ശ്രമിക്കൂ! ഓർക്കുക: ${selectedItem.categoryHintMl}`
      });
    }
  };

  const handleReset = () => {
    playClickSound();
    setUnclassified(ITEMS_POOL);
    setSelectedItem(ITEMS_POOL[0]);
    setBaskets({ solid: [], liquid: [], gas: [] });
    setFeedback({ status: null, messageEn: '', messageMl: '' });
  };

  return (
    <div className="bg-vaayana-soft rounded-3xl p-6 sm:p-8 border border-vaayana-softBorder shadow-soft space-y-6">
      
      {/* Activity Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
            EVS • Chapter 1 Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textDark mt-2 font-malayalam">
            {language === 'ml' ? 'ഖരമോ, ദ്രാവകമോ, വാതകമോ? (Solid, Liquid or Gas?)' : 'Solid, Liquid or Gas? Sorting Challenge'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textDarkMuted">
            {language === 'ml'
              ? 'വസ്തുക്കളെ അവയുടെ അവസ്ഥയ്ക്കനുസരിച്ച് ശരിയായ പെട്ടിയിലേക്ക് മാറ്റുക.'
              : 'Classify familiar objects from Kerala surroundings into Solid, Liquid, or Gas.'}
          </p>
        </div>

        {/* Score & Reset */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-vaayana-dark text-vaayana-lime font-mono font-black text-sm shadow-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{totalClassified} / {ITEMS_POOL.length}</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-vaayana-dark border border-vaayana-softBorder shadow-sm transition-all active:scale-95"
            title="Reset Game"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Finished Celebration Banner */}
      {isFinished && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 rounded-3xl bg-emerald-700 text-white text-center space-y-2 shadow-lg"
        >
          <div className="flex justify-center text-3xl">🎉 ⭐ 👏</div>
          <h4 className="text-xl font-black font-malayalam">
            {language === 'ml' ? 'അഭിനന്ദനങ്ങൾ! എല്ലാ വസ്തുക്കളെയും കൃത്യമായി തരംതിരിച്ചു!' : 'Outstanding! All objects classified successfully!'}
          </h4>
          <p className="text-xs sm:text-sm text-emerald-100">
            {language === 'ml' ? 'ഖരം, ദ്രാവകം, വാതകം എന്നീ മൂന്ന് അവസ്ഥകളെക്കുറിച്ച് കുട്ടികൾ നന്നായി മനസ്സിലാക്കി.' : 'Great job exploring the three fundamental states of matter!'}
          </p>
        </motion.div>
      )}

      {/* Selected Object for Smartboard Classification */}
      {!isFinished && selectedItem && (
        <div className="p-6 rounded-3xl bg-white border-2 border-vaayana-lime shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-vaayana-lime/20 flex items-center justify-center text-4xl shadow-inner animate-bounce">
              {selectedItem.icon}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-vaayana-textDarkMuted uppercase tracking-wider">
                {language === 'ml' ? 'തിരഞ്ഞെടുത്ത വസ്തു' : 'Active Object'}
              </span>
              <h4 className="text-2xl font-black text-vaayana-textDark font-malayalam">
                {language === 'ml' ? selectedItem.nameMl : selectedItem.nameEn}
              </h4>
              <p className="text-xs text-vaayana-textDarkMuted">
                {language === 'ml' ? selectedItem.categoryHintMl : selectedItem.categoryHintEn}
              </p>
            </div>
          </div>

          {/* Touch Buttons for 3 States */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <button
              onClick={() => handleClassify('solid')}
              className="px-5 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex flex-col items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Layers className="w-5 h-5" />
              <span>{language === 'ml' ? 'ഖരം (Solid)' : 'Solid'}</span>
            </button>

            <button
              onClick={() => handleClassify('liquid')}
              className="px-5 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex flex-col items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Droplet className="w-5 h-5" />
              <span>{language === 'ml' ? 'ദ്രാവകം (Liquid)' : 'Liquid'}</span>
            </button>

            <button
              onClick={() => handleClassify('gas')}
              className="px-5 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm flex flex-col items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Wind className="w-5 h-5" />
              <span>{language === 'ml' ? 'വാതകം (Gas)' : 'Gas'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Immediate Audio/Visual Feedback Notice */}
      {feedback.status && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
            feedback.status === 'correct' 
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
              : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}
        >
          {feedback.status === 'correct' ? <Check className="w-5 h-5 text-emerald-700" /> : <X className="w-5 h-5 text-rose-700" />}
          <span>{language === 'ml' ? feedback.messageMl : feedback.messageEn}</span>
        </motion.div>
      )}

      {/* 3 Sorting Buckets Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Solid Bucket */}
        <div className="bg-amber-50/80 rounded-3xl p-5 border-2 border-amber-300 space-y-3 min-h-[160px]">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                ഖ
              </span>
              <h5 className="font-black text-amber-950 font-malayalam">
                {language === 'ml' ? 'ഖരം (Solid)' : 'Solids'}
              </h5>
            </div>
            <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
              {baskets.solid.length}
            </span>
          </div>

          <p className="text-[11px] text-amber-800 font-medium">
            {language === 'ml' ? 'നിർദ്ദിഷ്ട ആകൃതിയും വ്യാപ്തിയുമുള്ള വസ്തുക്കൾ.' : 'Definite shape & volume.'}
          </p>

          <div className="flex flex-wrap gap-2">
            {baskets.solid.map(item => (
              <span key={item.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-950 shadow-xs">
                <span>{item.icon}</span>
                <span>{language === 'ml' ? item.nameMl : item.nameEn}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Liquid Bucket */}
        <div className="bg-blue-50/80 rounded-3xl p-5 border-2 border-blue-300 space-y-3 min-h-[160px]">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                ദ്ര
              </span>
              <h5 className="font-black text-blue-950 font-malayalam">
                {language === 'ml' ? 'ദ്രാവകം (Liquid)' : 'Liquids'}
              </h5>
            </div>
            <span className="text-xs font-black text-blue-800 bg-blue-200/80 px-2.5 py-0.5 rounded-full">
              {baskets.liquid.length}
            </span>
          </div>

          <p className="text-[11px] text-blue-800 font-medium">
            {language === 'ml' ? 'കൃത്യമായ ആകൃതിയില്ല; പാത്രത്തിന്റെ ആകൃതി സ്വീകരിക്കുന്നു.' : 'No fixed shape; takes container shape.'}
          </p>

          <div className="flex flex-wrap gap-2">
            {baskets.liquid.map(item => (
              <span key={item.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-300 text-xs font-bold text-blue-950 shadow-xs">
                <span>{item.icon}</span>
                <span>{language === 'ml' ? item.nameMl : item.nameEn}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Gas Bucket */}
        <div className="bg-teal-50/80 rounded-3xl p-5 border-2 border-teal-300 space-y-3 min-h-[160px]">
          <div className="flex items-center justify-between pb-2 border-b border-teal-200">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                വാ
              </span>
              <h5 className="font-black text-teal-950 font-malayalam">
                {language === 'ml' ? 'വാതകം (Gas)' : 'Gases'}
              </h5>
            </div>
            <span className="text-xs font-black text-teal-800 bg-teal-200/80 px-2.5 py-0.5 rounded-full">
              {baskets.gas.length}
            </span>
          </div>

          <p className="text-[11px] text-teal-800 font-medium">
            {language === 'ml' ? 'വായു സ്ഥലം അപഹരിക്കുന്നു; നീരാവിയും കാറ്റും ഉദാഹരണങ്ങൾ.' : 'Occupies all available space; air & steam.'}
          </p>

          <div className="flex flex-wrap gap-2">
            {baskets.gas.map(item => (
              <span key={item.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-teal-300 text-xs font-bold text-teal-950 shadow-xs">
                <span>{item.icon}</span>
                <span>{language === 'ml' ? item.nameMl : item.nameEn}</span>
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Unclassified Items Queue Strip */}
      {unclassified.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-vaayana-textDarkMuted">
            {language === 'ml' ? 'തരംതിരിക്കാനുള്ള വസ്തുക്കൾ (ടാപ്പ് ചെയ്യുക):' : 'Remaining Objects to Classify (Tap to switch):'}
          </span>
          <div className="flex flex-wrap gap-2">
            {unclassified.map(item => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectObject(item)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    isSelected 
                      ? 'bg-vaayana-dark text-vaayana-lime ring-2 ring-vaayana-lime shadow-md scale-105' 
                      : 'bg-white hover:bg-slate-100 text-vaayana-textDark border border-vaayana-softBorder shadow-sm'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="font-malayalam">{language === 'ml' ? item.nameMl : item.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

