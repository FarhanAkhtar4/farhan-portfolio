'use client';

import { T, SectionHeader, DataRow, Separator, Card } from '../TerminalUI';
import { C, L } from '../TerminalUI';

export default function CareerSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="▤ CAREER TIMELINE" subtitle="PROFESSIONAL EXPERIENCE & EDUCATION" />
      <Separator y={y} />
      y += L.LINE;

      <T text="▸ EXPERIENCE" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.09} />
      y -= 1.3;

      <Card
        title="NIT Calicut — Research Intern"
        desc="NIT Calicut Research Internship"
        x={0} y={y} w={12} h={1.4}
      />
      y -= 1.55;

      <T text="[PLACEHOLDER – Research responsibilities and achievements]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.09} />
      y -= 0.6;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ EDUCATION" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.09} />
      y -= 1.3;

      <Card
        title="[PLACEHOLDER – University Name]"
        desc="[PLACEHOLDER – Degree and field of study]"
        x={0} y={y} w={12} h={1.0}
      />
      y -= 1.15;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ RESUME DOWNLOADS" position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.09} />
      y -= 0.35;

      <T text="[PLACEHOLDER – Resume PDF downloads — templates only]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.09} />
      y -= 0.3;

      <T text='LINK PLACEHOLDER: [PLACEHOLDER – AI Engineer Resume]' position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.08} />
      y -= 0.25;
      <T text='LINK PLACEHOLDER: [PLACEHOLDER – ML Engineer Resume]' position={[L.LEFT, y, 0.01]} color={C.cyan} size={0.08} />
    </group>
  );
}
