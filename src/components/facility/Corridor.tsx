'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const ROOM_SPACING = 40;
const NUM_ROOMS = 11;
const CORRIDOR_LENGTH = (NUM_ROOMS - 1) * ROOM_SPACING;
const WALL_HEIGHT = 8;
const CORRIDOR_WIDTH = 14;

export default function Corridor() {
  const wallGeo = useMemo(
    () => new THREE.PlaneGeometry(CORRIDOR_LENGTH, WALL_HEIGHT),
    []
  );
  const floorGeo = useMemo(
    () => new THREE.PlaneGeometry(CORRIDOR_LENGTH, CORRIDOR_WIDTH),
    []
  );
  const ceilingGeo = useMemo(
    () => new THREE.PlaneGeometry(CORRIDOR_LENGTH, CORRIDOR_WIDTH),
    []
  );
  const edgeGeo = useMemo(
    () => new THREE.BoxGeometry(CORRIDOR_LENGTH, 0.05, 0.05),
    []
  );
  const edgeVerticalGeo = useMemo(
    () => new THREE.BoxGeometry(0.05, 0.05, CORRIDOR_LENGTH),
    []
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#06b6d4',
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.85,
        metalness: 0.15,
        emissive: '#0e7490',
        emissiveIntensity: 0.05,
      }),
    []
  );

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0c1220',
        roughness: 0.9,
        metalness: 0.1,
        emissive: '#0e7490',
        emissiveIntensity: 0.02,
      }),
    []
  );

  const startY = 30;
  const endY = 30 - CORRIDOR_LENGTH;
  const centerX = 0;

  return (
    <group>
      {/* Floor */}
      <mesh
        geometry={floorGeo}
        material={floorMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[centerX, 0, startY - CORRIDOR_LENGTH / 2]}
        receiveShadow
      />

      {/* Ceiling */}
      <mesh
        geometry={ceilingGeo}
        material={wallMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[centerX, WALL_HEIGHT, startY - CORRIDOR_LENGTH / 2]}
      />

      {/* Left Wall */}
      <mesh
        geometry={wallGeo}
        material={wallMaterial}
        rotation={[0, Math.PI / 2, 0]}
        position={[-CORRIDOR_WIDTH / 2, WALL_HEIGHT / 2, startY - CORRIDOR_LENGTH / 2]}
      />

      {/* Right Wall */}
      <mesh
        geometry={wallGeo}
        material={wallMaterial}
        rotation={[0, -Math.PI / 2, 0]}
        position={[CORRIDOR_WIDTH / 2, WALL_HEIGHT / 2, startY - CORRIDOR_LENGTH / 2]}
      />

      {/* Neon edge lines along floor */}
      <mesh
        geometry={edgeGeo}
        material={lineMaterial}
        position={[centerX, 0.02, startY - CORRIDOR_LENGTH / 2]}
      />
      {/* Left edge */}
      <mesh
        geometry={edgeVerticalGeo}
        material={lineMaterial}
        position={[-CORRIDOR_WIDTH / 2 + 0.02, 0.02, startY - CORRIDOR_LENGTH / 2]}
      />
      {/* Right edge */}
      <mesh
        geometry={edgeVerticalGeo}
        material={lineMaterial}
        position={[CORRIDOR_WIDTH / 2 - 0.02, 0.02, startY - CORRIDOR_LENGTH / 2]}
      />
      {/* Ceiling edges */}
      <mesh
        geometry={edgeGeo}
        material={lineMaterial}
        position={[centerX, WALL_HEIGHT - 0.02, startY - CORRIDOR_LENGTH / 2]}
      />

      {/* Doorway arches between rooms */}
      {Array.from({ length: NUM_ROOMS }).map((_, i) => {
        const z = 30 - i * ROOM_SPACING;
        return (
          <group key={i} position={[0, 0, z]}>
            {/* Left pillar */}
            <mesh
              position={[-CORRIDOR_WIDTH / 2 + 0.3, WALL_HEIGHT / 2, 0]}
            >
              <boxGeometry args={[0.6, WALL_HEIGHT, 1]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#06b6d4"
                emissiveIntensity={0.35}
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
            {/* Right pillar */}
            <mesh
              position={[CORRIDOR_WIDTH / 2 - 0.3, WALL_HEIGHT / 2, 0]}
            >
              <boxGeometry args={[0.6, WALL_HEIGHT, 1]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#06b6d4"
                emissiveIntensity={0.35}
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
            {/* Top beam */}
            <mesh position={[0, WALL_HEIGHT - 0.3, 0]}>
              <boxGeometry args={[CORRIDOR_WIDTH, 0.5, 1]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#06b6d4"
                emissiveIntensity={0.4}
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
            {/* Room number glow */}
            <pointLight
              position={[0, WALL_HEIGHT - 0.5, 0.5]}
              color="#06b6d4"
              intensity={1.5}
              distance={15}
              decay={2}
            />
          </group>
        );
      })}
    </group>
  );
}
