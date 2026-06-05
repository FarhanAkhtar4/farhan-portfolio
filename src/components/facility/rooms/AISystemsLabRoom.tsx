'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { skillCategories } from '@/lib/data';

const iconGeometries: (() => THREE.BufferGeometry)[] = [
  () => new THREE.BoxGeometry(0.3, 0.3, 0.3),      // Languages - cube
  () => new THREE.SphereGeometry(0.2, 12, 12),     // ML/DL - sphere
  () => new THREE.OctahedronGeometry(0.25),         // LLM/Agentic - octahedron
  () => new THREE.ConeGeometry(0.2, 0.4, 6),       // Data Science - cone
  () => new THREE.TorusGeometry(0.2, 0.06, 8, 12), // Cloud - torus
];

export default function AISystemsLabRoom() {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  return (
    <group>
      {/* Floating 3D plinths in a gallery layout */}
      {skillCategories.map((cat, i) => {
        const angle = (i / skillCategories.length) * Math.PI * 2;
        const radius = 3.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899'];
        const color = colors[i % colors.length];
        const Geo = iconGeometries[i % iconGeometries.length];

        return (
          <Float key={cat.name} speed={0.6 + i * 0.15} rotationIntensity={0.15} floatIntensity={0.3}>
            <group position={[x, 2.5, z]}>
              {/* Plinth base */}
              <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.5, 0.6, 0.15, 8]} />
                <meshStandardMaterial
                  color="#0a1628"
                  emissive={color}
                  emissiveIntensity={0.2}
                  roughness={0.4}
                  metalness={0.4}
                />
              </mesh>

              {/* Icon */}
              <mesh geometry={Geo()}>
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.8}
                />
              </mesh>

              {/* Label panel */}
              <Billboard position={[0, -0.7, 0]}>
                <Text fontSize={0.11} color={color} anchorX="center" anchorY="middle">
                  {cat.name}
                </Text>
              </Billboard>

              {/* Skills list */}
              <Billboard position={[0, -1.1, 0]}>
                <Text
                  fontSize={0.06}
                  color="#64748b"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2}
                  lineHeight={1.4}
                >
                  {cat.skills.slice(0, 4).join(' · ')}
                </Text>
              </Billboard>

              {/* Highlight indicator */}
              {cat.highlight && (
                <pointLight position={[0, 0.3, 0]} color={color} intensity={0.5} distance={3} />
              )}
            </group>
          </Float>
        );
      })}

      {/* Central holographic hub */}
      <group position={[0, 3, 0]}>
        <mesh>
          <dodecahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
            wireframe
          />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#06b6d4" intensity={0.5} distance={5} />
      </group>

      {/* Title */}
      <Billboard position={[0, 6.5, 0]}>
        <Text fontSize={0.3} color="#10b981" anchorX="center" anchorY="middle">
          AI SYSTEMS LAB
        </Text>
      </Billboard>
      <Billboard position={[0, 6, 0]}>
        <Text fontSize={0.12} color="#94a3b8" anchorX="center">
          Technical Stack &amp; Competencies
        </Text>
      </Billboard>

      <Billboard position={[0, 7.5, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 07 - AI SYSTEMS LAB
        </Text>
      </Billboard>
    </group>
  );
}
