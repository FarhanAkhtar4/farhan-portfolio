'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { experience, education } from '@/lib/data';

const milestones = [
  ...experience.map((e) => ({ label: e.role, sub: e.company, date: e.period, color: '#06b6d4' })),
  { label: 'B.E. AI & ML', sub: 'Yenepoya Institute of Technology', date: 'Expected 2026', color: '#10b981' },
  { label: 'PUC Science', sub: 'MES PU College, Sirsi', date: '2022', color: '#8b5cf6' },
  { label: '11+ Certifications', sub: 'IBM, NVIDIA, AWS, Oracle', date: 'Ongoing', color: '#f59e0b' },
];

export default function CareerObservatoryRoom() {
  const pathRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  return (
    <group>
      {/* Glowing timeline path */}
      <group ref={pathRef}>
        {/* Main path line */}
        <mesh position={[0, 3, -4]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.06, 0.06, 16]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
        </mesh>

        {/* Milestone markers */}
        {milestones.map((ms, i) => {
          const z = 4 - i * 2.8;
          return (
            <Float key={i} speed={0.8} rotationIntensity={0.05} floatIntensity={0.2}>
              <group position={[0, 3, z]}>
                {/* Marker diamond */}
                <mesh rotation={[0, Math.PI / 4, 0]}>
                  <boxGeometry args={[0.25, 0.25, 0.25]} />
                  <meshStandardMaterial
                    color={ms.color}
                    emissive={ms.color}
                    emissiveIntensity={0.5}
                  />
                </mesh>

                {/* Text panel */}
                <mesh position={[2, 0.5, 0]}>
                  <boxGeometry args={[3, 1.2, 0.05]} />
                  <meshStandardMaterial
                    color="#0a1628"
                    emissive={ms.color}
                    emissiveIntensity={0.1}
                    transparent
                    opacity={0.8}
                  />
                </mesh>

                <Billboard position={[2, 0.8, 0.08]}>
                  <Text fontSize={0.12} color={ms.color} anchorX="center" maxWidth={2.8}>
                    {ms.label}
                  </Text>
                </Billboard>
                <Billboard position={[2, 0.4, 0.08]}>
                  <Text fontSize={0.08} color="#94a3b8" anchorX="center" maxWidth={2.8}>
                    {ms.sub}
                  </Text>
                </Billboard>
                <Billboard position={[2, 0, 0.08]}>
                  <Text fontSize={0.07} color="#64748b" anchorX="center">
                    {ms.date}
                  </Text>
                </Billboard>

                {/* Connection line to path */}
                <mesh position={[0.9, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <boxGeometry args={[0.02, 0.02, 1.1]} />
                  <meshBasicMaterial color={ms.color} transparent opacity={0.3} />
                </mesh>
              </group>
            </Float>
          );
        })}
      </group>

      {/* Title */}
      <Billboard position={[0, 6.5, 0]}>
        <Text fontSize={0.3} color="#06b6d4" anchorX="center" anchorY="middle">
          CAREER OBSERVATORY
        </Text>
      </Billboard>

      <pointLight position={[0, 4, 0]} color="#06b6d4" intensity={0.5} distance={12} />

      <Billboard position={[0, 7.5, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 06 - CAREER OBSERVATORY
        </Text>
      </Billboard>
    </group>
  );
}
