import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { playClickSound, playCorrectSound } from '../../services/soundService';
import { Play, Pause, RotateCcw, Info, Sparkles, Orbit } from 'lucide-react';

interface PlanetData {
  id: string;
  nameEn: string;
  nameMl: string;
  order: number;
  orbitRadius: number; // visual pixels
  size: number;        // visual diameter
  color: string;
  orbitDuration: number; // seconds
  hasRings?: boolean;
  hasMoon?: boolean;
  factsEn: string[];
  factsMl: string[];
}

const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    nameEn: 'Mercury',
    nameMl: 'ബുധൻ',
    order: 1,
    orbitRadius: 48,
    size: 10,
    color: '#94A3B8',
    orbitDuration: 6,
    factsEn: ['Closest planet to the Sun', 'Smallest planet in the solar system', 'No atmosphere or moons'],
    factsMl: ['സൂര്യനോട് ഏറ്റവും അടുത്ത ഗ്രഹം', 'സൗരയൂഥത്തിലെ ഏറ്റവും ചെറിയ ഗ്രഹം', 'ഉപഗ്രഹങ്ങളോ അന്തരീക്ഷമോ ഇല്ല']
  },
  {
    id: 'venus',
    nameEn: 'Venus',
    nameMl: 'ശുക്രൻ',
    order: 2,
    orbitRadius: 76,
    size: 14,
    color: '#F59E0B',
    orbitDuration: 10,
    factsEn: ['Hottest planet in solar system', 'Known as Morning & Evening Star', 'Rotates in opposite direction'],
    factsMl: ['ഏറ്റവും ചൂടേറിയ ഗ്രഹം', 'പ്രഭാത നക്ഷത്രം, സന്ധ്യാ നക്ഷത്രം എന്ന് അറിയപ്പെടുന്നു', 'കിഴക്ക് നിന്ന് പടിഞ്ഞാറോട്ട് ഭ്രമണം ചെയ്യുന്നു']
  },
  {
    id: 'earth',
    nameEn: 'Earth',
    nameMl: 'ഭൂമി',
    order: 3,
    orbitRadius: 108,
    size: 16,
    color: '#3B82F6',
    orbitDuration: 15,
    hasMoon: true,
    factsEn: ['Our home planet, rich with life & water', 'Has 1 natural satellite: The Moon', '1 revolution takes 365¼ days'],
    factsMl: ['ജീവൻ നിലനിൽക്കുന്ന ഒരേയൊരു ഗ്രഹം', 'ചന്ദ്രൻ ഭൂമിയുടെ ഏക സ്വാഭാവിക ഉപഗ്രഹമാണ്', 'സൂര്യനെ ചുറ്റാൻ 365¼ ദിവസം വേണം']
  },
  {
    id: 'mars',
    nameEn: 'Mars',
    nameMl: 'ചൊവ്വ',
    order: 4,
    orbitRadius: 140,
    size: 12,
    color: '#EF4444',
    orbitDuration: 22,
    factsEn: ['Known as the Red Planet due to iron oxide', 'Has two small moons: Phobos & Deimos', 'Target of robotic rover explorations'],
    factsMl: ['ചുവന്ന ഗ്രഹം എന്ന് അറിയപ്പെടുന്നു', 'ഫോബോസ്, ഡീമോസ് എന്നിങ്ങനെ രണ്ട് ഉപഗ്രഹങ്ങൾ', 'ഇന്ത്യയുടെ മംഗൾയാൻ പര്യവേക്ഷണം നടത്തി']
  },
  {
    id: 'jupiter',
    nameEn: 'Jupiter',
    nameMl: 'വ്യാഴം',
    order: 5,
    orbitRadius: 180,
    size: 26,
    color: '#D97706',
    orbitDuration: 32,
    factsEn: ['Largest planet in the solar system', 'Gas giant with Great Red Spot storm', 'Has more than 90 moons'],
    factsMl: ['സൗരയൂഥത്തിലെ ഏറ്റവും വലിയ ഗ്രഹം', 'വാതകഭീമൻ; വലിയ ചുവന്ന പൊട്ടുണ്ട്', '90-ലധികം ഉപഗ്രഹങ്ങളുണ്ട്']
  },
  {
    id: 'saturn',
    nameEn: 'Saturn',
    nameMl: 'ശനി',
    order: 6,
    orbitRadius: 224,
    size: 22,
    color: '#FCD34D',
    orbitDuration: 42,
    hasRings: true,
    factsEn: ['Famous for its spectacular ice rings', 'Second largest planet in solar system', 'Less dense than liquid water!'],
    factsMl: ['മനോഹരമായ വളയങ്ങളുള്ള ഗ്രഹം', 'സൗരയൂഥത്തിലെ രണ്ടാമത്തെ വലിയ ഗ്രഹം', 'ജലത്തേക്കാൾ സാന്ദ്രത കുറവാണ്']
  },
  {
    id: 'uranus',
    nameEn: 'Uranus',
    nameMl: 'യുറാനസ്',
    order: 7,
    orbitRadius: 265,
    size: 18,
    color: '#06B6D4',
    orbitDuration: 55,
    factsEn: ['Ice giant with pale blue-cyan color', 'Rotates on its side like a rolling ball', 'Extremely cold atmosphere'],
    factsMl: ['തണുത്തുറഞ്ഞ ഹിമഭീമൻ ഗ്രഹം', 'ഒരു വശത്തേക്ക് ചരിഞ്ഞ് ഭ്രമണം ചെയ്യുന്നു', 'മീഥേൻ വാതകം കാരണം ഇളം നീലനിറം']
  },
  {
    id: 'neptune',
    nameEn: 'Neptune',
    nameMl: 'നെപ്റ്റ്യൂൺ',
    order: 8,
    orbitRadius: 300,
    size: 18,
    color: '#2563EB',
    orbitDuration: 70,
    factsEn: ['Farthest known major planet from the Sun', 'Deep blue color with supersonic winds', 'Takes 165 Earth years for 1 revolution'],
    factsMl: ['സൂര്യനിൽ നിന്ന് ഏറ്റവും അകലെയുള്ള ഗ്രഹം', 'അതിവേഗ കാറ്റുകളുള്ള കടുംനീല ഗ്രഹം', 'സൂര്യനെ ഒരു തവണ ചുറ്റാൻ 165 വർഷം വേണം']
  }
];

export const SolarSystemSimulator: React.FC = () => {
  const { language } = useLanguage();

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANETS[2]); // Default Earth

  const handleTogglePlay = () => {
    playClickSound();
    setIsPlaying(!isPlaying);
  };

  const handleSelectPlanet = (p: PlanetData) => {
    playClickSound();
    setSelectedPlanet(p);
  };

  const handleSpeedChange = (mult: number) => {
    playClickSound();
    setSpeedMultiplier(mult);
  };

  return (
    <div className="bg-vaayana-darkSurface border border-vaayana-darkBorder rounded-3xl p-6 sm:p-8 space-y-6 shadow-darkCard">
      
      {/* Activity Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
            EVS • Chapter 2 Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-2 font-malayalam">
            {language === 'ml' ? 'സൗരയൂഥ സിമുലേറ്റർ (Solar System Simulator)' : 'Interactive Solar System Simulator'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted">
            {language === 'ml' 
              ? 'സൂര്യനും എട്ട് ഗ്രഹങ്ങളും അവയുടെ പരിക്രമണ പാതകളും നിരീക്ഷിക്കുക.' 
              : 'Observe the Sun and all 8 planets revolving in their orbits.'}
          </p>
        </div>

        {/* Not-to-scale disclaimer badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vaayana-darkElevated border border-vaayana-darkBorder text-[11px] text-amber-400 font-bold">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ml' ? 'മാതൃകാ ദൃശ്യം (യഥാർത്ഥ അളവിലല്ല)' : 'Illustrative model — Not to scale'}</span>
        </div>
      </div>

      {/* Main Simulation Viewport (Canvas / SVG Stage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Solar System Animated Orrery Stage (7 Cols) */}
        <div className="lg:col-span-7 bg-[#080D0A] rounded-3xl p-4 sm:p-6 border border-vaayana-darkBorder shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[460px]">
          
          {/* Subtle star background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* SVG Orrery Viewport */}
          <svg
            width="640"
            height="640"
            viewBox="-320 -320 640 640"
            className="w-full h-auto max-w-[580px] max-h-[580px] overflow-visible relative z-10"
          >
            {/* THE SUN (Centre) */}
            <circle cx="0" cy="0" r="28" fill="#F59E0B" className="drop-shadow-[0_0_20px_#F59E0B]" />
            <circle cx="0" cy="0" r="32" fill="#FBBF24" opacity="0.4" className="animate-pulse" />
            <text x="0" y="4" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="900">
              SUN
            </text>

            {/* 8 PLANETARY ORBITS & PLANETS */}
            {PLANETS.map((planet) => {
              const isSelected = selectedPlanet.id === planet.id;
              const duration = planet.orbitDuration / speedMultiplier;

              return (
                <g key={planet.id}>
                  {/* Orbit Track Line */}
                  <circle
                    cx="0"
                    cy="0"
                    r={planet.orbitRadius}
                    fill="none"
                    stroke={isSelected ? '#9ACD32' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={isSelected ? '2' : '1'}
                    strokeDasharray={isSelected ? '4 4' : undefined}
                  />

                  {/* Revolving Orbit Pivot Group */}
                  <g
                    style={{
                      transformOrigin: '0px 0px',
                      animation: isPlaying ? `spin ${duration}s linear infinite` : 'none'
                    }}
                  >
                    {/* Planet Body positioned at (orbitRadius, 0) */}
                    <g 
                      transform={`translate(${planet.orbitRadius}, 0)`}
                      className="cursor-pointer"
                      onClick={() => handleSelectPlanet(planet)}
                    >
                      {/* Selection Glow Indicator */}
                      {isSelected && (
                        <circle cx="0" cy="0" r={planet.size + 6} fill="none" stroke="#9ACD32" strokeWidth="2" strokeDasharray="3 3" />
                      )}

                      {/* Saturn's Rings */}
                      {planet.hasRings && (
                        <ellipse cx="0" cy="0" rx={planet.size * 1.7} ry={planet.size * 0.5} fill="none" stroke="#FDE68A" strokeWidth="3" opacity="0.8" transform="rotate(-20)" />
                      )}

                      {/* Planet Circle */}
                      <circle cx="0" cy="0" r={planet.size / 2} fill={planet.color} className="drop-shadow-sm" />

                      {/* Earth's Orbiting Moon */}
                      {planet.hasMoon && (
                        <g style={{ transformOrigin: '0px 0px', animation: isPlaying ? 'spin 3s linear infinite' : 'none' }}>
                          <circle cx="16" cy="0" r="3" fill="#E2E8F0" />
                        </g>
                      )}

                      {/* Planet Name Label */}
                      <text
                        x="0"
                        y={planet.size / 2 + 12}
                        textAnchor="middle"
                        fill={isSelected ? '#9ACD32' : '#E2E8F0'}
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {language === 'ml' ? planet.nameMl : planet.nameEn}
                      </text>
                    </g>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Quick Play/Pause & Speed Overlay Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 bg-vaayana-dark/85 backdrop-blur-md p-3 rounded-2xl border border-vaayana-darkBorder z-20">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-vaayana-lime text-vaayana-dark font-black text-xs shadow-limeGlow active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-vaayana-dark" /> : <Play className="w-4 h-4 fill-vaayana-dark" />}
                <span>{isPlaying ? (language === 'ml' ? 'നിർത്തുക' : 'Pause') : (language === 'ml' ? 'തുടങ്ങുക' : 'Resume')}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-vaayana-textLight">
              <span className="text-vaayana-textLightMuted text-[11px]">Speed:</span>
              {[0.5, 1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    speedMultiplier === spd
                      ? 'bg-vaayana-lime text-vaayana-dark shadow-xs'
                      : 'bg-vaayana-darkElevated text-vaayana-textLightMuted hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Selected Planet Inspector Card & Order Strip (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Selected Planet Details Card */}
          <div className="p-6 rounded-3xl bg-vaayana-darkElevated border border-vaayana-darkBorder shadow-darkCard space-y-4">
            <div className="flex items-center justify-between border-b border-vaayana-darkBorder pb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md"
                  style={{ backgroundColor: selectedPlanet.color }}
                >
                  {selectedPlanet.order}
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-lime">
                    {language === 'ml' ? `ഗ്രഹം ${selectedPlanet.order} (Planet ${selectedPlanet.order})` : `Planet #${selectedPlanet.order}`}
                  </span>
                  <h4 className="text-2xl font-black text-white font-malayalam">
                    {language === 'ml' ? selectedPlanet.nameMl : selectedPlanet.nameEn}
                  </h4>
                </div>
              </div>
            </div>

            {/* Facts bullet list */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-vaayana-textLightMuted">
                {language === 'ml' ? 'പ്രധാന വസ്തുതകൾ:' : 'Key Scientific Facts:'}
              </span>
              <ul className="space-y-2 text-xs text-vaayana-textLight font-medium font-malayalam">
                {(language === 'ml' ? selectedPlanet.factsMl : selectedPlanet.factsEn).map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-vaayana-darkSurface p-2.5 rounded-xl border border-vaayana-darkBorder">
                    <span className="text-vaayana-lime font-black">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Earth & Moon note */}
            {selectedPlanet.id === 'earth' && (
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-[11px] text-blue-200">
                {language === 'ml'
                  ? 'ചന്ദ്രൻ ഭൂമിയെ ചുറ്റുന്ന സ്വാഭാവിക ഉപഗ്രഹമാണ് (Natural Satellite).'
                  : 'The Moon is Earth’s only natural satellite, orbiting Earth as Earth orbits the Sun.'}
              </div>
            )}
          </div>

          {/* Quick Select Strip: All 8 Planets in Order */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-vaayana-textLightMuted">
              {language === 'ml' ? 'സൂര്യനിൽ നിന്നുള്ള ക്രമം (1 മുതൽ 8 വരെ):' : 'Planets in Correct Order from Sun (1–8):'}
            </span>
            <div className="grid grid-cols-4 gap-2">
              {PLANETS.map((p) => {
                const isSelected = p.id === selectedPlanet.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPlanet(p)}
                    className={`p-2.5 rounded-xl text-center border transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-vaayana-lime text-vaayana-dark border-vaayana-lime font-black shadow-limeGlow'
                        : 'bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight border-vaayana-darkBorder font-bold text-xs'
                    }`}
                  >
                    <div className="text-[10px] opacity-75">#{p.order}</div>
                    <div className="text-xs truncate font-malayalam">{language === 'ml' ? p.nameMl : p.nameEn}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

