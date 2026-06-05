'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export default function ContactTerminalRoom() {
  const timeRef = useRef(0);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (scanRef.current) {
      scanRef.current.position.y = 2 + Math.sin(timeRef.current * 1.5) * 2;
    }
  });

  return (
    <group>
      {/* Communication console structure */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[3, 3, 1]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#0e7490"
          emissiveIntensity={0.15}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Console screen */}
      <mesh position={[0, 2.5, 0.52]}>
        <boxGeometry args={[2.5, 1.8, 0.05]} />
        <meshStandardMaterial
          color="#020617"
          emissive="#06b6d4"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Screen border */}
      <mesh position={[0, 2.5, 0.53]}>
        <boxGeometry args={[2.6, 1.9, 0.02]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
      </mesh>

      {/* Scanning line */}
      <mesh ref={scanRef} position={[0, 2.5, 0.56]}>
        <boxGeometry args={[2.3, 0.02, 0.01]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
      </mesh>

      {/* Input fields (placeholder) */}
      {['NAME', 'SUBJECT', 'MESSAGE'].map((field, i) => (
        <group key={field} position={[0, 3.1 - i * 0.5, 0.56]}>
          <Billboard>
            <Text fontSize={0.06} color="#475569" anchorX="left" position={[-1.1, 0.1, 0]}>
              {field}
            </Text>
          </Billboard>
          <mesh position={[0, -0.05, 0]}>
            <planeGeometry args={[2, 0.2]} />
            <meshBasicMaterial color="#0e7490" transparent opacity={0.1} />
          </mesh>
        </group>
      ))}

      {/* Transmit button */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.1}>
        <group position={[0, 1, 0.56]}>
          <mesh>
            <boxGeometry args={[1.2, 0.35, 0.05]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.3}
            />
          </mesh>
          <Billboard position={[0, 0, 0.04]}>
            <Text fontSize={0.09} color="#020617" anchorX="center" anchorY="middle">
              TRANSMIT
            </Text>
          </Billboard>
        </group>
      </Float>

      {/* Console base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 2, 0.15, 8]} />
        <meshStandardMaterial color="#0a1628" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Side panels */}
      {[-1.8, 1.8].map((x) => (
        <mesh key={x} position={[x, 1.5, 0]}>
          <boxGeometry args={[0.3, 2, 0.8]} />
          <meshStandardMaterial
            color="#0a1628"
            emissive="#8b5cf6"
            emissiveIntensity={0.1}
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>
      ))}

      {/* Social links (placeholder) */}
      {[
        { label: 'GITHUB', color: '#f59e0b', pos: [-3, 3, 2] as [number, number, number] },
        { label: 'LINKEDIN', color: '#06b6d4', pos: [0, 3, 2] as [number, number, number] },
        { label: 'HUGGINGFACE', color: '#10b981', pos: [3, 3, 2] as [number, number, number] },
      ].map((link, i) => (
        <Float key={i} speed={0.8} rotationIntensity={0.05} floatIntensity={0.15}>
          <group position={link.pos}>
            <mesh>
              <boxGeometry args={[2, 0.6, 0.05]} />
              <meshStandardMaterial
                color="#0a1628"
                emissive={link.color}
                emissiveIntensity={0.15}
              />
            </mesh>
            <Billboard position={[0, 0, 0.04]}>
              <Text fontSize={0.1} color={link.color} anchorX="center" anchorY="middle">
                {link.label}
              </Text>
            </Billboard>
          </group>
        </Float>
      ))}

      {/* Title */}
      <Billboard position={[0, 6.5, 0]}>
        <Text fontSize={0.3} color="#06b6d4" anchorX="center" anchorY="middle">
          CONTACT TERMINAL
        </Text>
      </Billboard>

      <pointLight position={[0, 4, 0]} color="#06b6d4" intensity={0.5} distance={12} />
      <pointLight position={[0, 2, 1]} color="#8b5cf6" intensity={0.2} distance={6} />

      <Billboard position={[0, 7.5, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 10 - CONTACT TERMINAL
        </Text>
      </Billboard>
    </group>
  );
}
