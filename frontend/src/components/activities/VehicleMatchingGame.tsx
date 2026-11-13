import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Car, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Truck, 
  Bus,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VehicleCard {
  id: string;
  nameEn: string;
  nameMl: string;
  number: number;
  type: 'car' | 'bus' | 'auto' | 'jeep' | 'truck' | 'bike';
  color: string;
  pairedWith?: number;
}

const VEHICLES_DECK: VehicleCard[] = [
  { id: 'v1', nameEn: 'Blue Taxi', nameMl: 'നീല ടാക്സി', number: 5000, type: 'car', color: '#38BDF8', pairedWith: 4999 },
  { id: 'v2', nameEn: 'Yellow Auto', nameMl: 'മഞ്ഞ ഓട്ടോ', number: 4999, type: 'auto', color: '#FACC15', pairedWith: 5000 },
  { id: 'v3', nameEn: 'Red KSRTC Bus', nameMl: 'ചുവപ്പ് കെ.എസ്.ആർ.ടി.സി ബസ്', number: 6500, type: 'bus', color: '#EF4444', pairedWith: 3499 },
  { id: 'v4', nameEn: 'Green Jeep', nameMl: 'പച്ച ജീപ്പ്', number: 3499, type: 'jeep', color: '#10B981', pairedWith: 6500 },
  { id: 'v5', nameEn: 'Orange Delivery Van', nameMl: 'ഓറഞ്ച് വാൻ', number: 7250, type: 'truck', color: '#FB923C', pairedWith: 2749 },
  { id: 'v6', nameEn: 'Purple Scooter', nameMl: 'പർപ്പിൾ സ്കൂട്ടർ', number: 2749, type: 'bike', color: '#C084FC', pairedWith: 7250 },
  // Distractors
  { id: 'd1', nameEn: 'Silver Car', nameMl: 'വെള്ളി കാർ', number: 4500, type: 'car', color: '#94A3B8' },
  { id: 'd2', nameEn: 'White Van', nameMl: 'വെളുത്ത വാൻ', number: 3100, type: 'truck', color: '#CBD5E1' },
];

export const VehicleMatchingGame: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCards, setSelectedCards] = useState<VehicleCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[][]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const handleCardClick = (card: VehicleCard) => {
    // If already part of a matched pair, ignore
    if (matchedPairs.some(p => p.includes(card.id))) return;

    if (selectedCards.length === 0) {
      setSelectedCards([card]);
      return;
    }

    if (selectedCards.length === 1) {
      if (selectedCards[0].id === card.id) {
        // Deselect
        setSelectedCards([]);
        return;
      }

      const card1 = selectedCards[0];
      const card2 = card;
      const sum = card1.number + card2.number;

      if (sum === 9999) {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.7 } });
        setMatchedPairs(prev => [...prev, [card1.id, card2.id]]);
        setFeedback({
          message: language === 'ml' 
            ? `ശരിയാണ്! ${card1.number} + ${card2.number} = 9999! കാറുകൾ ഒരുമിച്ച് പാഞ്ഞു!` 
            : `Bingo! ${card1.number} + ${card2.number} = 9999!`,
          isCorrect: true
        });
        setSelectedCards([]);
      } else {
        const diff = 9999 - sum;
        setFeedback({
          message: language === 'ml' 
            ? `തെറ്റാണ്! ${card1.number} + ${card2.number} = ${sum} (${diff > 0 ? `${diff} കുറവാണ്` : `${Math.abs(diff)} കൂടുതലാണ്`})` 
            : `Not 9999! ${card1.number} + ${card2.number} = ${sum}`,
          isCorrect: false
        });
        setTimeout(() => setSelectedCards([]), 1200);
      }

      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const resetGame = () => {
    setSelectedCards([]);
    setMatchedPairs([]);
    setFeedback(null);
  };

  const isCompleted = matchedPairs.length >= 3;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'വാഹന നമ്പർ പൊരുത്തപ്പെടുത്തൽ (Sum = 9999)' : 'Vehicle Matching Game: Target 9999'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'നമ്പറുകൾ കൂട്ടുമ്പോൾ 9999 കിട്ടുന്ന രണ്ട് വാഹനങ്ങൾ തിരഞ്ഞെടുക്കൂ' : 'Pick two vehicles whose number plates add up to exactly 9999'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full bg-vaayana-dark text-vaayana-lime font-mono font-black text-xs border border-vaayana-darkBorder">
            Pairs: {matchedPairs.length} / 3
          </span>
          <button
            onClick={resetGame}
            className="p-2 rounded-xl bg-vaayana-dark text-vaayana-textLightMuted hover:text-vaayana-textLight"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Vehicle Parking Lot Grid */}
      <div className="bg-vaayana-softSurface p-6 sm:p-10 rounded-4xl border border-vaayana-softBorder shadow-card space-y-6">
        
        {/* Active Selection Formula Preview Banner */}
        <div className="p-4 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder flex items-center justify-center gap-4 text-center">
          <div className="text-lg sm:text-2xl font-black font-mono text-vaayana-lime">
            {selectedCards[0] ? selectedCards[0].number : '______'} 
            {' '}+{' '}
            {selectedCards[1] ? selectedCards[1].number : '______'} 
            {' '}={' '}
            <span className="text-amber-400">9999</span>
          </div>
        </div>

        {/* Feedback alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`p-4 rounded-2xl text-center text-xs sm:text-sm font-bold font-malayalam ${
                feedback.isCorrect 
                  ? 'bg-emerald-100 border border-emerald-300 text-emerald-950' 
                  : 'bg-rose-100 border border-rose-300 text-rose-950'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {VEHICLES_DECK.map(card => {
            const isSelected = selectedCards.some(c => c.id === card.id);
            const isMatched = matchedPairs.some(p => p.includes(card.id));

            return (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isMatched}
                whileHover={!isMatched ? { y: -4 } : {}}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-between min-h-[160px] text-center relative overflow-hidden shadow-soft ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 opacity-60 pointer-events-none'
                    : isSelected
                      ? 'bg-amber-100 border-amber-500 scale-105 shadow-md'
                      : 'bg-vaayana-soft hover:bg-vaayana-softBorder border-vaayana-softBorder'
                }`}
              >
                {/* Vehicle Type Icon */}
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm mb-2"
                  style={{ backgroundColor: `${card.color}20`, color: card.color }}
                >
                  {card.type === 'car' && <Car className="w-6 h-6" />}
                  {card.type === 'bus' && <Bus className="w-6 h-6" />}
                  {card.type === 'truck' && <Truck className="w-6 h-6" />}
                  {(card.type === 'auto' || card.type === 'jeep' || card.type === 'bike') && <Car className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-vaayana-textDark font-malayalam line-clamp-1">
                    {language === 'ml' ? card.nameMl : card.nameEn}
                  </h4>

                  {/* Number plate pill */}
                  <div className="px-3 py-1 rounded-xl bg-vaayana-dark text-vaayana-lime font-mono font-black text-base sm:text-lg border border-vaayana-darkBorder shadow-sm">
                    {card.number}
                  </div>
                </div>

                {isMatched && (
                  <div className="absolute top-2 right-2 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Completion Celebration */}
        {isCompleted && (
          <div className="p-6 bg-emerald-100 border border-emerald-300 rounded-3xl text-center space-y-2">
            <h4 className="text-xl font-black text-emerald-950 font-malayalam">
              {language === 'ml' ? 'അഭിനന്ദനങ്ങൾ! എല്ലാ വാഹന ജോടികളും 9999 തികച്ചു!' : 'Super! All pairs matched to 9999!'}
            </h4>
            <p className="text-xs text-emerald-900">
              5000 + 4999 = 9999 | 6500 + 3499 = 9999 | 7250 + 2749 = 9999
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
