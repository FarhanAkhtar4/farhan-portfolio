'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  distance?: number;
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.7,
  distance = 24,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const axis = direction === 'left' ? 'x' : direction === 'right' ? 'x' : 'y';
  const sign = direction === 'up' ? 1 : direction === 'left' ? 1 : -1;
  const offset = direction === 'none' ? 0 : distance * sign;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      [axis]: offset,
      filter: shouldReduceMotion ? 'none' : 'blur(6px)',
    },
    visible: {
      opacity: 1,
      [axis]: 0,
      filter: 'blur(0px)',
      transition: {
        duration: shouldReduceMotion ? 0.3 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // easeOutQuint — snappy settle
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}