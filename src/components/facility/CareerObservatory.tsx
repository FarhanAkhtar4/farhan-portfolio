'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  ArrowDown,
} from 'lucide-react';
import { experience, education, siteConfig } from '@/lib/data';

const timelineEvents = [
  ...experience.map(exp => ({
    type: 'experience' as const,
    title: exp.role,
    organization: exp.company,
    period: exp.period,
    details: exp.responsibilities,
    location: 'Calicut, Kerala',
  })),
  ...education.map(edu => ({
    type: 'education' as const,
    title: edu.degree,
    organization: edu.institution,
    period: edu.period,
    details: edu.details ? [edu.details] : [],
    location: edu.institution.includes('Yenepoya') ? 'Moodbidri, Karnataka' : 'Sirsi, Karnataka',
  })),
];

export default function CareerObservatory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <div ref={sectionRef} className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-4xl w-full mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 06 — Career Observatory</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[var(--accent-purple)]">Career</span>{' '}
            <span className="text-[var(--text-primary)]">Timeline</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Research, education, and professional journey
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-purple)] via-[var(--accent-cyan)] to-[rgba(148,163,184,0.1)]" />

          <div className="space-y-8">
            {timelineEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-12 sm:pl-20"
              >
                {/* Timeline dot */}
                <div className={`absolute left-2.5 sm:left-6.5 top-1 w-3 h-3 rounded-full border-2 ${
                  event.type === 'experience'
                    ? 'bg-[var(--accent-purple)] border-[rgba(139,92,246,0.3)] shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'bg-[var(--accent-cyan)] border-[rgba(6,182,212,0.3)] shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                }`}>
                  {i === 0 && (
                    <span className="absolute inset-0 rounded-full border-2 border-[var(--accent-purple)] animate-ping opacity-30" />
                  )}
                </div>

                {/* Content */}
                <div className="glass-card group hover:border-[rgba(139,92,246,0.2)]">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {event.type === 'experience' ? (
                          <Briefcase className="w-3.5 h-3.5 text-[var(--accent-purple)]" />
                        ) : (
                          <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                        )}
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{event.title}</h3>
                      </div>
                      <p className="text-xs text-[var(--accent-purple)] font-mono">{event.organization}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  {event.details.length > 0 && (
                    <div className="space-y-2">
                      {event.details.map((detail, di) => (
                        <div key={di} className="flex items-start gap-2">
                          <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                            event.type === 'experience' ? 'bg-[var(--accent-purple)]' : 'bg-[var(--accent-cyan)]'
                          }`} />
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Future indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="relative pl-12 sm:pl-20 mt-8"
          >
            <div className="absolute left-2.5 sm:left-6.5 top-1 w-3 h-3 rounded-full border-2 border-dashed border-[rgba(148,163,184,0.3)]" />
            <div className="flex items-center gap-2 text-xs font-mono text-[rgba(148,163,184,0.4)]">
              <ArrowDown className="w-3 h-3" />
              Open to opportunities
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
