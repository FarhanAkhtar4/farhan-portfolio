'use client';

import { motion } from 'framer-motion';
import { Brain, Layers, Network, Box, LineChart, Lock, Table2 } from 'lucide-react';

/* ─── SAINT Architecture Blocks ─── */
const archBlocks = [
  { label: 'Feature Encoding', icon: Box, row: 2 },
  { label: 'Column Embedding', icon: Layers, row: 2 },
  { label: 'Transformer Blocks', icon: Brain, row: 1 },
  { label: 'Intersample Attention', icon: Network, row: 1 },
];

/* ─── Training Data (fake) ─── */
const trainingPoints = [
  { epoch: 0, loss: 0.95 },
  { epoch: 5, loss: 0.72 },
  { epoch: 10, loss: 0.53 },
  { epoch: 15, loss: 0.38 },
  { epoch: 20, loss: 0.28 },
  { epoch: 25, loss: 0.22 },
  { epoch: 30, loss: 0.18 },
  { epoch: 35, loss: 0.15 },
  { epoch: 40, loss: 0.13 },
  { epoch: 45, loss: 0.12 },
  { epoch: 50, loss: 0.11 },
];

/* ─── Metrics Table ─── */
const metrics = [
  { metric: 'Accuracy', value: '[PLACEHOLDER]', benchmark: '[PLACEHOLDER]' },
  { metric: 'AUC-ROC', value: '[PLACEHOLDER]', benchmark: '[PLACEHOLDER]' },
  { metric: 'F1-Score', value: '[PLACEHOLDER]', benchmark: '[PLACEHOLDER]' },
  { metric: 'Log Loss', value: '[PLACEHOLDER]', benchmark: '[PLACEHOLDER]' },
  { metric: 'Training Time', value: '[PLACEHOLDER]', benchmark: '[PLACEHOLDER]' },
];

export default function DeepLearningSection() {
  /* Build SVG path from training data */
  const svgWidth = 400;
  const svgHeight = 200;
  const padX = 40;
  const padY = 20;
  const plotW = svgWidth - padX * 2;
  const plotH = svgHeight - padY * 2;
  const maxEpoch = 50;
  const maxLoss = 1;

  const toX = (e: number) => padX + (e / maxEpoch) * plotW;
  const toY = (l: number) => padY + plotH - (l / maxLoss) * plotH;

  const pathD = trainingPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.epoch)} ${toY(p.loss)}`)
    .join(' ');

  const gridLines = Array.from({ length: 6 }, (_, i) => {
    const y = padY + (i / 5) * plotH;
    const val = maxLoss - (i / 5) * maxLoss;
    return { y, val };
  });

  const epochLines = Array.from({ length: 6 }, (_, i) => {
    const x = padX + (i / 5) * plotW;
    const epoch = Math.round((i / 5) * maxEpoch);
    return { x, epoch };
  });

  return (
    <section className="relative w-full py-16 px-4 md:px-8 lg:px-16" id="deep-learning">
      {/* ── Section Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-16" />

      {/* ── Case File Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <span className="text-xs tracking-[0.3em] text-slate-500 uppercase font-mono">
            Case File #004-SAINT
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-mono font-bold tracking-wider text-cyan-400 uppercase leading-tight">
          SAINT Architecture
          <br />
          <span className="text-purple-400">— Tabular Attention Network</span>
        </h2>
        <div className="h-px bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent mt-4" />
      </motion.div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Architecture Diagram ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.1 }}
          className="dossier-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
              Model Architecture
            </span>
          </div>

          {/* CSS Grid Architecture Diagram */}
          <div className="space-y-4">
            {/* Row 1: Intersample + Transformer */}
            <div className="flex items-center gap-3 justify-center">
              <div className="dossier-arch-box px-4 py-3 text-center border-purple-400/30">
                <Network className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                <span className="text-[10px] font-mono text-purple-300 tracking-wider uppercase block">
                  Intersample Attention
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-px bg-purple-400/30" />
                <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-purple-400/40" />
              </div>
              <div className="dossier-arch-box px-4 py-3 text-center border-cyan-400/30">
                <Brain className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                <span className="text-[10px] font-mono text-cyan-300 tracking-wider uppercase block">
                  Transformer Blocks
                </span>
              </div>
            </div>

            {/* Vertical connector */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-cyan-400/20" />
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-cyan-400/30" />
              </div>
            </div>

            {/* Row 2: Column Embedding + Feature Encoding */}
            <div className="flex items-center gap-3 justify-center">
              <div className="dossier-arch-box px-4 py-3 text-center border-emerald-400/30">
                <Layers className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-300 tracking-wider uppercase block">
                  Column Embedding
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-px bg-emerald-400/30" />
                <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-r-[6px] border-t-transparent border-b-transparent border-r-emerald-400/40" />
              </div>
              <div className="dossier-arch-box px-4 py-3 text-center border-amber-400/30">
                <Box className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="text-[10px] font-mono text-amber-300 tracking-wider uppercase block">
                  Feature Encoding
                </span>
              </div>
            </div>

            {/* Input Arrow */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-500/30" />
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-500/40" />
              </div>
            </div>
            <div className="text-center">
              <span className="text-[9px] font-mono tracking-[0.3em] text-slate-500 uppercase">
                Raw Tabular Input
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Training Graph ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.2 }}
          className="dossier-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
                Training Curve
              </span>
            </div>
            <span className="text-[8px] font-mono tracking-wider text-amber-400/70 uppercase px-2 py-0.5 border border-amber-400/30 rounded">
              Illustrative — Replace
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full bg-slate-900/40 rounded border border-slate-700/40 p-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines */}
              {gridLines.map((g) => (
                <line
                  key={g.y}
                  x1={padX}
                  y1={g.y}
                  x2={svgWidth - padX}
                  y2={g.y}
                  stroke="rgba(71,85,105,0.3)"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              ))}
              {epochLines.map((e) => (
                <line
                  key={e.x}
                  x1={e.x}
                  y1={padY}
                  x2={e.x}
                  y2={svgHeight - padY}
                  stroke="rgba(71,85,105,0.3)"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              ))}

              {/* Y-axis labels */}
              {gridLines.map((g) => (
                <text
                  key={g.y}
                  x={padX - 4}
                  y={g.y + 3}
                  textAnchor="end"
                  fontSize="7"
                  fill="#475569"
                  fontFamily="monospace"
                >
                  {g.val.toFixed(1)}
                </text>
              ))}

              {/* X-axis labels */}
              {epochLines.map((e) => (
                <text
                  key={e.x}
                  x={e.x}
                  y={svgHeight - padY + 14}
                  textAnchor="middle"
                  fontSize="7"
                  fill="#475569"
                  fontFamily="monospace"
                >
                  {e.epoch}
                </text>
              ))}

              {/* Loss curve */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Data points */}
              {trainingPoints.map((p) => (
                <circle
                  key={p.epoch}
                  cx={toX(p.epoch)}
                  cy={toY(p.loss)}
                  r="2"
                  fill="#0f172a"
                  stroke="#00f0ff"
                  strokeWidth="1"
                />
              ))}

              {/* Axis labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 2}
                textAnchor="middle"
                fontSize="8"
                fill="#64748b"
                fontFamily="monospace"
              >
                Epoch
              </text>
              <text
                x="8"
                y={svgHeight / 2}
                textAnchor="middle"
                fontSize="8"
                fill="#64748b"
                fontFamily="monospace"
                transform={`rotate(-90, 8, ${svgHeight / 2})`}
              >
                Loss
              </text>
            </svg>
          </div>
        </motion.div>

        {/* ── Model Evaluation Metrics Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.3 }}
          className="dossier-card p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <Table2 className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
              Model Evaluation Metrics
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-cyan-400/20">
                  <th className="text-[10px] font-mono tracking-[0.2em] text-cyan-400 uppercase py-3 px-4">
                    Metric
                  </th>
                  <th className="text-[10px] font-mono tracking-[0.2em] text-cyan-400 uppercase py-3 px-4">
                    Value
                  </th>
                  <th className="text-[10px] font-mono tracking-[0.2em] text-cyan-400 uppercase py-3 px-4">
                    Benchmark
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, idx) => (
                  <tr
                    key={m.metric}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="text-xs font-mono text-slate-300 py-3 px-4">{m.metric}</td>
                    <td className="text-xs font-mono py-3 px-4">
                      <span className="relative inline-block">
                        <span className="text-slate-400">{m.value}</span>
                        <span className="absolute inset-0 bg-slate-900 -translate-y-[2px]" />
                      </span>
                    </td>
                    <td className="text-xs font-mono py-3 px-4">
                      <span className="relative inline-block">
                        <span className="text-slate-500">{m.benchmark}</span>
                        <span className="absolute inset-0 bg-slate-900 -translate-y-[2px]" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Lock className="w-3 h-3 text-slate-600" />
            <span className="text-[9px] font-mono tracking-wider text-slate-600 uppercase">
              All values classified — awaiting clearance
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
