'use client';

import { motion } from 'framer-motion';
import { Briefcase, Lock, Rocket, Search, Clock } from 'lucide-react';

interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isReal?: boolean;
  isLast?: boolean;
  isClassified?: boolean;
}

const timelineEntries: TimelineEntry[] = [
  {
    date: '2024 — Present',
    title: 'NIT Calicut AI/ML Internship',
    description:
      'Research internship focused on deep learning architectures and natural language processing. Developed novel approaches to [PLACEHOLDER] under the guidance of faculty researchers. Published findings on [PLACEHOLDER].',
    icon: <Briefcase className="w-5 h-5" />,
    isReal: true,
  },
  {
    date: '[REDACTED DATE]',
    title: '[CLASSIFIED ASSIGNMENT]',
    description:
      'Operative deployed on a classified assignment involving [PLACEHOLDER]. Details withheld under clearance protocol SECTION-7B. Mission parameters: [PLACEHOLDER]. Duration: [REDACTED].',
    icon: <Lock className="w-5 h-5" />,
    isClassified: true,
  },
  {
    date: '[PLACEHOLDER DATE]',
    title: 'AI Production Deployment',
    description:
      'Spearheaded the deployment of [PLACEHOLDER] AI systems into production environments. Achieved [PLACEHOLDER]% improvement in [PLACEHOLDER] metrics. Infrastructure: [PLACEHOLDER].',
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    date: '[REDACTED DATE]',
    title: '[CLASSIFIED ASSIGNMENT]',
    description:
      'Black-ops initiative targeting [PLACEHOLDER]. Collaboration with [PLACEHOLDER] division on [PLACEHOLDER] operations. Outcome: CLASSIFIED — clearance level OMEGA required.',
    icon: <Lock className="w-5 h-5" />,
    isClassified: true,
  },
  {
    date: 'ACTIVE',
    title: 'Seeking Opportunities',
    description:
      'Operative currently available for deployment. Seeking roles in AI/ML Engineering, Deep Learning Research, and Generative AI Systems. Open to [PLACEHOLDER] positions globally.',
    icon: <Search className="w-5 h-5" />,
    isLast: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function CareerTimelineSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8" id="timeline">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono tracking-[0.3em] text-cyan-400/70 uppercase">
            Case File #006-TIMELINE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-cyan-300 font-mono">
          OPERATIVE TIMELINE{' '}
          <span className="text-cyan-500">{'//'}</span> CLEARANCE PATH
        </h2>
        <div className="mt-4 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </motion.div>

      {/* Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="relative max-w-4xl mx-auto"
      >
        {/* Glowing Cyan Line — Vertical */}
        <div
          className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0, 240, 255, 0.25), rgba(0, 240, 255, 0.15), transparent)',
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.2), 0 0 30px rgba(0, 240, 255, 0.05)',
          }}
        />

        {/* Timeline Entries */}
        <div className="space-y-12">
          {timelineEntries.map((entry, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Date Label — Left side on desktop */}
              <div
                className={`hidden md:flex flex-col items-end w-44 shrink-0 ${
                  index % 2 === 0 ? 'order-1' : 'order-3'
                }`}
              >
                <span className="text-sm font-mono text-cyan-400/80 tracking-wider">
                  {entry.date}
                </span>
              </div>

              {/* Node Dot */}
              <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    entry.isLast
                      ? 'border-2 border-cyan-400 animate-pulse bg-cyan-400/10'
                      : 'bg-gray-950 border border-cyan-500/40'
                  } ${entry.isReal ? 'bg-cyan-400/15 border-cyan-400/60 shadow-[0_0_16px_rgba(0,240,255,0.3)]' : ''} ${
                    entry.isClassified ? 'bg-red-500/10 border-red-500/40' : ''
                  }`}
                >
                  <span
                    className={
                      entry.isReal
                        ? 'text-cyan-400'
                        : entry.isClassified
                        ? 'text-red-400/70'
                        : entry.isLast
                        ? 'text-cyan-400'
                        : 'text-cyan-500/70'
                    }
                  >
                    {entry.icon}
                  </span>
                </div>
              </div>

              {/* Content Card */}
              <div
                className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${
                  index % 2 === 0 ? 'md:order-2' : 'md:order-2'
                }`}
              >
                {/* Mobile Date */}
                <div className="md:hidden mb-1">
                  <span className="text-xs font-mono text-cyan-400/70 tracking-wider">
                    {entry.date}
                  </span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`relative p-4 sm:p-5 rounded-lg border backdrop-blur-sm ${
                    entry.isLast
                      ? 'border-cyan-400/40 bg-cyan-400/[0.04] shadow-[0_0_20px_rgba(0,240,255,0.08)]'
                      : entry.isReal
                      ? 'border-cyan-400/30 bg-cyan-400/[0.03] shadow-[0_0_16px_rgba(0,240,255,0.06)]'
                      : entry.isClassified
                      ? 'border-red-500/20 bg-red-500/[0.02]'
                      : 'border-cyan-500/15 bg-cyan-500/[0.03]'
                  }`}
                  style={{
                    background: entry.isClassified
                      ? 'rgba(3, 7, 18, 0.8)'
                      : 'rgba(3, 15, 25, 0.7)',
                  }}
                >
                  {/* Redacted Stamp for Classified */}
                  {entry.isClassified && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-lg">
                      <span className="text-red-500/20 text-3xl font-bold tracking-[0.4em] -rotate-12 border-2 border-red-500/15 px-4 py-1 rounded-sm uppercase">
                        Classified
                      </span>
                    </div>
                  )}

                  {/* Real Badge */}
                  {entry.isReal && (
                    <div className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/30 w-fit">
                      <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase">
                        Verified
                      </span>
                    </div>
                  )}

                  <h3
                    className={`text-base sm:text-lg font-bold font-mono tracking-wide mb-2 ${
                      entry.isLast
                        ? 'text-cyan-300'
                        : entry.isClassified
                        ? 'text-red-300/80'
                        : 'text-cyan-200'
                    }`}
                  >
                    {entry.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-mono leading-relaxed">
                    {entry.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
