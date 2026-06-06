'use client';

import { T, SectionHeader, DataRow, Separator, MetricBox } from '../TerminalUI';
import { C, L } from '../TerminalUI';

export default function IdentificationSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="◆ IDENTIFICATION" subtitle="SUBJECT VERIFICATION IN PROGRESS" />
      <Separator y={y} />
      y += L.LINE;

      <DataRow label="SUBJECT NAME" value="Farhan Akhtar Makandar" y={y} />
      y += L.LINE;
      <DataRow label="DESIGNATION" value="[PLACEHOLDER – ML Systems Engineer]" y={y} />
      y += L.LINE;
      <DataRow label="SPECIALIZATION" value="[PLACEHOLDER – AI Specialization]" y={y} />
      y += L.LINE;
      <DataRow label="STATUS" value="● ACTIVE — CLEARANCE GRANTED" y={y} valueColor={C.success} />

      y += L.LINE;
      <Separator y={y} />
      y += L.LINE;

      <DataRow label="RESEARCH" value="NIT Calicut Research Internship" y={y} valueColor={C.cyan} />
      y += L.LINE;
      <DataRow label="PROJECTS" value="Multiple AI Production Projects" y={y} valueColor={C.cyan} />
      y += L.LINE;

      <Separator y={y} />
      y += L.LINE;

      <MetricBox label="MODEL IMPROVEMENT" value="22%" x={-2.8} y={y} accent />
      <MetricBox label="VS XGBoost" value="SUPERIOR" x={1.2} y={y} />
      y += L.LINE * 4;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ MISSION STATEMENTS" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y += L.LINE;
      <T text="[PLACEHOLDER – Mission statement 1]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.09} />
      y += L.LINE;
      <T text="[PLACEHOLDER – Mission statement 2]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.09} />
      y += L.LINE;
      <T text="[PLACEHOLDER – Mission statement 3]" position={[L.LEFT, y, 0.01]} color={C.dim} size={0.09} />
    </group>
  );
}
