'use client';

import { useRef, useEffect, useCallback, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlitchTransitionProps {
  sectionKey: string;
  children: ReactNode;
}

export default function GlitchTransition({ sectionKey, children }: GlitchTransitionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const prevKeyRef = useRef(sectionKey);
  const animPhaseRef = useRef(0); // 0=idle, 1=closing, 2=opening
  const animTimerRef = useRef(0);

  const setChildrenOpacity = useCallback((opacity: number) => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if (
        (child as THREE.Mesh).isMesh ||
        (child as THREE.LineSegments).isLineSegments ||
        (child as THREE.Points).isPoints
      ) {
        const mat = (child as THREE.Mesh).material;
        if (mat && 'opacity' in mat) {
          (mat as THREE.MeshBasicMaterial).transparent = true;
          (mat as THREE.MeshBasicMaterial).opacity = opacity;
        }
      }
    });
  }, []);

  // Detect section change
  useEffect(() => {
    if (prevKeyRef.current !== sectionKey && animPhaseRef.current === 0) {
      // Start closing animation
      animPhaseRef.current = 1;
      animTimerRef.current = 0;
      prevKeyRef.current = sectionKey;
    }
  }, [sectionKey]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (animPhaseRef.current === 0) return;

    animTimerRef.current += delta;

    if (animPhaseRef.current === 1) {
      // Closing: slide down + scale down
      const t = Math.min(animTimerRef.current / 0.15, 1);
      groupRef.current.position.y = -0.5 * t;
      groupRef.current.scale.y = 1 - 0.95 * t;
      groupRef.current.scale.x = 1 - 0.05 * t;
      setChildrenOpacity(1 - t);

      if (t >= 1) {
        animPhaseRef.current = 2;
        animTimerRef.current = 0;
      }
    } else if (animPhaseRef.current === 2) {
      // Opening: slide up + scale up with new content
      const t = Math.min(animTimerRef.current / 0.15, 1);
      const ease = t * t * (3 - 2 * t); // smoothstep
      groupRef.current.position.y = -0.5 + 0.5 * ease;
      groupRef.current.scale.y = 0.05 + 0.95 * ease;
      groupRef.current.scale.x = 0.95 + 0.05 * ease;
      setChildrenOpacity(ease);

      if (t >= 1) {
        // Reset
        groupRef.current.position.y = 0;
        groupRef.current.scale.set(1, 1, 1);
        setChildrenOpacity(1);
        animPhaseRef.current = 0;
        animTimerRef.current = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
