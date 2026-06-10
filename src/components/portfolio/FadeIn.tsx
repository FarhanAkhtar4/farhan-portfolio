'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const directionMap = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {},
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...directionMap[direction],
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: shouldReduceMotion ? 0.3 : duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}