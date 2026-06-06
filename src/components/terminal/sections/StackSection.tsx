'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { T, SectionHeader, Tag, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Stack Section — Floating 3D columns/bars (like bar chart)
   ============================================================ */
function FloatingBars() {
  const groupRef = useRef<THREE.Group>(null);

  const bars = useMemo(() => {
    const b: { height: number; color: string; x: number; edgeGeo: THREE.EdgesGeometry }[] = [];
    const colors = [C.cyan, C.violet, C.cyan, C.violet, C.cyan];
    const heights = [0.9, 0.65, 0.8, 0.5, 0.75];
    for (let i = 0; i < 5; i++) {
      const h = heights[i];
      b.push({
        height: h,
        color: colors[i],
        x: (i - 2) * 0.2,
        edgeGeo: new THREE.EdgesGeometry(new THREE.BoxGeometry(0.08, h, 0.08)),
      });
    }
    return b;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.2;

    // Individual bar bob animation
    groupRef.current.children.forEach((child, i) => {
      if (i < bars.length) {
        child.position.y = bars[i].height / 2 + Math.sin(t * 1.5 + i * 0.8) * 0.05;
      }
    });
  });

  return (
    <Section3DVisual position={[5.5, -1.5, 0.5]}>
      <group ref={groupRef}>
        {bars.map((bar, i) => (
          <group key={i} position={[bar.x, bar.height / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.08, bar.height, 0.08]} />
              <meshBasicMaterial
                color={bar.color}
                transparent
                opacity={0.5}
              />
            </mesh>
            <lineSegments geometry={bar.edgeGeo}>
              <lineBasicMaterial color={bar.color} transparent opacity={0.6} />
            </lineSegments>
          </group>
        ))}
      </group>
    </Section3DVisual>
  );
}

export default function StackSection() {
  return (
    <group>
      <SectionHeader title="▥ TECH STACK" subtitle="[PLACEHOLDER – Technology overview]" />

      {/* Languages */}
      <group position={[L.LEFT, L.TOP + L.LINE * 3, 0]}>
        <Tag text="LANGUAGES" x={0} y={0} color={C.cyan} />
        <Tag text="[PLACEHOLDER]" x={2.2} y={0} />
        <Tag text="[PLACEHOLDER]" x={3.8} y={0} />
        <Tag text="[PLACEHOLDER]" x={5.4} y={0} />
        <Tag text="[PLACEHOLDER]" x={7.0} y={0} />
      </group>

      {/* ML & Deep Learning */}
      <group position={[L.LEFT, L.TOP + L.LINE * 5.5, 0]}>
        <Tag text="ML & DL" x={0} y={0} color={C.muted} />
        <Tag text="[PLACEHOLDER]" x={2.2} y={0} />
        <Tag text="[PLACEHOLDER]" x={3.8} y={0} />
        <Tag text="[PLACEHOLDER]" x={5.4} y={0} />
        <Tag text="[PLACEHOLDER]" x={7.0} y={0} />
      </group>

      {/* LLM & Agentic AI */}
      <group position={[L.LEFT, L.TOP + L.LINE * 8, 0]}>
        <Tag text="LLM & AGENTIC" x={0} y={0} color={C.violet} />
        <Tag text="[PLACEHOLDER]" x={2.8} y={0} color={C.violet} />
        <Tag text="[PLACEHOLDER]" x={4.4} y={0} color={C.violet} />
        <Tag text="[PLACEHOLDER]" x={6.0} y={0} color={C.violet} />
        <Tag text="[PLACEHOLDER]" x={7.6} y={0} color={C.violet} />
      </group>

      {/* Data Science */}
      <group position={[L.LEFT, L.TOP + L.LINE * 10.5, 0]}>
        <Tag text="DATA SCIENCE" x={0} y={0} color={C.muted} />
        <Tag text="[PLACEHOLDER]" x={2.8} y={0} />
        <Tag text="[PLACEHOLDER]" x={4.4} y={0} />
        <Tag text="[PLACEHOLDER]" x={6.0} y={0} />
      </group>

      {/* Cloud & Tools */}
      <group position={[L.LEFT, L.TOP + L.LINE * 13, 0]}>
        <Tag text="CLOUD" x={0} y={0} color={C.muted} />
        <Tag text="[PLACEHOLDER]" x={1.8} y={0} />
        <Tag text="[PLACEHOLDER]" x={3.4} y={0} />
        <Tag text="[PLACEHOLDER]" x={5.0} y={0} />
      </group>

      {/* Section-specific 3D: Floating Bars */}
      <FloatingBars />
    </group>
  );
}
