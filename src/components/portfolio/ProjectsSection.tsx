'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Github, ExternalLink, Star, Zap, ChevronRight, GitFork, Globe, Box } from 'lucide-react';
import { projects, projectCategories, type Project } from '@/lib/data';
import { fadeUpSlow, easeSmooth, easeOut, transitionSmooth } from '@/lib/animations';
import type { Variants } from 'framer-motion';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const filterTabVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      delay: 0.15 + i * 0.06,
    },
  }),
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 22,
      delay: i * 0.08,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 12,
    transition: { duration: 0.25, ease: easeOut },
  },
};

// ---------------------------------------------------------------------------
// Category color map
// ---------------------------------------------------------------------------

const categoryColors: Record<string, { badge: string; dot: string; border: string }> = {
  'Deep Learning': { badge: 'bg-purple-500/15 text-purple-300 border-purple-500/25', dot: 'bg-purple-400', border: 'border-purple-500/20' },
  'Agentic AI': { badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25', dot: 'bg-cyan-400', border: 'border-cyan-500/20' },
  'AI & LLM': { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/25', dot: 'bg-amber-400', border: 'border-amber-500/20' },
  'SaaS & Full-Stack': { badge: 'bg-rose-500/15 text-rose-300 border-rose-500/25', dot: 'bg-rose-400', border: 'border-rose-500/20' },
};

// Pre-compute category counts (pure computation, no hooks)
const categoryCount: Record<string, number> = (() => {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  counts['All'] = projects.length;
  return counts;
})();

// ---------------------------------------------------------------------------
// Language color dots (matching GitHub language colors)
// ---------------------------------------------------------------------------

const langColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  PyTorch: '#EE4C2C',
  Power: '#F2C811',
  SQL: '#e38c00',
};

function getLangColor(tags: string[]): string {
  for (const tag of tags) {
    if (langColors[tag]) return langColors[tag];
  }
  return '#8b949e';
}

function getPrimaryLang(tags: string[]): string {
  for (const tag of tags) {
    if (['Python', 'TypeScript', 'PyTorch'].includes(tag)) return tag;
  }
  return tags[0] || 'Code';
}

// ---------------------------------------------------------------------------
// Architecture layer icon resolver
// ---------------------------------------------------------------------------

function ArchitectureIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    Layers: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    Zap: <Zap className="h-4 w-4" />,
    TrendingUp: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    MessageSquare: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    Database: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    Brain: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
        <path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" />
        <path d="M6 18a4 4 0 0 1-1.967-.516" /><path d="M19.967 17.484A4 4 0 0 1 18 18" />
      </svg>
    ),
    Sparkles: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
      </svg>
    ),
    Globe: <Globe className="h-4 w-4" />,
  };

  return <span className="text-cyan-400">{iconMap[name] || <Zap className="h-4 w-4" />}</span>;
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={transitionSmooth}
      className="mb-10 text-center"
    >
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/70">
        What I&apos;ve Built
      </p>
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
        My <span className="gradient-text">Projects</span>
      </h2>
      <div className="heading-gradient-line mx-auto mt-2 w-24 sm:w-32" />

      {/* Project count badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5"
      >
        <Box className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-sm font-medium">
          <span className="gradient-text font-bold">{projects.length}</span>
          <span className="ml-1 text-[var(--text-secondary)]">Projects</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

interface FilterTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

function FilterTabs({ activeCategory, onCategoryChange }: FilterTabsProps) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5">
      {projectCategories.map((category, i) => {
        const isActive = activeCategory === category;
        const count = categoryCount[category] || 0;

        return (
          <motion.button
            key={category}
            custom={i}
            variants={filterTabVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            onClick={() => onCategoryChange(category)}
            className={`
              relative rounded-full px-4 py-2 text-xs font-semibold tracking-wide
              transition-colors duration-300
              ${isActive
                ? 'text-cyan-300 border border-cyan-500/30 shadow-[0_0_16px_rgba(6,182,212,0.12)]'
                : 'text-[var(--text-secondary)] border border-white/[0.06] hover:border-white/[0.12] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {category}
            <span className={`ml-1.5 text-[10px] ${isActive ? 'text-cyan-400/70' : 'text-[var(--text-secondary)]/50'}`}>
              {count}
            </span>
            {isActive && (
              <motion.span
                layoutId="project-filter-indicator"
                className="absolute inset-0 -z-10 rounded-full bg-cyan-500/15"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Architecture diagram
// ---------------------------------------------------------------------------

function ArchitectureDiagram({
  architecture,
}: {
  architecture: NonNullable<Project['architecture']>;
}) {
  return (
    <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
        {architecture.title}
      </p>
      <div className="flex flex-col items-center gap-0">
        {architecture.layers.map((layer, i) => (
          <React.Fragment key={layer.label + layer.sublabel}>
            <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-500/10">
                <ArchitectureIcon name={layer.icon} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-tight text-[var(--text-primary)]">
                  {layer.label}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">{layer.sublabel}</span>
              </div>
            </div>
            {i < architecture.layers.length - 1 && (
              <div className="flex flex-col items-center py-0.5">
                <div className="h-3.5 w-px bg-gradient-to-b from-cyan-500/30 to-purple-500/30" />
                <ChevronRight className="h-2 w-2 rotate-90 text-cyan-500/30" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3D tilt + spotlight card
// ---------------------------------------------------------------------------

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const hasLinks = project.github || project.huggingface;
  const langColor = getLangColor(project.tags);
  const primaryLang = getPrimaryLang(project.tags);
  const catStyle = categoryColors[project.category] || categoryColors['Deep Learning'];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt: max 8 degrees
    const tiltX = ((y - centerY) / centerY) * -8;
    const tiltY = ((x - centerX) / centerX) * 8;

    setTilt({ x: tiltX, y: tiltY });
    setSpotlightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setSpotlightPos({ x: 50, y: 50 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <motion.article
      layout
      layoutId={project.id}
      custom={index}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`${project.isFlagship ? 'md:col-span-2' : ''}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          tilt-card spotlight-card group relative flex flex-col overflow-hidden
          rounded-xl border border-white/[0.06] bg-[var(--bg-card)] p-5
          backdrop-blur-xl transition-[border-color,box-shadow] duration-300
          ${project.isFlagship
            ? 'gradient-border-animated glass-card-premium'
            : ''
          }
          ${isHovered
            ? 'border-cyan-500/20 shadow-[0_8px_40px_-8px_rgba(6,182,212,0.15)]'
            : ''
          }
        `}
        style={{
          '--spotlight-x': `${spotlightPos.x}%`,
          '--spotlight-y': `${spotlightPos.y}%`,
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
          transition: 'transform 0.2s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
        } as React.CSSProperties}
      >
        {/* Gradient accent line for flagship */}
        {project.isFlagship && (
          <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        )}

        {/* Header row: category dot + badge + flagship star + live badge */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${catStyle.dot}`} />
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${catStyle.badge}`}
            >
              {project.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Live badge for HuggingFace projects */}
            {project.huggingface && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Live
              </span>
            )}
            {project.isFlagship && (
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400/80">
                <Star className="h-3 w-3 fill-amber-400/70 text-amber-400/70" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Language badge + Title */}
        <div className="mb-1.5 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-snug text-[var(--text-primary)] transition-colors duration-200 group-hover:text-cyan-300">
            {project.title}
          </h3>
          {/* GitHub stats (star + fork) */}
          <div className="flex shrink-0 items-center gap-2.5 pt-0.5">
            <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
              <Star className="h-3 w-3" />
              <span>0</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
              <GitFork className="h-3 w-3" />
              <span>0</span>
            </span>
          </div>
        </div>

        {/* Language dot + One-liner */}
        <div className="mb-2 flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor }} />
            {primaryLang}
          </span>
          <span className="text-[var(--text-secondary)]/40">·</span>
          <p className="text-[11px] font-medium text-cyan-400/60">{project.oneLiner}</p>
        </div>

        {/* Description */}
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--text-secondary)] line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-gradient-to-br from-purple-500/10 to-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300/80 border border-white/[0.04]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Metrics row */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 ${
                  metric.accent
                    ? 'border-cyan-500/20 bg-cyan-500/10'
                    : 'border-white/[0.06] bg-white/[0.02]'
                }`}
              >
                {metric.accent && <Zap className="h-3 w-3 text-cyan-400" />}
                <div className="flex flex-col">
                  <span className={`text-xs font-bold leading-tight ${metric.accent ? 'text-cyan-300' : 'text-[var(--text-primary)]'}`}>
                    {metric.value}
                  </span>
                  <span className="text-[9px] leading-tight text-[var(--text-secondary)]">{metric.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Highlights list */}
        {project.highlights && project.highlights.length > 0 && (
          <ul className="mb-3 flex flex-col gap-1.5">
            {project.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400/60" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Architecture diagram (flagship projects only) */}
        {project.architecture && (
          <ArchitectureDiagram architecture={project.architecture} />
        )}

        {/* Spacer to push links to bottom */}
        <div className="mt-auto pt-3" />

        {/* Links row */}
        {hasLinks && (
          <div className="flex items-center gap-3 border-t border-white/[0.06] pt-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub: ${project.title}`}
                className="group/link flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:bg-white/[0.05] hover:text-[var(--text-primary)]"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {project.huggingface && (
              <a
                href={project.huggingface}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`HuggingFace: ${project.title}`}
                className="group/link flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:bg-white/[0.05] hover:text-[var(--text-primary)]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 16.09V18.4c-2.69-.08-3.79-1.83-3.79-1.83 0-.61.4-1.26.4-1.26s1.04.62 1.75.77c.36.07.72.09 1.06.09.52 0 1.02-.06 1.52-.2.05-.01.09-.02.13-.03l.03-.01c.02-.01.04-.02.06-.03l.02-.01c.04-.02.07-.04.1-.06.05-.03.09-.06.13-.09l.01-.01c.02-.02.04-.03.06-.05.02-.02.04-.04.06-.07.01-.01.02-.02.03-.04.02-.03.04-.06.06-.09.01-.02.02-.03.03-.05.01-.03.03-.06.04-.09.01-.02.02-.04.02-.07.01-.03.02-.07.03-.1 0-.02.01-.04.01-.07.01-.04.01-.08.01-.12v-.04c0-.05 0-.1-.01-.14 0-.03 0-.05-.01-.08 0-.04-.01-.08-.02-.12 0-.02-.01-.04-.02-.07-.01-.04-.02-.07-.04-.11-.01-.02-.02-.04-.03-.07-.02-.04-.04-.07-.06-.11l-.03-.05c-.03-.04-.06-.08-.09-.12l-.03-.03c-.04-.04-.08-.08-.12-.12l-.04-.03c-.04-.03-.09-.07-.14-.1l-.03-.02c-.06-.03-.12-.06-.18-.08-.04-.02-.07-.03-.11-.04-.02 0-.05-.01-.07-.02-.04-.01-.08-.02-.13-.02h-.06c-.05 0-.1.01-.15.02-.02 0-.05.01-.07.02-.04.01-.08.02-.12.04-.02.01-.05.02-.07.03-.04.02-.08.05-.12.07l-.03.02c-.05.04-.1.08-.14.12l-.02.02c-.04.04-.08.09-.11.14l-.01.02c-.03.05-.06.1-.08.15v.01c-.02.05-.04.1-.05.15 0 .02-.01.04-.01.07-.01.04-.01.09-.02.14v.03c0 .05 0 .11.01.16 0 .02 0 .04.01.07.01.05.02.09.03.14.01.02.01.04.02.06.02.05.04.1.06.14.01.02.02.04.03.05.03.04.05.08.08.12l.02.03c.03.03.05.06.08.09.01.01.02.02.03.04.03.03.05.05.08.07.01.01.02.02.03.03.03.02.05.04.08.06.02.01.03.02.05.03.03.02.05.03.08.05l.06.03c.03.01.05.03.08.04l.06.02c.04.01.07.02.11.03.03.01.05.01.08.02.04.01.07.01.11.02h.1c.04 0 .07 0 .11-.01h.03c.04-.01.07-.01.11-.02l.03-.01c.04-.01.07-.02.11-.03.01 0 .02 0 .03-.01.04-.01.07-.03.11-.04l.02-.01c.04-.02.08-.04.12-.07.01 0 .01-.01.02-.01.04-.02.08-.05.12-.08l.02-.01c.04-.03.08-.07.12-.1l.02-.02c.04-.04.07-.08.11-.12l.01-.01c.03-.04.07-.09.1-.13l.01-.02c.03-.05.06-.1.08-.15l.01-.02c.03-.05.05-.11.07-.16v-.01c.02-.06.03-.11.04-.17 0-.02 0-.04.01-.07.01-.06.01-.12.01-.18v-.03c0-.06 0-.12-.01-.18 0-.02 0-.04-.01-.07-.01-.06-.02-.12-.04-.18 0-.02-.01-.04-.02-.07-.02-.06-.04-.11-.06-.17-.01-.02-.02-.04-.03-.07-.02-.05-.05-.11-.08-.16l-.03-.05c-.03-.05-.06-.1-.09-.14l-.03-.04c-.04-.05-.07-.09-.11-.13l-.03-.03c-.04-.04-.08-.08-.13-.12l-.03-.03c-.05-.04-.1-.08-.15-.11l-.03-.02c-.05-.03-.1-.06-.16-.09l-.03-.01c-.06-.03-.11-.05-.17-.07l-.03-.01c-.06-.02-.12-.04-.18-.05h-.03c-.06-.01-.13-.02-.19-.02h-.04c-.07 0-.13.01-.2.02h-.03c-.06.01-.13.03-.19.05l-.03.01c-.06.02-.12.05-.18.07l-.03.02c-.06.03-.11.07-.16.11l-.03.02c-.05.04-.09.08-.14.12l-.02.03c-.04.04-.08.09-.12.14l-.02.03c-.03.05-.07.1-.09.16l-.02.05c-.03.05-.05.11-.07.17-.01.02-.02.04-.02.07-.02.06-.04.12-.05.18 0 .02 0 .04-.01.07-.01.06-.01.12-.01.18v.03c0 .06 0 .12.01.18 0 .02 0 .04.01.07.01.06.02.12.04.18 0 .02.01.05.02.07.02.06.04.11.06.17.01.02.02.05.03.07.03.05.05.1.08.16l.03.04c.04.05.07.1.11.14l.03.03c.04.04.08.08.12.13l.03.03c.04.04.09.08.14.12l.03.02c.05.04.1.07.15.11l.03.02c.05.03.11.06.16.09l.03.01c.06.03.11.05.17.07l.03.01c.06.02.12.04.19.05h.03c.06.01.13.02.2.02h.04z" />
                </svg>
                <span>Demo</span>
              </a>
            )}
            {project.deployedUrl && (
              <a
                href={project.deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live: ${project.title}`}
                className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-400 transition-colors duration-200 hover:bg-emerald-500/20"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Live</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title}`}
                className="ml-auto flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:bg-white/[0.05] hover:text-cyan-400"
              >
                <ExternalLink className="h-3 w-3" />
                <span>View</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
        <Box className="h-8 w-8 text-[var(--text-secondary)]/30" />
      </div>
      <p className="text-sm font-medium text-[var(--text-secondary)]">
        No projects found in this category.
      </p>
      <p className="mt-1 text-xs text-[var(--text-secondary)]/60">
        Try selecting a different filter above.
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ProjectsSection — main exported component
// ---------------------------------------------------------------------------

function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="projects" className="relative z-10 section-padding">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-cyan-600/[0.05] blur-[120px]" />
        <div className="absolute -right-32 bottom-1/3 h-72 w-72 rounded-full bg-purple-500/[0.04] blur-[120px]" />
        <div className="absolute left-1/3 top-2/3 h-64 w-64 rounded-full bg-emerald-500/[0.03] blur-[100px]" />
      </div>

      <div className="container-custom relative">
        <SectionHeading />
        <FilterTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Project cards grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            layout
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredProjects.length === 0 && <EmptyState />}
      </div>
    </section>
  );
}

export default ProjectsSection;
