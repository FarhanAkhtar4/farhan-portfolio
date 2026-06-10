'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { navLinks, siteConfig } from '@/lib/data';
import { resumeDownloads } from '@/lib/resume-data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[hsl(0,0%,2%)]/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="font-mono text-sm font-semibold tracking-tight text-white/90 hover:text-emerald-400 transition-colors"
          >
            {siteConfig.firstName}
            <span className="text-emerald-500">.</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="animated-underline px-3 py-2 text-[13px] text-white/50 hover:text-white/90 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href={resumeDownloads[0].href}
              className="ml-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all"
            >
              <Download size={13} />
              Resume
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[hsl(0,0%,2%)]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="text-xl font-medium text-white/70 hover:text-emerald-400 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={resumeDownloads[0].href}
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg"
              >
                <Download size={14} />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}