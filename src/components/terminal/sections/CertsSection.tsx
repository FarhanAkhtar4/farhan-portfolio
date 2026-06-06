'use client';

import { T, SectionHeader, DataRow, Separator, Card, MetricBox, Tag } from '../TerminalUI';
import { C, L } from '../TerminalUI';

export default function CertsSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="◆ CERTIFICATIONS" subtitle="Industry Certifications" />
      <Separator y={y} />
      y += L.LINE;

      <MetricBox label="TOTAL" value="11" x={-2.8} y={y} />
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
    </group>
  );
}
