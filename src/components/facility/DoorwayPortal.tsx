'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useFacilityStore } from '@/store/facility-store';

interface DoorwayPortalProps {
  position: [number, number, number];
  targetRoomIndex: number;
  direction: 'forward' | 'backward';
}

export default function DoorwayPortal({
  position,
  targetRoomIndex,
  direction,
}: DoorwayPortalProps) {
  const hasEntered = useFacilityStore((s) => s.hasEntered);
  const isTransitioning = useFacilityStore((s) => s.isTransitioning);
  const setCurrentRoom = useFacilityStore((s) => s.setCurrentRoom);
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const portalMeshRef = useRef<THREE.Mesh>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);
  const arrowMeshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const portalMat = portalMeshRef.current?.material as THREE.MeshBasicMaterial | undefined;
    const glowMat = glowMeshRef.current?.material as THREE.MeshBasicMaterial | undefined;
    const arrowMat = arrowMeshRef.current?.material as THREE.MeshBasicMaterial | undefined;

    if (portalMat) {
      const pulse = Math.sin(timeRef.current * 2.5) * 0.5 + 0.5;
      portalMat.opacity = 0.1 + pulse * 0.12 + (hovered ? 0.15 : 0);
    }
    if (glowMat) {
      const pulse = Math.sin(timeRef.current * 2.5 + 0.5) * 0.5 + 0.5;
      glowMat.opacity = 0.03 + pulse * 0.05;
    }
    if (arrowMat) {
      const pulse = Math.sin(timeRef.current * 2.5) * 0.5 + 0.5;
      arrowMat.opacity = 0.5 + pulse * 0.4;
    }
    if (arrowMeshRef.current) {
      const bob = Math.sin(timeRef.current * 2) * 0.05;
      arrowMeshRef.current.position.y = position[1] + 1.2 + bob;
    }
  });

  if (!hasEntered) return null;

  const handleClick = () => {
    if (!isTransitioning) {
      setCurrentRoom(targetRoomIndex);
    }
  };

  const arrowZ = direction === 'forward' ? -0.15 : 0.15;
  const arrowRotZ = direction === 'forward' ? 0 : Math.PI;

  return (
    <group position={position}>
      {/* Main portal plane */}
      <mesh
        ref={portalMeshRef}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <planeGeometry args={[4.5, 6]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Glow backdrop */}
      <mesh ref={glowMeshRef}>
        <planeGeometry args={[5.5, 7]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Arrow cone */}
      <mesh
        ref={arrowMeshRef}
        position={[0, position[1] + 1.2, arrowZ]}
        rotation={[Math.PI / 2, 0, arrowRotZ]}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <coneGeometry args={[0.25, 0.5, 6]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Direction label */}
      <Billboard position={[0, position[1] + 2, 0.05]}>
        <Text
          fontSize={0.18}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
        >
          {direction === 'forward' ? '\u25B6 NEXT' : '\u25C0 PREV'}
        </Text>
      </Billboard>
    </group>
  );
}
