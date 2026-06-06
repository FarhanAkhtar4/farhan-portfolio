'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { T, SectionHeader, DataRow, Separator, Card, MetricBox, Tag, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Certs Section — Floating holographic badge planes (tilted, rotating)
   ============================================================ */
function FloatingBadges() {
  const groupRef = useRef<THREE.Group>(null);
  const badgeGeo = useMemo(() => new THREE.PlaneGeometry(0.4, 0.4), []);
  const badgeEdgeGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.4, 0.4, 0.03)), []);

  const badges = useMemo(() => [
    { x: -0.3, y: 0.3, z: 0, rotX: 0.3, rotY: 0.5, color: C.cyan },
    { x: 0.3, y: 0.1, z: 0.1, rotX: -0.2, rotY: -0.4, color: C.violet },
    { x: -0.1, y: -0.3, z: -0.1, rotX: 0.4, rotY: 0.2, color: C.cyan },
    { x: 0.2, y: -0.5, z: 0.05, rotX: -0.3, rotY: -0.6, color: C.violet },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Slow group rotation
    groupRef.current.rotation.y = t * 0.15;

    // Individual badge wobble
    groupRef.current.children.forEach((child, i) => {
      if (i < badges.length && child instanceof THREE.Group) {
        child.rotation.z = Math.sin(t * 1.0 + i * 1.5) * 0.1;
      }
    });
  });

  return (
    <Section3DVisual position={[5.5, -1.0, 0.5]}>
      <group ref={groupRef}>
        {badges.map((badge, i) => (
          <group key={i} position={[badge.x, badge.y, badge.z]} rotation={[badge.rotX, badge.rotY, 0]}>
            {/* Badge plane */}
            <mesh geometry={badgeGeo}>
              <meshBasicMaterial
                color={badge.color}
                transparent
                opacity={0.1}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {/* 3D badge edge (box) */}
            <lineSegments geometry={badgeEdgeGeo}>
              <lineBasicMaterial color={badge.color} transparent opacity={0.5} />
            </lineSegments>
          </group>
        ))}
      </group>
    </Section3DVisual>
  );
}

export default function CertsSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="◆ CERTIFICATIONS" subtitle="Industry Certifications" />
      <Separator y={y} />
      y += L.LINE;

      <MetricBox label="TOTAL" value="[PLACEHOLDER]" x={-2.8} y={y} />
      <MetricBox label="VERIFIED" value="[PLACEHOLDER]" x={1.2} y={y} />
      y -= 1.2;

      {/* AI & ML */}
      <T text="▸ AI & ML" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.09} />
      y -= 0.85;
      <Card title="[PLACEHOLDER – IBM Python for Data Science]" desc="[PLACEHOLDER – Issuer]" x={0} y={y} w={5.8} h={0.7} />
      <Card title="[PLACEHOLDER – Deep Learning Fundamentals]" desc="[PLACEHOLDER – Issuer]" x={0} y={y - 0.85} w={5.8} h={0.7} />
      y -= 2.0;

      <Separator y={y} />
      y += L.LINE;

      {/* GenAI & Agentic AI */}
      <T text="▸ GenAI & AGENTIC AI" position={[L.LEFT, y, 0.01]} color={C.violet} size={0.09} />
      y -= 0.85;
      <Card title="[PLACEHOLDER – NVIDIA RAG Agents with LLMs]" desc="[PLACEHOLDER – Issuer]" x={0} y={y} w={5.8} h={0.7} />
      y -= 1.2;

      <Separator y={y} />
      y += L.LINE;

      {/* Cloud & Data */}
      <T text="▸ CLOUD & DATA" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.09} />
      y -= 0.85;
      <Card title="[PLACEHOLDER – Oracle Cloud AI Foundations]" desc="[PLACEHOLDER – Issuer]" x={0} y={y} w={5.8} h={0.7} />
      y -= 1.2;

      {/* Other */}
      <T text="▸ OTHER" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y -= 0.85;
      <Card title="[PLACEHOLDER – HTML Training]" desc="[PLACEHOLDER – Issuer]" x={0} y={y} w={5.8} h={0.7} />

      {/* Section-specific 3D: Floating Badges */}
      <FloatingBadges />
    </group>
  );
}
