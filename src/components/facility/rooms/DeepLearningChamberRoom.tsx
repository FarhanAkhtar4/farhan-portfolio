'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export default function DeepLearningChamberRoom() {
  const beamsRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (beamsRef.current) {
      beamsRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.15 + Math.sin(timeRef.current * 3 + i * 0.5) * 0.15;
        }
      });
    }
  });

  // SAINT architecture layers
  const layers = [
    { y: 0, label: 'Input', color: '#06b6d4' },
    { y: 1.2, label: 'Self-Attention', color: '#8b5cf6' },
    { y: 2.4, label: 'Inter-Attn', color: '#10b981' },
    { y: 3.6, label: 'FFN', color: '#f59e0b' },
    { y: 4.8, label: 'Classification', color: '#ec4899' },
  ];

  // Feature nodes
  const features = Array.from({ length: 12 }, (_, i) => ({
    x: -3 + (i % 4) * 2,
    y: 0.5 + Math.floor(i / 4) * 2,
    z: -3 + (i % 3) * 2,
  }));

  return (
    <group>
      {/* SAINT tower */}
      <group position={[0, 1, 0]}>
        {layers.map((layer, i) => (
          <group key={i} position={[0, layer.y, 0]}>
            <mesh>
              <boxGeometry args={[4, 0.3, 2]} />
              <meshStandardMaterial
                color="#111827"
                emissive={layer.color}
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <Billboard position={[0, 0, 1.3]}>
              <Text fontSize={0.12} color={layer.color} anchorX="center">
                {layer.label}
              </Text>
            </Billboard>
          </group>
        ))}

        {/* Attention flow light beams */}
        <group ref={beamsRef}>
          {layers.slice(0, -1).map((_, i) => (
            <mesh key={i} position={[0, layers[i].y + 0.75, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.9, 4]} />
              <meshBasicMaterial color="#8b5cf6" transparent opacity={0.45} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Feature nodes that activate */}
      {features.map((feat, i) => (
        <Float key={i} speed={0.8 + i * 0.1} rotationIntensity={0.1} floatIntensity={0.15}>
          <mesh position={[feat.x + 3, feat.y, feat.z]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={0.4 + (i % 3) * 0.2}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}

      {/* Training convergence screen */}
      <group position={[-4, 3, -3]}>
        <mesh>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial
            color="#111827"
            emissive="#0e7490"
            emissiveIntensity={0.2}
          />
        </mesh>
        <Billboard position={[0, 0.8, 0.1]}>
          <Text fontSize={0.15} color="#10b981" anchorX="center">
            Training Convergence
          </Text>
        </Billboard>
        <Billboard position={[0, 0.3, 0.1]}>
          <Text fontSize={0.1} color="#475569" anchorX="center">
            Loss decreasing
          </Text>
        </Billboard>
        {/* Convergence curve (simplified as a diagonal line) */}
        <mesh position={[0, -0.3, 0.08]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[2.2, 0.03, 0.01]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Title */}
      <Billboard position={[0, 7.5, 0]}>
        <Text fontSize={0.3} color="#8b5cf6" anchorX="center" anchorY="middle">
          DEEP LEARNING CHAMBER
        </Text>
      </Billboard>
      <Billboard position={[0, 7, 0]}>
        <Text fontSize={0.12} color="#94a3b8" anchorX="center">
          SAINT Model | Self-Attention | Intersample Attention
        </Text>
      </Billboard>

      <pointLight position={[0, 4, 0]} color="#8b5cf6" intensity={1.5} distance={12} />

      <Billboard position={[0, 8.5, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 04 - DEEP LEARNING CHAMBER
        </Text>
      </Billboard>
    </group>
  );
}
