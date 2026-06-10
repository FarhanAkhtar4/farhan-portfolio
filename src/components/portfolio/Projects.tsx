'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, projectCategories } from '@/lib/data';
import FadeIn from './FadeIn';
import { ExternalLink, Github, Globe, ChevronRight } from 'lucide-react';

/* ============================================================
   SPOTLIGHT CARD WRAPPER — mouse-following glow
   ============================================================ */
function SpotCard({ children, className, flagship = false }: {
  children: React.ReactNode;
  className?: string;
  flagship?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current?.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    ref.current?.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`card-glow rounded-xl overflow-hidden ${
        flagship
          ? 'bg-emerald-500/[0.015] border border-emerald-500/10'
          : 'bg-white/[0.02] border border-white/[0.06]'
      } ${className || ''}`}
    >
      {children}
    </div>
  );
}

/* ============================================================
   ARCHITECTURE PIPELINE
   ============================================================ */
function ArchPipeline({ layers, title }: { layers: { label: string; sublabel: string }[]; title: string }) {
  if (!layers || layers.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-white/[0.04]">
      <p className="text-[10px] font-mono text-white/20 uppercase tracking-wider mb-2">{title}</p>
      <div className="arch-pipeline">
        {layers.map((layer, i) => (
          <span key={i} className="flex items-center">
            <div className="arch-node">
              <div className="arch-label">{layer.label}</div>
              <div className="arch-sub">{layer.sublabel}</div>
            </div>
            {i < layers.length - 1 && <div className="arch-arrow" />}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PROJECTS SECTION
   ============================================================ */
export default function Projects() {
  const [active, setActive] = useState<string>('All');
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-24 sm:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-mono font-medium text-emerald-500/70 uppercase tracking-widest mb-3">
            Projects
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/95">
            What I&apos;ve Built
          </h2>
          <p className="mt-3 text-white/40 text-sm max-w-xl leading-relaxed">
            From seismic prediction with Temporal Fusion Transformers to multi-agent SaaS platforms —
            each project solves a real problem with production-grade architecture.
          </p>
        </FadeIn>

        {/* Filter */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mt-8">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active === cat
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <SpotCard flagship={project.isFlagship} className="p-5 relative">
                  {/* Flagship badge */}
                  {project.isFlagship && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                        Flagship
                      </span>
                    </div>
                  )}

                  {/* Category + Title */}
                  <div className="mb-3 relative z-10">
                    <span className="text-[10px] font-mono font-medium text-white/20 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-base font-semibold text-white/90 mt-1 pr-20 leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/40 leading-relaxed mb-4 relative z-10 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Metrics */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                      {project.metrics.map((m) => (
                        <div
                          key={m.label}
                          className={`metric-chip ${
                            m.accent
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-white/[0.03] text-white/50'
                          }`}
                        >
                          <span className={`metric-val ${m.accent ? '' : 'text-white/70'}`}>{m.value}</span>
                          <span className="text-white/20 font-normal">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Highlights */}
                  {project.highlights && (
                    <ul className="space-y-1.5 mb-4 relative z-10">
                      {project.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex gap-2 text-xs text-white/35 leading-relaxed">
                          <ChevronRight size={12} className="text-emerald-500/50 mt-0.5 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3 relative z-10">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-mono text-white/30 bg-white/[0.03] rounded border border-white/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Architecture pipeline */}
                  {project.architecture && (
                    <ArchPipeline layers={project.architecture.layers} title={project.architecture.title} />
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-3 mt-auto border-t border-white/[0.04] relative z-10">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors"
                    >
                      <Github size={13} /> Source
                    </a>
                    {project.huggingface && (
                      <a
                        href={project.huggingface}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors"
                      >
                        <Globe size={13} /> Demo
                      </a>
                    )}
                    {project.deployedUrl && (
                      <a
                        href={project.deployedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors"
                      >
                        <ExternalLink size={13} /> Live
                      </a>
                    )}
                  </div>
                </SpotCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}