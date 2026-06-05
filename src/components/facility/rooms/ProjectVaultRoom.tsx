'use client';

import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { projects, type Project } from '@/lib/data';

function ProjectDetailPanel({ project, onClose, position }: {
  project: Project;
  onClose: () => void;
  position: [number, number, number];
}) {
  const panelRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [panelOpacity, setPanelOpacity] = useState(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    // Fade in
    if (panelOpacity < 1) {
      const newOp = Math.min(1, panelOpacity + delta * 2);
      setPanelOpacity(newOp);
    }
    // Subtle float
    if (panelRef.current) {
      panelRef.current.position.y = position[1] + Math.sin(timeRef.current * 0.5) * 0.05;
    }
  });

  return (
    <group ref={panelRef} position={position}>
      {/* Expanded detail panel */}
      <mesh onClick={onClose}>
        <boxGeometry args={[6, 5, 0.1]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#06b6d4"
          emissiveIntensity={0.2}
          transparent
          opacity={0.9 * panelOpacity}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Border glow */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[6.1, 5.1, 0.02]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15 * panelOpacity} />
      </mesh>

      {/* Title */}
      <Billboard position={[0, 1.8, 0.15]}>
        <Text fontSize={0.22} color="#06b6d4" anchorX="center" anchorY="middle" maxWidth={5.5}>
          {project.title}
        </Text>
      </Billboard>

      {/* Description */}
      <Billboard position={[0, 1.1, 0.15]}>
        <Text fontSize={0.1} color="#e2e8f0" anchorX="center" anchorY="middle" maxWidth={5.2}>
          {project.description}
        </Text>
      </Billboard>

      {/* Highlights */}
      {project.highlights?.slice(0, 4).map((h, i) => (
        <Billboard key={i} position={[0, 0.4 - i * 0.3, 0.15]}>
          <Text fontSize={0.07} color="#94a3b8" anchorX="center" anchorY="middle" maxWidth={5}>
            {'\u2022 ' + h}
          </Text>
        </Billboard>
      ))}

      {/* Tags */}
      <Billboard position={[0, -1.2, 0.15]}>
        <Text fontSize={0.08} color="#8b5cf6" anchorX="center" anchorY="middle" maxWidth={5}>
          {project.tags.join(' \u00B7 ')}
        </Text>
      </Billboard>

      {/* Category */}
      <mesh position={[0, -1.7, 0.08]}>
        <planeGeometry args={[2, 0.25]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
      </mesh>
      <Billboard position={[0, -1.7, 0.12]}>
        <Text fontSize={0.09} color="#06b6d4" anchorX="center" anchorY="middle">
          {project.category}
        </Text>
      </Billboard>

      {/* Close button */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.05}>
        <mesh position={[0, -2.1, 0.15]} onClick={onClose}>
          <boxGeometry args={[2, 0.35, 0.05]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Billboard position={[0, -2.1, 0.2]}>
          <Text fontSize={0.12} color="#020617" anchorX="center" anchorY="middle" onClick={onClose}>
            CLOSE
          </Text>
        </Billboard>
      </Float>
    </group>
  );
}

export default function ProjectVaultRoom() {
  const timeRef = useRef(0);
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  const displayProjects = projects.filter((p) => p.isFlagship).slice(0, 6);
  const remaining = projects.filter((p) => !p.isFlagship).slice(0, 6 - displayProjects.length);
  const allDisplay = [...displayProjects, ...remaining];

  const handleTileClick = useCallback((project: Project) => {
    setExpandedProject((prev) => (prev?.id === project.id ? null : project));
  }, []);

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
          const isSelected = expandedProject?.id === project.id;

          return (
            <Float key={project.id} speed={0.5 + i * 0.1} rotationIntensity={0.05} floatIntensity={0.15}>
              <group
                position={[x, 0, z]}
                onClick={() => handleTileClick(project)}
                onPointerOver={() => {
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'default';
                }}
              >
                {/* Glass panel tile */}
                <mesh>
                  <boxGeometry args={[2.5, 3, 0.08]} />
                  <meshStandardMaterial
                    color="#0a1628"
                    emissive={isSelected ? '#06b6d4' : (isFlagship ? '#06b6d4' : '#1e293b')}
                    emissiveIntensity={isSelected ? 0.3 : (isFlagship ? 0.15 : 0.05)}
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
                    <meshBasicMaterial color="#06b6d4" transparent opacity={isSelected ? 0.25 : 0.1} />
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
                    {project.tags.join(' \u00B7 ')}
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

                {/* Selected indicator */}
                {isSelected && (
                  <Billboard position={[0, -1.7, 0.1]}>
                    <Text fontSize={0.09} color="#06b6d4" anchorX="center" anchorY="middle">
                      SELECTED
                    </Text>
                  </Billboard>
                )}
              </group>
            </Float>
          );
        })}
      </group>

      {/* Expanded detail panel */}
      {expandedProject && (
        <ProjectDetailPanel
          project={expandedProject}
          onClose={() => setExpandedProject(null)}
          position={[0, 4, 6]}
        />
      )}

      {/* Title */}
      <Billboard position={[0, 6.5, 0]}>
        <Text fontSize={0.3} color="#f59e0b" anchorX="center" anchorY="middle">
          PROJECT VAULT
        </Text>
      </Billboard>
      <Billboard position={[0, 6, 0]}>
        <Text fontSize={0.12} color="#94a3b8" anchorX="center">
          {projects.length} Projects | Deep Learning \u00B7 Agentic AI \u00B7 SaaS
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
