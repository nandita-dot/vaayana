import React from 'react';

interface MotionBackgroundProps {
  intensity?: 'subtle' | 'playful' | 'calm';
  classroomMode?: boolean;
}

export const MotionBackground: React.FC<MotionBackgroundProps> = ({
  intensity = 'subtle',
  classroomMode = false
}) => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#09080F]"
      aria-hidden="true"
    >
      {/* 1. Subtle Notebook Paper Dot / Grid Pattern in Soft Lavender */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(237, 229, 247, 0.08) 1px, transparent 0),
            linear-gradient(to right, rgba(121, 80, 184, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(121, 80, 184, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px'
        }}
      />

      {/* 2. Cohesive Ambient Deep Purple & Lavender Night Glows */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[#563580]/16 blur-[140px]" />
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-[#7950B8]/12 blur-[140px]" />
      <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] rounded-full bg-[#72D6B0]/06 blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[#3D2D56]/14 blur-[160px]" />
    </div>
  );
};

export default MotionBackground;
