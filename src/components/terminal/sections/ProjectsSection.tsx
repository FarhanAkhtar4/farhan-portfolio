'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { T, SectionHeader, Separator, Card, MetricBox, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Projects Section — Rotating hexagonal tiles in background
   ============================================================ */
function HexTiles() {
  const groupRef = useRef<THREE.Group>(null);
  const hexGeo = useMemo(() => new THREE.CircleGeometry(0.25, 6), []);
  const hexEdgeGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.CircleGeometry(0.25, 6)), []);

  const tiles = useMemo(() => {
    const t: { pos: THREE.Vector3; rot: number; color: string }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      t.push({
        pos: new THREE.Vector3(
          Math.cos(angle) * 0.6,
          Math.sin(angle) * 0.6,
          (i % 3) * 0.1 - 0.1
        ),
        rot: angle,
        color: i % 2 === 0 ? C.cyan : C.violet,
      });
    }
    return t;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.25;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;

    // Animate individual tiles
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && i < tiles.length) {
        child.rotation.z = tiles[i].rot + t * 0.5;
      }
    });
  });

  return (
    <Section3DVisual position={[5.5, -1.2, 0.5]}>
      <group ref={groupRef}>
        {tiles.map((tile, i) => (
          <group key={i} position={tile.pos}>
            <mesh geometry={hexGeo}>
              <meshBasicMaterial
                color={tile.color}
                transparent
                opacity={0.1}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <lineSegments geometry={hexEdgeGeo}>
              <lineBasicMaterial color={tile.color} transparent opacity={0.4} />
            </lineSegments>
          </group>
        ))}
      </group>
    </Section3DVisual>
  );
}

export default function ProjectsSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="▣ PROJECT VAULT" subtitle="[PLACEHOLDER – Project archive overview]" />
      <Separator y={y} />
      y += L.LINE;

      <MetricBox label="TOTAL" value="[PLACEHOLDER]" x={-4} y={y} />
      <MetricBox label="FLAGSHIP" value="[PLACEHOLDER]" x={0} y={y} accent />
      <MetricBox label="CATEGORIES" value="[PLACEHOLDER]" x={4} y={y} />
      y -= 1.2;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ FLAGSHIP PROJECTS" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.09} />
      y -= 1.3;

      <Card title="[PLACEHOLDER – Project 1]" desc="[PLACEHOLDER – TFT model details]" x={-3} y={y} w={5.8} h={L.CARD_H} />
      <Card title="[PLACEHOLDER – Project 2]" desc="[PLACEHOLDER – Multi-agent SaaS]" x={3} y={y} w={5.8} h={L.CARD_H} />
      y -= L.CARD_H + 0.15;

      <Card title="[PLACEHOLDER – Project 3]" desc="[PLACEHOLDER – Attention for tabular data]" x={-3} y={y} w={5.8} h={L.CARD_H} />
      <Card title="[PLACEHOLDER – Project 4]" desc="[PLACEHOLDER – AI project builder]" x={3} y={y} w={5.8} h={L.CARD_H} accent />
      y -= L.CARD_H + 0.15;

      <Separator y={y} />
      y += L.LINE;

      <T text="[PLACEHOLDER – Additional projects available on request]" position={[0, y, 0.01]} color={C.dim} size={0.08} anchor="center" />

      {/* Section-specific 3D: Hex Tiles */}
      <HexTiles />
    </group>
  );
}
