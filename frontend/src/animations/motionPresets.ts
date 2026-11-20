import { Variants, Transition } from 'framer-motion';

// Calm, organic, and elegant easing curve for educational UI
export const CALM_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const GENTLE_SPRING = { type: 'spring', stiffness: 260, damping: 25 };

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
    filter: 'blur(2px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.35,
      ease: CALM_EASE
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(2px)',
    transition: {
      duration: 0.2,
      ease: CALM_EASE
    }
  }
};

// Classroom slide transition variants
export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: CALM_EASE
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: CALM_EASE
    }
  })
};

// Staggered list container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

// Staggered item appearance
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: CALM_EASE
    }
  }
};

// Card interaction presets (soft hover, gentle lift)
export const cardHoverMotion = {
  whileHover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.25, ease: CALM_EASE }
  },
  whileTap: {
    scale: 0.985,
    transition: { duration: 0.1, ease: CALM_EASE }
  }
};

// Button interaction presets
export const buttonMotion = {
  whileHover: {
    scale: 1.03,
    transition: { duration: 0.2, ease: CALM_EASE }
  },
  whileTap: {
    scale: 0.97,
    transition: { duration: 0.1, ease: CALM_EASE }
  }
};

// Modal animation variants
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 16
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: CALM_EASE
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: {
      duration: 0.2,
      ease: CALM_EASE
    }
  }
};

// Gentle pulse animation for interactive highlights
export const subtlePulse = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

