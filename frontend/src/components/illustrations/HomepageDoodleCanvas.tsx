import React from 'react';

/**
 * HomepageDoodleCanvas
 * 
 * Beautiful, transparent, colorful 2D educational doodles framing the VAAYANA homepage.
 * Strictly positioned in page margins, outer corner whitespace, and side flanks.
 * Positioned in background z-0 layer so they NEVER overlap cards, headings, or text.
 */
export const HomepageDoodleCanvas: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden w-full h-full" 
      aria-hidden="true"
    >
      {/* =====================================================================
          ZONE 1: HERO SECTION FLANKS & PERIMETER MARGINS
         ===================================================================== */}

      {/* Top-Left Outer: Paper Airplane with Breeze Dash Trail */}
      <div className="absolute top-6 left-4 sm:left-8 lg:left-14">
        <svg width="84" height="60" viewBox="0 0 100 70" fill="none" className="opacity-30">
          <path 
            d="M6 56 C 20 68, 36 46, 56 42" 
            stroke="#65C7F7" 
            strokeWidth="1.8" 
            strokeDasharray="4 4" 
            strokeLinecap="round" 
          />
          <polygon 
            points="58,40 94,18 82,52 72,43" 
            fill="#65C7F7" 
            fillOpacity="0.18" 
            stroke="#65C7F7" 
            strokeWidth="2" 
            strokeLinejoin="round" 
          />
          <line x1="94" y1="18" x2="72" y2="43" stroke="#65C7F7" strokeWidth="2" strokeLinecap="round" />
          <polygon points="72,43 82,52 70,50" fill="#72D6B0" fillOpacity="0.3" stroke="#72D6B0" strokeWidth="1.6" />
        </svg>
      </div>

      {/* Top-Left Secondary: Fluffy Cloud & Crescent Moon */}
      <div className="absolute top-8 left-32 sm:left-44 lg:left-64 hidden md:block">
        <svg width="70" height="42" viewBox="0 0 90 52" fill="none" className="opacity-26">
          {/* Crescent Moon */}
          <path 
            d="M32 6 C 26 12 28 22 36 26 C 28 28 18 20 22 10 Z" 
            fill="#FFD166" 
            fillOpacity="0.4" 
            stroke="#FFD166" 
            strokeWidth="1.6" 
          />
          {/* Cloud */}
          <path 
            d="M20 40 C 12 40 8 32 14 26 C 13 18 22 13 30 17 C 36 9 50 9 56 16 C 64 11 75 15 75 23 C 83 25 84 35 76 40 Z" 
            fill="#D4BEE4" 
            fillOpacity="0.15" 
            stroke="#D4BEE4" 
            strokeWidth="1.8" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {/* Mid-Left Outer Flank: Stack of Books & Wooden Pencil */}
      <div className="absolute top-64 left-3 sm:left-6 lg:left-10 hidden lg:block">
        <svg width="75" height="75" viewBox="0 0 90 90" fill="none" className="opacity-28">
          {/* Bottom Book */}
          <rect x="15" y="55" width="55" height="15" rx="3" fill="#7950B8" fillOpacity="0.25" stroke="#A881E6" strokeWidth="1.8" />
          <line x1="20" y1="62" x2="65" y2="62" stroke="#EDE5F7" strokeWidth="1.4" opacity="0.6" />
          {/* Middle Book */}
          <rect x="20" y="40" width="50" height="14" rx="3" fill="#72D6B0" fillOpacity="0.22" stroke="#72D6B0" strokeWidth="1.8" />
          <line x1="25" y1="47" x2="65" y2="47" stroke="#72D6B0" strokeWidth="1.4" opacity="0.6" />
          {/* Top Book */}
          <rect x="25" y="27" width="44" height="13" rx="3" fill="#F497B6" fillOpacity="0.22" stroke="#F497B6" strokeWidth="1.8" />
          {/* Bookmark Ribbon */}
          <path d="M55 27 L55 38 L60 35 L65 38 L65 27" fill="#FFD166" fillOpacity="0.6" stroke="#FFD166" strokeWidth="1.2" />
          {/* Tilting Pencil */}
          <g transform="translate(68, 15) rotate(25)">
            <rect x="0" y="0" width="8" height="38" rx="2" fill="#FFD166" fillOpacity="0.3" stroke="#FFD166" strokeWidth="1.6" />
            <polygon points="0,0 8,0 4,-8" fill="#E8DDC8" stroke="#FFD166" strokeWidth="1.4" />
            <polygon points="2,-4 6,-4 4,-8" fill="#282136" />
          </g>
        </svg>
      </div>

      {/* Far-Left Flank (Hero Level): Math Symbols & Playful Dots */}
      <div className="absolute top-96 left-4 sm:left-8 hidden xl:block">
        <svg width="60" height="70" viewBox="0 0 70 80" fill="none" className="opacity-30">
          <text x="10" y="25" fill="#65C7F7" fontSize="22" fontWeight="bold" fontFamily="sans-serif">+</text>
          <text x="38" y="45" fill="#F497B6" fontSize="20" fontWeight="bold" fontFamily="sans-serif">×</text>
          <text x="14" y="68" fill="#FFD166" fontSize="18" fontWeight="bold" fontFamily="sans-serif">÷</text>
          <circle cx="50" cy="65" r="3" fill="#72D6B0" fillOpacity="0.5" />
          <path d="M48 15 Q 52 10 56 15 Q 60 20 48 20" stroke="#D4BEE4" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Top-Right Outer: Open Storybook with Page Lines */}
      <div className="absolute top-6 right-4 sm:right-8 lg:right-14">
        <svg width="80" height="60" viewBox="0 0 95 70" fill="none" className="opacity-30">
          <path d="M48 18 L48 60" stroke="#7950B8" strokeWidth="2.4" />
          {/* Left Page */}
          <path 
            d="M48 18 C36 12 22 12 10 16 L10 58 C22 54 36 54 48 60 Z" 
            fill="#563580" 
            fillOpacity="0.2" 
            stroke="#A881E6" 
            strokeWidth="1.8" 
          />
          {/* Right Page */}
          <path 
            d="M48 18 C60 12 74 12 86 16 L86 58 C74 54 60 54 48 60 Z" 
            fill="#563580" 
            fillOpacity="0.2" 
            stroke="#A881E6" 
            strokeWidth="1.8" 
          />
          {/* Page text lines */}
          <line x1="18" y1="28" x2="40" y2="30" stroke="#EDE5F7" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
          <line x1="18" y1="36" x2="38" y2="38" stroke="#EDE5F7" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
          <line x1="18" y1="44" x2="34" y2="46" stroke="#EDE5F7" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
          <line x1="56" y1="30" x2="78" y2="28" stroke="#EDE5F7" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
          <line x1="56" y1="38" x2="76" y2="36" stroke="#EDE5F7" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Top-Right Secondary: Spiral Notebook & 4-Point Sparkle */}
      <div className="absolute top-8 right-32 sm:right-44 lg:right-64 hidden md:block">
        <svg width="65" height="60" viewBox="0 0 80 75" fill="none" className="opacity-26">
          {/* Notebook Body */}
          <rect x="18" y="10" width="48" height="58" rx="4" fill="#65C7F7" fillOpacity="0.12" stroke="#65C7F7" strokeWidth="1.8" />
          {/* Spiral Bindings */}
          {[16, 26, 36, 46, 56].map((y) => (
            <g key={y}>
              <ellipse cx="18" cy={y} rx="5" ry="2.5" stroke="#FAF6EE" strokeWidth="1.4" opacity="0.6" />
              <circle cx="18" cy={y} r="1.5" fill="#09080F" />
            </g>
          ))}
          <line x1="30" y1="28" x2="56" y2="28" stroke="#FAF6EE" strokeWidth="1.4" opacity="0.4" />
          <line x1="30" y1="40" x2="52" y2="40" stroke="#FAF6EE" strokeWidth="1.4" opacity="0.4" />
          {/* Sparkle Star */}
          <path 
            d="M72 15 Q 72 23 80 23 Q 72 23 72 31 Q 72 23 64 23 Q 72 23 72 15 Z" 
            fill="#FFD166" 
            fillOpacity="0.6" 
          />
        </svg>
      </div>

      {/* Mid-Right Outer Flank: Ringed Celestial Planet & Tiny Rocket */}
      <div className="absolute top-64 right-3 sm:right-6 lg:right-10 hidden lg:block">
        <svg width="85" height="80" viewBox="0 0 100 95" fill="none" className="opacity-30">
          {/* Planet */}
          <circle cx="50" cy="45" r="20" fill="#65C7F7" fillOpacity="0.22" stroke="#65C7F7" strokeWidth="2" />
          {/* Orbit Ring */}
          <ellipse cx="50" cy="45" rx="38" ry="12" stroke="#FFD166" strokeWidth="2" transform="rotate(-20 50 45)" />
          {/* Planet crater marks */}
          <circle cx="44" cy="38" r="3" fill="#65C7F7" fillOpacity="0.5" />
          <circle cx="56" cy="48" r="2.2" fill="#65C7F7" fillOpacity="0.5" />
          {/* Tiny Flying Rocket */}
          <g transform="translate(68, 12) rotate(35)">
            <path d="M0 16 L0 6 Q0 0 5 0 Q10 0 10 6 L10 16 Z" fill="#F497B6" fillOpacity="0.3" stroke="#F497B6" strokeWidth="1.6" />
            <circle cx="5" cy="7" r="2" fill="#65C7F7" />
            <polygon points="-3,16 0,11 0,16" fill="#F497B6" stroke="#F497B6" strokeWidth="1.2" />
            <polygon points="13,16 10,11 10,16" fill="#F497B6" stroke="#F497B6" strokeWidth="1.2" />
            <path d="M2 16 L5 21 L8 16 Z" fill="#FFD166" fillOpacity="0.6" />
          </g>
        </svg>
      </div>

      {/* Far-Right Flank (Hero Level): Paintbrush, Paint Droplet & Star */}
      <div className="absolute top-96 right-4 sm:right-8 hidden xl:block">
        <svg width="65" height="75" viewBox="0 0 75 85" fill="none" className="opacity-28">
          {/* Paintbrush */}
          <g transform="translate(20, 10) rotate(-30)">
            <rect x="0" y="20" width="6" height="40" rx="2" fill="#D4BEE4" fillOpacity="0.3" stroke="#D4BEE4" strokeWidth="1.6" />
            <rect x="-1" y="14" width="8" height="6" fill="#A881E6" stroke="#A881E6" strokeWidth="1.2" />
            <path d="M-1 14 C -1 6 3 0 3 0 C 3 0 7 6 7 14 Z" fill="#72D6B0" fillOpacity="0.4" stroke="#72D6B0" strokeWidth="1.4" />
          </g>
          {/* Paint Splashes */}
          <circle cx="50" cy="55" r="4.5" fill="#72D6B0" fillOpacity="0.3" stroke="#72D6B0" strokeWidth="1.4" />
          <circle cx="62" cy="62" r="2.5" fill="#FFD166" fillOpacity="0.4" />
          <circle cx="56" cy="42" r="2" fill="#F497B6" fillOpacity="0.4" />
        </svg>
      </div>

      {/* =====================================================================
          ZONE 2: SUBJECT CURRICULUM DISCOVERY SECTION FLANKS (Y: ~750px - 1450px)
         ===================================================================== */}

      {/* Left Flank outside Mathematics Card: Isometric Dice & Geometric Shapes */}
      <div className="absolute top-[820px] left-3 sm:left-6 lg:left-10 hidden lg:block">
        <svg width="75" height="85" viewBox="0 0 85 95" fill="none" className="opacity-28">
          {/* Isometric Die */}
          <g transform="translate(15, 15)">
            <polygon points="25,0 48,13 25,26 2,13" fill="#B39DDB" fillOpacity="0.25" stroke="#A881E6" strokeWidth="1.8" />
            <polygon points="2,13 25,26 25,52 2,39" fill="#7E57C2" fillOpacity="0.25" stroke="#A881E6" strokeWidth="1.8" />
            <polygon points="25,26 48,13 48,39 25,52" fill="#5E35B1" fillOpacity="0.25" stroke="#A881E6" strokeWidth="1.8" />
            {/* Pips */}
            <circle cx="25" cy="13" r="2.2" fill="#FAF6EE" />
            <circle cx="12" cy="32" r="2" fill="#FAF6EE" />
            <circle cx="16" cy="42" r="2" fill="#FAF6EE" />
            <circle cx="36" cy="28" r="2" fill="#FAF6EE" />
            <circle cx="36" cy="42" r="2" fill="#FAF6EE" />
          </g>
          {/* Tangram Triangle */}
          <polygon points="55,60 78,85 32,85" fill="#FFD166" fillOpacity="0.2" stroke="#FFD166" strokeWidth="1.6" />
        </svg>
      </div>

      {/* Mid-Left Flank (Curriculum Level): Abacus Rings & Ruler */}
      <div className="absolute top-[1080px] left-4 sm:left-8 hidden xl:block">
        <svg width="65" height="75" viewBox="0 0 75 85" fill="none" className="opacity-26">
          {/* Abacus Wire and Rings */}
          <line x1="8" y1="20" x2="68" y2="20" stroke="#7950B8" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="25" cy="20" rx="8" ry="12" fill="#72D6B0" fillOpacity="0.3" stroke="#72D6B0" strokeWidth="1.6" />
          <ellipse cx="45" cy="20" rx="8" ry="12" fill="#FFD166" fillOpacity="0.3" stroke="#FFD166" strokeWidth="1.6" />
          {/* Compass / Protractor Arc */}
          <path d="M15 65 A 25 25 0 0 1 65 65 Z" fill="#65C7F7" fillOpacity="0.15" stroke="#65C7F7" strokeWidth="1.8" />
          <circle cx="40" cy="65" r="2.5" fill="#65C7F7" />
        </svg>
      </div>

      {/* Right Flank outside English Card: Botanical Leaves & Whimsical Candy */}
      <div className="absolute top-[820px] right-3 sm:right-6 lg:right-10 hidden lg:block">
        <svg width="75" height="90" viewBox="0 0 85 100" fill="none" className="opacity-28">
          {/* Wrapped Candy */}
          <g transform="translate(18, 12)">
            <ellipse cx="28" cy="18" rx="16" ry="11" fill="#F497B6" fillOpacity="0.25" stroke="#F497B6" strokeWidth="1.8" />
            <path d="M12 18 L0 9 L2 27 Z" fill="#F497B6" fillOpacity="0.3" stroke="#F497B6" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M44 18 L56 9 L54 27 Z" fill="#F497B6" fillOpacity="0.3" stroke="#F497B6" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M22 10 Q28 18 22 26" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
            <path d="M30 10 Q36 18 30 26" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
          </g>
          {/* Living Botanic Sprout */}
          <g transform="translate(20, 52)">
            <path d="M15 42 Q 18 20 30 8" stroke="#72D6B0" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M30 8 Q 18 -2 36 -6 Q 44 4 30 8 Z" fill="#72D6B0" fillOpacity="0.28" stroke="#72D6B0" strokeWidth="1.5" />
            <path d="M24 20 Q 8 16 12 28 Q 26 26 24 20 Z" fill="#72D6B0" fillOpacity="0.25" stroke="#72D6B0" strokeWidth="1.4" />
          </g>
        </svg>
      </div>

      {/* Mid-Right Flank (Curriculum Level): Chocolate Bar & Sparkle Stars */}
      <div className="absolute top-[1080px] right-4 sm:right-8 hidden xl:block">
        <svg width="70" height="80" viewBox="0 0 80 90" fill="none" className="opacity-28">
          {/* Chocolate Bar with Grid */}
          <rect x="14" y="24" width="46" height="52" rx="4" fill="#8D6E63" fillOpacity="0.22" stroke="#BCAAA4" strokeWidth="1.8" />
          <line x1="14" y1="50" x2="60" y2="50" stroke="#BCAAA4" strokeWidth="1.4" />
          <line x1="37" y1="24" x2="37" y2="76" stroke="#BCAAA4" strokeWidth="1.4" />
          {/* Golden Peeling Wrapper */}
          <path d="M14 24 L32 8 L60 24 Z" fill="#FFD166" fillOpacity="0.3" stroke="#FFD166" strokeWidth="1.6" />
          {/* Sparkles */}
          <path d="M68 18 Q 68 24 74 24 Q 68 24 68 30 Q 68 24 62 24 Q 68 24 68 18 Z" fill="#FFD166" fillOpacity="0.7" />
          <circle cx="12" cy="18" r="2.5" fill="#F497B6" />
        </svg>
      </div>

      {/* =====================================================================
          ZONE 3: SMARTBOARD CONSOLE & FEATURES FLANKS (Y: ~1450px - 2150px)
         ===================================================================== */}

      {/* Left Flank outside Smartboard Console: Science Atom & Flask */}
      <div className="absolute top-[1520px] left-3 sm:left-6 lg:left-10 hidden lg:block">
        <svg width="75" height="85" viewBox="0 0 85 95" fill="none" className="opacity-28">
          {/* Atom Nucleus & Orbitals */}
          <ellipse cx="40" cy="40" rx="30" ry="11" stroke="#65C7F7" strokeWidth="1.6" transform="rotate(30 40 40)" />
          <ellipse cx="40" cy="40" rx="30" ry="11" stroke="#F497B6" strokeWidth="1.6" transform="rotate(-30 40 40)" />
          <ellipse cx="40" cy="40" rx="30" ry="11" stroke="#72D6B0" strokeWidth="1.6" transform="rotate(90 40 40)" />
          <circle cx="40" cy="40" r="4.5" fill="#FFD166" fillOpacity="0.7" />
          <circle cx="62" cy="28" r="2.2" fill="#65C7F7" />
          <circle cx="18" cy="52" r="2.2" fill="#F497B6" />
        </svg>
      </div>

      {/* Right Flank outside Smartboard Console: Lightbulb & Spark of Ideas */}
      <div className="absolute top-[1520px] right-3 sm:right-6 lg:right-10 hidden lg:block">
        <svg width="70" height="85" viewBox="0 0 80 95" fill="none" className="opacity-28">
          {/* Lightbulb */}
          <path 
            d="M40 12 C 26 12 18 22 18 34 C 18 43 25 48 27 55 L 53 55 C 55 48 62 43 62 34 C 62 22 54 12 40 12 Z" 
            fill="#FFD166" 
            fillOpacity="0.2" 
            stroke="#FFD166" 
            strokeWidth="2" 
          />
          {/* Filament */}
          <path d="M34 36 L38 28 L42 28 L46 36" stroke="#FFD166" strokeWidth="1.6" strokeLinecap="round" />
          {/* Screw Base */}
          <rect x="30" y="55" width="20" height="5" rx="1.5" fill="#A881E6" stroke="#A881E6" strokeWidth="1.4" />
          <rect x="32" y="60" width="16" height="4" rx="1.5" fill="#A881E6" stroke="#A881E6" strokeWidth="1.4" />
          {/* Light Rays */}
          <line x1="40" y1="2" x2="40" y2="7" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="18" x2="16" y2="21" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="18" x2="64" y2="21" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Left Flank outside Innovations: Graduation Cap & Laurel Ribbon */}
      <div className="absolute top-[1880px] left-3 sm:left-6 lg:left-10 hidden lg:block">
        <svg width="75" height="75" viewBox="0 0 85 85" fill="none" className="opacity-28">
          {/* Mortarboard */}
          <polygon points="42,12 80,26 42,40 4,26" fill="#7950B8" fillOpacity="0.25" stroke="#A881E6" strokeWidth="2" />
          {/* Skull Cap */}
          <path d="M18 32 L18 48 C 18 58 66 58 66 48 L66 32" fill="#563580" fillOpacity="0.2" stroke="#A881E6" strokeWidth="1.8" />
          {/* Tassel */}
          <path d="M42 26 L22 36 L20 54" stroke="#FFD166" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="20" cy="56" r="3" fill="#FFD166" />
        </svg>
      </div>

      {/* Right Flank outside Innovations: Magnifying Glass & Star Cluster */}
      <div className="absolute top-[1880px] right-3 sm:right-6 lg:right-10 hidden lg:block">
        <svg width="75" height="80" viewBox="0 0 85 90" fill="none" className="opacity-28">
          {/* Magnifying Glass */}
          <circle cx="34" cy="34" r="22" fill="#65C7F7" fillOpacity="0.16" stroke="#65C7F7" strokeWidth="2.2" />
          <line x1="50" y1="50" x2="74" y2="74" stroke="#D4BEE4" strokeWidth="4" strokeLinecap="round" />
          {/* Lens reflection curve */}
          <path d="M22 24 A 14 14 0 0 1 42 20" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
          {/* Sparkle inside */}
          <polygon points="34,26 36,32 42,34 36,36 34,42 32,36 26,34 32,32" fill="#FFD166" fillOpacity="0.7" />
        </svg>
      </div>

    </div>
  );
};

export default HomepageDoodleCanvas;

