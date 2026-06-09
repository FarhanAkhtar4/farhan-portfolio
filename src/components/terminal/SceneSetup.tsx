'use client';

import { useRef, type ReactNode } from 'react';
import * as THREE from 'three';

function SceneSetup() {
  const cyanLightRef = useRef<THREE.PointLight>(null);
  const violetLightRef = useRef<THREE.PointLight>(null);

  return (
    <>
      {/* Low ambient for base visibility */}
      <ambientLight intensity={0.15} color="#1a2a3a" />

      {/* Primary cyan point light — upper left */}
      <pointLight
        ref={cyanLightRef}
        position={[-5, 5, 3]}
        intensity={0.8}
        color="#00F0FF"
        distance={20}
        decay={2}
      />

      {/* Secondary violet point light — upper right */}
      <pointLight
        ref={violetLightRef}
        position={[5, 4, 2]}
        intensity={0.5}
        color="#A855F7"
        distance={18}
        decay={2}
      />

      {/* Subtle rim light from below */}
      <pointLight
        position={[0, -2, 4]}
        intensity={0.15}
        color="#00F0FF"
        distance={12}
        decay={2}
      />

      {/* Exponential fog for depth fade */}
      <fog attach="fog" args={['#030712', 8, 30]} />
    </>
  );
}

export default SceneSetup;
