import React from 'react';

export interface SubjectIllustration2DProps {
  subject: 'Mathematics' | 'Environmental Studies' | 'English' | string;
  className?: string;
}

export const SubjectIllustration2D: React.FC<SubjectIllustration2DProps> = ({
  subject,
  className = 'w-full h-full'
}) => {
  const s = subject.toLowerCase();

  // 1. MATHEMATICS — ഗണിതം
  if (s.includes('math') || s.includes('ഗണിത')) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="mathCubeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9C6BDB" />
            <stop offset="100%" stopColor="#563580" />
          </linearGradient>
        </defs>
        {/* Soft backdrop circle */}
        <circle cx="120" cy="80" r="55" fill="#563580" fillOpacity="0.12" />
        
        {/* 2D Isometric Cube */}
        <g transform="translate(90, 40)">
          {/* Top Face */}
          <polygon points="30,0 55,14 30,28 5,14" fill="#B39DDB" stroke="#4A267A" strokeWidth="1.5" />
          {/* Left Face */}
          <polygon points="5,14 30,28 30,60 5,46" fill="#7E57C2" stroke="#4A267A" strokeWidth="1.5" />
          {/* Right Face */}
          <polygon points="30,28 55,14 55,46 30,60" fill="#5E35B1" stroke="#4A267A" strokeWidth="1.5" />
          {/* Pips */}
          <circle cx="30" cy="14" r="2.5" fill="#FAF6EE" />
          <circle cx="18" cy="38" r="2.5" fill="#FAF6EE" />
          <circle cx="42" cy="32" r="2.5" fill="#FAF6EE" />
        </g>

        {/* Abacus Rings on the side */}
        <circle cx="50" cy="95" r="14" fill="#8FAF91" stroke="#5E8A5A" strokeWidth="2.5" />
        <circle cx="50" cy="95" r="6" fill="#17151B" />

        {/* Ruler triangle */}
        <polygon points="175,70 205,115 155,115" fill="#FFD166" stroke="#FFA000" strokeWidth="2" />
        <polygon points="175,85 195,110 165,110" fill="#17151B" />

        {/* Math Symbol Doodles */}
        <text x="50" y="55" fill="#EDE5F7" fontSize="16" fontWeight="bold" opacity="0.6">+</text>
        <text x="180" y="55" fill="#FFD166" fontSize="16" fontWeight="bold" opacity="0.6">×</text>
        <text x="110" y="130" fill="#8FAF91" fontSize="14" fontWeight="bold" opacity="0.6">1/2</text>
      </svg>
    );
  }

  // 2. ENVIRONMENTAL STUDIES — പരിസരപഠനം
  if (s.includes('env') || s.includes('evs') || s.includes('പരിസര')) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="evsGlobeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#64B5F6" />
            <stop offset="100%" stopColor="#1E88E5" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8FAF91" />
            <stop offset="100%" stopColor="#5E8A5A" />
          </linearGradient>
        </defs>
        {/* Soft backdrop circle */}
        <circle cx="120" cy="80" r="55" fill="#8FAF91" fillOpacity="0.12" />

        {/* Central Planet / Earth Globe */}
        <circle cx="115" cy="80" r="32" fill="url(#evsGlobeGrad)" stroke="#1565C0" strokeWidth="1.5" />
        <path d="M 102 70 Q 110 65 120 68 Q 128 75 122 84 Q 112 88 100 80 Z" fill="#81C784" />
        <path d="M 125 80 Q 132 78 138 85 Q 132 94 125 90 Z" fill="#81C784" />

        {/* Botanical Sprout Rising */}
        <g transform="translate(155, 60)">
          <path d="M 10 45 Q 12 25 22 15" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaf 1 */}
          <path d="M 22 15 Q 12 5 28 0 Q 34 10 22 15 Z" fill="url(#leafGrad)" stroke="#4A7046" strokeWidth="1" />
          {/* Leaf 2 */}
          <path d="M 18 25 Q 5 20 10 32 Q 22 30 18 25 Z" fill="url(#leafGrad)" stroke="#4A7046" strokeWidth="1" />
        </g>

        {/* Compass Needle (Directions chapter) */}
        <g transform="translate(60, 65)">
          <circle cx="15" cy="15" r="14" fill="#FAF6EE" stroke="#C4B495" strokeWidth="1.5" />
          <polygon points="15,6 18,15 15,18 12,15" fill="#E63946" />
          <polygon points="15,24 18,15 15,18 12,15" fill="#563580" />
          <circle cx="15" cy="15" r="2" fill="#FFA000" />
        </g>
      </svg>
    );
  }

  // 3. ENGLISH — ഇംഗ്ലീഷ് (Default)
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="englishBookGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7950B8" />
          <stop offset="100%" stopColor="#4A267A" />
        </linearGradient>
      </defs>
      {/* Soft backdrop circle */}
      <circle cx="120" cy="80" r="55" fill="#FFD166" fillOpacity="0.12" />

      {/* Open Storybook */}
      <g transform="translate(70, 50)">
        {/* Book Cover */}
        <path d="M 0 45 C 20 48 45 42 50 36 C 55 42 80 48 100 45 L 100 52 C 80 55 55 49 50 43 C 45 49 20 55 0 52 Z" fill="url(#englishBookGrad)" />
        {/* Pages */}
        <path d="M 5 42 C 22 45 46 40 50 35 L 50 10 C 46 15 22 18 5 15 Z" fill="#FAF7F2" stroke="#E4DCCB" strokeWidth="1" />
        <path d="M 95 42 C 78 45 54 40 50 35 L 50 10 C 54 15 78 18 95 15 Z" fill="#FAF7F2" stroke="#E4DCCB" strokeWidth="1" />
        {/* Page text lines */}
        <line x1="15" y1="20" x2="40" y2="20" stroke="#D1C4E9" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="26" x2="38" y2="26" stroke="#D1C4E9" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="32" x2="35" y2="32" stroke="#D1C4E9" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="60" y1="20" x2="85" y2="20" stroke="#D1C4E9" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="60" y1="26" x2="82" y2="26" stroke="#D1C4E9" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Golden Feather Quill Pen */}
      <path
        d="M 155 70 Q 165 40 185 25 Q 175 45 170 60 L 150 72 Z"
        fill="#FFD166"
        stroke="#FFA000"
        strokeWidth="1.5"
      />
      <line x1="150" y1="72" x2="185" y2="25" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

      {/* Floating Alphabet & Speech Bubble */}
      <circle cx="55" cy="55" r="14" fill="#FAF7F2" stroke="#7950B8" strokeWidth="1.5" />
      <text x="50" y="60" fill="#563580" fontSize="13" fontWeight="bold">A</text>
      
      <circle cx="185" cy="95" r="12" fill="#FAF7F2" stroke="#8FAF91" strokeWidth="1.5" />
      <text x="180" y="100" fill="#5E8A5A" fontSize="11" fontWeight="bold">📖</text>
    </svg>
  );
};

