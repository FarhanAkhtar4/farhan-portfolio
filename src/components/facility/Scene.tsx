'use client';

import { useRef } from 'react';
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

export default function Scene() {
  const fogRef = useRef<THREE.Fog>(null);

  useFrame(() => {
    if (fogRef.current) {
      fogRef.current.color.setHSL(0.65, 0.4, 0.02);
    }
  });

  return (
    <>
      {/* Fog */}
      <fog attach="fog" ref={fogRef} args={['#030712', 15, 80]} />

      {/* Ambient */}
      <ambientLight intensity={0.08} color="#4a5568" />

      {/* Global directional */}
      <directionalLight position={[10, 20, 10]} intensity={0.3} color="#94a3b8" />

      {/* Corridor / walls connecting rooms */}
      <Corridor />

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
