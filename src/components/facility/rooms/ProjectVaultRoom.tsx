'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '@/lib/data';

export default function ProjectVaultRoom() {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  const displayProjects = projects.filter((p) => p.isFlagship).slice(0, 6);
  // Fill remaining slots with non-flagship projects
  const remaining = projects.filter((p) => !p.isFlagship).slice(0, 6 - displayProjects.length);
  const allDisplay = [...displayProjects, ...remaining];

  return (
    <group>
      {/* Corridor of project tiles */}
      <group position={[0, 2, 0]}>
        {allDisplay.map((project, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const x = -3 + col * 3;
          const z = -2 + row * 4;
          const isFlagship = project.isFlagship;

          return (
            <Float key={project.id} speed={0.5 + i * 0.1} rotationIntensity={0.05} floatIntensity={0.15}>
              <group position={[x, 0, z]}>
                {/* Glass panel tile */}
                <mesh>
                  <boxGeometry args={[2.5, 3, 0.08]} />
                  <meshStandardMaterial
                    color={isFlagship ? '#0a1628' : '#080e18'}
                    emissive={isFlagship ? '#06b6d4' : '#1e293b'}
                    emissiveIntensity={isFlagship ? 0.15 : 0.05}
                    transparent
                    opacity={0.85}
                    roughness={0.2}
                    metalness={0.6}
                  />
                </mesh>

                {/* Flagship glow edge */}
                {isFlagship && (
                  <mesh position={[0, 0, 0.01]}>
                    <boxGeometry args={[2.6, 3.1, 0.02]} />
                    <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
                  </mesh>
                )}

                {/* Title */}
                <Billboard position={[0, 1, 0.1]}>
                  <Text
                    fontSize={0.13}
                    color={isFlagship ? '#06b6d4' : '#94a3b8'}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2.2}
                  >
                    {project.title}
                  </Text>
                </Billboard>

                {/* One liner */}
                <Billboard position={[0, 0.3, 0.1]}>
                  <Text
                    fontSize={0.08}
                    color="#64748b"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2}
                  >
                    {project.oneLiner}
                  </Text>
                </Billboard>

                {/* Tags */}
                <Billboard position={[0, -0.8, 0.1]}>
                  <Text
                    fontSize={0.07}
                    color="#475569"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2.2}
                  >
                    {project.tags.join(' · ')}
                  </Text>
                </Billboard>

                {/* Category badge */}
                <mesh position={[0, -1.3, 0.06]}>
                  <planeGeometry args={[1.5, 0.2]} />
                  <meshBasicMaterial
                    color={isFlagship ? '#06b6d4' : '#1e293b'}
                    transparent
                    opacity={0.3}
                  />
                </mesh>
                <Billboard position={[0, -1.3, 0.08]}>
                  <Text fontSize={0.07} color="#94a3b8" anchorX="center" anchorY="middle">
                    {project.category}
                  </Text>
                </Billboard>
              </group>
            </Float>
          );
        })}
      </group>

      {/* Title */}
      <Billboard position={[0, 6.5, 0]}>
        <Text fontSize={0.3} color="#f59e0b" anchorX="center" anchorY="middle">
          PROJECT VAULT
        </Text>
      </Billboard>
      <Billboard position={[0, 6, 0]}>
        <Text fontSize={0.12} color="#94a3b8" anchorX="center">
          {projects.length} Projects | Deep Learning · Agentic AI · SaaS
        </Text>
      </Billboard>

      <pointLight position={[0, 4, 0]} color="#f59e0b" intensity={0.4} distance={12} />

      <Billboard position={[0, 7.5, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 05 - PROJECT VAULT
        </Text>
      </Billboard>
    </group>
  );
}
