'use client';

import { T, SectionHeader, Separator, Card, MetricBox } from '../TerminalUI';
import { C, L } from '../TerminalUI';

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
    </group>
  );
}
