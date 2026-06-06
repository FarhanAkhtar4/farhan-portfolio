'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { T, SectionHeader, DataRow, Separator, Card, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Career Section — 3D Timeline Path with milestone spheres
   ============================================================ */
function TimelinePath() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.1, 10, 10), []);

  // Timeline milestones
  const milestones = useMemo(() => [
    { y: 0.8, label: 'Research', color: C.cyan },
    { y: 0.2, label: 'Projects', color: C.violet },
    { y: -0.3, label: 'Education', color: C.cyan },
    { y: -0.8, label: 'Growth', color: C.violet },
  ], []);

  // Timeline line
  const linePoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    pts.push(new THREE.Vector3(0, 1.0, 0));
    pts.push(new THREE.Vector3(0, -1.0, 0));
    return pts;
  }, []);
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(linePoints), [linePoints]);

  // Pulse ring
  const pulseGeo = useMemo(() => new THREE.RingGeometry(0.15, 0.18, 16), []);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Slow rotation
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.3;

    // Traveling pulse ring
    if (pulseRef.current) {
      const normalized = (t * 0.3) % 1.0;
      pulseRef.current.position.y = 1.0 - normalized * 2.0;
    }
  });

  return (
    <Section3DVisual position={[4.5, -0.5, 0.8]}>
      <group ref={groupRef}>
        {/* Timeline line */}
        <line geometry={lineGeo}>
          <lineBasicMaterial color={C.cyan} transparent opacity={0.4} />
        </line>
        {/* Milestone spheres */}
        {milestones.map((m, i) => (
          <mesh key={i} position={[0, m.y, 0]} geometry={sphereGeo}>
            <meshBasicMaterial
              color={m.color}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
        {/* Pulse ring traveling down */}
        <mesh ref={pulseRef} position={[0, 1.0, 0]} geometry={pulseGeo}>
          <meshBasicMaterial
            color={C.cyan}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Section3DVisual>
  );
}

export default function CareerSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="▤ CAREER TIMELINE" subtitle="PROFESSIONAL EXPERIENCE & EDUCATION" />
      <Separator y={y} />
      y += L.LINE;

      <T text="▸ EXPERIENCE" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.11} />
      y -= 1.3;

      <Card
        title="NIT Calicut — Research Intern"
        desc="NIT Calicut Research Internship"
        x={0} y={y} w={12} h={1.4}
      />
      y -= 1.55;

      <T text="[PLACEHOLDER – Research responsibilities and achievements]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.11} />
      y -= 0.6;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ EDUCATION" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.11} />
      y -= 1.3;

      <Card
        title="[PLACEHOLDER – University Name]"
        desc="[PLACEHOLDER – Degree and field of study]"
        x={0} y={y} w={12} h={1.0}
      />
      y -= 1.15;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ RESUME DOWNLOADS" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.11} />
      y -= 0.35;

      <T text="[PLACEHOLDER – Resume PDF downloads — templates only]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.11} />
      y -= 0.3;

      <T text='LINK PLACEHOLDER: [PLACEHOLDER – AI Engineer Resume]' position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.1} />
      y -= 0.25;
      <T text='LINK PLACEHOLDER: [PLACEHOLDER – ML Engineer Resume]' position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.1} />

      {/* Section-specific 3D: Timeline Path */}
      <TimelinePath />
    </group>
  );
}
