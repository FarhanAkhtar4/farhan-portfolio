'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const CONNECTION_LINES: [number, number, number][][[number, number, number]] = [
  [[-2, 2, 0], [-1, 2, 0]],
  [[-1, 2, 0], [0, 2, 0]],
  [[0, 2, 0], [1, 2, 0]],
  [[1, 2, 0], [2, 2, 0]],
  [[-2, 1, 1], [-2, 2, 0]],
  [[2, 2, 0], [2, 1, 1]],
];

export default function SeismicLabRoom() {
  const networkRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (networkRef.current) {
      networkRef.current.rotation.y = timeRef.current * 0.15;
    }
  });

  // Neural network nodes for TFT architecture
  const nodes = [
    { pos: [-2, 2, 0] as [number, number, number], label: 'Input' },
    { pos: [-1, 2, 0] as [number, number, number], label: 'Var Sel' },
    { pos: [0, 2, 0] as [number, number, number], label: 'LSTM' },
    { pos: [1, 2, 0] as [number, number, number], label: 'Attn' },
    { pos: [2, 2, 0] as [number, number, number], label: 'Output' },
    { pos: [-2, 1, 1] as [number, number, number], label: 'TS Data' },
    { pos: [2, 1, 1] as [number, number, number], label: 'Predict' },
  ];

  // Pre-compute connection line data to avoid creating Vector3 in render
  const connectionData = useMemo(() => {
    return CONNECTION_LINES.map((line) => {
      const start = new THREE.Vector3(...line[0]);
      const end = new THREE.Vector3(...line[1]);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const dir = end.clone().sub(start);
      const length = dir.length();
      return { mid, length, rotY: Math.atan2(dir.x, dir.z) };
    });
  }, []);

  return (
    <group>
      {/* Central 3D neural network graph */}
      <group ref={networkRef} position={[0, 3, 0]}>
        {nodes.map((node, i) => (
          <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.3} floatIntensity={0.3}>
            <group position={node.pos}>
              <mesh>
                <sphereGeometry args={[0.25, 12, 12]} />
                <meshStandardMaterial
                  color="#10b981"
                  emissive="#10b981"
                  emissiveIntensity={0.4}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              <Billboard position={[0, 0.4, 0]}>
                <Text fontSize={0.1} color="#94a3b8" anchorX="center">
                  {node.label}
                </Text>
              </Billboard>
            </group>
          </Float>
        ))}

        {/* Connection lines between nodes */}
        {connectionData.map((data, i) => (
            <mesh
              key={i}
              position={[data.mid.x, data.mid.y, data.mid.z]}
              rotation={[0, data.rotY, 0]}
            >
              <cylinderGeometry args={[0.01, 0.01, data.length, 4]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
            </mesh>
        ))}
      </group>

      {/* Comparison bars - 22% improvement */}
      {[
        { label: 'XGBoost', value: 0.6, color: '#475569', pos: -3.5 },
        { label: 'KNN', value: 0.5, color: '#475569', pos: -2 },
        { label: 'TFT (Ours)', value: 0.85, color: '#10b981', pos: -0.5 },
      ].map((bar) => (
        <group key={bar.label} position={[4, 1 + bar.pos * 1.2, 0]}>
          <Billboard position={[-1.5, 0, 0]}>
            <Text fontSize={0.12} color="#94a3b8" anchorX="right">
              {bar.label}
            </Text>
          </Billboard>
          <mesh>
            <boxGeometry args={[bar.value * 2.5, 0.3, 0.2]} />
            <meshStandardMaterial
              color={bar.color}
              emissive={bar.color}
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[bar.value * 1.25 + 0.15, 0, 0.15]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
          </mesh>
        </group>
      ))}

      {/* 22% improvement marker */}
      <Billboard position={[4, 4.5, 0]}>
        <Text fontSize={0.35} color="#10b981" anchorX="center" anchorY="middle">
          22% IMPROVEMENT
        </Text>
      </Billboard>

      {/* Display panel (wall screen placeholder) */}
      <mesh position={[0, 4, -5]}>
        <boxGeometry args={[8, 3, 0.1]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#0e7490"
          emissiveIntensity={0.1}
        />
      </mesh>
      <Billboard position={[0, 4.8, -4.8]}>
        <Text fontSize={0.12} color="#06b6d4" anchorX="center">
          SEISMIC RESPONSE PREDICTION - TFT ARCHITECTURE
        </Text>
      </Billboard>

      {/* Lighting */}
      <pointLight position={[0, 5, 0]} color="#10b981" intensity={0.5} distance={12} />
      <pointLight position={[4, 2, 0]} color="#06b6d4" intensity={0.3} distance={8} />

      <Billboard position={[0, 7, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 02 - SEISMIC RESEARCH LAB
        </Text>
      </Billboard>
    </group>
  );
}
