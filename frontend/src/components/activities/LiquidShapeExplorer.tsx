import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playCorrectSound } from '../../services/soundService';
import { RotateCcw, Droplets, ArrowRightLeft, Sparkles, CheckCircle2, Info } from 'lucide-react';

interface ContainerSpec {
  id: string;
  nameEn: string;
  nameMl: string;
  iconName: string;
  width: number;
  height: number;
  liquidPath: string; // SVG path for water inside
  glassPath: string;  // SVG path for glass outline
  waterHeightPct: number; // visual fill height for fixed 250ml
  descriptionEn: string;
  descriptionMl: string;
}

const CONTAINERS: ContainerSpec[] = [
  {
    id: 'measuring_cylinder',
    nameEn: 'Tall Measuring Cylinder',
    nameMl: 'നീളമുള്ള സിലിണ്ടർ',
    iconName: 'cylinder',
    width: 90,
    height: 220,
    glassPath: 'M25 20 L25 200 C25 208 65 208 65 200 L65 20',
    liquidPath: 'M26 80 L26 198 C26 206 64 206 64 198 L64 80 Z',
    waterHeightPct: 75,
    descriptionEn: 'Narrow & tall: Water rises high, showing liquid takes cylindrical shape.',
    descriptionMl: 'ഇടുങ്ങിയതും ഉയരമുള്ളതുമായ പാത്രം: വെള്ളം ഉയർന്നു നിൽക്കുന്നു.'
  },
  {
    id: 'conical_flask',
    nameEn: 'Conical Science Flask',
    nameMl: 'കോണിക്കൽ ഫ്ലാസ്ക്',
    iconName: 'flask',
    width: 150,
    height: 200,
    glassPath: 'M60 20 L60 60 L15 180 C10 195 140 195 135 180 L90 60 L90 20',
    liquidPath: 'M32 135 L18 178 C14 193 136 193 132 178 L118 135 Z',
    waterHeightPct: 45,
    descriptionEn: 'Wide bottom: Water spreads out wide at the base.',
    descriptionMl: 'വീതിയുള്ള അടിഭാഗം: വെള്ളം താഴേക്ക് പരന്നു നിൽക്കുന്നു.'
  },
  {
    id: 'wide_bowl',
    nameEn: 'Wide Flat Bowl (ഉരുളി)',
    nameMl: 'പരന്ന ഉരുളി / പാത്രം',
    iconName: 'bowl',
    width: 200,
    height: 140,
    glassPath: 'M10 40 C15 130 185 130 190 40',
    liquidPath: 'M16 65 C22 124 178 124 184 65 Z',
    waterHeightPct: 25,
    descriptionEn: 'Shallow & wide: Water spreads flat, water level looks low.',
    descriptionMl: 'പരന്ന പാത്രം: വെള്ളം പരന്നു കിടക്കുന്നതിനാൽ ജലനിരപ്പ് കുറവായി തോന്നുന്നു.'
  },
  {
    id: 'spouted_pot',
    nameEn: 'Traditional Kerala Spouted Vessel (കിണ്ടി)',
    nameMl: 'പരമ്പരാഗത കിണ്ടി',
    iconName: 'kindi',
    width: 170,
    height: 190,
    glassPath: 'M55 25 L55 50 C30 70 30 150 55 170 L115 170 C140 150 140 70 115 50 L115 25 M32 110 L10 80',
    liquidPath: 'M40 95 C30 120 30 150 55 168 L115 168 C140 150 140 120 130 95 Z M32 110 L16 88',
    waterHeightPct: 55,
    descriptionEn: 'Curved pot with spout: Water matches rounded contours and fills spout.',
    descriptionMl: 'വളഞ്ഞ പാത്രം: വെള്ളം കിണ്ടിയുടെ ആകൃതി പൂർണ്ണമായി സ്വീകരിക്കുന്നു.'
  },
  {
    id: 'tumbler',
    nameEn: 'Glass Tumbler',
    nameMl: 'സാധാരണ ഗ്ലാസ്സ്',
    iconName: 'glass',
    width: 110,
    height: 180,
    glassPath: 'M20 20 L28 165 C30 172 80 172 82 165 L90 20',
    liquidPath: 'M23 75 L28 164 C30 170 80 170 82 164 L87 75 Z',
    waterHeightPct: 60,
    descriptionEn: 'Standard glass: Classic everyday liquid shape.',
    descriptionMl: 'ദൈനംദിന ഗ്ലാസ്സ്: സാധാരണ ഗ്ലാസ്സിന്റെ ആകൃതി.'
  }
];

export const LiquidShapeExplorer: React.FC = () => {
  const { language } = useLanguage();

  const [activeContainerIndex, setActiveContainerIndex] = useState<number>(0);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [hasExploredAll, setHasExploredAll] = useState<boolean>(false);
  const [visitedIndices, setVisitedIndices] = useState<Set<number>>(new Set([0]));

  const currentContainer = CONTAINERS[activeContainerIndex];

  const handleSwitchContainer = (index: number) => {
    if (index === activeContainerIndex || isPouring) return;
    playClickSound();
    setIsPouring(true);

    setTimeout(() => {
      setActiveContainerIndex(index);
      setIsPouring(false);
      playCorrectSound();

      const nextVisited = new Set(visitedIndices).add(index);
      setVisitedIndices(nextVisited);
      if (nextVisited.size === CONTAINERS.length) {
        setHasExploredAll(true);
      }
    }, 600);
  };

  const handleReset = () => {
    playClickSound();
    setActiveContainerIndex(0);
    setVisitedIndices(new Set([0]));
    setHasExploredAll(false);
  };

  return (
    <div className="bg-vaayana-soft rounded-3xl p-6 sm:p-8 border border-vaayana-softBorder shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
            EVS • Chapter 1 Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textDark mt-2 font-malayalam">
            {language === 'ml' ? 'ദ്രാവകങ്ങൾ പാത്രത്തിന്റെ ആകൃതി സ്വീകരിക്കുന്നു' : 'Liquids Take the Shape of Containers'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textDarkMuted">
            {language === 'ml' 
              ? '250 മില്ലിലിറ്റർ വെള്ളം വിവിധ പാത്രങ്ങളിലേക്ക് ഒഴിച്ച് ആകൃതി മാറുന്നത് നിരീക്ഷിക്കുക.' 
              : 'Pour exactly 250 ml of water into differently shaped containers and observe shape adaptation.'}
          </p>
        </div>

        {/* Volume badge (constant volume rule) */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-mono font-black text-sm shadow-md flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-200 animate-pulse" />
            <span>250 ml (മാറ്റമില്ല / Fixed)</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-vaayana-dark border border-vaayana-softBorder shadow-sm"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Pouring & Vessel Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Animated Vessel SVG Graphic (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-vaayana-softBorder shadow-inner flex flex-col items-center justify-center relative min-h-[340px]">
          
          {/* Constant Volume Highlight Indicator */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{language === 'ml' ? 'ജലത്തിന്റെ അളവ്: കൃത്യം 250 ml' : 'Water Volume: Constant 250 ml'}</span>
          </div>

          {/* Pouring Stream Animation Overlay */}
          <AnimatePresence>
            {isPouring && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-8 w-4 h-40 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg z-20"
              />
            )}
          </AnimatePresence>

          {/* Container SVG */}
          <motion.div
            key={currentContainer.id}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: isPouring ? 0.97 : 1, opacity: isPouring ? 0.7 : 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            <svg
              width={currentContainer.width + 40}
              height={currentContainer.height + 40}
              viewBox={`0 0 ${currentContainer.width} ${currentContainer.height}`}
              className="overflow-visible"
            >
              {/* Liquid Wave and Fill */}
              <motion.path
                d={currentContainer.liquidPath}
                fill="url(#waterGradient)"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />

              {/* Water surface glisten */}
              <motion.ellipse
                cx={currentContainer.width / 2}
                cy={currentContainer.height * (1 - currentContainer.waterHeightPct / 100)}
                rx={currentContainer.width * 0.32}
                ry="6"
                fill="#60A5FA"
                opacity="0.8"
                animate={{ ry: [5, 7, 5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Transparent Glass Vessel Contour */}
              <path
                d={currentContainer.glassPath}
                fill="none"
                stroke="#1E293B"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />

              {/* Glass Reflection Highlight */}
              <path
                d={currentContainer.glassPath}
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2"
                strokeDasharray="15 30"
              />

              {/* Gradient Defs */}
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Current Container Label */}
          <div className="mt-4 text-center space-y-1">
            <h4 className="text-xl font-black text-vaayana-textDark font-malayalam">
              {language === 'ml' ? currentContainer.nameMl : currentContainer.nameEn}
            </h4>
            <p className="text-xs text-vaayana-textDarkMuted max-w-sm">
              {language === 'ml' ? currentContainer.descriptionMl : currentContainer.descriptionEn}
            </p>
          </div>
        </div>

        {/* Right: Container Selector & Concept Explanations (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-vaayana-textDarkMuted">
              {language === 'ml' ? 'വെള്ളം പകരാൻ മറ്റൊരു പാത്രം തിരഞ്ഞെടുക്കൂ:' : 'Select Container to Transfer Water:'}
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {CONTAINERS.map((c, idx) => {
                const isActive = idx === activeContainerIndex;
                const isVisited = visitedIndices.has(idx);

                return (
                  <button
                    key={c.id}
                    onClick={() => handleSwitchContainer(idx)}
                    disabled={isPouring}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all active:scale-98 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                        : isVisited
                        ? 'bg-white hover:bg-slate-50 text-vaayana-textDark border-blue-200'
                        : 'bg-white/80 hover:bg-white text-vaayana-textDark border-vaayana-softBorder'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isActive ? 'bg-white text-blue-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-black font-malayalam">
                          {language === 'ml' ? c.nameMl : c.nameEn}
                        </div>
                        <div className={`text-[11px] ${isActive ? 'text-blue-100' : 'text-vaayana-textDarkMuted'}`}>
                          {language === 'ml' ? `ജലനിരപ്പ്: ${c.waterHeightPct}%` : `Liquid level: ${c.waterHeightPct}%`}
                        </div>
                      </div>
                    </div>

                    <ArrowRightLeft className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Scientific Principle Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wide">
              <Info className="w-4 h-4 text-amber-600" />
              <span>{language === 'ml' ? 'പ്രധാന തത്വം (Key Scientific Rule)' : 'Key Scientific Rule'}</span>
            </div>
            <p className="text-xs text-amber-950 font-medium leading-relaxed font-malayalam">
              {language === 'ml'
                ? 'ദ്രാവകങ്ങൾക്ക് സ്വന്തമായി ആകൃതിയില്ല. അവ ഏത് പാത്രത്തിലാണോ ഒഴിക്കുന്നത്, ആ പാത്രത്തിന്റെ ആകൃതി സ്വീകരിക്കുന്നു. എന്നാൽ ജലത്തിന്റെ അളവിൽ (വ്യാപ്തിയിൽ) യാതൊരു മാറ്റവും ഉണ്ടാകുന്നില്ല!'
                : 'Liquids do not have a definite shape. They adopt the shape of their container. Crucially, the quantity (volume) remains exactly the same when transferred!'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

