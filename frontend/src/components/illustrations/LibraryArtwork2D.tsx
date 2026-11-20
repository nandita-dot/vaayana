import React from 'react';

export const LibraryArtwork2D: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="60" cy="60" r="48" fill="#563580" fillOpacity="0.12" />
      
      {/* Stack of colorful books */}
      <g transform="translate(25, 40)">
        {/* Book 1 (Bottom): Deep Purple */}
        <rect x="0" y="32" width="70" height="14" rx="2.5" fill="#563580" stroke="#3D2060" strokeWidth="1.2" />
        <rect x="8" y="34" width="60" height="10" fill="#FAF6EE" />
        <line x1="12" y1="36" x2="12" y2="42" stroke="#FFD166" strokeWidth="1.5" />

        {/* Book 2 (Middle): Muted Green */}
        <rect x="5" y="18" width="62" height="14" rx="2.5" fill="#5E8A5A" stroke="#3E633B" strokeWidth="1.2" />
        <rect x="12" y="20" width="53" height="10" fill="#FAF6EE" />
        <line x1="16" y1="22" x2="16" y2="28" stroke="#FFE082" strokeWidth="1.5" />

        {/* Book 3 (Top): Golden Orange */}
        <rect x="10" y="4" width="54" height="14" rx="2.5" fill="#FFA726" stroke="#D87A00" strokeWidth="1.2" />
        <rect x="16" y="6" width="46" height="10" fill="#FAF6EE" />
        <line x1="20" y1="8" x2="20" y2="14" stroke="#563580" strokeWidth="1.5" />
      </g>

      {/* Floating Golden Star */}
      <circle cx="85" cy="30" r="3" fill="#FFD166" />
      <circle cx="35" cy="32" r="2" fill="#8FAF91" />
    </svg>
  );
};

