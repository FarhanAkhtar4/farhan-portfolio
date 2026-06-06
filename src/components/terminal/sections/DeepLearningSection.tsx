'use client';

import { T, SectionHeader, Separator, Card, PlaceholderImage } from '../TerminalUI';
import { C, L } from '../TerminalUI';

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
    </group>
  );
}
