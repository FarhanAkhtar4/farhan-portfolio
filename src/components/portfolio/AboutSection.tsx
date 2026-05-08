'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Briefcase, MapPin, Award, Calendar, ExternalLink } from 'lucide-react';
import { siteConfig, education, experience } from '@/lib/data';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const sectionContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardStagger = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: 0.2 + i * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// ---------------------------------------------------------------------------
// Section heading component
// ---------------------------------------------------------------------------

function SectionHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-14 text-center"
    >
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/70">
        My Journey
      </p>
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
        About <span className="gradient-text">Me</span>
      </h2>
      <div className="heading-gradient-line mx-auto mt-2 w-24 sm:w-32" />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Quick stat badge
// ---------------------------------------------------------------------------

interface QuickStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function QuickStat({ icon, label, value }: QuickStatProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 backdrop-blur-sm">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </span>
        <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
          {value}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// About text column
// ---------------------------------------------------------------------------

function AboutText() {
  return (
    <motion.div
      variants={slideLeft}
      className="flex flex-col gap-6"
    >
      {/* Bio paragraphs */}
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[0.938rem] sm:leading-7">
          I&apos;m <span className="font-semibold text-[var(--text-primary)]">Farhan Akhtar Makandar</span>, a
          Machine Learning Systems Engineer specializing in building intelligent systems that bridge the
          gap between cutting-edge AI research and real-world applications.
        </p>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[0.938rem] sm:leading-7">
          Currently pursuing my B.E. in Artificial Intelligence &amp; Machine Learning at{' '}
          <span className="font-medium text-cyan-400/80">Yenepoya Institute of Technology</span>, I&apos;ve
          worked on research projects at{' '}
          <span className="font-medium text-cyan-400/80">NIT Calicut</span> focusing on transformer
          architectures for time-series prediction.
        </p>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[0.938rem] sm:leading-7">
          My expertise spans deep learning with PyTorch and TensorFlow, agentic AI workflows with RAG
          pipelines, and building production-ready ML systems. I&apos;m passionate about leveraging
          transformer models, LLMs, and retrieval-augmented generation to solve complex engineering
          challenges.
        </p>
      </div>

      {/* Quick stats badges */}
      <div className="flex flex-wrap gap-3 pt-2">
        <QuickStat
          icon={<MapPin className="h-3.5 w-3.5" />}
          label="Location"
          value={siteConfig.location}
        />
        <QuickStat
          icon={<GraduationCap className="h-3.5 w-3.5" />}
          label="Degree"
          value="B.E. AIML"
        />
        <QuickStat
          icon={<Award className="h-3.5 w-3.5" />}
          label="Focus"
          value="ML Systems"
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Education card
// ---------------------------------------------------------------------------

interface EducationCardProps {
  institution: string;
  degree: string;
  period: string;
  details?: string;
  index: number;
}

function EducationCard({ institution, degree, period, details, index }: EducationCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardStagger}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="glass-card group flex gap-4"
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-colors duration-300 group-hover:bg-purple-500/15">
        <GraduationCap className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <h3 className="text-sm font-semibold leading-snug text-[var(--text-primary)]">
          {institution}
        </h3>
        <p className="text-xs font-medium text-cyan-400/70">{degree}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
          <Calendar className="h-3 w-3" />
          <span>{period}</span>
        </div>
        {details && (
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-secondary)]/80 line-clamp-2">
            {details}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Experience card
// ---------------------------------------------------------------------------

function ExperienceCard() {
  const exp = experience[0];
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (!exp) return null;

  return (
    <motion.div
      ref={ref}
      custom={education.length}
      variants={cardStagger}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="glass-card group relative overflow-hidden"
    >
      {/* Subtle gradient accent at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition-colors duration-300 group-hover:bg-cyan-500/15 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <Briefcase className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-sm font-semibold leading-snug text-[var(--text-primary)]">
            {exp.role}
          </h3>
          <p className="text-xs font-medium text-cyan-400/70">{exp.company}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <Calendar className="h-3 w-3" />
            <span>{exp.period}</span>
          </div>
        </div>
      </div>

      {/* Responsibilities */}
      <ul className="flex flex-col gap-2.5 pl-0">
        {exp.responsibilities.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// AboutSection — main exported component
// ---------------------------------------------------------------------------

function AboutSection() {
  return (
    <section id="about" className="relative z-10 section-padding">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-purple-600/[0.05] blur-[120px]" />
        <div className="absolute -right-40 bottom-1/3 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-[120px]" />
      </div>

      <div className="container-custom relative">
        <SectionHeading />

        <motion.div
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14 lg:gap-16"
        >
          {/* ---- Left column: About text ---- */}
          <AboutText />

          {/* ---- Right column: Education & Experience ---- */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            {/* Education cards */}
            <div className="flex flex-col gap-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
                Education
              </h3>
              {education.map((edu, i) => (
                <EducationCard
                  key={edu.institution}
                  institution={edu.institution}
                  degree={edu.degree}
                  period={edu.period}
                  details={edu.details}
                  index={i}
                />
              ))}
            </div>

            {/* Experience card */}
            <div className="flex flex-col gap-4 pt-2">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                Experience
              </h3>
              <ExperienceCard />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
