export * from './motionPresets';

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.32, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    transition: { 
      duration: 0.18, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

