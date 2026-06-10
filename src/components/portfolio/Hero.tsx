'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, ExternalLink } from 'lucide-react';
import { siteConfig, heroTaglines, projects } from '@/lib/data';
import Image from 'next/image';

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % heroTaglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const flagship = projects.filter((p) => p.isFlagship);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 pt-20"
    >
      <div className="mx-auto max-w-6xl w-full grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        {/* Left content — 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          {/* Status badge */}
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

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-white/95">Farhan Akhtar</span>
              <br />
              <span className="gradient-text">Makandar</span>
            </h1>
          </motion.div>

          {/* Role */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/50 font-medium"
          >
            {siteConfig.roleShort}
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-white/40 max-w-lg leading-relaxed"
          >
            <span key={taglineIndex} className="inline-block">
              {heroTaglines[taglineIndex]}
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors"
            >
              View Projects
              <ArrowDown size={14} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white/[0.06] text-white/80 border border-white/[0.08] rounded-lg hover:bg-white/[0.1] hover:border-white/[0.12] transition-all"
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4 pt-2"
          >
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/70 transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/70 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={siteConfig.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/70 transition-colors"
              aria-label="HuggingFace"
            >
              <ExternalLink size={18} />
            </a>
          </motion.div>
        </div>

        {/* Right — Photo + flagship stats — 2 cols */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 flex flex-col items-center gap-6"
        >
          {/* Photo */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-white/[0.08]">
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
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            {[
              { value: `${projects.length}+`, label: 'Projects' },
              { value: '10', label: 'Certifications' },
              { value: '3', label: 'Flagship' },
            ].map((stat, i) => (
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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