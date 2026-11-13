import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Circle as CircleIcon, 
  Triangle as TriangleIcon, 
  Square, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  HelpCircle,
  Eye,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShapeItem {
  id: string;
  nameEn: string;
  nameMl: string;
  shape: 'circle' | 'triangle' | 'rectangle';
  emoji: string;
  descEn: string;
  descMl: string;
}

const EVERYDAY_OBJECTS: ShapeItem[] = [
  { id: 'obj-1', nameEn: 'Cart Wheel', nameMl: 'വണ്ടിച്ചക്രം', shape: 'circle', emoji: '🛞', descEn: 'Rolls smoothly with no corners', descMl: 'മൂലകളില്ലാതെ ഉരുളുന്നു' },
  { id: 'obj-2', nameEn: 'House Roof', nameMl: 'വീടിന്റെ മേൽക്കൂര', shape: 'triangle', emoji: '🏠', descEn: '3 sloping sides to drain rainwater', descMl: 'മഴവെള്ളം ഒഴുകിപ്പോകാൻ 3 വശങ്ങൾ' },
  { id: 'obj-3', nameEn: 'Textbook', nameMl: 'പാഠപുസ്തകം', shape: 'rectangle', emoji: '📖', descEn: '4 straight sides, opposite sides equal', descMl: '4 വശങ്ങൾ, എതിർവശങ്ങൾ തുല്യം' },
  { id: 'obj-4', nameEn: 'Wall Clock', nameMl: 'മതിൽ ഘടികാരം', shape: 'circle', emoji: '⏰', descEn: 'Round boundary with equal distance from center', descMl: 'കേന്ദ്രത്തിൽ നിന്ന് തുല്യ അകലമുള്ള വൃത്താകൃതി' },
  { id: 'obj-5', nameEn: 'Traffic Sign', nameMl: 'ട്രാഫിക് ബോർഡ്', shape: 'triangle', emoji: '⚠️', descEn: 'Pointed top with 3 sharp vertices', descMl: 'മുകളിലേക്ക് കൂർത്ത 3 മൂലകൾ' },
  { id: 'obj-6', nameEn: 'Classroom Door', nameMl: 'ക്ലാസ്സ് മുറിയുടെ വാതിൽ', shape: 'rectangle', emoji: '🚪', descEn: 'Tall rectangular frame with 4 right angles', descMl: '4 മട്ടകോണുകളുള്ള ചതുരാകൃതി' },
];

export const ShapeExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedShape, setSelectedShape] = useState<'circle' | 'triangle' | 'rectangle'>('circle');
  const [activeTab, setActiveTab] = useState<'explore' | 'match'>('explore');

  // Matching game state
  const [unmatchedObjects, setUnmatchedObjects] = useState<ShapeItem[]>(EVERYDAY_OBJECTS);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const shapeData = {
    circle: {
      nameEn: 'Circle',
      nameMl: 'വൃത്തം',
      sides: 0,
      vertices: 0,
      edgesDescEn: '1 smooth curved closed line. No straight sides or corners.',
      edgesDescMl: 'ഒരു വളഞ്ഞ രേഖയാൽ ചുറ്റപ്പെട്ട രൂപം. വശങ്ങളോ കോണുകളോ ഇല്ല.',
      realLifeEn: 'Bicycle wheel, coin, plate, round clock',
      realLifeMl: 'സൈക്കിൾ ചക്രം, നാണയം, തളിക, ഘടികാരം',
      color: '#38BDF8',
      path: (
        <circle cx="100" cy="100" r="75" fill="none" stroke="#38BDF8" strokeWidth="8" strokeDasharray="500" strokeDashoffset="0" />
      )
    },
    triangle: {
      nameEn: 'Triangle',
      nameMl: 'ത്രികോണം',
      sides: 3,
      vertices: 3,
      edgesDescEn: '3 straight sides and 3 corners (vertices). Sum of angles = 180°.',
      edgesDescMl: '3 നേർരേഖാ വശങ്ങളും 3 മൂലകളും (കോണുകൾ) അടങ്ങിയ അടഞ്ഞ രൂപം.',
      realLifeEn: 'Samosa, house roof, set-square, triangular traffic sign',
      realLifeMl: 'സമോസ, വീടിന്റെ മേൽക്കൂര, സെറ്റ് സ്‌ക്വയർ, ട്രാഫിക് ബോർഡ്',
      color: '#FB923C',
      path: (
        <polygon points="100,25 180,175 20,175" fill="none" stroke="#FB923C" strokeWidth="8" strokeLinejoin="round" />
      )
    },
    rectangle: {
      nameEn: 'Rectangle',
      nameMl: 'ചതുരം',
      sides: 4,
      vertices: 4,
      edgesDescEn: '4 straight sides and 4 corners. Opposite sides are equal in length.',
      edgesDescMl: '4 വശങ്ങളും 4 മൂലകളും. എതിർവശങ്ങൾ തുല്യ നീളമുള്ളവയാണ്.',
      realLifeEn: 'Textbook, classroom smartboard, door, currency note',
      realLifeMl: 'പാഠപുസ്തകം, സ്മാർട്ട്ബോർഡ്, വാതിൽ, കറൻസി നോട്ട്',
      color: '#9ACD32',
      path: (
        <rect x="25" y="45" width="150" height="110" rx="8" fill="none" stroke="#9ACD32" strokeWidth="8" />
      )
    }
  };

  const handleMatch = (targetShape: 'circle' | 'triangle' | 'rectangle') => {
    if (unmatchedObjects.length === 0) return;
    const current = unmatchedObjects[0];

    if (current.shape === targetShape) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      setScore(s => s + 1);
      setFeedback({
        message: language === 'ml' 
          ? `ശരിയാണ്! ${current.nameMl} ഒരു ${shapeData[targetShape].nameMl} ആണ്.` 
          : `Correct! ${current.nameEn} is a ${shapeData[targetShape].nameEn}!`,
        isCorrect: true
      });
      setUnmatchedObjects(prev => prev.slice(1));
    } else {
      setFeedback({
        message: language === 'ml' 
          ? `ശ്രമിക്കൂ! ${current.nameMl} ഒരു ${shapeData[targetShape].nameMl} അല്ല.` 
          : `Try again! ${current.nameEn} is not a ${shapeData[targetShape].nameEn}.`,
        isCorrect: false
      });
    }

    setTimeout(() => setFeedback(null), 2500);
  };

  const resetGame = () => {
    setUnmatchedObjects(EVERYDAY_OBJECTS);
    setScore(0);
    setFeedback(null);
  };

  const current = shapeData[selectedShape];

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime/20 border border-vaayana-lime/40 flex items-center justify-center text-vaayana-lime font-black">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'വരകളും രൂപങ്ങളും പര്യവേക്ഷണം' : 'Lines & Shapes Explorer'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'വൃത്തം, ത്രികോണം, ചതുരം എന്നിവയുടെ പ്രത്യേകതകൾ' : 'Properties of Circles, Triangles & Rectangles'}
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'explore'
                ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                : 'text-vaayana-textLightMuted hover:text-vaayana-textLight'
            }`}
          >
            {language === 'ml' ? 'രൂപങ്ങൾ കാണാം' : 'Explore Shapes'}
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'match'
                ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                : 'text-vaayana-textLightMuted hover:text-vaayana-textLight'
            }`}
          >
            {language === 'ml' ? 'കളിച്ചു പഠിക്കാം (Matching)' : 'Matching Game'}
          </button>
        </div>
      </div>

      {activeTab === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Shape selector tabs */}
          <div className="lg:col-span-4 space-y-3">
            {(['circle', 'triangle', 'rectangle'] as const).map(shape => {
              const isSelected = selectedShape === shape;
              const data = shapeData[shape];
              return (
                <button
                  key={shape}
                  onClick={() => setSelectedShape(shape)}
                  className={`w-full text-left p-4 sm:p-5 rounded-3xl border transition-all flex items-center justify-between group active:scale-95 ${
                    isSelected
                      ? 'bg-vaayana-softSurface border-vaayana-lime shadow-soft'
                      : 'bg-vaayana-darkSurface border-vaayana-darkBorder hover:border-vaayana-darkMuted text-vaayana-textLightMuted'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm"
                      style={{ backgroundColor: `${data.color}20`, color: data.color }}
                    >
                      {shape === 'circle' && <CircleIcon className="w-6 h-6" />}
                      {shape === 'triangle' && <TriangleIcon className="w-6 h-6" />}
                      {shape === 'rectangle' && <Square className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={`text-base sm:text-lg font-black ${isSelected ? 'text-vaayana-textDark font-malayalam' : 'text-vaayana-textLight font-malayalam'}`}>
                        {data.nameMl}
                      </h4>
                      <p className="text-xs font-bold font-mono opacity-80">
                        {data.nameEn}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-3 h-3 rounded-full bg-vaayana-lime shadow-limeGlow" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Inspection Canvas */}
          <div className="lg:col-span-8 bg-vaayana-softSurface p-6 sm:p-8 rounded-4xl border border-vaayana-softBorder shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-vaayana-softBorder pb-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-vaayana-textDark font-malayalam">
                  {current.nameMl} <span className="text-lg font-bold text-vaayana-textDarkMuted font-mono">({current.nameEn})</span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-vaayana-dark text-vaayana-lime font-black text-xs">
                  {language === 'ml' ? `വശങ്ങൾ: ${current.sides}` : `Sides: ${current.sides}`}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-vaayana-dark text-amber-300 font-black text-xs">
                  {language === 'ml' ? `മൂലകൾ: ${current.vertices}` : `Vertices: ${current.vertices}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* SVG drawing canvas */}
              <div className="relative w-full aspect-square max-w-[260px] mx-auto rounded-3xl bg-vaayana-dark border border-vaayana-darkBorder flex items-center justify-center p-4 overflow-hidden shadow-inner">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(154,205,50,0.3)]">
                  <motion.g
                    key={selectedShape}
                    initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    {current.path}
                  </motion.g>
                </svg>
                <div className="absolute bottom-3 right-3 text-[11px] font-mono text-vaayana-textLightMuted bg-vaayana-dark/80 px-2.5 py-1 rounded-lg">
                  2D Shape
                </div>
              </div>

              {/* Properties Breakdown */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-vaayana-soft border border-vaayana-softBorder space-y-1.5">
                  <span className="font-extrabold text-xs text-vaayana-limeDark uppercase tracking-wider block">
                    {language === 'ml' ? 'പ്രധാന പ്രത്യേകതകൾ' : 'Key Properties'}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-vaayana-textDark font-malayalam leading-relaxed">
                    {language === 'ml' ? current.edgesDescMl : current.edgesDescEn}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <span className="font-extrabold text-xs text-amber-800 uppercase tracking-wider block">
                    {language === 'ml' ? 'നിത്യജീവിതത്തിലെ ഉദാഹരണങ്ങൾ' : 'Real-World Examples in Kerala'}
                  </span>
                  <p className="text-sm font-bold text-amber-950 font-malayalam leading-relaxed">
                    {language === 'ml' ? current.realLifeMl : current.realLifeEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Matching Game Mode */
        <div className="bg-vaayana-softSurface p-6 sm:p-8 rounded-4xl border border-vaayana-softBorder shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-vaayana-softBorder pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-vaayana-textDark font-malayalam">
                {language === 'ml' ? 'വസ്തുക്കളെ രൂപങ്ങളുമായി യോജിപ്പിക്കാം' : 'Match Everyday Objects to Shapes'}
              </h3>
              <p className="text-xs text-vaayana-textDarkMuted">
                {language === 'ml' ? 'താഴെ കാണുന്ന വസ്തു ഏത് രൂപത്തിൽ പെട്ടതാണ്?' : 'Which shape matches the current object?'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-vaayana-dark text-vaayana-lime font-mono font-black text-sm">
                Score: {score}
              </span>
              <button
                onClick={resetGame}
                className="p-2 rounded-xl bg-vaayana-soft hover:bg-vaayana-softBorder text-vaayana-textDark transition-all"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {unmatchedObjects.length > 0 ? (
            <div className="max-w-md mx-auto text-center space-y-6">
              {/* Current Object Card */}
              <motion.div
                key={unmatchedObjects[0].id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 rounded-3xl bg-vaayana-soft border-2 border-dashed border-vaayana-softBorder shadow-soft space-y-3"
              >
                <span className="text-6xl block mb-2">{unmatchedObjects[0].emoji}</span>
                <h4 className="text-2xl font-black text-vaayana-textDark font-malayalam">
                  {language === 'ml' ? unmatchedObjects[0].nameMl : unmatchedObjects[0].nameEn}
                </h4>
                <p className="text-xs text-vaayana-textDarkMuted font-medium">
                  {language === 'ml' ? unmatchedObjects[0].descMl : unmatchedObjects[0].descEn}
                </p>
              </motion.div>

              {/* Feedback Alert */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold ${
                      feedback.isCorrect
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-rose-100 text-rose-950 border border-rose-300'
                    }`}
                  >
                    {feedback.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Target 3 Shape Buttons */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {(['circle', 'triangle', 'rectangle'] as const).map(shape => {
                  const data = shapeData[shape];
                  return (
                    <button
                      key={shape}
                      onClick={() => handleMatch(shape)}
                      className="p-4 sm:p-5 rounded-2xl bg-vaayana-dark hover:bg-vaayana-darkHover border border-vaayana-darkBorder text-vaayana-textLight flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-md group"
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${data.color}25`, color: data.color }}
                      >
                        {shape === 'circle' && <CircleIcon className="w-5 h-5" />}
                        {shape === 'triangle' && <TriangleIcon className="w-5 h-5" />}
                        {shape === 'rectangle' && <Square className="w-5 h-5" />}
                      </div>
                      <span className="text-xs sm:text-sm font-black font-malayalam group-hover:text-vaayana-lime transition-colors">
                        {data.nameMl}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-vaayana-textDark font-malayalam">
                {language === 'ml' ? 'അഭിനന്ദനങ്ങൾ! എല്ലാ വസ്തുക്കളും ശരിയായി പൊരുത്തപ്പെടുത്തി!' : 'Awesome! All objects correctly categorized!'}
              </h3>
              <p className="text-sm text-vaayana-textDarkMuted">
                {language === 'ml' ? `നിങ്ങളുടെ സ്കോർ: ${score} / ${EVERYDAY_OBJECTS.length}` : `Final Score: ${score} / ${EVERYDAY_OBJECTS.length}`}
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-3 rounded-2xl bg-vaayana-dark text-vaayana-lime font-black text-sm shadow-limeGlow active:scale-95 transition-all"
              >
                {language === 'ml' ? 'വീണ്ടും കളിക്കാം' : 'Play Again'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
