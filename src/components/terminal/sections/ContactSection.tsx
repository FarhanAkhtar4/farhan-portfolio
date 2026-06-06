'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { T, SectionHeader, DataRow, Separator, Tag, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Contact Section — Pulsing Radar/Sonar Ring Animation
   ============================================================ */
function RadarRings() {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => [
    { radius: 0.2, speed: 0.8 },
    { radius: 0.4, speed: 0.6 },
    { radius: 0.6, speed: 0.4 },
  ], []);

  const ringGeometries = useMemo(() =>
    rings.map(r => new THREE.RingGeometry(r.radius - 0.01, r.radius + 0.01, 32)),
    [rings]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Rotate group slowly
    groupRef.current.rotation.z = t * 0.1;

    // Animate individual ring opacity (pulse in sequence)
    groupRef.current.children.forEach((child, i) => {
      if (i < rings.length && child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshBasicMaterial;
        const phase = (t * rings[i].speed + i * 0.3) % 1.0;
        mat.opacity = Math.sin(phase * Math.PI) * 0.35;
      }
    });
  });

  return (
    <Section3DVisual position={[5.5, -0.5, 0.5]}>
      <group ref={groupRef}>
        {/* Sonar rings */}
        {ringGeometries.map((geo, i) => (
          <mesh key={i} geometry={geo}>
            <meshBasicMaterial
              color={C.cyan}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
        {/* Center dot */}
        <mesh>
          <circleGeometry args={[0.05, 12]} />
          <meshBasicMaterial
            color={C.cyan}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Cross hairs */}
        <line geometry={useMemo(() => {
          const pts = [
            new THREE.Vector3(-0.7, 0, 0),
            new THREE.Vector3(0.7, 0, 0),
          ];
          return new THREE.BufferGeometry().setFromPoints(pts);
        }, [])}>
          <lineBasicMaterial color={C.cyan} transparent opacity={0.15} />
        </line>
        <line geometry={useMemo(() => {
          const pts = [
            new THREE.Vector3(0, -0.7, 0),
            new THREE.Vector3(0, 0.7, 0),
          ];
          return new THREE.BufferGeometry().setFromPoints(pts);
        }, [])}>
          <lineBasicMaterial color={C.cyan} transparent opacity={0.15} />
        </line>
      </group>
    </Section3DVisual>
  );
}

export default function ContactSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="✦ COMM CHANNEL" subtitle="ESTABLISH SECURE CONNECTION" />
      <Separator y={y} />
      y += L.LINE;

      <DataRow label="EMAIL" value="[PLACEHOLDER EMAIL]" y={y} valueColor={C.cyan} />
      y += L.LINE;
      <DataRow label="PHONE" value="[PLACEHOLDER PHONE]" y={y} />
      y += L.LINE;
      <DataRow label="LOCATION" value="[PLACEHOLDER ADDRESS]" y={y} />
      y += L.LINE;
      <DataRow label="GITHUB" value="LINK PLACEHOLDER" y={y} valueColor={C.cyan} />
      y += L.LINE;
      <DataRow label="LINKEDIN" value="LINK PLACEHOLDER" y={y} valueColor={C.cyan} />
      y += L.LINE;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ TRANSMIT MESSAGE" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y -= 0.4;
      <T text="[PLACEHOLDER – Message console — not functional in demo]" position={[0, y, 0.01]} color={C.dim} size={0.09} anchor="center" />
      y -= 0.6;

      <Separator y={y} />
      y += L.LINE;

      <T text="● ENCRYPTED CHANNEL ACTIVE — TRANSMISSION SECURE" position={[0, y, 0.01]} color={C.success} size={0.09} anchor="center" />

      {/* Section-specific 3D: Radar/Sonar Rings */}
      <RadarRings />
    </group>
  );
}
