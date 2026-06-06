'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { T, SectionHeader, Separator, Card, PlaceholderImage, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Deep Learning Section — Neural Network Layers visualization
   ============================================================ */
function NeuralNetworkViz() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.04, 6, 6), []);

  // Build 3 layers of nodes
  const layers = useMemo(() => {
    const l: { positions: THREE.Vector3[] }[] = [];
    const layerSizes = [4, 6, 4];
    const layerSpacing = 0.5;
    const nodeSpacing = 0.15;

    for (let li = 0; li < layerSizes.length; li++) {
      const nodes: THREE.Vector3[] = [];
      const size = layerSizes[li];
      for (let ni = 0; ni < size; ni++) {
        const y = (ni - (size - 1) / 2) * nodeSpacing;
        const x = (li - (layerSizes.length - 1) / 2) * layerSpacing;
        nodes.push(new THREE.Vector3(x, y, 0));
      }
      l.push({ positions: nodes });
    }
    return l;
  }, []);

  // Connection lines between layers
  const connections = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let li = 0; li < layers.length - 1; li++) {
      for (const from of layers[li].positions) {
        for (const to of layers[li + 1].positions) {
          points.push(from.clone());
          points.push(to.clone());
        }
      }
    }
    return points;
  }, [layers]);

  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(connections), [connections]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
  });

  return (
    <Section3DVisual position={[5.5, -1.5, 0.5]}>
      <group ref={groupRef}>
        {/* Connection lines */}
        <line geometry={lineGeo}>
          <lineBasicMaterial color={C.cyan} transparent opacity={0.1} />
        </line>
        {/* Nodes */}
        {layers.map((layer, li) =>
          layer.positions.map((pos, ni) => (
            <mesh key={`${li}-${ni}`} position={pos} geometry={sphereGeo}>
              <meshBasicMaterial
                color={li === 1 ? C.violet : C.cyan}
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))
        )}
      </group>
    </Section3DVisual>
  );
}

export default function DeepLearningSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="⬢ DEEP LEARNING" subtitle="NEURAL ARCHITECTURES & ATTENTION MODELS" />
      <Separator y={y} />
      y += L.LINE;

      <Card
        title="SAINT Model"
        desc="[PLACEHOLDER – Self-Attention and Intersample Attention for tabular data]"
        x={0} y={y} w={12} h={L.CARD_H}
      />
      y -= L.CARD_H + 0.15;

      <Card
        title="Transformer Architectures"
        desc="[PLACEHOLDER – Attention mechanism research and applications]"
        x={0} y={y} w={12} h={L.CARD_H}
      />
      y -= L.CARD_H + 0.15;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ ATTENTION VISUALIZATION" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y -= 1.8;

      <PlaceholderImage x={0} y={y} w={10} h={3} label="SCREENSHOT PLACEHOLDER — SAINT Network" />

      {/* Section-specific 3D: Neural Network */}
      <NeuralNetworkViz />
    </group>
  );
}
