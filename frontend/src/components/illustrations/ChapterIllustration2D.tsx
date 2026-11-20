import React from 'react';

export interface ChapterIllustration2DProps {
  topic?: string;
  chapterTitle?: string;
  className?: string;
}

export const ChapterIllustration2D: React.FC<ChapterIllustration2DProps> = ({
  topic = '',
  chapterTitle = '',
  className = 'w-full h-full'
}) => {
  const combined = `${topic} ${chapterTitle}`.toLowerCase();

  // 1. SPACE & SOLAR SYSTEM
  if (
    combined.includes('space') ||
    combined.includes('solar') ||
    combined.includes('moon') ||
    combined.includes('സൂര്യ') ||
    combined.includes('ചന്ദ്ര') ||
    combined.includes('ഭൂമി')
  ) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="100" cy="60" r="42" fill="#563580" fillOpacity="0.15" />
        {/* Ringed Planet */}
        <ellipse cx="100" cy="60" rx="42" ry="14" fill="none" stroke="#FFD166" strokeWidth="2.5" opacity="0.8" transform="rotate(-15 100 60)" />
        <circle cx="100" cy="60" r="22" fill="#8FAF91" stroke="#5E8A5A" strokeWidth="2" />
        {/* Planet Surface Bands */}
        <path d="M 80 55 Q 100 62 120 55" stroke="#728D73" strokeWidth="2" fill="none" />
        <path d="M 82 65 Q 100 72 118 65" stroke="#728D73" strokeWidth="2" fill="none" />
        {/* Front Ring segment for depth */}
        <path d="M 60 68 Q 100 78 140 58" stroke="#FFE082" strokeWidth="3" fill="none" />
        {/* Orbiting Moon */}
        <circle cx="145" cy="40" r="6" fill="#FAF6EE" stroke="#E4DCCB" strokeWidth="1" />
        {/* Sparkling Stars */}
        <circle cx="45" cy="35" r="2" fill="#FFD166" />
        <circle cx="160" cy="85" r="2" fill="#FFD166" />
        <circle cx="55" cy="85" r="1.5" fill="#FAF6EE" />
      </svg>
    );
  }

  // 2. WATER & STATES OF MATTER (ഖരം, ദ്രാവകം, വാതകം / വെള്ളം)
  if (
    combined.includes('water') ||
    combined.includes('liquid') ||
    combined.includes('solid') ||
    combined.includes('matter') ||
    combined.includes('ദ്രാവകം') ||
    combined.includes('ഖരം') ||
    combined.includes('വാതകം') ||
    combined.includes('വെള്ളം')
  ) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="100" cy="60" r="42" fill="#3A86C8" fillOpacity="0.12" />
        {/* Laboratory Flask / Beaker */}
        <g transform="translate(80, 25)">
          <path
            d="M 14 0 L 26 0 L 26 22 L 38 48 Q 40 54 34 58 L 6 58 Q 0 54 2 48 L 14 22 Z"
            fill="#E1F5FE"
            stroke="#0288D1"
            strokeWidth="2"
          />
          {/* Blue Liquid Level */}
          <path
            d="M 6 42 Q 20 38 34 42 L 34 56 Q 34 58 32 58 L 8 58 Q 6 58 6 56 Z"
            fill="#29B6F6"
          />
          {/* Rising Gas Bubbles */}
          <circle cx="16" cy="48" r="2.5" fill="#FFFFFF" opacity="0.8" />
          <circle cx="24" cy="44" r="3" fill="#FFFFFF" opacity="0.8" />
          <circle cx="20" cy="32" r="2" fill="#0288D1" opacity="0.6" />
          <circle cx="18" cy="18" r="2" fill="#0288D1" opacity="0.6" />
        </g>
        {/* Ice Cube (Solid) */}
        <rect x="42" y="65" width="20" height="20" rx="3" fill="#B3E5FC" stroke="#0288D1" strokeWidth="1.5" />
        {/* Steam / Gas Waved lines */}
        <path d="M 142 55 Q 146 45 142 35 Q 138 25 142 15" stroke="#8FAF91" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 152 60 Q 156 50 152 40 Q 148 30 152 20" stroke="#8FAF91" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 3. MATHEMATICS (Abacus, Clock, Shapes, Fraction)
  if (
    combined.includes('math') ||
    combined.includes('clock') ||
    combined.includes('time') ||
    combined.includes('fraction') ||
    combined.includes('shape') ||
    combined.includes('അബാക്കസ്') ||
    combined.includes('സമയം') ||
    combined.includes('ഭിന്നസംഖ്യ')
  ) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="100" cy="60" r="42" fill="#7950B8" fillOpacity="0.12" />
        {/* Friendly Clock Dial */}
        <circle cx="80" cy="60" r="28" fill="#FAF6EE" stroke="#563580" strokeWidth="2.5" />
        <line x1="80" y1="60" x2="80" y2="44" stroke="#563580" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="80" y1="60" x2="94" y2="60" stroke="#E63946" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="60" r="3" fill="#FFA000" />
        {/* Fraction Ring Sector */}
        <g transform="translate(130, 40)">
          <circle cx="20" cy="20" r="18" fill="#E8DDC8" stroke="#5E8A5A" strokeWidth="2" />
          <path d="M 20 20 L 20 2 A 18 18 0 0 1 38 20 Z" fill="#8FAF91" />
          <circle cx="20" cy="20" r="2" fill="#17151B" />
        </g>
        {/* Math Plus & Times */}
        <text x="35" y="45" fill="#FFD166" fontSize="16" fontWeight="bold">+</text>
        <text x="135" y="95" fill="#7950B8" fontSize="16" fontWeight="bold">÷</text>
      </svg>
    );
  }

  // 4. ENGLISH / SEED OF TRUTH / STORIES (Default)
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="100" cy="60" r="42" fill="#5E8A5A" fillOpacity="0.12" />
      {/* Flowerpot with Sprouting Seed of Truth */}
      <g transform="translate(85, 35)">
        {/* Clay Pot */}
        <polygon points="5,30 25,30 22,50 8,50" fill="#D87A56" stroke="#9C4124" strokeWidth="1.5" />
        <rect x="3" y="27" width="24" height="4" rx="1" fill="#E28E6E" stroke="#9C4124" strokeWidth="1" />
        {/* Sprout Stem */}
        <path d="M 15 27 Q 14 15 15 5" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Leaves */}
        <path d="M 15 14 Q 5 10 7 2 Q 15 6 15 14 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1" />
        <path d="M 15 8 Q 25 4 23 -4 Q 15 0 15 8 Z" fill="#81C784" stroke="#2E7D32" strokeWidth="1" />
      </g>
      {/* Open Little Book */}
      <g transform="translate(35, 55)">
        <polygon points="0,20 15,22 30,20 30,8 15,10 0,8" fill="#FAF6EE" stroke="#563580" strokeWidth="1.2" />
        <line x1="15" y1="10" x2="15" y2="22" stroke="#7950B8" strokeWidth="1.5" />
      </g>
      {/* Golden Star of Virtue */}
      <polygon
        points="148,45 151,52 158,53 153,58 155,65 148,61 142,65 144,58 139,53 146,52"
        fill="#FFD166"
        stroke="#FFA000"
        strokeWidth="1"
      />
    </svg>
  );
};

