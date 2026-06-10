'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  ExternalLink,
  Star,
  Filter,
  Sparkles,
  Globe,
} from 'lucide-react';
import { projects, projectCategories } from '@/lib/data';

const categoryColors: Record<string, string> = {
  'Agentic AI': 'var(--accent-purple)',
  'AI & LLM': 'var(--accent-cyan)',
  'Deep Learning': 'var(--accent-emerald)',
  'SaaS & Full-Stack': '#f59e0b',
};

export default function ProjectVault() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

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
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 05 — Project Vault</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[#f59e0b]">Project</span>{' '}
            <span className="text-[var(--text-primary)]">Vault</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {projects.length} projects across {new Set(projects.map(p => p.category)).size} categories
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {projectCategories.map(cat => {
            const count = cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length;
            const isActive = activeFilter === cat;
            const color = cat === 'All' ? 'var(--accent-purple)' : categoryColors[cat] || 'var(--text-secondary)';
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                  isActive
                    ? 'border-opacity-30 bg-opacity-10'
                    : 'border-[var(--border-glass)] text-[var(--text-secondary)] hover:border-[rgba(148,163,184,0.2)]'
                }`}
                style={isActive ? { borderColor: color, backgroundColor: `${color}10`, color } : undefined}
              >
                <Filter className="w-3 h-3" />
                {cat}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`glass-card spotlight-card relative overflow-hidden group ${
                  project.isFlagship ? 'sm:col-span-2 lg:col-span-1 border-[rgba(139,92,246,0.12)]' : ''
                }`}
              >
                {/* Category color strip */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${categoryColors[project.category] || 'var(--accent-purple)'}, transparent)` }} />

                {/* Flagship badge */}
                {project.isFlagship && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(139,92,246,0.08)] text-[var(--accent-purple)] border border-[rgba(139,92,246,0.15)] z-10">
                    <Star className="w-2.5 h-2.5" />
                    FLAGSHIP
                  </div>
                )}

                <div className="pt-2">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 pr-16">{project.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-3">{project.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[rgba(15,23,42,0.5)] text-[var(--text-secondary)] border border-[var(--border-glass)]"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[var(--text-secondary)]">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-glass)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[rgba(148,163,184,0.3)] transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      Code
                    </a>
                    {project.deployedUrl && (
                      <a
                        href={project.deployedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-glass)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[rgba(6,182,212,0.3)] transition-all"
                      >
                        <Globe className="w-3 h-3" />
                        Live
                      </a>
                    )}
                    {project.huggingface && (
                      <a
                        href={project.huggingface}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-glass)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent-emerald)] hover:border-[rgba(16,185,129,0.3)] transition-all"
                      >
                        🤗 Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
