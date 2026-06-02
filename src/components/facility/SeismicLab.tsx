'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Layers,
  Zap,
  Database,
  Brain,
  TrendingUp,
  Activity,
  ArrowRight,
  ExternalLink,
  FlaskConical,
  BarChart3,
  Cpu,
  Target,
} from 'lucide-react';
import { projects } from '@/lib/data';

const seismicProject = projects.find(p => p.id === 'seismic-response-prediction')!;

const pipelineSteps = [
  { icon: <Database className="w-6 h-6" />, label: 'Seismic Dataset', sublabel: 'BRBF Structural Data', color: 'var(--accent-cyan)' },
  { icon: <FlaskConical className="w-6 h-6" />, label: 'EDA & Preprocessing', sublabel: 'Pandas, NumPy, Seaborn', color: 'var(--accent-purple)' },
  { icon: <Layers className="w-6 h-6" />, label: 'TFT Architecture', sublabel: 'Variable Selection + LSTM', color: 'var(--accent-cyan)' },
  { icon: <Brain className="w-6 h-6" />, label: 'Multi-Head Attention', sublabel: 'Temporal Attention', color: 'var(--accent-purple)' },
  { icon: <Cpu className="w-6 h-6" />, label: 'Training Pipeline', sublabel: 'PyTorch Optimization', color: 'var(--accent-cyan)' },
  { icon: <Target className="w-6 h-6" />, label: '22% Improvement', sublabel: 'vs XGBoost & KNN', color: 'var(--accent-emerald)' },
];

const archLayers = seismicProject.architecture?.layers || [];

export default function SeismicLab() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <div ref={sectionRef} className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-6xl w-full mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 02 — Seismic Research Lab</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(16,185,129,0.1)] text-[var(--accent-emerald)] border border-[rgba(16,185,129,0.2)]">FLAGSHIP</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[var(--accent-emerald)]">Seismic Response</span>
            <br />
            <span className="text-[var(--text-primary)]">Prediction</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
            Temporal Fusion Transformer model achieving <strong className="text-[var(--accent-emerald)]">22% improvement</strong> over 
            XGBoost and KNN for seismic structural response prediction.
          </p>
        </motion.div>

        {/* Metrics Row */}
        <div className="flex flex-wrap gap-4 mb-10">
          {seismicProject.metrics?.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className={`glass-card px-5 py-3 flex items-center gap-3 ${metric.accent ? 'border-[rgba(16,185,129,0.2)]' : ''}`}
            >
              <span className={`text-2xl font-bold ${metric.accent ? 'text-[var(--accent-emerald)]' : 'text-[var(--text-primary)]'}`}>
                {metric.value}
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary)]">{metric.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mb-10"
        >
          <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--accent-cyan)]" />
            Research Pipeline
          </h3>
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.15)] to-transparent -translate-y-1/2 z-0" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {pipelineSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 glass-card text-center group hover:border-[rgba(16,185,129,0.3)]"
                >
                  <div className="flex justify-center mb-3" style={{ color: step.color }}>
                    {step.icon}
                  </div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-1">{step.label}</h4>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)]">{step.sublabel}</p>
                  {i < pipelineSteps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-[rgba(148,163,184,0.2)] mt-2 mx-auto md:hidden" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mb-10"
        >
          <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--accent-purple)]" />
            TFT Architecture Layers
          </h3>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {archLayers.map((layer, i) => {
              const IconComp = () => {
                switch (layer.icon) {
                  case 'Layers': return <Layers className="w-4 h-4" />;
                  case 'Zap': return <Zap className="w-4 h-4" />;
                  case 'TrendingUp': return <TrendingUp className="w-4 h-4" />;
                  default: return <Brain className="w-4 h-4" />;
                }
              };
              return (
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  className="flex-1 glass-card flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.15)] flex items-center justify-center text-[var(--accent-purple)] flex-shrink-0">
                    <IconComp />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">{layer.label}</h4>
                    <p className="text-[10px] font-mono text-[var(--text-secondary)]">{layer.sublabel}</p>
                  </div>
                  {i < archLayers.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[rgba(148,163,184,0.2)] ml-auto hidden md:block" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="glass-card mb-6"
        >
          <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-4">Key Highlights</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {seismicProject.highlights?.map((h, i) => (
              <motion.div
                key={h}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] mt-1.5 flex-shrink-0" />
                <span className="text-sm text-[var(--text-secondary)]">{h}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="flex flex-wrap gap-3"
        >
          <a
            href={seismicProject.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.03)] text-sm text-[var(--text-secondary)] hover:text-[var(--accent-purple)] hover:border-[rgba(139,92,246,0.4)] transition-all"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
          {seismicProject.huggingface && (
            <a
              href={seismicProject.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.03)] text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[rgba(6,182,212,0.4)] transition-all"
            >
              Live Demo <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}
