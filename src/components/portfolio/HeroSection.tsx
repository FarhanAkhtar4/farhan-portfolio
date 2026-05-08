'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { siteConfig, heroTaglines } from '@/lib/data';

// ---------------------------------------------------------------------------
// Typewriter hook — cycles through taglines character by character
// ---------------------------------------------------------------------------

function useTypewriter(taglines: string[], charDelay = 50, pauseDuration = 2200) {
  const [displayedText, setDisplayedText] = useState('');
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing');

  useEffect(() => {
    const currentTagline = taglines[taglineIndex];
    let timeoutId: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (displayedText.length < currentTagline.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentTagline.slice(0, displayedText.length + 1));
        }, charDelay);
      } else {
        timeoutId = setTimeout(() => setPhase('pausing'), pauseDuration);
      }
    } else if (phase === 'pausing') {
      timeoutId = setTimeout(() => setPhase('erasing'), 800);
    } else if (phase === 'erasing') {
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, charDelay * 0.5);
      } else {
        // Wrap in setTimeout to avoid synchronous setState in effect
        timeoutId = setTimeout(() => {
          setTaglineIndex((prev) => (prev + 1) % taglines.length);
          setPhase('typing');
        }, 0);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, taglineIndex, phase, taglines, charDelay, pauseDuration]);

  return displayedText;
}

// ---------------------------------------------------------------------------
// Animated counter hook — counts from 0 to target using requestAnimationFrame
// ---------------------------------------------------------------------------

function useCounter(target: number, duration = 2000, startOnView = false) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);
  const rafId = useRef<number>(0);

  const startCounting = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(step);
      }
    };

    rafId.current = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return { count, startCounting };
}

// ---------------------------------------------------------------------------
// StatCard — single animated stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function StatCard({ value, suffix, label, delay }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { count, startCounting } = useCounter(value, 1800);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(startCounting, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, startCounting, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card flex flex-col items-center justify-center p-5 text-center"
    >
      <span className="gradient-text text-3xl font-bold tracking-tight md:text-4xl">
        {count}
        {suffix}
      </span>
      <span className="mt-1.5 text-xs font-medium tracking-wide uppercase text-[var(--text-secondary)]">
        {label}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Stats grid — right-side visible on md+ screens
// ---------------------------------------------------------------------------

const stats: { value: number; suffix: string; label: string }[] = [
  { value: 5, suffix: '+', label: 'Projects' },
  { value: 11, suffix: '', label: 'Certifications' },
  { value: 1, suffix: '+', label: 'Year Experience' },
  { value: 5, suffix: '+', label: 'Skills Categories' },
];

function StatsGrid() {
  return (
    <div className="hidden grid-cols-2 gap-4 md:grid">
      {stats.map((stat, i) => (
        <StatCard
          key={stat.label}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          delay={600 + i * 150}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Social icon button
// ---------------------------------------------------------------------------

interface SocialLinkProps {
  href: string;
  'aria-label': string;
  children: React.ReactNode;
}

function SocialLink({ href, 'aria-label': ariaLabel, children }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[var(--text-secondary)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// HeroSection — main exported component
// ---------------------------------------------------------------------------

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function HeroSection() {
  const typedText = useTypewriter(heroTaglines);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16 sm:px-6 md:pt-0"
    >
      {/* Ambient gradient orbs behind content */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-purple-600/[0.07] blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.04] blur-[100px]" />
      </div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 md:flex-row md:items-center md:gap-16 lg:gap-20"
      >
        {/* ---- Left side: main content ---- */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          {/* Greeting */}
          <motion.p
            variants={fadeUp}
            className="mb-3 text-sm font-medium tracking-wider text-[var(--text-secondary)] sm:text-base"
          >
            Hello, I&apos;m
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={fadeUp}
            className="gradient-text mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-7xl"
          >
            {siteConfig.name.split(' ')[0]}
            <br />
            <span className="text-[var(--text-primary)]">
              {siteConfig.name.split(' ').slice(1).join(' ')}
            </span>
          </motion.h1>

          {/* Role — typewriter */}
          <motion.div variants={fadeUp} className="mb-5 flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
            <p className="text-lg font-medium text-[var(--text-secondary)] sm:text-xl md:text-2xl">
              {siteConfig.role}
            </p>
          </motion.div>

          {/* Typewriter tagline */}
          <motion.p
            variants={fadeUp}
            className="mb-3 min-h-[1.75rem] font-mono text-sm leading-relaxed text-cyan-300/70 sm:text-base md:min-h-[1.875rem]"
          >
            {typedText}
            <span
              className={`ml-0.5 inline-block w-[2px] translate-y-[1px] bg-cyan-400 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
              style={{ height: '1em' }}
            />
          </motion.p>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mb-6 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base"
          >
            Specializing in deep learning systems, transformer architectures,
            <br className="hidden sm:inline" /> and agentic AI workflows for real-world engineering problems.
          </motion.p>

          {/* Social links */}
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
            <SocialLink href={siteConfig.github} aria-label="GitHub">
              <Github className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={siteConfig.linkedin} aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={`mailto:${siteConfig.email}`} aria-label="Email">
              <Mail className="h-4 w-4" />
            </SocialLink>
          </motion.div>

          {/* Location */}
          <motion.div
            variants={fadeUp}
            className="mb-8 flex items-center gap-1.5 text-xs text-[var(--text-secondary)] sm:text-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-cyan-400/60" />
            <span>{siteConfig.location}</span>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-4"
          >
            {/* Primary — View Projects */}
            <button
              onClick={() => scrollTo('projects')}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-cyan-500/30 active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
            >
              <span className="relative z-10">View Projects</span>
              <svg
                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {/* Shine overlay on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>

            {/* Secondary — Contact Me */}
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.04] hover:border-cyan-500/30 hover:bg-cyan-500/10 active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Me</span>
            </button>
          </motion.div>
        </div>

        {/* ---- Right side: stats grid (md+) ---- */}
        <StatsGrid />
      </motion.div>

      {/* ---- Scroll indicator ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          Scroll
        </span>
        <ArrowDown className="h-4 w-4 text-[var(--text-secondary)] scroll-indicator" />
      </motion.div>
    </section>
  );
}

export default HeroSection;
