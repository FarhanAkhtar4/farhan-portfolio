'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, ExternalLink } from 'lucide-react';
import { siteConfig, heroTaglines, projects } from '@/lib/data';
import Image from 'next/image';

/* ============================================================
   TYPING ANIMATION HOOK
   ============================================================ */
function useTypingEffect(texts: string[], typeSpeed = 40, deleteSpeed = 25, pause = 2500) {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
        if (charIdx + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
        if (charIdx <= 1) {
          setIsDeleting(false);
          setTextIdx((i) => (i + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, textIdx, texts, typeSpeed, deleteSpeed, pause]);

  return display;
}

/* ============================================================
   TECH KEYWORDS FOR MARQUEE
   ============================================================ */
const techKeywords = [
  'PyTorch', 'Transformers', 'Temporal Fusion', 'RAG', 'LangChain',
  'Multi-Agent', 'LLMs', 'Fine-Tuning', 'Vector DB', 'Agentic AI',
  'Deep Learning', 'CNN', 'LSTM', 'GANs', 'XGBoost',
  'Next.js', 'TypeScript', 'AWS', 'Cloudflare', 'Python',
];

export default function Hero() {
  const typed = useTypingEffect(heroTaglines, 35, 20, 3000);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-8">
      <div className="mx-auto max-w-6xl w-full grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        {/* Left — 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 glow-dot" />
            <span className="text-xs font-medium text-emerald-400/80">
              Open to opportunities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08]"
          >
            <span className="text-white/95">Farhan Akhtar</span>
            <br />
            <span className="gradient-text">Makandar</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/50 font-medium"
          >
            {siteConfig.roleShort}
          </motion.p>

          {/* Typing tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-white/40 max-w-lg leading-relaxed h-6"
          >
            {typed}<span className="typing-cursor" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
            >
              View Projects <ArrowDown size={14} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white/[0.06] text-white/80 border border-white/[0.08] rounded-lg hover:bg-white/[0.1] hover:border-white/[0.12] transition-all"
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4 pt-2"
          >
            {[
              { icon: Github, href: siteConfig.github, label: 'GitHub' },
              { icon: Linkedin, href: siteConfig.linkedin, label: 'LinkedIn' },
              { icon: ExternalLink, href: siteConfig.huggingface, label: 'HuggingFace' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/70 transition-colors"
                aria-label={s.label}
              >
                <s.icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right — Photo + Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 flex flex-col items-center gap-6"
        >
          {/* Photo with rotating gradient ring */}
          <div className="photo-ring">
            <div className="photo-ring-inner w-48 h-48 sm:w-56 sm:h-56">
              <Image
                src="/farhan-photo.jpg"
                alt="Farhan Akhtar Makandar"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {[
              { value: `${projects.length}+`, label: 'Projects' },
              { value: '10', label: 'Certifications' },
              { value: '3', label: 'Flagship' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center py-3 px-2 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="text-xl font-bold gradient-text">{stat.value}</div>
                <div className="text-[11px] text-white/35 mt-0.5 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tech Marquee */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="marquee-container py-4">
          <div className="marquee-track">
            {[...techKeywords, ...techKeywords].map((kw, i) => (
              <span key={i} className="marquee-item">
                <span className="dot" />{kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}