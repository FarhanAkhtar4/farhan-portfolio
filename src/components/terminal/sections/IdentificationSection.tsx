'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { T, SectionHeader, DataRow, Separator, MetricBox, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Identification Section — Rotating 3D wireframe dodecahedron
   ============================================================ */
function RotatingDodecahedron() {
  const groupRef = useRef<THREE.Group>(null);
  const geo = useMemo(() => new THREE.DodecahedronGeometry(1.2, 0), []);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const innerGeo = useMemo(() => new THREE.IcosahedronGeometry(0.6, 0), []);
  const innerEdgeGeo = useMemo(() => new THREE.EdgesGeometry(innerGeo), [innerGeo]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = t * 0.3;
    groupRef.current.rotation.y = t * 0.5;
  });

  return (
    <Section3DVisual position={[4.5, 0, 0.8]}>
      <group ref={groupRef}>
        {/* Outer dodecahedron wireframe */}
        <lineSegments geometry={edgeGeo}>
          <lineBasicMaterial color={C.cyan} transparent opacity={0.8} />
        </lineSegments>
        {/* Inner icosahedron wireframe — counter-rotating */}
        <lineSegments geometry={innerEdgeGeo} rotation={[0.5, 0, 0]}>
          <lineBasicMaterial color={C.violet} transparent opacity={0.7} />
        </lineSegments>
        {/* Core glow sphere */}
        <mesh>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshBasicMaterial color={C.cyan} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </Section3DVisual>
  );
}

export default function IdentificationSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="◆ IDENTIFICATION" subtitle="SUBJECT VERIFICATION IN PROGRESS" />
      <Separator y={y} />
      y += L.LINE;

      <DataRow label="SUBJECT NAME" value="Farhan Akhtar Makandar" y={y} />
      y += L.LINE;
      <DataRow label="DESIGNATION" value="[PLACEHOLDER – ML Systems Engineer]" y={y} />
      y += L.LINE;
      <DataRow label="SPECIALIZATION" value="[PLACEHOLDER – AI Specialization]" y={y} />
      y += L.LINE;
      <DataRow label="STATUS" value="● ACTIVE — CLEARANCE GRANTED" y={y} valueColor={C.success} />

      y += L.LINE;
      <Separator y={y} />
      y += L.LINE;

      <DataRow label="RESEARCH" value="NIT Calicut Research Internship" y={y} valueColor={C.cyan} />
      y += L.LINE;
      <DataRow label="PROJECTS" value="Multiple AI Production Projects" y={y} valueColor={C.cyan} />
      y += L.LINE;

      <Separator y={y} />
      y += L.LINE;

      <MetricBox label="MODEL IMPROVEMENT" value="22%" x={-2.8} y={y} accent />
      <MetricBox label="VS XGBoost" value="SUPERIOR" x={1.2} y={y} />
      y += L.LINE * 4;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ MISSION STATEMENTS" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.11} />
      y += L.LINE;
      <T text="[PLACEHOLDER – Mission statement 1]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.11} />
      y += L.LINE;
      <T text="[PLACEHOLDER – Mission statement 2]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.11} />
      y += L.LINE;
      <T text="[PLACEHOLDER – Mission statement 3]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.11} />

      {/* Section-specific 3D: Rotating wireframe dodecahedron */}
      <RotatingDodecahedron />
    </group>
  );
}
