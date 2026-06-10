'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Wrench, Sparkles, Brain, Cpu, Database, Cloud } from 'lucide-react';
import { skillCategories } from '@/lib/data';

const categoryIcons: Record<string, React.ReactNode> = {
  'Languages': <Cpu className="w-5 h-5" />,
  'ML & Deep Learning': <Brain className="w-5 h-5" />,
  'LLM & Agentic AI': <Sparkles className="w-5 h-5" />,
  'Data Science': <Database className="w-5 h-5" />,
  'Cloud & Tools': <Cloud className="w-5 h-5" />,
};

const categoryAccents: Record<string, string> = {
  'Languages': 'var(--accent-cyan)',
  'ML & Deep Learning': 'var(--accent-emerald)',
  'LLM & Agentic AI': 'var(--accent-purple)',
  'Data Science': 'var(--accent-cyan)',
  'Cloud & Tools': '#f59e0b',
};

export default function AISystemsLab() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

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
          <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 07 — AI Systems Lab</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[var(--accent-cyan)]">Skills &</span>{' '}
            <span className="text-[var(--text-primary)]">Technologies</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Technical stack across {skillCategories.length} categories
          </p>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid sm:grid-cols-2 gap-6">
          {skillCategories.map((category, ci) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + ci * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card relative overflow-hidden group ${
                category.highlight ? 'border-[rgba(139,92,246,0.2)]' : ''
              }`}
            >
              {/* Highlight glow */}
              {category.highlight && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-purple)] to-transparent" />
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg border border-[var(--border-glass)] bg-[rgba(15,23,42,0.6)] flex items-center justify-center transition-all group-hover:border-opacity-30"
                  style={{ color: categoryAccents[category.name] || 'var(--text-secondary)' }}
                >
                  {categoryIcons[category.name] || <Wrench className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{category.name}</h3>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">{category.skills.length} skills</span>
                </div>
                {category.highlight && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(139,92,246,0.08)] text-[var(--accent-purple)] border border-[rgba(139,92,246,0.15)]">
                    CORE
                  </span>
                )}
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + ci * 0.1 + si * 0.03, duration: 0.3 }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all hover:scale-105 cursor-default"
                    style={{
                      backgroundColor: `${categoryAccents[category.name] || 'var(--accent-cyan)'}08`,
                      borderColor: `${categoryAccents[category.name] || 'var(--accent-cyan)'}15`,
                      color: categoryAccents[category.name] || 'var(--accent-cyan)',
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
