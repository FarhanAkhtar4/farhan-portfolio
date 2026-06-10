'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ============================================================
   Atmospheric Effects — Volumetric fog planes, light shafts,
   lens flare, and haze layer for cinematic depth
   ============================================================ */

/**
 * VolumetricFogPlanes — Multiple semi-transparent horizontal planes at
 * different heights with fog-like opacity, slowly drifting
 */
function VolumetricFogPlanes() {
  const planesRef = useRef<THREE.Group>(null);
  const planeCount = 5;

  const planes = useMemo(() => {
    const result = [];
    for (let i = 0; i < planeCount; i++) {
      result.push({
        y: 0.5 + i * 1.2,
        width: 30 + i * 5,
        depth: 20 + i * 3,
        opacity: 0.015 - i * 0.002,
        speed: 0.02 + i * 0.005,
        zOffset: -3 - i * 2,
      });
    }
    return result;
  }, []);

  useFrame((state) => {
    if (!planesRef.current) return;
    const t = state.clock.elapsedTime;
    planesRef.current.children.forEach((child, i) => {
      const plane = planes[i];
      child.position.x = Math.sin(t * plane.speed + i * 0.5) * 0.8;
      child.position.z = plane.zOffset + Math.sin(t * plane.speed * 0.7 + i) * 0.3;
    });
  });

  return (
    <group ref={planesRef}>
      {planes.map((plane, i) => (
        <mesh key={i} position={[0, plane.y, plane.zOffset]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[plane.width, plane.depth]} />
          <meshBasicMaterial
            color="#0a2035"
            transparent
            opacity={plane.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * LightShafts — Angled planes with additive blending simulating
 * light beams from the key light position
 */
function LightShafts() {
  const shaftsRef = useRef<THREE.Group>(null);

  const shafts = useMemo(() => {
    return [
      { angle: -0.3, width: 2.5, height: 15, opacity: 0.02, color: '#00F0FF', x: -3 },
      { angle: -0.2, width: 1.8, height: 12, opacity: 0.015, color: '#00D0FF', x: -1 },
      { angle: -0.4, width: 3.0, height: 18, opacity: 0.012, color: '#00B0FF', x: -5 },
    ];
  }, []);

  useFrame((state) => {
    if (!shaftsRef.current) return;
    const t = state.clock.elapsedTime;
    shaftsRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = shafts[i].opacity + Math.sin(t * 0.5 + i * 1.5) * 0.005;
    });
  });

  return (
    <group ref={shaftsRef} position={[-3, 5, -1]}>
      {shafts.map((shaft, i) => (
        <mesh key={i} position={[shaft.x + 3, -2.5, 0]} rotation={[0, 0, shaft.angle]}>
          <planeGeometry args={[shaft.width, shaft.height]} />
          <meshBasicMaterial
            color={shaft.color}
            transparent
            opacity={shaft.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * LensFlare — Bright spot at screen center with radial gradient, pulsing subtly
 */
function LensFlare() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.04 + Math.sin(t * 1.5) * 0.015;
  });

  return (
    <mesh ref={meshRef} position={[0, 2.5, -2.5]}>
      <circleGeometry args={[3, 32]} />
      <meshBasicMaterial
        color="#00F0FF"
        transparent
        opacity={0.04}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * HazeLayer — Very large plane close to camera with subtle noise-like texture,
 * creating atmospheric depth
 */
function HazeLayer() {
  const meshRef = useRef<THREE.Mesh>(null);
  const noiseTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 20;
      data[i] = 10 + v;
      data[i + 1] = 25 + v;
      data[i + 2] = 45 + v;
      data[i + 3] = 8; // very subtle
    }
    ctx.putImageData(imageData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 3);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 3, 6]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[30, 18]} />
      <meshBasicMaterial
        map={noiseTexture}
        transparent
        opacity={0.06}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * AtmosphericEffects — Combined export
 */
export default function AtmosphericEffects() {
  return (
    <group>
      <VolumetricFogPlanes />
      <LightShafts />
      <LensFlare />
      <HazeLayer />
    </group>
  );
}
