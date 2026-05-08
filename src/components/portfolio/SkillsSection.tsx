'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Database, Cloud, Cpu, Sparkles } from 'lucide-react';
import { skillCategories } from '@/lib/data';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardStagger = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// ---------------------------------------------------------------------------
// Category icon map
// ---------------------------------------------------------------------------

const categoryIconMap: Record<string, React.ReactNode> = {
  Languages: <Code className="h-5 w-5" />,
  'ML & Deep Learning': <Cpu className="h-5 w-5" />,
  'LLM & Agentic AI': <Sparkles className="h-6 w-6" />,
  'Data Science': <Brain className="h-5 w-5" />,
  'Cloud & Tools': <Cloud className="h-5 w-5" />,
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
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-14 text-center"
    >
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/70">
        What I Work With
      </p>
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
        Skills &amp; <span className="gradient-text">Expertise</span>
      </h2>
      <div className="heading-gradient-line mx-auto mt-2 w-24 sm:w-32" />
      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        My Technical Stack
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Hero card — LLM & Agentic AI (highlighted category)
// ---------------------------------------------------------------------------

function HeroCard({ category }: { category: typeof skillCategories[number] }) {
  return (
    <motion.div
      custom={0}
      variants={cardStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl border border-white/[0.08]"
    >
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(168,85,247,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(6,182,212,0.20) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 50% 20%, rgba(139,92,246,0.15) 0%, transparent 60%)',
          animation: 'gradient-shift 8s ease infinite',
          backgroundSize: '200% 200%',
        }}
      />
      {/* Blur overlay for depth */}
      <div
        className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-[80px]"
        aria-hidden="true"
      />

      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        {/* Icon + category name */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 shadow-[0_0_24px_rgba(168,85,247,0.15)]">
            <span className="text-purple-300">
              {categoryIconMap[category.name]}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
              {category.name}
            </h3>
            <p className="mt-0.5 text-xs text-purple-300/70 font-medium uppercase tracking-wider">
              Core Specialization
            </p>
          </div>
        </div>

        {/* Skills as floating pills with glow */}
        <div className="flex flex-wrap gap-2.5">
          {category.skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: 0.3 + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.08 }}
              className="inline-flex items-center rounded-full border border-purple-500/20 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.08)] backdrop-blur-sm transition-colors hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-100"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Standard card — non-highlighted categories
// ---------------------------------------------------------------------------

interface StandardCardProps {
  category: typeof skillCategories[number];
  index: number;
}

function StandardCard({ category, index }: StandardCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="glass-card group flex flex-col"
    >
      {/* Icon + category name */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/[0.06]">
          <span className="text-cyan-400">
            {categoryIconMap[category.name]}
          </span>
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-cyan-300">
          {category.name}
        </h3>
      </div>

      {/* Skills as pills */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.35,
              delay: 0.2 + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ scale: 1.08 }}
            className="inline-flex items-center rounded-md bg-gradient-to-br from-purple-500/10 to-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300/80 border border-white/[0.04] transition-colors hover:bg-cyan-500/10 hover:text-cyan-200"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// SkillsSection — main exported component
// ---------------------------------------------------------------------------

function SkillsSection() {
  const highlighted = skillCategories.find((c) => c.highlight);
  const standard = skillCategories.filter((c) => !c.highlight);

  // Compute index offset for stagger animation
  const standardOffset = highlighted ? 1 : 0;

  return (
    <section id="skills" className="relative z-10 section-padding">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-purple-600/[0.05] blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-[120px]" />
      </div>

      <div className="container-custom relative">
        <SectionHeading />

        {/* Bento grid: 1 col mobile, 2 cols md+, hero spans 2 cols */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Hero card for highlighted category */}
          {highlighted && <HeroCard category={highlighted} />}

          {/* Standard cards */}
          {standard.map((category, i) => (
            <StandardCard
              key={category.name}
              category={category}
              index={standardOffset + i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
