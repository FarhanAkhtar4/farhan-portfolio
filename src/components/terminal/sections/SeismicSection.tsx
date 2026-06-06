'use client';

import { T, SectionHeader, DataRow, Separator, Card, MetricBox, PlaceholderImage } from '../TerminalUI';
import { C, L } from '../TerminalUI';

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
        title="Seismic Response Prediction"
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

      <T text="▸ ARCHITECTURE LAYERS" position={[L.LEFT, y, 0.01]} color={C.muted} size={0.09} />
      y -= 0.9;

      <ArchCard label="Input" sublabel="[PLACEHOLDER]" x={-4.8} y={y} />
      <ArchCard label="Variable Selection" sublabel="[PLACEHOLDER]" x={-2.4} y={y} />
      <ArchCard label="LSTM Encoder" sublabel="[PLACEHOLDER]" x={0} y={y} />
      <ArchCard label="Attention" sublabel="[PLACEHOLDER]" x={2.4} y={y} />
      <ArchCard label="Output" sublabel="Prediction" x={4.8} y={y} />
      y -= 1.1;

      <T text="[PLACEHOLDER – Performance comparison chart with 22% marker]" position={[0, y, 0.01]} color={C.dim} size={0.08} anchor="center" />
    </group>
  );
}
