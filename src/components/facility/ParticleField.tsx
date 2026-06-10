'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const isMobile = useMemo(
    () =>
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent),
    []
  );
  const count = isMobile ? 300 : 800;

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    // Spread particles across corridor volume
    // Corridor runs from z=30 to z=-370, width=14, height=8
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;     // x: -6 to 6
      positions[i * 3 + 1] = Math.random() * 7 + 0.5;     // y: 0.5 to 7.5
      positions[i * 3 + 2] = Math.random() * 420 - 380;   // z: -380 to 40
      velocities[i] = 0.1 + Math.random() * 0.3;          // drift speed
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: '#06b6d4',
      size: 0.05,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= delta * 0.15; // drift down

        // Reset to top when below floor
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 7 + Math.random();
        }
      }

      posAttr.needsUpdate = true;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
