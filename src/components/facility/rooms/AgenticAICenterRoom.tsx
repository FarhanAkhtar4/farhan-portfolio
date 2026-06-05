'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

function Agent({ position: positionProp, color, label, speed }: {
  position: [number, number, number];
  color: string;
  label: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(Math.random() * Math.PI * 2);
  const posRef = useRef<[number, number, number]>(positionProp);
  // Keep posRef in sync with the latest prop (avoids stale useFrame closures)
  posRef.current = positionProp;

  useFrame((_, delta) => {
    timeRef.current += delta * speed;
    const pos = posRef.current;
    if (ref.current && pos) {
      ref.current.position.x = pos[0] + Math.sin(timeRef.current) * 2;
      ref.current.position.z = pos[2] + Math.cos(timeRef.current * 0.7) * 1.5;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={positionProp}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <Billboard position={positionProp}>
        <Text fontSize={0.1} color={color} anchorX="center" anchorY="middle" position={[0, 0.55, 0]}>
          {label}
        </Text>
      </Billboard>
    </group>
  );
}

function ToolCube({ from, to, color, speed }: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(Math.random() * Math.PI * 2);
  const fromVec = useRef(new THREE.Vector3(...from));
  const toVec = useRef(new THREE.Vector3(...to));

  useFrame((_, delta) => {
    timeRef.current += delta * speed;
    const t = (Math.sin(timeRef.current) + 1) / 2;
    if (ref.current) {
      ref.current.position.lerpVectors(fromVec.current, toVec.current, t);
    }
  });

  return (
    <mesh ref={ref} position={from}>
      <boxGeometry args={[0.12, 0.12, 0.12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default function AgenticAICenterRoom() {
  const memoryRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (memoryRef.current) {
      const scale = 1 + Math.sin(timeRef.current * 2) * 0.1;
      memoryRef.current.scale.set(scale, scale, scale);
    }
  });

  const agents = [
    { position: [-2.5, 2.5, 0] as [number, number, number], color: '#06b6d4', label: 'Research', speed: 0.8 },
    { position: [2.5, 2.5, 0] as [number, number, number], color: '#8b5cf6', label: 'Code', speed: 0.6 },
    { position: [0, 3.5, -2] as [number, number, number], color: '#10b981', label: 'Analysis', speed: 1.0 },
    { position: [-1.5, 2.5, 2] as [number, number, number], color: '#f59e0b', label: 'Planning', speed: 0.7 },
    { position: [1.5, 2.5, 2] as [number, number, number], color: '#ec4899', label: 'Execution', speed: 0.9 },
  ];

  return (
    <group>
      {/* Central table */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.2, 8]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Memory sphere (pulsing) */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[0, 2.5, 0]}>
          <mesh ref={memoryRef}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={0.6}
              transparent
              opacity={0.5}
              wireframe
            />
          </mesh>
          <Billboard position={[0, 0.6, 0]}>
            <Text fontSize={0.1} color="#8b5cf6" anchorX="center">
              MEMORY
            </Text>
          </Billboard>
        </group>
      </Float>

      {/* Agents */}
      {agents.map((agent, i) => (
        <Agent key={i} {...agent} />
      ))}

      {/* Tool call cubes flying between agents */}
      <ToolCube from={[-2.5, 2.5, 0]} to={[2.5, 2.5, 0]} color="#06b6d4" speed={1.5} />
      <ToolCube from={[0, 3.5, -2]} to={[-1.5, 2.5, 2]} color="#10b981" speed={1.2} />
      <ToolCube from={[2.5, 2.5, 0]} to={[1.5, 2.5, 2]} color="#f59e0b" speed={1.8} />

      {/* Info text */}
      <Billboard position={[0, 5.5, 0]}>
        <Text fontSize={0.25} color="#8b5cf6" anchorX="center" anchorY="middle">
          AGENTIC AI COMMAND CENTER
        </Text>
      </Billboard>
      <Billboard position={[0, 5, 0]}>
        <Text fontSize={0.12} color="#94a3b8" anchorX="center">
          5 Specialized Agents | RAG Pipeline | Multi-Agent Orchestration
        </Text>
      </Billboard>

      {/* Lighting */}
      <pointLight position={[0, 4, 0]} color="#8b5cf6" intensity={1.5} distance={12} />
      <pointLight position={[-3, 2, 0]} color="#06b6d4" intensity={1.5} distance={8} />
      <pointLight position={[3, 2, 0]} color="#10b981" intensity={1.5} distance={8} />

      <Billboard position={[0, 7, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 03 - AGENTIC AI COMMAND CENTER
        </Text>
      </Billboard>
    </group>
  );
}
