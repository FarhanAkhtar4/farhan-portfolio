'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';

interface EntryExperienceProps {
  onEnter: () => void;
}

export default function EntryExperience({ onEnter }: EntryExperienceProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 relative">
      {/* Decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-[rgba(139,92,246,0.06)]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full border border-[rgba(6,182,212,0.06)]"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-[rgba(16,185,129,0.04)]"
        />
      </div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)]"
      >
        <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
        <span className="text-xs font-mono text-[var(--text-secondary)]">FACILITY ONLINE</span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-4"
      >
        <span className="gradient-text">FARHAN AI</span>
        <br />
        <span className="text-[var(--text-primary)]">RESEARCH FACILITY</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-sm sm:text-base font-mono text-[var(--text-secondary)] max-w-lg mb-2"
      >
        ML Systems Engineer · Deep Learning · Agentic AI
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="text-xs font-mono text-[rgba(148,163,184,0.5)] mb-12"
      >
        NIT Calicut · PyTorch · Transformers · RAG · Multi-Agent Systems
      </motion.p>

      {/* Enter Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139, 92, 246, 0.2), 0 0 80px rgba(6, 182, 212, 0.1)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onEnter}
        className="group relative flex items-center gap-3 px-8 py-4 rounded-xl border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.05)] text-[var(--text-primary)] font-medium text-base transition-all overflow-hidden"
      >
        {/* Animated border gradient */}
        <span className="absolute inset-0 rounded-xl gradient-border-animated" />
        <span className="relative flex items-center gap-3">
          <Zap className="w-5 h-5 text-[var(--accent-purple)]" />
          <span>Enter Facility</span>
          <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-1 group-hover:text-[var(--accent-cyan)] transition-all" />
        </span>
      </motion.button>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono text-[rgba(148,163,184,0.4)] uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-[rgba(148,163,184,0.15)] flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-[rgba(139,92,246,0.5)]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
