import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Coins, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ShoppingBag, 
  Trash2,
  Plus,
  Minus,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

interface CurrencyItem {
  id: string;
  type: 'coin' | 'note';
  val: number;
  label: string;
  color: string;
  bgGrad: string;
  borderColor: string;
}

const DENOMINATIONS: CurrencyItem[] = [
  // Coins
  { id: 'c1', type: 'coin', val: 1, label: '₹1', color: '#64748B', bgGrad: 'from-slate-200 to-slate-400', borderColor: '#475569' },
  { id: 'c2', type: 'coin', val: 2, label: '₹2', color: '#64748B', bgGrad: 'from-slate-300 to-slate-400', borderColor: '#475569' },
  { id: 'c5', type: 'coin', val: 5, label: '₹5', color: '#B45309', bgGrad: 'from-amber-200 to-amber-400', borderColor: '#92400E' },
  { id: 'c10', type: 'coin', val: 10, label: '₹10', color: '#B45309', bgGrad: 'from-amber-300 via-amber-100 to-amber-500', borderColor: '#78350F' },
  { id: 'c20', type: 'coin', val: 20, label: '₹20', color: '#047857', bgGrad: 'from-emerald-200 to-emerald-400', borderColor: '#065F46' },

  // Notes
  { id: 'n10', type: 'note', val: 10, label: '₹10', color: '#78350F', bgGrad: 'from-amber-100 to-amber-200', borderColor: '#B45309' },
  { id: 'n20', type: 'note', val: 20, label: '₹20', color: '#065F46', bgGrad: 'from-emerald-100 to-emerald-200', borderColor: '#059669' },
  { id: 'n50', type: 'note', val: 50, label: '₹50', color: '#0369A1', bgGrad: 'from-cyan-100 to-sky-200', borderColor: '#0284C7' },
  { id: 'n100', type: 'note', val: 100, label: '₹100', color: '#6D28D9', bgGrad: 'from-purple-100 to-violet-200', borderColor: '#7C3AED' },
  { id: 'n200', type: 'note', val: 200, label: '₹200', color: '#C2410C', bgGrad: 'from-orange-100 to-amber-200', borderColor: '#EA580C' },
  { id: 'n500', type: 'note', val: 500, label: '₹500', color: '#4D7C0F', bgGrad: 'from-lime-100 to-emerald-200', borderColor: '#65A30D' }
];

interface ShopItem {
  id: string;
  nameEn: string;
  nameMl: string;
  price: number;
  icon: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 's1', nameEn: 'Kerala Geometry Box', nameMl: 'ജ്യാമിതി ബോക്സ്', price: 75, icon: '📐' },
  { id: 's2', nameEn: 'Storybook', nameMl: 'കഥാപുസ്തകം', price: 135, icon: '📚' },
  { id: 's3', nameEn: 'Wooden Abacus Toy', nameMl: 'മരംകൊണ്ടുള്ള അബാക്കസ്', price: 150, icon: '🧮' },
  { id: 's4', nameEn: 'Class 4 Water Bottle', nameMl: 'കുടിവെള്ള കുപ്പി', price: 85, icon: '🍶' }
];

interface CurrencyChallenge {
  id: string;
  titleEn: string;
  titleMl: string;
  targetAmount: number;
  mode: 'exact' | 'fewest' | 'shop-change';
  paidAmount?: number;
  shopItem?: ShopItem;
  explanationEn: string;
  explanationMl: string;
}

const CHALLENGES: CurrencyChallenge[] = [
  {
    id: 'ch1',
    titleEn: 'Make exact ₹50 using any combination of notes and coins',
    titleMl: 'നോട്ടുകളും നാണയങ്ങളും ഉപയോഗിച്ച് കൃത്യം ₹50 ഉണ്ടാക്കുക',
    targetAmount: 50,
    mode: 'exact',
    explanationEn: 'Ways to make ₹50: One ₹50 note, or five ₹10 coins, or two ₹20 notes + one ₹10 coin!',
    explanationMl: '₹50 ഉണ്ടാക്കാൻ: ഒരു ₹50 നോട്ട്, അല്ലെങ്കിൽ അഞ്ച് ₹10 നാണയങ്ങൾ, അല്ലെങ്കിൽ രണ്ട് ₹20 നോട്ടും ഒരു ₹10 ഉം!'
  },
  {
    id: 'ch2',
    titleEn: 'Kerala School Shop: Pay ₹75 for the Geometry Box',
    titleMl: 'ജ്യാമിതി ബോക്സിന് ₹75 വിലയുണ്ട്. കൃത്യമായ തുക നൽകുക',
    targetAmount: 75,
    mode: 'exact',
    shopItem: SHOP_ITEMS[0],
    explanationEn: '₹75 can be paid with: ₹50 note + ₹20 note + ₹5 coin!',
    explanationMl: '₹75 നൽകാൻ: ₹50 നോട്ട് + ₹20 നോട്ട് + ₹5 നാണയം!'
  },
  {
    id: 'ch3',
    titleEn: 'Change Calculation: You have ₹200 and buy a book for ₹135. Form the change (₹65)!',
    titleMl: '₹200 നൽകി ₹135 രൂപയുടെ പുസ്തകം വാങ്ങി. ബാക്കി ലഭിക്കേണ്ട തുക (₹65) ട്രേയിൽ വെയ്ക്കൂ!',
    targetAmount: 65,
    mode: 'shop-change',
    paidAmount: 200,
    shopItem: SHOP_ITEMS[1],
    explanationEn: '₹200 − ₹135 = ₹65 change (₹50 note + ₹10 note + ₹5 coin).',
    explanationMl: '₹200 − ₹135 = ₹65 ബാക്കി (₹50 നോട്ട് + ₹10 നോട്ട് + ₹5 നാണയം).'
  },
  {
    id: 'ch4',
    titleEn: 'Make ₹100 using the FEWEST notes and coins',
    titleMl: 'ഏറ്റവും കുറഞ്ഞ നോട്ടുകൾ ഉപയോഗിച്ച് ₹100 ഉണ്ടാക്കുക',
    targetAmount: 100,
    mode: 'fewest',
    explanationEn: 'The fewest is a single ₹100 note!',
    explanationMl: 'ഏറ്റവും കുറവ് ഒരൊറ്റ ₹100 നോട്ടാണ്!'
  }
];

export const IndianCurrencyExplorer: React.FC = () => {
  const { language } = useLanguage();

  const [trayItems, setTrayItems] = useState<{ id: string; item: CurrencyItem; uid: string }[]>([]);
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const activeChallenge = CHALLENGES[challengeIdx];

  const totalTrayAmount = trayItems.reduce((acc, curr) => acc + curr.item.val, 0);

  // Add denomination to collection tray
  const handleAddItem = (item: CurrencyItem) => {
    soundService.play('coin');
    const uid = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setTrayItems(prev => [...prev, { id: item.id, item, uid }]);
    setFeedback(null);
  };

  // Remove individual item from collection tray
  const handleRemoveItem = (uid: string) => {
    soundService.play('click');
    setTrayItems(prev => prev.filter(x => x.uid !== uid));
    setFeedback(null);
  };

  const handleClearTray = () => {
    soundService.play('click');
    setTrayItems([]);
    setFeedback(null);
    setShowExplanation(false);
  };

  const handleCheckChallenge = () => {
    if (activeChallenge.mode === 'fewest') {
      if (totalTrayAmount === 100 && trayItems.length === 1 && trayItems[0].item.val === 100) {
        soundService.play('celebration');
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
        setFeedback({
          isCorrect: true,
          message: language === 'ml' 
            ? 'അത്ഭുതം! ഒരൊറ്റ ₹100 നോട്ട് ഉപയോഗിച്ച് ഏറ്റവും ചുരുങ്ങിയ രൂപത്തിൽ ₹100 നൽകി!' 
            : 'Superb! A single ₹100 note is the fewest possible count!'
        });
        setShowExplanation(true);
      } else if (totalTrayAmount === 100) {
        soundService.play('incorrect');
        setFeedback({
          isCorrect: false,
          message: language === 'ml' 
            ? `ആകെ തുക ₹100 ശരിയാണ്, പക്ഷെ ${trayItems.length} നോട്ടുകൾ ഉപയോഗിച്ചു. ഇതിലും കുറഞ്ഞ എണ്ണം ഉപയോഗിച്ച് ₹100 ഉണ്ടാക്കാമോ?` 
            : `Total is ₹100, but can you do it with FEWER items?`
        });
      } else {
        soundService.play('incorrect');
        setFeedback({
          isCorrect: false,
          message: language === 'ml' 
            ? `ട്രേയിലെ ആകെ തുക: ₹${totalTrayAmount}. ലക്ഷ്യം: ₹${activeChallenge.targetAmount}.` 
            : `Current tray is ₹${totalTrayAmount}, target is ₹${activeChallenge.targetAmount}.`
        });
      }
    } else {
      if (totalTrayAmount === activeChallenge.targetAmount) {
        soundService.play('celebration');
        try {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
        setFeedback({
          isCorrect: true,
          message: language === 'ml' 
            ? `തികച്ചും ശരിയാണ്! കൃത്യം ₹${activeChallenge.targetAmount} ട്രേയിൽ വെച്ചു!` 
            : `Exact match! ₹${activeChallenge.targetAmount} placed correctly in the wallet tray!`
        });
        setShowExplanation(true);
      } else {
        soundService.play('incorrect');
        setFeedback({
          isCorrect: false,
          message: language === 'ml' 
            ? `ശ്രമിക്കൂ! നിലവിലെ തുക: ₹${totalTrayAmount}. ലക്ഷ്യം: ₹${activeChallenge.targetAmount}.` 
            : `Keep going! Current total is ₹${totalTrayAmount}, target is ₹${activeChallenge.targetAmount}.`
        });
      }
    }
  };

  const handleNextChallenge = () => {
    soundService.play('click');
    const nextIdx = (challengeIdx + 1) % CHALLENGES.length;
    setChallengeIdx(nextIdx);
    setTrayItems([]);
    setFeedback(null);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Top Banner */}
      <div className="bg-vaayana-darkSurface p-4 sm:p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-emerald-950 uppercase tracking-wider">
              {language === 'ml' ? 'പ്രവർത്തനം 3' : 'Activity 3'}
            </span>
            <span className="text-xs font-bold text-vaayana-textLightMuted">
              Class 4 Mathematics • Chapter 6
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-1 font-malayalam">
            {language === 'ml' ? 'ഇന്ത്യൻ നാണയങ്ങളും നോട്ടുകളും (Notes & Coins)' : 'Indian Currency: Notes & Coins'}
          </h2>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted mt-1">
            {language === 'ml'
              ? 'യഥാർത്ഥ ഇടപാടുകൾ പോലെ നോട്ടുകളും നാണയങ്ങളും തിരഞ്ഞെടുത്ത് തുക കൂട്ടാനും ബാക്കി കണക്കാക്കാനും പരിശീലിക്കുക.'
              : 'Add denominations to the wallet, pay for classroom items, and calculate change accurately.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearTray}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-bold text-xs border border-vaayana-darkBorder transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-vaayana-lime" />
            <span>{language === 'ml' ? 'ട്രേ ഒഴിവാക്കുക' : 'Clear Wallet'}</span>
          </button>

          <button
            onClick={handleNextChallenge}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-xs shadow-limeGlow transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-vaayana-dark" />
            <span>{language === 'ml' ? 'അടുത്ത വെല്ലുവിളി' : 'Next Challenge'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Bank Teller Denomination Selector (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-vaayana-softSurface border border-vaayana-softBorder shadow-card space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-vaayana-softMuted">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-black text-navy-900 font-malayalam">
                {language === 'ml' ? 'നാണയങ്ങളും നോട്ടുകളും തിരഞ്ഞെടുക്കുക' : 'Select Currency Denominations'}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              {language === 'ml' ? 'തൊട്ടാൽ ട്രേയിൽ വരും' : 'Tap to add to tray'}
            </span>
          </div>

          {/* Coins Section */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {language === 'ml' ? 'നാണയങ്ങൾ (Coins)' : 'Indian Coins'}:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {DENOMINATIONS.filter(d => d.type === 'coin').map((coin) => (
                <motion.button
                  key={coin.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleAddItem(coin)}
                  className={`w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gradient-to-br ${coin.bgGrad} border-4 flex flex-col items-center justify-center font-black shadow-md cursor-pointer`}
                  style={{ borderColor: coin.borderColor }}
                  title={`Add ${coin.label} coin`}
                >
                  <span className="text-base sm:text-lg font-black font-mono text-navy-900">
                    {coin.label}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-slate-700">COIN</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {language === 'ml' ? 'കറൻസി നോട്ടുകൾ (Banknotes)' : 'Indian Currency Notes'}:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DENOMINATIONS.filter(d => d.type === 'note').map((note) => (
                <motion.button
                  key={note.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddItem(note)}
                  className={`p-3 rounded-2xl bg-gradient-to-r ${note.bgGrad} border-2 border-dashed flex flex-col justify-between items-start shadow-sm cursor-pointer min-h-[64px]`}
                  style={{ borderColor: note.borderColor }}
                  title={`Add ${note.label} note`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono font-bold text-slate-600">₹</span>
                    <span className="text-[9px] font-black uppercase text-slate-500 bg-white/70 px-1 rounded">
                      NOTE
                    </span>
                  </div>
                  <div className="text-lg font-black font-mono" style={{ color: note.color }}>
                    {note.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Helper Note */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 italic text-center font-malayalam">
            {language === 'ml'
              ? 'ഇന്ത്യൻ രൂപയുടെ ഔദ്യോഗിക ചിഹ്നം ₹ ആണ്.'
              : 'The official currency symbol of India is ₹ (Indian Rupee).'}
          </div>

        </div>

        {/* Right Column: Wallet Collection Tray & Challenge Area (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Active Wallet Collection Tray */}
          <div className="p-6 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder shadow-darkCard space-y-4">
            
            <div className="flex items-center justify-between border-b border-vaayana-darkBorder pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-vaayana-lime" />
                <h3 className="text-lg font-black text-vaayana-textLight font-malayalam">
                  {language === 'ml' ? 'നിങ്ങളുടെ പഴ്സ് / ട്രേ (My Wallet)' : 'Collection Tray / Wallet'}
                </h3>
              </div>

              {/* Real-time Total Counter Badge */}
              <div className="px-4 py-1.5 rounded-2xl bg-black border border-vaayana-lime/40 text-vaayana-lime font-mono text-xl sm:text-2xl font-black shadow-limeGlow">
                ₹{totalTrayAmount}
              </div>
            </div>

            {/* Tray Items Dropping Area */}
            <div className="min-h-[140px] max-h-[220px] overflow-y-auto p-3 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder flex flex-wrap content-start gap-2">
              {trayItems.length === 0 ? (
                <div className="w-full h-28 flex items-center justify-center text-xs font-bold text-vaayana-textLightMuted italic text-center font-malayalam">
                  {language === 'ml'
                    ? 'ട്രേ കാലിയാണ്. ഇടത് വശത്തുനിന്ന് നോട്ടുകളിലും നാണയങ്ങളിലും തൊട്ട് ഇവിടെ ചേർക്കുക.'
                    : 'Wallet is empty. Click notes and coins on the left to add them here.'}
                </div>
              ) : (
                trayItems.map((itemObj) => (
                  <motion.div
                    key={itemObj.uid}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => handleRemoveItem(itemObj.uid)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black font-mono shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-80 active:scale-95 ${
                      itemObj.item.type === 'coin'
                        ? 'bg-amber-400 text-amber-950 rounded-full'
                        : 'bg-emerald-400 text-emerald-950 rounded-lg'
                    }`}
                    title="Click to remove from tray"
                  >
                    <span>{itemObj.item.label}</span>
                    <span className="text-[10px] opacity-60">×</span>
                  </motion.div>
                ))
              )}
            </div>

            {trayItems.length > 0 && (
              <div className="flex items-center justify-between text-xs text-vaayana-textLightMuted px-1">
                <span>{language === 'ml' ? 'ഇനങ്ങളുടെ എണ്ണം' : 'Items count'}: {trayItems.length}</span>
                <span className="text-rose-400 cursor-pointer hover:underline" onClick={handleClearTray}>
                  {language === 'ml' ? 'മുഴുവൻ മാറ്റുക' : 'Remove all'}
                </span>
              </div>
            )}
          </div>

          {/* Challenge Box */}
          <div className="p-6 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder shadow-darkCard space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-vaayana-lime uppercase tracking-wider flex items-center gap-1.5 font-malayalam">
                <Award className="w-4 h-4 text-vaayana-lime" />
                <span>{language === 'ml' ? 'വെല്ലുവിളി' : 'Classroom Challenge'} #{challengeIdx + 1}</span>
              </span>

              {activeChallenge.shopItem && (
                <span className="text-xl" title={activeChallenge.shopItem.nameEn}>
                  {activeChallenge.shopItem.icon}
                </span>
              )}
            </div>

            {/* Challenge Description */}
            <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-darkBorder space-y-2">
              <p className="text-sm font-extrabold text-vaayana-textLight font-malayalam leading-relaxed">
                {language === 'ml' ? activeChallenge.titleMl : activeChallenge.titleEn}
              </p>

              {activeChallenge.mode === 'shop-change' && (
                <div className="p-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>Paid: ₹{activeChallenge.paidAmount}</span>
                  <span>Cost: ₹{activeChallenge.shopItem?.price}</span>
                  <span className="text-vaayana-lime font-bold">Change Due: ₹{activeChallenge.targetAmount}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleCheckChallenge}
              className="w-full py-3.5 px-4 rounded-xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-sm shadow-limeGlow transition-all active:scale-95"
            >
              {language === 'ml' ? 'തുക പരിശോധിക്കുക' : 'Verify Wallet Amount'}
            </button>

            {/* Feedback Display */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-3 ${
                  feedback.isCorrect
                    ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800'
                    : 'bg-rose-950/80 text-rose-200 border border-rose-800'
                }`}
              >
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-vaayana-lime shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="font-malayalam leading-relaxed">{feedback.message}</div>
              </motion.div>
            )}

            {/* Explanation Box */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-lime/30 space-y-1.5 text-xs text-vaayana-textLight font-malayalam"
              >
                <span className="font-bold text-vaayana-lime">
                  {language === 'ml' ? 'വിശദീകരണം:' : 'Explanation:'}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {language === 'ml' ? activeChallenge.explanationMl : activeChallenge.explanationEn}
                </p>
              </motion.div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
