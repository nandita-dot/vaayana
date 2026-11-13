import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MotionBackgroundProps {
  intensity?: 'subtle' | 'playful' | 'calm';
  classroomMode?: boolean;
}

export const MotionBackground: React.FC<MotionBackgroundProps> = ({
  intensity = 'subtle',
  classroomMode = false
}) => {
  const shouldReduceMotion = useReducedMotion();

  // For interactive classroom activities and lessons, keep the background simpler so students can focus on the simulation
  if (classroomMode) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#090909] via-[#0B0B0D] to-[#090909]"
        aria-hidden="true"
      >
        {/* Soft subtle purple focus glow in corner */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#563580]/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#7950B8]/10 blur-[120px]" />
      </div>
    );
  }

  // Refined Educational Notebook Aesthetic with Deep Black Canvas & Warm Ivory/Beige Illustrations
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#090909]"
      aria-hidden="true"
    >
      {/* 1. Subtle Notebook Paper Grid / Dot Pattern in Warm Ivory */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(245, 240, 230, 0.06) 1.5px, transparent 0),
            linear-gradient(to right, rgba(232, 221, 200, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(232, 221, 200, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px'
        }}
      />

      {/* 2. Soft Ambient Deep Purple & Lavender Glows */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[#563580]/20 blur-[140px]" />
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-[#7950B8]/15 blur-[140px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[#3D2D56]/15 blur-[160px]" />

      {/* 3. Subtle Ivory & Warm Beige Educational Illustrations (5-12% opacity) */}
      <div className="absolute inset-0 w-full h-full">

        {/* Bicycle Illustration - Left Middle */}
        <motion.div 
          className="absolute top-[22%] left-[3%] text-[#F5F0E6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          animate={shouldReduceMotion ? undefined : { y: [-2, 2, -2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="115" height="80" viewBox="0 0 100 70" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.09">
            {/* Rear wheel */}
            <circle cx="22" cy="50" r="16" />
            <circle cx="22" cy="50" r="3" fill="currentColor" />
            <line x1="22" y1="34" x2="22" y2="66" strokeWidth="1" strokeDasharray="2 3" />
            <line x1="6" y1="50" x2="38" y2="50" strokeWidth="1" strokeDasharray="2 3" />
            {/* Front wheel */}
            <circle cx="78" cy="50" r="16" />
            <circle cx="78" cy="50" r="3" fill="currentColor" />
            <line x1="78" y1="34" x2="78" y2="66" strokeWidth="1" strokeDasharray="2 3" />
            <line x1="62" y1="50" x2="94" y2="50" strokeWidth="1" strokeDasharray="2 3" />
            {/* Frame */}
            <polygon points="22,50 46,50 68,28 38,28" strokeWidth="2.8" />
            <line x1="46" y1="50" x2="38" y2="20" strokeWidth="2.8" />
            <line x1="22" y1="50" x2="38" y2="28" strokeWidth="2.8" />
            <line x1="78" y1="50" x2="68" y2="20" strokeWidth="2.8" />
            {/* Seat & Handlebars */}
            <line x1="32" y1="18" x2="44" y2="18" strokeWidth="3.5" />
            <line x1="64" y1="18" x2="74" y2="18" strokeWidth="3.5" />
            <path d="M74 18 C78 18 80 22 80 24" strokeWidth="2.5" />
            {/* Pedals */}
            <circle cx="46" cy="50" r="3.5" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Open Book Illustration - Top Right */}
        <motion.div 
          className="absolute top-[8%] right-[8%] text-[#E8DDC8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          animate={shouldReduceMotion ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="90" height="70" viewBox="0 0 80 60" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.10">
            {/* Spine */}
            <path d="M40 15 L40 52" strokeWidth="3" />
            {/* Left Page Curvature */}
            <path d="M40 15 C30 10 18 10 8 13 L8 50 C18 47 30 47 40 52 Z" />
            {/* Right Page Curvature */}
            <path d="M40 15 C50 10 62 10 72 13 L72 50 C62 47 50 47 40 52 Z" />
            {/* Page lines */}
            <line x1="14" y1="22" x2="34" y2="24" strokeWidth="1.5" />
            <line x1="14" y1="30" x2="34" y2="32" strokeWidth="1.5" />
            <line x1="14" y1="38" x2="30" y2="40" strokeWidth="1.5" />
            <line x1="46" y1="24" x2="66" y2="22" strokeWidth="1.5" />
            <line x1="46" y1="32" x2="66" y2="30" strokeWidth="1.5" />
            <line x1="50" y1="40" x2="66" y2="38" strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* Diagonal Pencil with Eraser & Ruler - Bottom Left */}
        <div className="absolute bottom-[16%] left-[6%] text-[#F5F0E6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <svg width="90" height="90" viewBox="0 0 90 90" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.08">
            <g transform="rotate(35 45 45)">
              <rect x="35" y="15" width="14" height="50" rx="1" />
              {/* Tip */}
              <polygon points="35,65 42,78 49,65" />
              <polygon points="40,74 42,78 44,74" fill="currentColor" />
              {/* Eraser and ferrule */}
              <rect x="35" y="10" width="14" height="5" fill="currentColor" opacity="0.4" />
              <line x1="35" y1="15" x2="49" y2="15" />
              <line x1="39" y1="15" x2="39" y2="65" strokeWidth="1" />
              <line x1="45" y1="15" x2="45" y2="65" strokeWidth="1" />
            </g>
          </svg>
        </div>

        {/* Atom Science Symbol - Bottom Right */}
        <motion.div 
          className="absolute bottom-[18%] right-[6%] text-[#E8DDC8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          animate={shouldReduceMotion ? undefined : { rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <svg width="85" height="85" viewBox="0 0 80 80" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.09">
            {/* Nucleus */}
            <circle cx="40" cy="40" r="5" fill="currentColor" />
            {/* Orbit 1 */}
            <ellipse cx="40" cy="40" rx="34" ry="12" transform="rotate(0 40 40)" />
            {/* Orbit 2 */}
            <ellipse cx="40" cy="40" rx="34" ry="12" transform="rotate(60 40 40)" />
            {/* Orbit 3 */}
            <ellipse cx="40" cy="40" rx="34" ry="12" transform="rotate(120 40 40)" />
          </svg>
        </motion.div>

        {/* Science Beaker / Flask - Top Left Center with Mint Bubbles */}
        <div className="absolute top-[14%] left-[28%] text-[#F5F0E6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <svg width="60" height="70" viewBox="0 0 60 70" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.09">
            <line x1="22" y1="10" x2="38" y2="10" strokeWidth="3" />
            <line x1="25" y1="10" x2="25" y2="26" />
            <line x1="35" y1="10" x2="35" y2="26" />
            <path d="M25 26 L10 58 C8 62 11 65 16 65 L44 65 C49 65 52 62 50 58 L35 26" />
            <path d="M14 50 Q30 46 46 50" strokeDasharray="3 3" />
            {/* Playful Mint & Sky Blue glowing bubbles */}
            <circle cx="24" cy="56" r="2.5" fill="#72D6B0" stroke="#72D6B0" opacity="0.6" />
            <circle cx="34" cy="54" r="2" fill="#65C7F7" stroke="#65C7F7" opacity="0.6" />
            <circle cx="28" cy="42" r="1.5" fill="#FFD166" stroke="#FFD166" opacity="0.5" />
          </svg>
        </div>

        {/* Mathematics Symbols Cluster (+, -, ×, ÷, π, √) - Upper Right with Cheerful Accents */}
        <div className="absolute top-[32%] right-[16%] text-[#E8DDC8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono text-2xl font-black select-none flex flex-col gap-4 opacity-[0.11]">
          <div className="flex items-center gap-6">
            <span className="text-3xl font-extrabold text-[#FFD166]">+</span>
            <span className="text-2xl font-bold text-[#65C7F7]">π</span>
            <span className="text-3xl font-extrabold text-[#E8DDC8]">−</span>
          </div>
          <div className="flex items-center gap-6 pl-3">
            <span className="text-3xl font-extrabold text-[#FFA552]">×</span>
            <span className="text-2xl font-bold text-[#72D6B0]">√</span>
            <span className="text-3xl font-extrabold text-[#FF8066]">÷</span>
          </div>
        </div>

        {/* Geometric Shapes (Isometric 3D Cube) - Lower Center with Mint & Coral Edges */}
        <div className="absolute bottom-[8%] left-[40%] text-[#F5F0E6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <svg width="70" height="70" viewBox="0 0 70 70" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.09">
            <polygon points="35,10 60,24 35,38 10,24" stroke="#65C7F7" />
            <polygon points="10,24 35,38 35,62 10,48" stroke="#72D6B0" />
            <polygon points="35,38 60,24 60,48 35,62" stroke="#F5A6C8" />
          </svg>
        </div>

        {/* Constellation of Stars - Scattered with Warm Yellow & Coral Glows */}
        <motion.div 
          className="absolute top-[48%] left-[12%] text-[#FFD166] drop-shadow-[0_0_8px_rgba(255,209,102,0.6)] opacity-[0.25]"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </motion.div>

        <motion.div 
          className="absolute top-[65%] right-[24%] text-[#FF8066] drop-shadow-[0_0_8px_rgba(255,128,102,0.6)] opacity-[0.22]"
          animate={shouldReduceMotion ? undefined : { scale: [1.1, 0.9, 1.1], opacity: [0.18, 0.35, 0.18] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </motion.div>

        <motion.div 
          className="absolute top-[18%] left-[48%] text-[#65C7F7] drop-shadow-[0_0_8px_rgba(101,199,247,0.6)] opacity-[0.22]"
          animate={shouldReduceMotion ? undefined : { rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" />
          </svg>
        </motion.div>

        <motion.div 
          className="absolute bottom-[24%] left-[22%] text-[#F5A6C8] drop-shadow-[0_0_8px_rgba(245,166,200,0.6)] opacity-[0.22]"
          animate={shouldReduceMotion ? undefined : { scale: [0.95, 1.2, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </motion.div>

        {/* Small Educational Globe / Circles - Middle Right */}
        <div className="absolute top-[52%] right-[5%] text-[#F5F0E6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <svg width="65" height="65" viewBox="0 0 65 65" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" opacity="0.08">
            <circle cx="32" cy="32" r="22" />
            <ellipse cx="32" cy="32" rx="12" ry="22" />
            <line x1="10" y1="32" x2="54" y2="32" />
            <path d="M14 20 Q32 26 50 20" />
            <path d="M14 44 Q32 38 50 44" />
          </svg>
        </div>

      </div>

    </div>
  );
};

export default MotionBackground;
