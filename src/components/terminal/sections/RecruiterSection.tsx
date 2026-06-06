'use client';

import { T, SectionHeader, DataRow, Separator, Card, MetricBox, Tag } from '../TerminalUI';
import { C, L, C as Colors } from '../TerminalUI';

export default function RecruiterSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="⬟ RECRUITER HUB" subtitle="AUTHORIZED PERSONNEL ONLY" />
      <Separator y={y} />
      y += L.LINE;

      <DataRow label="CLEARANCE" value="LEVEL 3 — OPEN ACCESS" y={y} valueColor={C.success} />
      y += L.LINE;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ RESUME DOCUMENTS — TEMPLATES ONLY" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y -= 1.2;

      <Card title="[PLACEHOLDER – AI Engineer Resume]" desc="[PLACEHOLDER – Lorem ipsum template content]" x={-3} y={y} w={3.8} h={1.0} />
      <Card title="[PLACEHOLDER – ML Engineer Resume]" desc="[PLACEHOLDER – Lorem ipsum template content]" x={1.6} y={y} w={3.8} h={1.0} />
      y -= 1.3;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ ATS KEYWORD MATRIX — DEMO ILLUSTRATION ONLY" position={[L.LEFT, y, 0.01]} color={C.warning} size={0.1} />
      y -= 0.3;
      <T text="⚠ This ATS analysis is for illustration purposes only." position={[L.LEFT, y, 0.01]} color={C.warning} size={0.08} />
      y -= 0.8;

      {/* 3×3 grid of sample ATS keywords */}
      <group position={[-3, y, 0]}>
        <Tag text="Python" x={0} y={0} />
        <Tag text="PyTorch" x={1.8} y={0} />
        <Tag text="RAG" x={3.2} y={0} />
      </group>
      <group position={[-3, y - 0.28, 0]}>
        <Tag text="LLM" x={0} y={0} />
        <Tag text="Transformers" x={1.8} y={0} />
        <Tag text="LangChain" x={3.8} y={0} />
      </group>
      <group position={[-3, y - 0.56, 0]}>
        <Tag text="AWS" x={0} y={0} />
        <Tag text="Git" x={1.5} y={0} />
        <Tag text="[PLACEHOLDER]" x={3.2} y={0} />
      </group>
      y -= 1.2;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ PROFILE LINKS" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y -= 0.3;
      <T text="LINK PLACEHOLDER — [PLACEHOLDER LinkedIn]" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.08} />
      y -= 0.25;
      <T text="LINK PLACEHOLDER — [PLACEHOLDER GitHub]" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.08} />
      y -= 0.25;
      <T text="LINK PLACEHOLDER — [PLACEHOLDER HuggingFace]" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.08} />
    </group>
  );
}
