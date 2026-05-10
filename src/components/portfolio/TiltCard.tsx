"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareOpacity?: number;
}

export default function TiltCard({
  children,
  className = "",
  tiltAmount = 5,
  glareOpacity = 0.1,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [tiltAmount, -tiltAmount]), {
    stiffness: 200,
    damping: 25,
    mass: 0.5,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltAmount, tiltAmount]), {
    stiffness: 200,
    damping: 25,
    mass: 0.5,
  });

  const glareX = useTransform(x, [0, 1], [-30, 30]);
  const glareY = useTransform(y, [0, 1], [-30, 30]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {children}
      {/* Glare overlay - always mounted, visibility via opacity */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-20"
        style={{
          x: glareX,
          y: glareY,
          opacity: 0,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 50%)",
        }}
        whileHover={{ opacity: glareOpacity }}
        transition={{ duration: 0 }}
      />
    </motion.div>
  );
}
