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

  // If in quiet classroom mode or user prefers reduced motion, render a subtle static dark gradient
  if (classroomMode || shouldReduceMotion || intensity === 'calm') {
    return (
      <div 
        className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-vaayana-dark via-[#131B15] to-vaayana-dark"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Soft dark radial glow in corner */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-vaayana-lime/5 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-vaayana-lime/5 blur-[120px]" />

      {/* Floating subtle educational geometry */}
      <motion.div
        className="absolute top-24 left-[15%] w-16 h-16 rounded-3xl border border-vaayana-lime/10"
        animate={{
          y: [-10, 15, -10],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/3 right-[12%] w-24 h-24 rounded-full border border-vaayana-soft/5"
        animate={{
          y: [12, -15, 12],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-28 left-[22%] w-12 h-12 rounded-2xl bg-vaayana-lime/[0.03]"
        animate={{
          y: [-8, 12, -8],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#9ACD32 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />
    </div>
  );
};

export default MotionBackground;

