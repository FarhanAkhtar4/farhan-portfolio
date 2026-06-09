'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Database,
  Cpu,
  BarChart3,
  Lock,
  FileWarning,
} from 'lucide-react';

/* ─── TFT Pipeline Steps ─── */
const pipelineSteps = [
  { label: 'Input Features', icon: Database },
  { label: 'Variable Selection', icon: Activity },
  { label: 'LSTM Encoder', icon: Cpu },
  { label: 'Multi-Head Attention', icon: Lock },
  { label: 'Quantile Output', icon: BarChart3 },
];

/* ─── Results Bars ─── */
const results = [
  { label: 'TFT Model', width: 88, highlight: true, detail: '22% improvement' },
  { label: 'Model B', width: 72, highlight: false, detail: '[PLACEHOLDER]' },
  { label: 'Model C', width: 65, highlight: false, detail: '[PLACEHOLDER]' },
  { label: 'Model D', width: 58, highlight: false, detail: '[PLACEHOLDER]' },
];

export default function SeismicSection() {
  return (
    <section className="relative w-full py-16 px-4 md:px-8 lg:px-16" id="seismic">
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
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-xs tracking-[0.3em] text-slate-500 uppercase font-mono">
            Case File #002-TFT
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-mono font-bold tracking-wider text-cyan-400 uppercase leading-tight">
          Project: Temporal Fusion Transformer
          <br />
          <span className="text-purple-400">— BRBF Seismic Response Prediction</span>
        </h2>

        {/* Status Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded border border-emerald-500/40 bg-emerald-500/10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] text-emerald-400 uppercase font-mono">
            Classified // Results Verified
          </span>
        </div>

        <div className="h-px bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent mt-4" />
      </motion.div>

      {/* ── Content Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-6 lg:space-y-0">
        {/* ── Problem Statement ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.1 }}
          className="dossier-card p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileWarning className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
              Problem Statement
            </span>
          </div>
          <p className="text-sm font-mono text-slate-300 leading-relaxed">
            [PLACEHOLDER] — Detailed description of the seismic response prediction problem for Buckling-Restrained
            Braced Frames (BRBF). The model addresses critical structural engineering challenges in earthquake-prone
            regions by predicting nonlinear dynamic responses using temporal fusion transformer architecture with
            multi-horizon forecasting capabilities. All experimental parameters and validation methodologies are
            classified under [REDACTED] research protocols.
          </p>
        </motion.div>

        {/* ── Dataset ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.2 }}
          className="dossier-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
              Dataset
            </span>
          </div>
          <p className="text-sm font-mono text-slate-300 leading-relaxed">
            [PLACEHOLDER] — Comprehensive seismic dataset comprising nonlinear time-history analyses of BRBF
            structures. Ground motion records from [REDACTED] database, normalized and preprocessed through
            standardized pipeline. Feature engineering includes spectral acceleration, story drift ratios, and
            cumulative energy dissipation metrics. Dataset volume:{' '}
            <span className="relative inline-block">
              <span className="text-cyan-400">[REDACTED]</span>
              <span className="absolute inset-0 bg-slate-900 -translate-y-[2px]" />
            </span>{' '}
            samples across{' '}
            <span className="relative inline-block">
              <span className="text-cyan-400">[REDACTED]</span>
              <span className="absolute inset-0 bg-slate-900 -translate-y-[2px]" />
            </span>{' '}
            structural configurations.
          </p>
        </motion.div>

        {/* ── Training Pipeline Diagram ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.3 }}
          className="dossier-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
              Training Pipeline — TFT Architecture
            </span>
          </div>

          {/* CSS Pipeline Diagram */}
          <div className="flex flex-col gap-0">
            {pipelineSteps.map((step, idx) => (
              <div key={step.label} className="flex items-center">
                {/* Step box */}
                <div className="dossier-pipeline-box px-4 py-2.5 text-center min-w-[140px] flex items-center gap-2 justify-center">
                  <step.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-[11px] font-mono text-slate-200 tracking-wide">
                    {step.label}
                  </span>
                </div>
                {/* Arrow connector */}
                {idx < pipelineSteps.length - 1 && (
                  <div className="flex-1 flex flex-col items-center mx-2">
                    <div className="w-px h-4 bg-cyan-400/30" />
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-cyan-400/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Results — Comparison Bars ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.4 }}
          className="dossier-card p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
              Model Performance Comparison
            </span>
          </div>

          <div className="space-y-4">
            {results.map((r, idx) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-xs font-mono text-slate-400 w-24 shrink-0 text-right tracking-wide">
                  {r.label}
                </span>
                <div className="flex-1 h-8 bg-slate-800/60 rounded-sm overflow-hidden relative border border-slate-700/50">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${r.width}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + idx * 0.15, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full flex items-center px-3 ${
                      r.highlight
                        ? 'bg-gradient-to-r from-cyan-500/80 to-cyan-400/60 border-r-2 border-cyan-300'
                        : 'bg-slate-600/40'
                    }`}
                  >
                    {r.highlight && (
                      <span className="text-[10px] font-mono font-bold text-white tracking-wider">
                        {r.detail}
                      </span>
                    )}
                  </motion.div>
                  {/* Percentage label */}
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">
                    {r.width}%
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 w-32 shrink-0 tracking-wide">
                  {r.highlight ? (
                    <span className="text-cyan-400 font-semibold">22% improvement</span>
                  ) : (
                    <span className="relative inline-block">
                      {r.detail}
                      <span className="absolute inset-0 bg-slate-900 -translate-y-[2px]" />
                    </span>
                  )}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Screenshot Placeholder ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.5 }}
          className="dossier-card p-6 lg:col-span-2"
        >
          <div className="w-full h-48 md:h-64 bg-slate-800/40 border border-dashed border-slate-600/50 rounded-md flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-md bg-slate-700/50 flex items-center justify-center">
                <FileWarning className="w-6 h-6 text-slate-500" />
              </div>
              <span className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase">
                Screenshot Placeholder
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
