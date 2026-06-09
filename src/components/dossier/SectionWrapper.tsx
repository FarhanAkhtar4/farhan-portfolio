'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  caseNumber: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({
  id,
  caseNumber,
  title,
  subtitle,
  children,
  className = '',
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      data-section-id={id}
      className={`mb-16 ${className}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-[#A855F7] text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {caseNumber}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(168,85,247,0.3)] to-transparent" />
        </div>
        <h2
          className="text-[#00F0FF] text-xl md:text-2xl font-bold uppercase tracking-[0.15em]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[#4a6b7c]">{subtitle}</p>
        )}
      </div>

      {/* Content card */}
      <div className="dossier-card p-4 md:p-8">
        {children}
      </div>
    </motion.section>
  );
}
