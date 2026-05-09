'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Filter, Download } from 'lucide-react';
import {
  certifications,
  certCategories,
  categoryDots,
  type Certification,
} from '@/lib/data';
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
      duration: 0.5,
      delay: 0.15 + i * 0.08,
      ease: easeSmooth,
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
      duration: 0.6,
      delay: i * 0.1,
      ease: easeSmooth,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 12,
    transition: { duration: 0.3, ease: easeOut },
  },
};

// ---------------------------------------------------------------------------
// Category accent map — for card border glow on hover
// ---------------------------------------------------------------------------

const categoryAccentMap: Record<Certification['category'], string> = {
  'AI & ML': 'hover:border-purple-500/30 hover:shadow-[0_8px_32px_-8px_rgba(168,85,247,0.15)]',
  'GenAI & Agentic AI': 'hover:border-yellow-500/30 hover:shadow-[0_8px_32px_-8px_rgba(250,204,21,0.12)]',
  'Cloud & Data': 'hover:border-cyan-500/30 hover:shadow-[0_8px_32px_-8px_rgba(6,182,212,0.15)]',
  Other: 'hover:border-emerald-500/30 hover:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.15)]',
};

const categoryIconColorMap: Record<Certification['category'], string> = {
  'AI & ML': 'text-purple-400',
  'GenAI & Agentic AI': 'text-yellow-400',
  'Cloud & Data': 'text-cyan-400',
  Other: 'text-emerald-400',
};

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
      className="mb-14 text-center"
    >
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/70">
        Credentials &amp; Learning
      </p>
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
        <span className="gradient-text">Certifications</span>
      </h2>
      <div className="heading-gradient-line mx-auto mt-2 w-24 sm:w-32" />
      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        Professional Credentials
      </p>
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
      {certCategories.map((category, i) => {
        const isActive = activeCategory === category;
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
              relative rounded-full px-5 py-2 text-xs font-semibold tracking-wide
              transition-all duration-300
              ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_16px_rgba(6,182,212,0.12)]'
                  : 'glass text-[var(--text-secondary)] border border-white/[0.06] hover:border-white/[0.12] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {category}
            {isActive && (
              <motion.span
                layoutId="cert-filter-indicator"
                className="absolute inset-0 -z-10 rounded-full bg-cyan-500/20"
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
// Certification card
// ---------------------------------------------------------------------------

interface CertCardProps {
  cert: Certification;
  index: number;
}

function CertCard({ cert, index }: CertCardProps) {
  const accentClass = categoryAccentMap[cert.category];
  const iconColor = categoryIconColorMap[cert.category];
  const dotClass = categoryDots[cert.category];

  return (
    <motion.article
      layout
      layoutId={cert.title}
      custom={index}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className={`glass-card group relative flex flex-col transition-all duration-300 ${accentClass}`}
    >
      {/* Category dot + category label */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {cert.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-1.5 text-sm font-bold leading-snug text-[var(--text-primary)] transition-colors duration-200 group-hover:text-cyan-300 sm:text-base">
        {cert.title}
      </h3>

      {/* Issuer */}
      <p className="mb-4 text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
        <Award className={`h-3 w-3 ${iconColor}`} />
        {cert.issuer}
      </p>

      {/* Spacer to push buttons to bottom */}
      <div className="mt-auto" />

      {/* Action buttons */}
      <div className="flex items-center gap-2 border-t border-white/[0.06] pt-3">
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verify ${cert.title}`}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:bg-white/[0.05] hover:text-cyan-400"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Verify</span>
          </a>
        )}
        {cert.certFile && (
          <a
            href={cert.certFile}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Download ${cert.title}`}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:bg-white/[0.05] hover:text-purple-400"
          >
            <Download className="h-3 w-3" />
            <span>Certificate</span>
          </a>
        )}
        {!cert.verifyUrl && !cert.certFile && (
          <span className="text-[10px] text-[var(--text-secondary)] opacity-50">
            No credential link available
          </span>
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <Filter className="h-6 w-6 text-[var(--text-secondary)] opacity-40" />
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        No certifications found in this category.
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// CertificationsSection — main exported component
// ---------------------------------------------------------------------------

function CertificationsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredCerts = useMemo(() => {
    if (activeCategory === 'All') return certifications;
    return certifications.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="certifications" className="relative z-10 section-padding">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-purple-600/[0.05] blur-[120px]" />
        <div className="absolute -right-32 bottom-1/3 h-72 w-72 rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <div className="container-custom relative">
        <SectionHeading />

        {/* Filter tabs */}
        <FilterTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Count badge */}
        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Award className="h-3.5 w-3.5 text-cyan-400/70" />
            {filteredCerts.length} {filteredCerts.length === 1 ? 'Certification' : 'Certifications'}
          </span>
        </div>

        {/* Certification grid */}
        <AnimatePresence mode="popLayout">
          {filteredCerts.length > 0 ? (
            <motion.div
              key={activeCategory}
              layout
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredCerts.map((cert, i) => (
                <CertCard key={cert.title} cert={cert} index={i} />
              ))}
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default CertificationsSection;
