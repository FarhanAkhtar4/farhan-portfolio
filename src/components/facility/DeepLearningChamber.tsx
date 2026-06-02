'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Cpu,
  Eye,
  Layers,
  ArrowRight,
  ExternalLink,
  Network,
} from 'lucide-react';
import { projects } from '@/lib/data';

const dlProjects = projects.filter(p => p.category === 'Deep Learning');
const saintProject = projects.find(p => p.id === 'saint-model')!;

const attentionSteps = [
  { icon: <Layers className="w-5 h-5" />, label: 'Input Embedding', desc: 'Feature tokenization', color: 'var(--accent-cyan)' },
  { icon: <Network className="w-5 h-5" />, label: 'Self-Attention', desc: 'Intra-sample attention weights', color: 'var(--accent-purple)' },
  { icon: <Eye className="w-5 h-5" />, label: 'Intersample Attention', desc: 'Cross-sample feature learning', color: 'var(--accent-cyan)' },
  { icon: <Brain className="w-5 h-5" />, label: 'Classification', desc: 'Tabular data prediction', color: 'var(--accent-emerald)' },
];

export default function DeepLearningChamber() {
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
          <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 04 — Deep Learning Chamber</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[var(--accent-cyan)]">Deep Learning</span>
            <br />
            <span className="text-[var(--text-primary)]">Chamber</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
            Transformer architectures, attention mechanisms, and neural network models 
            for complex predictive tasks across domains.
          </p>
        </motion.div>

        {/* SAINT Model — Attention Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-10"
        >
          <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[var(--accent-cyan)]" />
            SAINT — Attention Mechanism Breakdown
          </h3>
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 hero-grid rounded-xl" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
              {attentionSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                  className="text-center group"
                >
                  <div
                    className="w-12 h-12 rounded-lg border border-[var(--border-glass)] bg-[rgba(15,23,42,0.6)] flex items-center justify-center mx-auto mb-2 transition-all group-hover:border-[rgba(6,182,212,0.3)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    style={{ color: step.color }}
                  >
                    {step.icon}
                  </div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">{step.label}</h4>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)]">{step.desc}</p>
                  {i < attentionSteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[rgba(148,163,184,0.15)] mx-auto mt-1.5 hidden md:block" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Animated attention lines */}
            <div className="hidden md:flex absolute top-6 left-[15%] right-[15%] h-px pointer-events-none">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-px bg-gradient-to-r from-transparent via-[rgba(6,182,212,0.3)] to-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {dlProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card spotlight-card relative overflow-hidden"
            >
              {project.isFlagship && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(6,182,212,0.1)] text-[var(--accent-cyan)] border border-[rgba(6,182,212,0.2)] z-10">
                  FLAGSHIP
                </span>
              )}

              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{project.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">{project.description}</p>

              {/* Metrics */}
              {project.metrics && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {project.metrics.map(m => (
                    <span key={m.label} className={`px-3 py-1 rounded-lg text-xs ${m.accent ? 'bg-[rgba(16,185,129,0.08)] text-[var(--accent-emerald)] border border-[rgba(16,185,129,0.15)]' : 'bg-[rgba(15,23,42,0.4)] text-[var(--text-secondary)] border border-[var(--border-glass)]'}`}>
                      <strong>{m.value}</strong> {m.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Highlights */}
              <div className="space-y-2 mb-4">
                {project.highlights?.map((h, hi) => (
                  <div key={hi} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--accent-cyan)] mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-[var(--text-secondary)]">{h}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(6,182,212,0.06)] text-[var(--accent-cyan)] border border-[rgba(6,182,212,0.12)]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-glass)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[rgba(6,182,212,0.3)] transition-all">
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
                {project.huggingface && (
                  <a href={project.huggingface} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-glass)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent-emerald)] hover:border-[rgba(16,185,129,0.3)] transition-all">
                    Live Demo <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
