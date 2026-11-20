import { CALM_EASE } from './motionPresets';

export const cardEntrance = (index = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: Math.min(index * 0.05, 0.4),
      ease: CALM_EASE
    }
  }
});

export const cardLiftHover = {
  whileHover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.22, ease: CALM_EASE }
  },
  whileTap: {
    scale: 0.985,
    transition: { duration: 0.1, ease: CALM_EASE }
  }
};

export const badgePillHover = {
  whileHover: {
    scale: 1.05,
    y: -1,
    transition: { duration: 0.18, ease: CALM_EASE }
  }
};

