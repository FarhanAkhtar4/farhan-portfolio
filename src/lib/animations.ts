// Shared animation variants with properly typed ease values
// This avoids TypeScript "number[] is not assignable to BezierDefinition" errors

import type { Variants } from 'framer-motion';

// Common cubic bezier curves (typed as tuples)
export const easeSmooth: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeOut: [number, number, number, number] = [0.4, 0, 1, 1];
export const easeNav: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Container that staggers children
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// Fade up
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeSmooth },
  },
};

export const fadeUpSlow: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeSmooth },
  },
};

// Slide directions
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: easeSmooth },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: easeSmooth },
  },
};

// Card stagger (dynamic delay based on index)
export const cardStagger: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: 0.2 + i * 0.15,
      ease: easeSmooth,
    },
  }),
};

export const cardStaggerFast: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.1 + i * 0.1,
      ease: easeSmooth,
    },
  }),
};

// Scale in
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

// Fade only
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeSmooth },
  },
};

// Filter tab (spring animation)
export const filterTab: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Inline transition presets (for whileInView / animate props)
export const transitionSmooth = { duration: 0.7, ease: easeSmooth };
export const transitionNav = { duration: 0.6, ease: easeNav };
export const transitionFast = { duration: 0.3, ease: easeOut };
export const transitionMedium = { duration: 0.5, ease: easeSmooth };
