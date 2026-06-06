'use client';

import { T, SectionHeader, Separator, Card, PlaceholderImage } from '../TerminalUI';
import { C, L } from '../TerminalUI';

export default function AgentsSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="⬡ AGENTIC SYSTEMS" subtitle="MULTI-AGENT ORCHESTRATION & RAG PIPELINES" />
      <Separator y={y} />
      y += L.LINE;

      <T text="[PLACEHOLDER – Agentic AI systems overview]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.09} />
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

      <T text="▸ AGENT WORKFLOW" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y -= 1.5;

      <T text="[PLACEHOLDER – Animated agent orbs visualization]" position={[0, y, 0.01]} color={C.dim} size={0.08} anchor="center" />
    </group>
  );
}
