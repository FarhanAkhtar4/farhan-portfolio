'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { siteConfig, navLinks } from '@/lib/data';
import { easeSmooth } from '@/lib/animations';
import type { Variants } from 'framer-motion';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeSmooth },
  },
};

// ---------------------------------------------------------------------------
// Social link button
// ---------------------------------------------------------------------------

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[var(--text-secondary)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    >
      {icon}
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// Footer — main exported component
// ---------------------------------------------------------------------------

function Footer() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <footer className="relative z-10 border-t border-white/[0.04]">
      {/* Top gradient border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.3) 25%, rgba(139,92,246,0.25) 50%, rgba(6,182,212,0.2) 75%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-10 py-12 sm:py-14 md:grid-cols-3 md:gap-8"
        >
          {/* ---- Column 1: Brand ---- */}
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-extrabold tracking-tight gradient-text sm:text-3xl">
              FARHAN
            </h3>
            <p className="text-sm font-medium text-cyan-400/70">
              {siteConfig.role}
            </p>
            <p className="max-w-xs text-xs leading-relaxed text-[var(--text-secondary)]">
              Building intelligent ML systems with deep learning, transformers, and agentic AI.
            </p>
          </div>

          {/* ---- Column 2: Quick Links ---- */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Quick Links
            </h4>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="inline-block text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-cyan-400 hover:translate-x-1"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ---- Column 3: Connect ---- */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <SocialLink
                href={siteConfig.github}
                icon={<Github className="h-4 w-4" />}
                label="GitHub"
              />
              <SocialLink
                href={siteConfig.linkedin}
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
              />
              <SocialLink
                href={`mailto:${siteConfig.email}`}
                icon={<Mail className="h-4 w-4" />}
                label="Email"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {siteConfig.email}
            </p>
          </div>
        </motion.div>

        {/* ---- Bottom bar ---- */}
        <div className="section-divider" />
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          {/* Left: Copyright */}
          <p className="text-center text-xs text-[var(--text-secondary)] sm:text-left">
            &copy; 2025 Farhan Akhtar Makandar. Built with Next.js &amp; Three.js
          </p>

          {/* Right: Made with + Back to top */}
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              Made with
              <Heart className="h-3 w-3 text-red-400" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[var(--text-secondary)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 hover:shadow-[0_0_16px_rgba(6,182,212,0.12)]"
            >
              <motion.div
                whileHover={{ scale: 1.15, y: -1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
