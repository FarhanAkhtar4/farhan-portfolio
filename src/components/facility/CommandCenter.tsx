'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, GraduationCap, Award, TrendingUp, Bot, Code } from 'lucide-react';
import { siteConfig, education, heroTaglines } from '@/lib/data';

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

const stats = [
  { icon: <TrendingUp className="w-5 h-5" />, label: 'Model Improvement', value: 22, suffix: '%', color: 'text-[var(--accent-emerald)]' },
  { icon: <GraduationCap className="w-5 h-5" />, label: 'Research Internship', value: 1, suffix: '', display: 'NIT Calicut', color: 'text-[var(--accent-cyan)]' },
  { icon: <Bot className="w-5 h-5" />, label: 'AI Projects', value: 13, suffix: '+', color: 'text-[var(--accent-purple)]' },
  { icon: <Award className="w-5 h-5" />, label: 'Certifications', value: 11, suffix: '+', color: 'text-[var(--accent-cyan)]' },
];

const taglines = heroTaglines.map(t => t.replace('I ', ''));

export default function CommandCenter() {
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
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 01 — Command Center</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{siteConfig.firstName}</span>
            <span className="text-[var(--text-primary)]"> {siteConfig.lastName}</span>
          </h2>
          <p className="text-lg sm:text-xl font-mono text-[var(--accent-purple)]">{siteConfig.role}</p>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card mb-10 max-w-3xl"
        >
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
            ML Systems Engineer specializing in <span className="text-[var(--accent-cyan)]">Agentic AI</span>,{' '}
            <span className="text-[var(--accent-purple)]">Deep Learning</span>, and{' '}
            <span className="text-[var(--accent-emerald)]">Transformer-based models</span>. 
            Research intern at <strong className="text-[var(--text-primary)]">NIT Calicut</strong>, 
            working on neural network optimization for engineering problems. 
            Built multi-agent AI platforms, RAG pipelines, and achieved{' '}
            <strong className="text-[var(--accent-emerald)]">22% model improvement</strong> over 
            XGBoost with Temporal Fusion Transformers for seismic response prediction.
          </p>
        </motion.div>

        {/* Tagline Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {taglines.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(139,92,246,0.15)] bg-[rgba(139,92,246,0.03)] text-xs sm:text-sm text-[var(--text-secondary)]"
            >
              <Code className="w-3.5 h-3.5 text-[var(--accent-purple)]" />
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card text-center group"
            >
              <div className={`${stat.color} mb-3 flex justify-center`}>{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">
                {stat.display ? (
                  <span>{stat.display}</span>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-xs font-mono text-[var(--text-secondary)]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[var(--accent-cyan)]" />
            Education
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {education.map((edu, i) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.5 }}
                className="glass-card"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">{edu.degree}</h4>
                  <span className="text-xs font-mono text-[var(--accent-purple)]">{edu.period}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <MapPin className="w-3 h-3" />
                  {edu.institution}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
