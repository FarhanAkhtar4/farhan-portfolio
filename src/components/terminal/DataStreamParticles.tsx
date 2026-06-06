'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT_DESKTOP = 1000;
const PARTICLE_COUNT_MOBILE = 500;
const BOUNDS_X = 15;
const BOUNDS_Y = 12;
const BOUNDS_Z = 10;
const ASCEND_SPEED = 0.3;
const DRIFT_SPEED = 0.05;
const DATA_PACKET_CHANCE = 0.08; // 8% of particles are larger "data packets"

function createParticleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function DataStreamParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const particleCount = viewport.width < 768
    ? PARTICLE_COUNT_MOBILE
    : PARTICLE_COUNT_DESKTOP;

  const { positions, colors, speeds, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);
    const szs = new Float32Array(particleCount);

    const cyanColor = new THREE.Color('#00F0FF');
    const violetColor = new THREE.Color('#A855F7');
    const mixedColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      pos[i3] = (Math.random() - 0.5) * BOUNDS_X * 2;
      pos[i3 + 1] = Math.random() * BOUNDS_Y * 2 - BOUNDS_Y;
      pos[i3 + 2] = (Math.random() - 0.5) * BOUNDS_Z * 2;

      const t = Math.random();
      mixedColor.copy(cyanColor).lerp(violetColor, t * 0.6);
      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;

      spd[i] = 0.5 + Math.random() * 1.5;

      // Data packets: 8% of particles are larger
      if (Math.random() < DATA_PACKET_CHANCE) {
        szs[i] = 0.2 + Math.random() * 0.15; // larger data packets
      } else {
        szs[i] = 0.1; // standard particles (up from 0.08)
      }
    }

    return { positions: pos, colors: col, speeds: spd, sizes: szs };
  }, [particleCount]);

  const particleTexture = useMemo(() => createParticleTexture(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.1,
      map: particleTexture,
      transparent: true,
      opacity: 0.7, // slightly brighter (up from 0.6)
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true,
    });
  }, [particleTexture]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Ascend (Y)
      posArray[i3 + 1] += speeds[i] * ASCEND_SPEED * 0.005;

      // Drift (X) with subtle sine wave
      posArray[i3] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.1) * DRIFT_SPEED * 0.002;

      // Loop when particle goes above bounds
      if (posArray[i3 + 1] > BOUNDS_Y) {
        posArray[i3 + 1] = -BOUNDS_Y;
        posArray[i3] = (Math.random() - 0.5) * BOUNDS_X * 2;
        posArray[i3 + 2] = (Math.random() - 0.5) * BOUNDS_Z * 2;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
  );
}

export default DataStreamParticles;
