'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { T, SectionHeader, DataRow, Separator, Card, MetricBox, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Seismic Section — 3D Node Graph Visualization
   ============================================================ */
function NodeGraph() {
  const groupRef = useRef<THREE.Group>(null);

  // Nodes — small spheres at fixed positions
  const nodes = useMemo(() => {
    const n: { pos: THREE.Vector3; color: string }[] = [];
    const cyanC = C.cyan;
    const violetC = C.violet;
    // Create a small graph layout
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 0.6 + (i % 3) * 0.3;
      n.push({
        pos: new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 0.7) * 0.4,
          Math.sin(angle) * radius
        ),
        color: i % 2 === 0 ? cyanC : violetC,
      });
    }
    // Central node
    n.push({ pos: new THREE.Vector3(0, 0, 0), color: C.cyan });
    return n;
  }, []);

  // Connection lines between nodes
  const connections = useMemo(() => {
    const lines: THREE.Vector3[] = [];
    const center = nodes[nodes.length - 1];
    for (let i = 0; i < nodes.length - 1; i++) {
      lines.push(nodes[i].pos.clone());
      lines.push(center.pos.clone());
    }
    // A few inter-node connections
    for (let i = 0; i < nodes.length - 1; i += 2) {
      if (i + 1 < nodes.length - 1) {
        lines.push(nodes[i].pos.clone());
        lines.push(nodes[i + 1].pos.clone());
      }
    }
    return lines;
  }, [nodes]);

  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(connections), [connections]);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.09, 8, 8), []);

  // Animated pulse on a sphere
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Slowly rotate the whole graph
    groupRef.current.rotation.y = t * 0.2;
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.15;

    // Pulse the center sphere
    if (pulseRef.current) {
      const s = 1.0 + Math.sin(t * 3) * 0.2;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Section3DVisual position={[4.5, -1, 0.8]}>
      <group ref={groupRef}>
        {/* Connection lines */}
        <line geometry={lineGeo}>
          <lineBasicMaterial color={C.cyan} transparent opacity={0.4} />
        </line>
        {/* Nodes */}
        {nodes.map((node, i) => (
          <mesh
            key={i}
            position={node.pos}
            geometry={sphereGeo}
            ref={i === nodes.length - 1 ? pulseRef : undefined}
          >
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </Section3DVisual>
  );
}

function ArchCard({ label, sublabel, x, y }: { label: string; sublabel: string; x: number; y: number }) {
  return (
    <Card title={label} desc={sublabel} x={x} y={y} w={2.4} h={0.7} />
  );
}

export default function SeismicSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="◈ SEISMIC RESEARCH" subtitle="TEMPORAL FUSION TRANSFORMER — FLAGSHIP" />
      <Separator y={y} />
      y += L.LINE;

      <Card
        title="[PLACEHOLDER – Seismic Response Prediction]"
        desc="[PLACEHOLDER – TFT model for structural response prediction]"
        x={0} y={y} w={12} h={L.CARD_H}
      />
      y -= L.CARD_H + 0.15;

      <MetricBox label="IMPROVEMENT" value="22%" x={-3} y={y} accent />
      <MetricBox label="BASELINE" value="XGBoost" x={0} y={y} />
      <MetricBox label="DATASET" value="[PLACEHOLDER]" x={3} y={y} />
      y -= 1.2;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ ARCHITECTURE LAYERS" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.11} />
      y -= 0.9;

      <ArchCard label="Input" sublabel="[PLACEHOLDER]" x={-4.8} y={y} />
      <ArchCard label="Variable Selection" sublabel="[PLACEHOLDER]" x={-2.4} y={y} />
      <ArchCard label="LSTM Encoder" sublabel="[PLACEHOLDER]" x={0} y={y} />
      <ArchCard label="Attention" sublabel="[PLACEHOLDER]" x={2.4} y={y} />
      <ArchCard label="Output" sublabel="Prediction" x={4.8} y={y} />
      y -= 1.1;

      <T text="[PLACEHOLDER – Performance comparison chart with 22% marker]" position={[0, y, 0.01]} color={C.dim} size={0.1} anchor="center" />

      {/* Section-specific 3D: Node Graph */}
      <NodeGraph />
    </group>
  );
}
