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
  const glitchIntensityRef = useRef(0);

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
      animPhaseRef.current = 1;
      animTimerRef.current = 0;
      prevKeyRef.current = sectionKey;
    }
  }, [sectionKey]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const delta = state.clock.getDelta();
    const elapsed = state.clock.elapsedTime;

    if (animPhaseRef.current === 0) return;

    animTimerRef.current += delta;

    if (animPhaseRef.current === 1) {
      // CLOSING — dramatic glitch
      const t = Math.min(animTimerRef.current / 0.2, 1);

      // Base slide down + scale
      groupRef.current.position.y = -0.5 * t;
      groupRef.current.scale.y = 1 - 0.95 * t;
      groupRef.current.scale.x = 1 - 0.05 * t;
      setChildrenOpacity(1 - t);

      // Horizontal glitch displacement — random jitter
      const jitterX = (Math.random() - 0.5) * 0.15 * (1 - t);
      const jitterY = (Math.random() - 0.5) * 0.05 * (1 - t);
      groupRef.current.position.x = jitterX;

      // Screen tear — skew effect
      groupRef.current.rotation.z = (Math.random() - 0.5) * 0.03 * (1 - t);

      if (t >= 1) {
        animPhaseRef.current = 2;
        animTimerRef.current = 0;
        groupRef.current.position.x = 0;
        groupRef.current.rotation.z = 0;
      }
    } else if (animPhaseRef.current === 2) {
      // OPENING — with RGB split and tear
      const t = Math.min(animTimerRef.current / 0.2, 1);
      const ease = t * t * (3 - 2 * t); // smoothstep

      groupRef.current.position.y = -0.5 + 0.5 * ease;
      groupRef.current.scale.y = 0.05 + 0.95 * ease;
      groupRef.current.scale.x = 0.95 + 0.05 * ease;
      setChildrenOpacity(ease);

      // RGB split effect during opening (decaying)
      const rgbSplit = (1 - ease) * 0.08;
      const splitOffset = Math.sin(elapsed * 15) * rgbSplit;
      groupRef.current.position.x = splitOffset;

      // Screen tear — horizontal displacement bands
      const tearIntensity = (1 - ease) * 0.02;
      groupRef.current.rotation.z = Math.sin(elapsed * 20) * tearIntensity;

      if (t >= 1) {
        // Reset
        groupRef.current.position.y = 0;
        groupRef.current.position.x = 0;
        groupRef.current.rotation.z = 0;
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
