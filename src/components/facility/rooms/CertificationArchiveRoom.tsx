'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { certifications, certCategories } from '@/lib/data';

const categoryColors: Record<string, string> = {
  'AI & ML': '#8b5cf6',
  'GenAI & Agentic AI': '#f59e0b',
  'Cloud & Data': '#06b6d4',
  'Other': '#10b981',
};

export default function CertificationArchiveRoom() {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  const certs = certifications.slice(0, 8);

  return (
    <group>
      {/* Floating badge cards */}
      {certs.map((cert, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = -4.5 + col * 3;
        const z = -1.5 + row * 4;
        const color = categoryColors[cert.category] || '#06b6d4';

        return (
          <Float key={i} speed={0.6 + i * 0.1} rotationIntensity={0.08} floatIntensity={0.2}>
            <group position={[x, 3, z]}>
              {/* Badge card */}
              <mesh>
                <boxGeometry args={[2.5, 3, 0.06]} />
                <meshStandardMaterial
                  color="#111827"
                  emissive={color}
                  emissiveIntensity={0.24}
                  transparent
                  opacity={0.85}
                  roughness={0.2}
                  metalness={0.5}
                />
              </mesh>

              {/* Border glow */}
              <mesh position={[0, 0, -0.01]}>
                <boxGeometry args={[2.6, 3.1, 0.02]} />
                <meshBasicMaterial color={color} transparent opacity={0.12} />
              </mesh>

              {/* Category dot */}
              <mesh position={[-0.9, 1.1, 0.05]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color={color} />
              </mesh>

              {/* Category label */}
              <Billboard position={[-0.5, 1.1, 0.06]}>
                <Text fontSize={0.07} color={color} anchorX="left">
                  {cert.category}
                </Text>
              </Billboard>

              {/* Cert title */}
              <Billboard position={[0, 0.4, 0.06]}>
                <Text
                  fontSize={0.1}
                  color="#e2e8f0"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2.2}
                >
                  {cert.title}
                </Text>
              </Billboard>

              {/* Issuer */}
              <Billboard position={[0, -0.2, 0.06]}>
                <Text fontSize={0.08} color="#94a3b8" anchorX="center">
                  {cert.issuer}
                </Text>
              </Billboard>

              {/* Verify badge */}
              {cert.verifyUrl && (
                <mesh position={[0, -0.8, 0.05]}>
                  <planeGeometry args={[1.2, 0.2]} />
                  <meshBasicMaterial color="#10b981" transparent opacity={0.25} />
                </mesh>
              )}

              {cert.verifyUrl && (
                <Billboard position={[0, -0.8, 0.07]}>
                  <Text fontSize={0.06} color="#10b981" anchorX="center" anchorY="middle">
                    VERIFIED
                  </Text>
                </Billboard>
              )}
            </group>
          </Float>
        );
      })}

      {/* Title */}
      <Billboard position={[0, 6.5, 0]}>
        <Text fontSize={0.3} color="#f59e0b" anchorX="center" anchorY="middle">
          CERTIFICATION ARCHIVE
        </Text>
      </Billboard>
      <Billboard position={[0, 6, 0]}>
        <Text fontSize={0.12} color="#94a3b8" anchorX="center">
          {certifications.length} Certifications | IBM · NVIDIA · AWS · Oracle
        </Text>
      </Billboard>

      <pointLight position={[0, 4, 0]} color="#f59e0b" intensity={1.5} />

      <Billboard position={[0, 7.5, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 08 - CERTIFICATION ARCHIVE
        </Text>
      </Billboard>
    </group>
  );
}
