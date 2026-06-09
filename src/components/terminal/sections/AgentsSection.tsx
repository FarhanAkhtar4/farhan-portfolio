'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { T, SectionHeader, Separator, Card, Section3DVisual, C } from '../TerminalUI';
import { L } from '../TerminalUI';

/* ============================================================
   Agents Section — Floating orbs representing agents (3-4 glowing spheres orbiting)
   ============================================================ */
function AgentOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.13, 12, 12), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.65, 0.01, 8, 48), []);

  const agents = useMemo(() => [
    { color: C.cyan, orbitRadius: 0.65, speed: 0.8, tilt: 0 },
    { color: C.violet, orbitRadius: 0.9, speed: 0.6, tilt: Math.PI / 4 },
    { color: C.cyan, orbitRadius: 0.45, speed: 1.1, tilt: -Math.PI / 3 },
    { color: '#10B981', orbitRadius: 0.7, speed: 0.9, tilt: Math.PI / 6 },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.15;

    // Update each agent position (orbit)
    groupRef.current.children.forEach((child, i) => {
      if (i < agents.length) {
        const agent = agents[i];
        const angle = t * agent.speed;
        child.position.x = Math.cos(angle) * agent.orbitRadius;
        child.position.y = Math.sin(angle) * agent.orbitRadius * Math.cos(agent.tilt);
        child.position.z = Math.sin(angle) * agent.orbitRadius * Math.sin(agent.tilt);
      }
    });
  });

  return (
    <Section3DVisual position={[4.5, -0.5, 0.8]}>
      <group ref={groupRef}>
        {/* Orbit ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={ringGeo} attach="geometry" />
          <meshBasicMaterial color={C.cyan} transparent opacity={0.15} />
        </mesh>
        {/* Agent orbs */}
        {agents.map((agent, i) => (
          <mesh key={i} geometry={sphereGeo}>
            <meshBasicMaterial
              color={agent.color}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
        {/* Central node */}
        <mesh>
          <octahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial
            color={C.cyan}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={useMemo(() => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.15, 0)), [])}>
          <lineBasicMaterial color={C.cyan} transparent opacity={0.4} />
        </lineSegments>
      </group>
    </Section3DVisual>
  );
}

export default function AgentsSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="⬡ AGENTIC SYSTEMS" subtitle="MULTI-AGENT ORCHESTRATION & RAG PIPELINES" />
      <Separator y={y} />
      y += L.LINE;

      <T text="[PLACEHOLDER – Agentic AI systems overview]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.11} />
      y -= 1.3;

      <Card
        title="Multi-Agent Orchestration"
        desc="[PLACEHOLDER – Agent collaboration description]"
        x={0} y={y} w={12} h={L.CARD_H}
      />
      y -= L.CARD_H + 0.15;

      <Card
        title="RAG Pipeline System"
        desc="[PLACEHOLDER – Retrieval-augmented generation flow]"
        x={0} y={y} w={12} h={L.CARD_H}
      />
      y -= L.CARD_H + 0.15;

      <Card
        title="Tool-Call Framework"
        desc="[PLACEHOLDER – Function calling architecture]"
        x={0} y={y} w={12} h={L.CARD_H} accent
      />
      y -= L.CARD_H + 0.15;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ AGENT WORKFLOW" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.11} />
      y -= 1.5;

      <T text="[PLACEHOLDER – Animated agent orbs visualization]" position={[0, y, 0.01]} color={C.dim} size={0.1} anchor="center" />

      {/* Section-specific 3D: Agent Orbs */}
      <AgentOrbs />
    </group>
  );
}
