import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Puzzle, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  HelpCircle,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TangramPiece {
  id: string;
  name: string;
  color: string;
  points: string; // SVG polygon points
  x: number;
  y: number;
  rotation: number;
  isPlaced: boolean;
}

const INITIAL_PIECES: TangramPiece[] = [
  { id: 't1', name: 'Large Triangle 1', color: '#38BDF8', points: '0,0 140,0 0,140', x: 20, y: 30, rotation: 0, isPlaced: false },
  { id: 't2', name: 'Large Triangle 2', color: '#0284C7', points: '0,0 140,0 140,140', x: 180, y: 30, rotation: 0, isPlaced: false },
  { id: 't3', name: 'Medium Triangle', color: '#A855F7', points: '0,0 100,0 50,50', x: 30, y: 200, rotation: 0, isPlaced: false },
  { id: 't4', name: 'Small Triangle 1', color: '#FB923C', points: '0,0 70,0 0,70', x: 160, y: 200, rotation: 0, isPlaced: false },
  { id: 't5', name: 'Small Triangle 2', color: '#F472B6', points: '0,0 70,0 70,70', x: 250, y: 200, rotation: 0, isPlaced: false },
  { id: 'sq', name: 'Square', color: '#9ACD32', points: '0,0 50,0 50,50 0,50', x: 60, y: 290, rotation: 0, isPlaced: false },
  { id: 'pg', name: 'Parallelogram', color: '#FBBF24', points: '20,0 70,0 50,50 0,50', x: 160, y: 290, rotation: 0, isPlaced: false },
];

export const TangramPuzzle: React.FC = () => {
  const { language } = useLanguage();
  const [pieces, setPieces] = useState<TangramPiece[]>(INITIAL_PIECES);
  const [selectedPieceId, setSelectedPieceId] = useState<string>('t1');
  const [activeSilhouette, setActiveSilhouette] = useState<'house' | 'candle' | 'boat'>('house');
  const [isCompleted, setIsCompleted] = useState(false);

  const rotateSelectedPiece = () => {
    setPieces(prev => prev.map(p => {
      if (p.id === selectedPieceId) {
        return { ...p, rotation: (p.rotation + 45) % 360 };
      }
      return p;
    }));
  };

  const handleSnapToPlace = (id: string) => {
    setPieces(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isPlaced: true } : p);
      const allDone = updated.every(p => p.isPlaced);
      if (allDone) {
        setIsCompleted(true);
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      }
      return updated;
    });
  };

  const resetPuzzle = () => {
    setPieces(INITIAL_PIECES.map(p => ({ ...p, isPlaced: false, rotation: 0 })));
    setIsCompleted(false);
  };

  const selectedPiece = pieces.find(p => p.id === selectedPieceId);

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Puzzle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'ടാൻഗ്രാം കടങ്കഥ (Tangram Puzzle)' : 'Traditional 7-Piece Tangram'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? '7 കഷ്ണങ്ങൾ കൊണ്ട് വീടും മെഴുകുതിരിയും ഉണ്ടാക്കാം' : 'Arrange the 7 geometric pieces to complete the silhouette'}
            </p>
          </div>
        </div>

        {/* Silhouette chooser & reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder">
            <button
              onClick={() => { setActiveSilhouette('house'); resetPuzzle(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeSilhouette === 'house' ? 'bg-vaayana-lime text-vaayana-dark' : 'text-vaayana-textLightMuted'}`}
            >
              {language === 'ml' ? 'വീട് (House)' : 'House'}
            </button>
            <button
              onClick={() => { setActiveSilhouette('candle'); resetPuzzle(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeSilhouette === 'candle' ? 'bg-vaayana-lime text-vaayana-dark' : 'text-vaayana-textLightMuted'}`}
            >
              {language === 'ml' ? 'മെഴുകുതിരി' : 'Candle'}
            </button>
            <button
              onClick={() => { setActiveSilhouette('boat'); resetPuzzle(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeSilhouette === 'boat' ? 'bg-vaayana-lime text-vaayana-dark' : 'text-vaayana-textLightMuted'}`}
            >
              {language === 'ml' ? 'തോണി (Boat)' : 'Boat'}
            </button>
          </div>

          <button
            onClick={resetPuzzle}
            className="p-2.5 rounded-2xl bg-vaayana-dark hover:bg-vaayana-darkBorder text-vaayana-textLightMuted hover:text-vaayana-textLight transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Tangram Interactive Board */}
        <div className="lg:col-span-8 bg-vaayana-softSurface p-6 sm:p-8 rounded-4xl border border-vaayana-softBorder shadow-card flex flex-col items-center justify-between min-h-[460px] relative">
          
          <div className="w-full flex items-center justify-between text-xs text-vaayana-textDarkMuted pb-2 border-b border-vaayana-softBorder">
            <span className="font-bold">
              {language === 'ml' ? 'കഷ്ണത്തിൽ തൊട്ട് തിരിക്കുക, സ്ഥാനത്ത് ഉറപ്പിക്കുക' : 'Tap a piece to select, rotate and snap into silhouette'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={rotateSelectedPiece}
                className="px-3 py-1.5 rounded-xl bg-vaayana-dark text-vaayana-lime hover:bg-[#1a251c] font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{language === 'ml' ? 'തിരിക്കുക (45°)' : 'Rotate Piece'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Area with Target Silhouette and Draggable Tangram Pieces */}
          <div className="relative w-full max-w-[480px] aspect-square bg-slate-900/90 rounded-3xl border-2 border-slate-700 shadow-inner overflow-hidden p-4 select-none">
            
            {/* Target Silhouette in Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              {activeSilhouette === 'house' && (
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[90px] border-l-transparent border-r-[90px] border-r-transparent border-b-[90px] border-b-white" />
                  <div className="w-[140px] h-[100px] bg-white border-2 border-white" />
                </div>
              )}
              {activeSilhouette === 'candle' && (
                <div className="flex flex-col items-center">
                  <div className="w-6 h-12 bg-amber-400 rounded-t-full mb-1" />
                  <div className="w-16 h-36 bg-white" />
                  <div className="w-28 h-8 bg-white rounded" />
                </div>
              )}
              {activeSilhouette === 'boat' && (
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[70px] border-l-transparent border-b-[100px] border-b-white self-start" />
                  <div className="w-48 h-10 bg-white rounded-b-full mt-2" />
                </div>
              )}
            </div>

            {/* Render 7 Tangram Pieces */}
            <svg viewBox="0 0 400 400" className="w-full h-full relative z-10">
              {pieces.map(piece => {
                const isSelected = selectedPieceId === piece.id;
                return (
                  <motion.g
                    key={piece.id}
                    onClick={() => setSelectedPieceId(piece.id)}
                    animate={{ rotate: piece.rotation }}
                    transition={{ type: 'spring', damping: 20 }}
                    style={{ transformOrigin: 'center' }}
                    className="cursor-pointer group"
                  >
                    <polygon
                      points={piece.points}
                      fill={piece.color}
                      stroke={isSelected ? '#FFF' : '#000'}
                      strokeWidth={isSelected ? '4' : '1.5'}
                      className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-all"
                      transform={`translate(${piece.x}, ${piece.y})`}
                    />
                  </motion.g>
                );
              })}
            </svg>

            {/* Quick Snap Helper Buttons inside smartboard */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2">
              <button
                onClick={() => handleSnapToPlace(selectedPieceId)}
                className="px-4 py-2 rounded-xl bg-vaayana-lime text-vaayana-dark font-black text-xs shadow-limeGlow active:scale-95 transition-all"
              >
                {language === 'ml' ? 'ഈ കഷ്ണം സ്ഥാപിക്കുക ✓' : 'Snap Selected Piece ✓'}
              </button>
            </div>
          </div>

          {/* Completion Celebration Overlay */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-vaayana-dark/90 backdrop-blur-sm rounded-4xl flex flex-col items-center justify-center p-8 text-center space-y-4 z-30"
              >
                <div className="w-20 h-20 rounded-full bg-vaayana-lime text-vaayana-dark flex items-center justify-center shadow-limeGlow">
                  <Trophy className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-vaayana-textLight font-malayalam">
                  {language === 'ml' ? 'അത്ഭുതം! ടാൻഗ്രാം പൂർത്തിയായി!' : 'Brilliant! Tangram Solved!'}
                </h3>
                <p className="text-sm text-vaayana-textLightMuted max-w-sm">
                  {language === 'ml' ? '7 ജ്യാമിതീയ കഷ്ണങ്ങളും കൃത്യമായി യോജിപ്പിച്ച് പുതിയ രൂപം സൃഷ്ടിച്ചു!' : 'You combined all 7 geometric pieces to construct the shape!'}
                </p>
                <button
                  onClick={resetPuzzle}
                  className="px-6 py-3 rounded-2xl bg-vaayana-lime text-vaayana-dark font-black text-sm shadow-limeGlow"
                >
                  {language === 'ml' ? 'മറ്റൊരു രൂപം പരീക്ഷിക്കാം' : 'Try Another Puzzle'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Info Column: 7 Pieces breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-vaayana-softSurface p-6 rounded-3xl border border-vaayana-softBorder shadow-card space-y-3">
            <h4 className="text-base font-black text-vaayana-textDark font-malayalam">
              {language === 'ml' ? '7 ടാൻഗ്രാം കഷ്ണങ്ങൾ (7 Pieces)' : '7 Tangram Pieces'}
            </h4>
            <div className="space-y-1.5 text-xs font-bold text-vaayana-textDark">
              <div className="flex items-center justify-between p-2 rounded-xl bg-sky-100 text-sky-950">
                <span>• {language === 'ml' ? '2 വലിയ ത്രികോണങ്ങൾ' : '2 Large Triangles'}</span>
                <span className="font-mono">T1, T2</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-purple-100 text-purple-950">
                <span>• {language === 'ml' ? '1 ഇടത്തരം ത്രികോണം' : '1 Medium Triangle'}</span>
                <span className="font-mono">T3</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-orange-100 text-orange-950">
                <span>• {language === 'ml' ? '2 ചെറിയ ത്രികോണങ്ങൾ' : '2 Small Triangles'}</span>
                <span className="font-mono">T4, T5</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-lime-100 text-lime-950">
                <span>• {language === 'ml' ? '1 സമചതുരം' : '1 Square'}</span>
                <span className="font-mono">SQ</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-100 text-amber-950">
                <span>• {language === 'ml' ? '1 സാമാന്തരികം (Parallelogram)' : '1 Parallelogram'}</span>
                <span className="font-mono">PG</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed mt-2">
              {language === 'ml'
                ? 'ടാൻഗ്രാം ചൈനയിൽ ഉത്ഭവിച്ച ഒരു പരമ്പരാഗത ജ്യാമിതീയ കടങ്കഥയാണ്. ഏഴ് കഷ്ണങ്ങൾ കൊണ്ടും ആയിരക്കണക്കിന് രൂപങ്ങൾ ഉണ്ടാക്കാം!'
                : 'Tangram is an ancient geometric puzzle with 7 pieces that can form thousands of creative figures!'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
