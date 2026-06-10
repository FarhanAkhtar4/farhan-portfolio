'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useState } from 'react';

function StatCounter({ target, suffix, sub, position, color }: {
  target: number;
  suffix: string;
  sub: string;
  position: [number, number, number];
  color: string;
}) {
  const timeRef = useRef(0);
  const [displayText, setDisplayText] = useState('0');

  useFrame((_, delta) => {
    timeRef.current += delta;
    // Ease-in count-up over 2 seconds
    const t = Math.min(1, timeRef.current / 2);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const newVal = Math.round(eased * target);
    const newText = `${newVal}${suffix}`;
    if (newText !== displayText) {
      setDisplayText(newText);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position}>
        <mesh>
          <boxGeometry args={[1.8, 1.2, 0.05]} />
          <meshStandardMaterial
            color="#111827"
            emissive={color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        <Billboard position={[0, 0.25, 0.04]}>
          <Text fontSize={0.3} color={color} anchorX="center" anchorY="middle">
            {displayText}
          </Text>
        </Billboard>
        <Billboard position={[0, -0.15, 0.04]}>
          <Text fontSize={0.12} color="#94a3b8" anchorX="center" anchorY="middle">
            {sub}
          </Text>
        </Billboard>
      </group>
    </Float>
  );
}

export default function CommandCenterRoom() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Holographic pedestal */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2, 2.5, 0.6, 8]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#0e7490"
          emissiveIntensity={0.4}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Holographic bust placeholder */}
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.2}>
        <group ref={groupRef} position={[0, 2.5, 0]}>
          {/* Head placeholder */}
          <mesh>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
              wireframe
            />
          </mesh>
          {/* Shoulders */}
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[1.4, 0.4, 0.6]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
              wireframe
            />
          </mesh>
          {/* Holographic scan lines */}
          <mesh position={[0, -0.3, 0.65]}>
            <planeGeometry args={[1.2, 2]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.12} />
          </mesh>
        </group>
      </Float>

      {/* Spotlight on bust */}
      <spotLight
        position={[0, 7, 0]}
        angle={0.4}
        penumbra={0.8}
        color="#06b6d4"
        intensity={3}
        distance={10}
        decay={2}
      />

      {/* Animated stat counters */}
      <StatCounter target={22} suffix="%" sub="Accuracy Gain" position={[-4, 3, -2]} color="#10b981" />
      <StatCounter target={6} suffix="+" sub="Projects" position={[4, 3, -2]} color="#8b5cf6" />
      <StatCounter target={11} suffix="+" sub="Certifications" position={[-4, 3, 2]} color="#f59e0b" />
      <StatCounter target={100} suffix="%" sub="RAG Pipeline" position={[4, 3, 2]} color="#06b6d4" />

      {/* Name plate */}
      <Billboard position={[0, 5.5, 0]}>
        <Text fontSize={0.35} color="#e2e8f0" anchorX="center" anchorY="middle">
          FARHAN AKHTAR MAKANDAR
        </Text>
      </Billboard>
      <Billboard position={[0, 5, 0]}>
        <Text fontSize={0.15} color="#06b6d4" anchorX="center" anchorY="middle">
          ML Systems Engineer
        </Text>
      </Billboard>

      {/* Ambient glow */}
      <pointLight position={[0, 2, 0]} color="#06b6d4" intensity={1.5} distance={10} />

      {/* Room label */}
      <Billboard position={[0, 7, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 01 - COMMAND CENTER
        </Text>
      </Billboard>
    </group>
  );
}
