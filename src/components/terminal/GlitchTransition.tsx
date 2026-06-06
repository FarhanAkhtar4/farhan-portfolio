'use client';

import { useRef, useEffect, useCallback, type ReactNode } from 'react';
import gsap from 'gsap';

interface GlitchTransitionProps {
  isActive: boolean;
  sectionKey: string;
  children: ReactNode;
}

function GlitchTransition({ isActive, sectionKey, children }: GlitchTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevSectionKey = useRef(sectionKey);

  useEffect(() => {
    if (sectionKey !== prevSectionKey.current && containerRef.current && contentRef.current) {
      // Transition animation
      const container = containerRef.current;
      const content = contentRef.current;

      // Reset
      gsap.set(container, { clipPath: 'inset(0 0 0 0)' });

      const tl = gsap.timeline();

      // Phase 1: Glitch out (clip-path random slices)
      tl.to(container, {
        clipPath: 'inset(20% 5% 40% 5%)',
        duration: 0.08,
        ease: 'steps(4)',
      })
      .to(container, {
        clipPath: 'inset(50% 10% 10% 10%)',
        duration: 0.06,
        ease: 'steps(3)',
      })
      .to(container, {
        clipPath: 'inset(70% 5% 5% 5%)',
        duration: 0.05,
        ease: 'steps(2)',
      })
      // Phase 2: Fade to black
      .to(container, {
        opacity: 0,
        duration: 0.08,
        ease: 'power2.in',
        onComplete: () => {
          // Update previous key
          prevSectionKey.current = sectionKey;
        },
      })
      // Phase 3: Glitch in with new content
      .set(container, {
        clipPath: 'inset(10% 5% 60% 5%)',
        opacity: 1,
      })
      .to(container, {
        clipPath: 'inset(0% 2% 30% 2%)',
        duration: 0.06,
        ease: 'steps(4)',
      })
      .to(container, {
        clipPath: 'inset(40% 10% 5% 10%)',
        duration: 0.05,
        ease: 'steps(3)',
      })
      // Phase 4: Settle to full
      .to(container, {
        clipPath: 'inset(0 0 0 0)',
        duration: 0.1,
        ease: 'power2.out',
      });

      // Brief RGB split effect on content
      tl.fromTo(
        content,
        {
          textShadow: '2px 0 #00f0ff, -2px 0 #a855f7',
        },
        {
          textShadow: '0 0 transparent',
          duration: 0.2,
          ease: 'power2.out',
        },
        '-=0.2'
      );
    }
  }, [sectionKey]);

  return (
    <div ref={containerRef} style={{ willChange: 'clip-path, opacity' }}>
      <div ref={contentRef} key={sectionKey}>
        {children}
      </div>
    </div>
  );
}

export default GlitchTransition;
