import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { playClickSound, playCorrectSound } from '../../services/soundService';
import { Play, Pause, RotateCcw, Sun, Moon, Sparkles, Orbit, Clock, Calendar } from 'lucide-react';

export const RotationRevolutionSimulator: React.FC = () => {
  const { language } = useLanguage();

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [focusMode, setFocusMode] = useState<'both' | 'rotation' | 'revolution'>('both');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [revolutionAngle, setRevolutionAngle] = useState<number>(0);

  const handleTogglePlay = () => {
    playClickSound();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    playClickSound();
    setRotationAngle(0);
    setRevolutionAngle(0);
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
            {language === 'ml' ? 'ഭ്രമണവും പരിക്രമണവും (Rotation & Revolution)' : 'Rotation and Revolution Simulator'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted">
            {language === 'ml' 
              ? 'ഭൂമിയുടെ അച്ചുതണ്ടിലെ ഭ്രമണവും (24 മണിക്കൂർ) സൂര്യന് ചുറ്റുമുള്ള പരിക്രമണവും (365¼ ദിവസം) നിരീക്ഷിക്കുക.' 
              : 'Observe Earth rotating on its tilted axis (Day & Night) and revolving around the Sun (1 Year).'}
          </p>
        </div>

        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-vaayana-lime text-vaayana-dark font-black text-xs sm:text-sm shadow-limeGlow active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-vaayana-dark" /> : <Play className="w-4 h-4 fill-vaayana-dark" />}
            <span>{isPlaying ? (language === 'ml' ? 'നിർത്തുക' : 'Pause') : (language === 'ml' ? 'തുടങ്ങുക' : 'Resume')}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight border border-vaayana-darkBorder shadow-sm transition-all"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Dual Stage Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive Visual Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-[#070C09] rounded-3xl p-6 border border-vaayana-darkBorder shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
          
          {/* Sunlight beams streaming from left to right */}
          <div className="absolute top-0 bottom-0 left-0 w-44 bg-gradient-to-r from-amber-500/20 via-amber-400/5 to-transparent pointer-events-none" />

          {/* SIMULATION VISUAL SVG */}
          <svg
            width="500"
            height="340"
            viewBox="0 0 500 340"
            className="w-full h-auto overflow-visible relative z-10"
          >
            {/* SUN (Left Anchor) */}
            <g transform="translate(60, 170)">
              <circle cx="0" cy="0" r="45" fill="#F59E0B" className="drop-shadow-[0_0_35px_#F59E0B]" />
              <circle cx="0" cy="0" r="52" fill="#FBBF24" opacity="0.4" className="animate-pulse" />
              <text x="0" y="5" textAnchor="middle" fill="#78350F" fontSize="12" fontWeight="900">
                SUN (സൂര്യൻ)
              </text>
            </g>

            {/* Elliptical Revolution Orbit Track */}
            <ellipse
              cx="250"
              cy="170"
              rx="180"
              ry="105"
              fill="none"
              stroke="rgba(154, 205, 50, 0.35)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Earth Position along the Revolution Orbit */}
            <g
              style={{
                transformOrigin: '250px 170px',
                animation: isPlaying && focusMode !== 'rotation' ? 'spin 24s linear infinite' : 'none'
              }}
            >
              <g transform="translate(430, 170)">
                
                {/* 23.5 Degree Tilted Axis Line */}
                <g transform="rotate(-23.5)">
                  <line x1="0" y1="-50" x2="0" y2="50" stroke="#9ACD32" strokeWidth="2.5" strokeDasharray="3 3" />
                  <text x="0" y="-55" textAnchor="middle" fill="#9ACD32" fontSize="9" fontWeight="bold">
                    North (23.5° Tilt)
                  </text>
                  <text x="0" y="62" textAnchor="middle" fill="#9ACD32" fontSize="9" fontWeight="bold">
                    South
                  </text>

                  {/* Earth Sphere with Day / Night Hemisphere Lighting */}
                  <g
                    style={{
                      transformOrigin: '0px 0px',
                      animation: isPlaying && focusMode !== 'revolution' ? 'spin 4s linear infinite' : 'none'
                    }}
                  >
                    {/* Dark / Night Hemisphere (Facing away from Sun) */}
                    <path
                      d="M 0 -36 A 36 36 0 0 1 0 36 Z"
                      fill="#0F172A"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />

                    {/* Illuminated / Day Hemisphere (Facing Sun) */}
                    <path
                      d="M 0 -36 A 36 36 0 0 0 0 36 Z"
                      fill="#38BDF8"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />

                    {/* Continents & Equator */}
                    <line x1="-36" y1="0" x2="36" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <circle cx="-12" cy="-10" r="7" fill="#22C55E" opacity="0.8" />
                    <circle cx="14" cy="12" r="8" fill="#15803D" opacity="0.8" />
                  </g>
                </g>

                {/* Day / Night Text Labels under Earth */}
                <text x="-25" y="45" textAnchor="middle" fill="#FBBF24" fontSize="10" fontWeight="bold">
                  ☀️ DAY (പകൽ)
                </text>
                <text x="25" y="45" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold">
                  🌙 NIGHT (രാത്രി)
                </text>
              </g>
            </g>
          </svg>

          {/* Mode Switcher Strip */}
          <div className="flex gap-2 mt-2 z-20">
            <button
              onClick={() => { playClickSound(); setFocusMode('both'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                focusMode === 'both' ? 'bg-vaayana-lime text-vaayana-dark shadow-sm' : 'bg-vaayana-darkElevated text-vaayana-textLightMuted'
              }`}
            >
              {language === 'ml' ? 'രണ്ടും ഒരുമിച്ച് (Both)' : 'Both Motions'}
            </button>
            <button
              onClick={() => { playClickSound(); setFocusMode('rotation'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                focusMode === 'rotation' ? 'bg-vaayana-lime text-vaayana-dark shadow-sm' : 'bg-vaayana-darkElevated text-vaayana-textLightMuted'
              }`}
            >
              {language === 'ml' ? 'ഭ്രമണം മാത്രം (Rotation Only)' : 'Rotation Only (24h)'}
            </button>
            <button
              onClick={() => { playClickSound(); setFocusMode('revolution'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                focusMode === 'revolution' ? 'bg-vaayana-lime text-vaayana-dark shadow-sm' : 'bg-vaayana-darkElevated text-vaayana-textLightMuted'
              }`}
            >
              {language === 'ml' ? 'പരിക്രമണം മാത്രം (Revolution Only)' : 'Revolution Only (1 Year)'}
            </button>
          </div>

        </div>

        {/* Right: Comparative Breakdown: Rotation vs Revolution (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Rotation Breakdown */}
          <div className="p-5 rounded-3xl bg-vaayana-darkElevated border-2 border-sky-500/40 shadow-darkCard space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </span>
                <h4 className="text-base font-black text-white font-malayalam">
                  {language === 'ml' ? 'ഭ്രമണം (Rotation)' : 'Earth Rotation'}
                </h4>
              </div>
              <span className="text-xs font-black text-sky-400 bg-sky-950 px-2.5 py-1 rounded-full border border-sky-800">
                24 Hours = 1 Day
              </span>
            </div>

            <p className="text-xs text-vaayana-textLight font-medium leading-relaxed font-malayalam">
              {language === 'ml'
                ? 'ഭൂമി സ്വന്തം അച്ചുതണ്ടിൽ കറങ്ങുന്ന ചലനമാണ് ഭ്രമണം. ഒരു ഭ്രമണത്തിന് 24 മണിക്കൂർ (ഒരു ദിവസം) സമയം വേണം. ഭ്രമണം കാരണമാണ് ഭൂമിയിൽ രാപ്പകലുകൾ മാറിമാറി ഉണ്ടാകുന്നത്.'
                : 'Earth rotates on its own tilted axis once every 24 hours (1 day). Rotation causes the cycle of Day and Night as each side faces and turns away from the Sun.'}
            </p>
          </div>

          {/* Card 2: Revolution Breakdown */}
          <div className="p-5 rounded-3xl bg-vaayana-darkElevated border-2 border-vaayana-lime/40 shadow-darkCard space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-vaayana-lime/20 text-vaayana-lime flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </span>
                <h4 className="text-base font-black text-white font-malayalam">
                  {language === 'ml' ? 'പരിക്രമണം (Revolution)' : 'Earth Revolution'}
                </h4>
              </div>
              <span className="text-xs font-black text-vaayana-lime bg-vaayana-darkSurface px-2.5 py-1 rounded-full border border-vaayana-lime/40">
                365¼ Days = 1 Year
              </span>
            </div>

            <p className="text-xs text-vaayana-textLight font-medium leading-relaxed font-malayalam">
              {language === 'ml'
                ? 'ഭൂമി നിശ്ചിത പാതയിലൂടെ സൂര്യന് ചുറ്റും കറങ്ങുന്ന ചലനമാണ് പരിക്രമണം. ഒരു പൂർണ്ണ പരിക്രമണത്തിന് 365¼ ദിവസം (ഒരു വർഷം) വേണം.'
                : 'Earth revolves around the Sun along its fixed elliptical orbit. One full revolution takes approximately 365¼ days (one year).'}
            </p>
          </div>

          {/* Distinction Callout */}
          <div className="p-4 rounded-2xl bg-vaayana-darkSurface border border-vaayana-darkBorder text-[11px] text-amber-300 font-medium font-malayalam">
            {language === 'ml'
              ? 'ഓർക്കുക: സ്വന്തം അച്ചുതണ്ടിൽ കറങ്ങുന്നത് ഭ്രമണം (രാപ്പകൽ). സൂര്യന് ചുറ്റും വലംവെക്കുന്നത് പരിക്രമണം (വർഷം).'
              : 'Remember: Spinning on its own axis = Rotation (Day/Night). Traveling around the Sun = Revolution (1 Year).'}
          </div>

        </div>

      </div>

    </div>
  );
};

