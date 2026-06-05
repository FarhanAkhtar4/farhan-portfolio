'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EntryRoom from './rooms/EntryRoom';
import CommandCenterRoom from './rooms/CommandCenterRoom';
import SeismicLabRoom from './rooms/SeismicLabRoom';
import AgenticAICenterRoom from './rooms/AgenticAICenterRoom';
import DeepLearningChamberRoom from './rooms/DeepLearningChamberRoom';
import ProjectVaultRoom from './rooms/ProjectVaultRoom';
import CareerObservatoryRoom from './rooms/CareerObservatoryRoom';
import AISystemsLabRoom from './rooms/AISystemsLabRoom';
import CertificationArchiveRoom from './rooms/CertificationArchiveRoom';
import RecruiterCenterRoom from './rooms/RecruiterCenterRoom';
import ContactTerminalRoom from './rooms/ContactTerminalRoom';
import Corridor from './Corridor';
import DoorwayPortals from './DoorwayPortals';
import ParticleField from './ParticleField';

function BackgroundStars() {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute stars in a sphere far away
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 150 + Math.random() * 150; // 150-300 distance
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) + (-170); // offset to center around corridor
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: '#475569',
      size: 0.3,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: false,
      depthWrite: false,
    });

    return { geometry: geo, material: mat };
  }, []);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function Scene() {
  const fogRef = useRef<THREE.Fog>(null);

  useFrame(() => {
    if (fogRef.current) {
      fogRef.current.color.setHSL(0.65, 0.4, 0.02);
    }
  });

  return (
    <>
      {/* Background color */}
      <color attach="background" args={['#030712']} />

      {/* Fog */}
      <fog attach="fog" ref={fogRef} args={['#030712', 20, 120]} />

      {/* Ambient - boosted for visibility */}
      <ambientLight intensity={0.4} color="#94a3b8" />

      {/* Global directional - primary light source */}
      <directionalLight position={[10, 20, 10]} intensity={1.2} color="#cbd5e1" />

      {/* Secondary fill light from opposite side */}
      <directionalLight position={[-10, 15, -5]} intensity={0.4} color="#64748b" />

      {/* Background stars */}
      <BackgroundStars />

      {/* Atmospheric particles */}
      <ParticleField />

      {/* Corridor / walls connecting rooms */}
      <Corridor />

      {/* Doorway portals for navigation */}
      <DoorwayPortals />

      {/* Room 0: Entry */}
      <group position={[0, 0, 30]}>
        <EntryRoom />
      </group>

      {/* Room 1: Command Center */}
      <group position={[0, 0, -10]}>
        <CommandCenterRoom />
      </group>

      {/* Room 2: Seismic Lab */}
      <group position={[0, 0, -50]}>
        <SeismicLabRoom />
      </group>

      {/* Room 3: Agentic AI */}
      <group position={[0, 0, -90]}>
        <AgenticAICenterRoom />
      </group>

      {/* Room 4: Deep Learning */}
      <group position={[0, 0, -130]}>
        <DeepLearningChamberRoom />
      </group>

      {/* Room 5: Project Vault */}
      <group position={[0, 0, -170]}>
        <ProjectVaultRoom />
      </group>

      {/* Room 6: Career Observatory */}
      <group position={[0, 0, -210]}>
        <CareerObservatoryRoom />
      </group>

      {/* Room 7: AI Systems Lab */}
      <group position={[0, 0, -250]}>
        <AISystemsLabRoom />
      </group>

      {/* Room 8: Certification Archive */}
      <group position={[0, 0, -290]}>
        <CertificationArchiveRoom />
      </group>

      {/* Room 9: Recruiter Center */}
      <group position={[0, 0, -330]}>
        <RecruiterCenterRoom />
      </group>

      {/* Room 10: Contact Terminal */}
      <group position={[0, 0, -370]}>
        <ContactTerminalRoom />
      </group>
    </>
  );
}
