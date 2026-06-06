'use client';

import { T, SectionHeader, Tag } from '../TerminalUI';
import { C, L } from '../TerminalUI';

export default function StackSection() {
  return (
    <group>
      <SectionHeader title="▥ TECH STACK" subtitle="[PLACEHOLDER – Technology overview]" />

      {/* Languages */}
      <group position={[L.LEFT, L.TOP + L.LINE * 3, 0]}>
        <Tag text="LANGUAGES" x={0} y={0} color={C.cyan} />
        <Tag text="Python" x={2.2} y={0} />
        <Tag text="SQL" x={3.6} y={0} />
        <Tag text="C" x={4.6} y={0} />
        <Tag text="R" x={5.2} y={0} />
        <Tag text="[PLACEHOLDER]" x={6.2} y={0} />
      </group>

      {/* ML & Deep Learning */}
      <group position={[L.LEFT, L.TOP + L.LINE * 5.5, 0]}>
        <Tag text="ML & DL" x={0} y={0} color={C.muted} />
        <Tag text="PyTorch" x={2.2} y={0} />
        <Tag text="TensorFlow" x={3.8} y={0} />
        <Tag text="[PLACEHOLDER]" x={5.6} y={0} />
        <Tag text="[PLACEHOLDER]" x={7.8} y={0} />
      </group>

      {/* LLM & Agentic AI — highlighted */}
      <group position={[L.LEFT, L.TOP + L.LINE * 8, 0]}>
        <Tag text="LLM & AGENTIC" x={0} y={0} color={C.violet} />
        <Tag text="RAG" x={2.8} y={0} color={C.violet} />
        <Tag text="LangChain" x={3.8} y={0} color={C.violet} />
        <Tag text="[PLACEHOLDER]" x={5.6} y={0} color={C.violet} />
        <Tag text="[PLACEHOLDER]" x={7.8} y={0} color={C.violet} />
      </group>

      {/* Data Science */}
      <group position={[L.LEFT, L.TOP + L.LINE * 10.5, 0]}>
        <Tag text="DATA SCIENCE" x={0} y={0} color={C.muted} />
        <Tag text="Pandas" x={2.8} y={0} />
        <Tag text="NumPy" x={4.2} y={0} />
        <Tag text="[PLACEHOLDER]" x={5.6} y={0} />
      </group>

      {/* Cloud & Tools */}
      <group position={[L.LEFT, L.TOP + L.LINE * 13, 0]}>
        <Tag text="CLOUD" x={0} y={0} color={C.muted} />
        <Tag text="AWS" x={1.8} y={0} />
        <Tag text="Git/GitHub" x={3.2} y={0} />
        <Tag text="[PLACEHOLDER]" x={5.6} y={0} />
      </group>
    </group>
  );
}
