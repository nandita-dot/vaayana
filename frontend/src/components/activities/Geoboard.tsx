import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Maximize2,
  Trash2,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Peg {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
}

const GRID_SIZE = 5;
const PEG_SPACING = 70;
const OFFSET = 50;

const COLORS = [
  { name: 'Lime', hex: '#9ACD32' },
  { name: 'Cyan', hex: '#38BDF8' },
  { name: 'Orange', hex: '#FB923C' },
  { name: 'Pink', hex: '#F472B6' },
];

export const Geoboard: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPegs, setSelectedPegs] = useState<number[]>([]);
  const [activeColor, setActiveColor] = useState(COLORS[0].hex);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  // Generate 5x5 grid of pegs
  const pegs: Peg[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      pegs.push({
        id: r * GRID_SIZE + c,
        row: r,
        col: c,
        x: OFFSET + c * PEG_SPACING,
        y: OFFSET + r * PEG_SPACING
      });
    }
  }

  const challenges = [
    {
      id: 'triangle',
      titleEn: 'Make a Triangle (3 sides)',
      titleMl: 'ഒരു ത്രികോണം ഉണ്ടാക്കുക (3 വശങ്ങൾ)',
      targetVertices: 3,
      hintEn: 'Tap 3 different pegs and tap the first peg again to close the shape.',
      hintMl: '3 പെഗ്ഗുകളിൽ തൊട്ട് ആദ്യത്തെ പെഗ്ഗിൽ തൊട്ട് ത്രികോണം പൂർത്തിയാക്കൂ.'
    },
    {
      id: 'rectangle',
      titleEn: 'Make a Rectangle or Square (4 sides)',
      titleMl: 'ഒരു ചതുരമോ സമചതുരമോ ഉണ്ടാക്കുക (4 വശങ്ങൾ)',
      targetVertices: 4,
      hintEn: 'Connect 4 pegs with right angles to form a rectangle.',
      hintMl: '4 വശങ്ങളുള്ള ചതുരം രൂപപ്പെടുത്താൻ 4 പെഗ്ഗുകൾ ബന്ധിപ്പിക്കുക.'
    },
    {
      id: 'free',
      titleEn: 'Free Creation Mode',
      titleMl: 'സ്വതന്ത്ര രചനാരീതി (ഇഷ്ടമുള്ള രൂപം)',
      targetVertices: 0,
      hintEn: 'Tap pegs in sequence to create any closed geometric polygon.',
      hintMl: 'നിങ്ങൾക്ക് ഇഷ്ടമുള്ള ബഹുഭുജ രൂപങ്ങൾ നിർമ്മിക്കാം.'
    }
  ];

  const currentChallenge = challenges[challengeIndex];

  const handlePegClick = (pegId: number) => {
    // If empty, start path
    if (selectedPegs.length === 0) {
      setSelectedPegs([pegId]);
      return;
    }

    // If clicking the first peg and we have at least 3 points, close polygon!
    if (selectedPegs.length >= 3 && pegId === selectedPegs[0]) {
      // Shape is closed!
      checkChallenge(selectedPegs.length);
      return;
    }

    // Don't allow immediately consecutive duplicate
    if (selectedPegs[selectedPegs.length - 1] === pegId) return;

    // Add to path if not already in middle
    if (!selectedPegs.includes(pegId)) {
      const newPath = [...selectedPegs, pegId];
      setSelectedPegs(newPath);
    }
  };

  const closeShape = () => {
    if (selectedPegs.length >= 3) {
      checkChallenge(selectedPegs.length);
    }
  };

  const checkChallenge = (vertexCount: number) => {
    if (currentChallenge.targetVertices > 0 && vertexCount === currentChallenge.targetVertices) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setChallengeSuccess(true);
      setTimeout(() => setChallengeSuccess(false), 3000);
    }
  };

  const clearBoard = () => {
    setSelectedPegs([]);
    setChallengeSuccess(false);
  };

  const isClosed = selectedPegs.length >= 3;

  // Path SVG string
  const getPathData = () => {
    if (selectedPegs.length === 0) return '';
    const points = selectedPegs.map(id => {
      const p = pegs[id];
      return `${p.x},${p.y}`;
    });
    return points.join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Maximize2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'ഡിജിറ്റൽ ജിയോബോർഡ് (Geoboard)' : 'Digital Geoboard Simulation'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'പെഗ്ഗുകളിൽ റബ്ബർ ബാൻഡ് വലിച്ച് രൂപങ്ങൾ ഉണ്ടാക്കാം' : 'Stretch elastic bands between pegs to build geometric shapes'}
            </p>
          </div>
        </div>

        {/* Color Palette and Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder">
            {COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => setActiveColor(c.hex)}
                className={`w-7 h-7 rounded-xl transition-all ${activeColor === c.hex ? 'scale-110 ring-2 ring-white' : 'opacity-60'}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          <button
            onClick={clearBoard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'ml' ? 'മായ്ക്കുക' : 'Clear'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Geoboard Canvas */}
        <div className="lg:col-span-8 bg-vaayana-softSurface p-6 sm:p-8 rounded-4xl border border-vaayana-softBorder shadow-card flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-square bg-[#1B241D] rounded-3xl border-4 border-[#2D3E30] shadow-[inset_0_4px_16px_rgba(0,0,0,0.6)] p-2 touch-none overflow-hidden select-none">
            
            <svg 
              viewBox={`0 0 ${OFFSET * 2 + (GRID_SIZE - 1) * PEG_SPACING} ${OFFSET * 2 + (GRID_SIZE - 1) * PEG_SPACING}`}
              className="w-full h-full"
            >
              {/* Elastic Band Polygon Fill & Stroke */}
              {selectedPegs.length >= 2 && (
                <polyline
                  points={getPathData()}
                  fill={isClosed ? `${activeColor}25` : 'none'}
                  stroke={activeColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="filter drop-shadow-[0_0_8px_rgba(154,205,50,0.5)] transition-all"
                />
              )}

              {/* Connecting line to close polygon if 3+ pegs */}
              {selectedPegs.length >= 3 && (
                <polygon
                  points={getPathData()}
                  fill={`${activeColor}20`}
                  stroke={activeColor}
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
              )}

              {/* Pegs */}
              {pegs.map(peg => {
                const isSelected = selectedPegs.includes(peg.id);
                const isFirst = selectedPegs[0] === peg.id;
                return (
                  <g 
                    key={peg.id} 
                    onClick={() => handlePegClick(peg.id)}
                    className="cursor-pointer group"
                  >
                    {/* Peg drop shadow */}
                    <circle 
                      cx={peg.x} 
                      cy={peg.y + 3} 
                      r="9" 
                      fill="#0A0F0C" 
                      opacity="0.8" 
                    />
                    {/* Wooden/brass peg body */}
                    <circle 
                      cx={peg.x} 
                      cy={peg.y} 
                      r="8" 
                      fill={isSelected ? activeColor : '#C2B280'} 
                      stroke="#8C7853"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-125"
                    />
                    {/* Highlight rim */}
                    <circle 
                      cx={peg.x - 2} 
                      cy={peg.y - 2} 
                      r="3" 
                      fill="#FFF" 
                      opacity="0.6" 
                    />
                    {/* Ring highlight if selected or starting */}
                    {isSelected && (
                      <circle
                        cx={peg.x}
                        cy={peg.y}
                        r="14"
                        fill="none"
                        stroke={activeColor}
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-spin-slow"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hint text at bottom of board */}
            <div className="absolute bottom-2 inset-x-0 text-center text-[11px] font-mono font-bold text-vaayana-textLightMuted/70 pointer-events-none">
              {language === 'ml' ? 'പെഗ്ഗിൽ തൊട്ട് ബാൻഡ് വലിച്ച് യോജിപ്പിക്കുക' : 'Tap pegs in sequence to stretch band'}
            </div>
          </div>
        </div>

        {/* Right Info and Challenges Column */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Shape Inspector */}
          <div className="bg-vaayana-softSurface p-6 rounded-3xl border border-vaayana-softBorder shadow-card space-y-4">
            <h4 className="text-base font-black text-vaayana-textDark font-malayalam flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-vaayana-limeDark" />
              <span>{language === 'ml' ? 'രൂപത്തിന്റെ വിവരങ്ങൾ' : 'Shape Details'}</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-vaayana-soft border border-vaayana-softBorder text-center">
                <span className="text-xs text-vaayana-textDarkMuted block font-bold">
                  {language === 'ml' ? 'മൂലകൾ (Vertices)' : 'Vertices'}
                </span>
                <span className="text-2xl font-black text-vaayana-textDark font-mono">
                  {selectedPegs.length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-vaayana-soft border border-vaayana-softBorder text-center">
                <span className="text-xs text-vaayana-textDarkMuted block font-bold">
                  {language === 'ml' ? 'വശങ്ങൾ (Sides)' : 'Sides'}
                </span>
                <span className="text-2xl font-black text-vaayana-limeDark font-mono">
                  {selectedPegs.length >= 3 ? selectedPegs.length : 0}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-bold leading-relaxed">
              {selectedPegs.length === 3 && (
                <span>✓ {language === 'ml' ? 'നിങ്ങൾ 3 വശങ്ങളുള്ള ത്രികോണം (Triangle) ഉണ്ടാക്കി!' : 'You created a 3-sided Triangle!'}</span>
              )}
              {selectedPegs.length === 4 && (
                <span>✓ {language === 'ml' ? 'നിങ്ങൾ 4 വശങ്ങളുള്ള ചതുർഭുജം (Quadrilateral) ഉണ്ടാക്കി!' : 'You created a 4-sided Quadrilateral / Rectangle!'}</span>
              )}
              {selectedPegs.length > 4 && (
                <span>✓ {language === 'ml' ? `നിങ്ങൾ ${selectedPegs.length} വശങ്ങളുള്ള ബഹുഭുജം (Polygon) ഉണ്ടാക്കി!` : `You created a ${selectedPegs.length}-sided Polygon!`}</span>
              )}
              {selectedPegs.length < 3 && (
                <span>{language === 'ml' ? 'കുറഞ്ഞത് 3 പെഗ്ഗുകളെങ്കിലും യോജിപ്പിച്ച് അടഞ്ഞ രൂപം നിർമ്മിക്കുക.' : 'Connect at least 3 pegs to complete a closed shape.'}</span>
              )}
            </div>
          </div>

          {/* Guided Challenge Card */}
          <div className="bg-vaayana-darkSurface p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-vaayana-lime/20 text-vaayana-lime font-mono font-black text-xs">
                Challenge {challengeIndex + 1}/{challenges.length}
              </span>
              <button
                onClick={() => setChallengeIndex(c => (c + 1) % challenges.length)}
                className="text-xs font-bold text-vaayana-lime hover:underline"
              >
                {language === 'ml' ? 'അടുത്തത് ➔' : 'Next ➔'}
              </button>
            </div>

            <div>
              <h4 className="text-lg font-black text-vaayana-textLight font-malayalam">
                {language === 'ml' ? currentChallenge.titleMl : currentChallenge.titleEn}
              </h4>
              <p className="text-xs text-vaayana-textLightMuted mt-1 leading-relaxed">
                {language === 'ml' ? currentChallenge.hintMl : currentChallenge.hintEn}
              </p>
            </div>

            {challengeSuccess && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-emerald-200 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{language === 'ml' ? 'വിജയം! വെരി ഗുഡ്!' : 'Challenge Solved! Great job!'}</span>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
