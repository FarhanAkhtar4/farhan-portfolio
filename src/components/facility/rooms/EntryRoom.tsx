'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useFacilityStore } from '@/store/facility-store';

export default function EntryRoom() {
  const pulseRef = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);
  const doorRef = useRef<THREE.Mesh>(null);
  const doorMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const hasEntered = useFacilityStore((s) => s.hasEntered);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (pulseRef.current) {
      pulseRef.current.intensity = 1.5 + Math.sin(timeRef.current * 2) * 0.5;
    }
    // Hover glow effect on door
    if (doorMaterialRef.current) {
      const base = 0.0;
      const hoverGlow = hovered ? 0.15 : 0;
      doorMaterialRef.current.emissiveIntensity = base + hoverGlow;
    }
  });

  const handleDoorClick = () => {
    const store = useFacilityStore.getState();
    if (!store.hasEntered) {
      store.setHasEntered(true);
      store.setCurrentRoom(1);
    }
  };

  return (
    <group>
      {/* Exterior building structure */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[12, 8, 8]} />
        <meshStandardMaterial
          color="#0a1628"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 8.5, 0]}>
        <boxGeometry args={[13, 0.5, 9]} />
        <meshStandardMaterial
          color="#0d1b2a"
          emissive="#0e7490"
          emissiveIntensity={0.1}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Emissive window lines on building */}
      {[-2, 0, 2].map((z) =>
        [-3, 3].map((x) => (
          <mesh key={`${x}-${z}`} position={[x, 5.5, z]}>
            <boxGeometry args={[1.5, 0.08, 0.08]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
          </mesh>
        ))
      )}

      {/* Door frame */}
      <mesh position={[0, 2.5, 4]}>
        <boxGeometry args={[3, 5, 0.3]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#0e7490"
          emissiveIntensity={0.3}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Door opening (darker inset) - CLICKABLE */}
      <mesh
        ref={doorRef}
        position={[0, 2.5, 4.05]}
        onClick={handleDoorClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[2.2, 4, 0.1]} />
        <meshStandardMaterial
          ref={doorMaterialRef}
          color="#020617"
          emissive="#06b6d4"
          emissiveIntensity={0}
          roughness={1}
        />
      </mesh>

      {/* Pulsing neon line around door */}
      <mesh position={[0, 5.1, 4.02]}>
        <boxGeometry args={[2.4, 0.1, 0.1]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.1, 4.02]}>
        <boxGeometry args={[2.4, 0.1, 0.1]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
      </mesh>

      {/* Door pulse light */}
      <pointLight
        ref={pulseRef}
        position={[0, 2.5, 5]}
        color="#06b6d4"
        intensity={1.5}
        distance={12}
        decay={2}
      />

      {/* "CLICK TO ENTER" billboard above door - only when not entered */}
      {!hasEntered && (
        <Billboard position={[0, 5.8, 4.5]}>
          <Text
            fontSize={0.2}
            color="#06b6d4"
            anchorX="center"
            anchorY="middle"
          >
            CLICK TO ENTER
          </Text>
        </Billboard>
      )}

      {/* "FARHAN AI RESEARCH FACILITY" text on building */}
      <Billboard position={[0, 7.5, 4.1]}>
        <Text
          fontSize={0.4}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
        >
          FARHAN AI RESEARCH FACILITY
        </Text>
      </Billboard>

      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3]}>
        <planeGeometry args={[8, 4]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.05} />
      </mesh>

      {/* Side accent lights */}
      <pointLight position={[-6, 3, 0]} color="#8b5cf6" intensity={0.3} distance={8} />
      <pointLight position={[6, 3, 0]} color="#8b5cf6" intensity={0.3} distance={8} />

      {/* Floating data particles */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[-4, 3, 2]}>
          <mesh>
            <octahedronGeometry args={[0.15]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <group position={[4, 4, 1]}>
          <mesh>
            <octahedronGeometry args={[0.12]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
          </mesh>
        </group>
      </Float>
      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.6}>
        <group position={[3, 2, 3]}>
          <mesh>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
