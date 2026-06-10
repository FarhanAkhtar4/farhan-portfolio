'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  MessageSquare,
  Database,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Users,
  Workflow,
} from 'lucide-react';
import { projects } from '@/lib/data';

const agenticProjects = projects.filter(p => p.category === 'Agentic AI');

const agentTypes = [
  { icon: <MessageSquare className="w-5 h-5" />, label: 'User Query', desc: 'Natural language task input', color: 'var(--accent-cyan)' },
  { icon: <Brain className="w-5 h-5" />, label: 'Orchestrator', desc: 'Task decomposition & routing', color: 'var(--accent-purple)' },
  { icon: <Users className="w-5 h-5" />, label: 'Specialized Agents', desc: 'Research, Code, Analysis, Planning', color: 'var(--accent-cyan)' },
  { icon: <Sparkles className="w-5 h-5" />, label: 'Synthesis', desc: 'Unified response generation', color: 'var(--accent-emerald)' },
];

export default function AgenticAICenter() {
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
          <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 03 — Agentic AI Command Center</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[var(--accent-purple)]">Agentic AI</span>
            <br />
            <span className="text-[var(--text-primary)]">Systems</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
            Multi-agent orchestration platforms, RAG pipelines, and intelligent systems 
            that combine retrieval, reasoning, and response generation.
          </p>
        </motion.div>

        {/* Agent Workflow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-10"
        >
          <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Workflow className="w-4 h-4 text-[var(--accent-purple)]" />
            Multi-Agent Workflow
          </h3>
          <div className="relative glass-card p-6">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-5 hero-grid rounded-xl" />
            <div className="relative flex flex-col md:flex-row items-center gap-4">
              {agentTypes.map((agent, i) => (
                <motion.div
                  key={agent.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                  className="flex-1 text-center group"
                >
                  <div
                    className="w-14 h-14 rounded-xl border border-[var(--border-glass)] bg-[rgba(15,23,42,0.6)] flex items-center justify-center mx-auto mb-3 transition-all group-hover:border-[rgba(139,92,246,0.3)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                    style={{ color: agent.color }}
                  >
                    {agent.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{agent.label}</h4>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] max-w-[140px] mx-auto">{agent.desc}</p>
                  {i < agentTypes.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[rgba(148,163,184,0.15)] mx-auto mt-2 md:rotate-0 rotate-90" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {agenticProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card spotlight-card relative overflow-hidden ${project.isFlagship ? 'md:col-span-2' : ''}`}
            >
              {/* Flagship badge */}
              {project.isFlagship && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(139,92,246,0.1)] text-[var(--accent-purple)] border border-[rgba(139,92,246,0.2)] z-10">
                  FLAGSHIP
                </span>
              )}

              <div className={`flex flex-col ${project.isFlagship ? 'md:flex-row md:items-center gap-6' : ''}`}>
                <div className={`flex-1 ${project.isFlagship ? '' : ''}`}>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{project.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">{project.description}</p>

                  {/* Architecture visualization */}
                  {project.architecture && (
                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {project.architecture.layers.map((layer, li) => (
                          <span key={layer.label} className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-glass)] text-[10px] font-mono text-[var(--text-secondary)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]" />
                            {layer.label}
                            {li < project.architecture!.layers.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-[rgba(148,163,184,0.3)] ml-1" />}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {project.highlights?.map((h, hi) => (
                      <div key={hi} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[var(--accent-purple)] mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-[var(--text-secondary)]">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(139,92,246,0.06)] text-[var(--accent-purple)] border border-[rgba(139,92,246,0.12)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3 mt-4">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-glass)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent-purple)] hover:border-[rgba(139,92,246,0.3)] transition-all">
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
                {project.deployedUrl && (
                  <a href={project.deployedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-glass)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[rgba(6,182,212,0.3)] transition-all">
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
