'use client';

import { T, SectionHeader, DataRow, Separator, Tag } from '../TerminalUI';
import { C, L } from '../TerminalUI';

export default function ContactSection() {
  let y = L.TOP + L.LINE * 3;
  return (
    <group>
      <SectionHeader title="✦ COMM CHANNEL" subtitle="ESTABLISH SECURE CONNECTION" />
      <Separator y={y} />
      y += L.LINE;

      <DataRow label="EMAIL" value="[PLACEHOLDER EMAIL]" y={y} valueColor={C.cyan} />
      y += L.LINE;
      <DataRow label="PHONE" value="[PLACEHOLDER PHONE]" y={y} />
      y += L.LINE;
      <DataRow label="LOCATION" value="[PLACEHOLDER ADDRESS]" y={y} />
      y += L.LINE;
      <DataRow label="GITHUB" value="LINK PLACEHOLDER" y={y} valueColor={C.cyan} />
      y += L.LINE;
      <DataRow label="LINKEDIN" value="LINK PLACEHOLDER" y={y} valueColor={C.cyan} />
      y += L.LINE;

      <Separator y={y} />
      y += L.LINE;

      <T text="▸ TRANSMIT MESSAGE" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y -= 0.4;
      <T text="[PLACEHOLDER – Message console — not functional in demo]" position={[0, y, 0.01]} color={C.dim} size={0.09} anchor="center" />
      y -= 0.6;

      <Separator y={y} />
      y += L.LINE;

      <T text="● ENCRYPTED CHANNEL ACTIVE — TRANSMISSION SECURE" position={[0, y, 0.01]} color={C.success} size={0.09} anchor="center" />
    </group>
  );
}
