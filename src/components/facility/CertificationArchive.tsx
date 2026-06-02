'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Award,
  ExternalLink,
  Shield,
  Cpu,
  Cloud,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { certifications, certCategories, categoryDots } from '@/lib/data';

const categoryIcons: Record<string, React.ReactNode> = {
  'AI & ML': <Cpu className="w-4 h-4" />,
  'GenAI & Agentic AI': <Shield className="w-4 h-4" />,
  'Cloud & Data': <Cloud className="w-4 h-4" />,
  Other: <Award className="w-4 h-4" />,
};

export default function CertificationArchive() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState<string>('certCategories0');

  const filtered = activeFilter === 'certCategories0'
    ? certifications
    : certifications.filter(c => c.category === activeFilter);

  return (
    <div ref={sectionRef} className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl w-full mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 08 — Certification Archive</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[var(--accent-emerald)]">Certification</span>{' '}
            <span className="text-[var(--text-primary)]">Archive</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {certifications.length} verified certifications across multiple domains
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {certCategories.map((cat, i) => {
            const filterId = `certCategories${i}`;
            const isActive = activeFilter === filterId;
            const dotColor = cat === 'All' ? 'var(--accent-purple)' : categoryDots[cat] || 'var(--text-secondary)';
            const count = cat === 'All' ? certifications.length : certifications.filter(c => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(filterId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                  isActive
                    ? 'bg-opacity-10'
                    : 'border-[var(--border-glass)] text-[var(--text-secondary)] hover:border-[rgba(148,163,184,0.2)]'
                }`}
                style={isActive ? { borderColor: dotColor, backgroundColor: `${dotColor}10`, color: dotColor } : undefined}
              >
                {cat !== 'All' && <span className={`w-1.5 h-1.5 rounded-full ${categoryDots[cat] || ''}`} />}
                <Filter className="w-3 h-3" />
                {cat}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Certification Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((cert, i) => (
              <motion.div
                key={cert.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card spotlight-card group"
              >
                {/* Top accent */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-[rgba(15,23,42,0.6)] border border-[var(--border-glass)] flex items-center justify-center text-[var(--text-secondary)]`}>
                      {categoryIcons[cert.category] || <Award className="w-4 h-4" />}
                    </div>
                    <span className={`w-2 h-2 rounded-full ${categoryDots[cert.category] || ''}`} />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] px-2 py-0.5 rounded-full border border-[var(--border-glass)]">
                    {cert.category}
                  </span>
                </div>

                {/* Title & Issuer */}
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1 leading-snug">{cert.title}</h3>
                <p className="text-xs font-mono text-[var(--text-secondary)] mb-3">{cert.issuer}</p>

                {/* Verify/Download links */}
                <div className="flex items-center gap-2">
                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-glass)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent-emerald)] hover:border-[rgba(16,185,129,0.3)] transition-all"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Verify
                    </a>
                  )}
                  {cert.certFile && (
                    <a
                      href={cert.certFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-glass)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[rgba(6,182,212,0.3)] transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
