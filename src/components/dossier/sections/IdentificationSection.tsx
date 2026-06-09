'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  GraduationCap,
  Rocket,
  Award,
  Shield,
  Fingerprint,
  Scan,
} from 'lucide-react';

/* ─── Typewriter hook ─── */
function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

/* ─── Stat Card ─── */
const stats = [
  {
    icon: TrendingUp,
    label: '22% Model Improvement',
    sub: 'Over XGBoost Baseline',
    color: 'text-cyan-400',
  },
  {
    icon: GraduationCap,
    label: 'NIT Calicut',
    sub: 'Research Internship',
    color: 'text-purple-400',
  },
  {
    icon: Rocket,
    label: 'Production Projects',
    sub: 'Multiple AI Systems',
    color: 'text-emerald-400',
  },
  {
    icon: Award,
    label: 'Certifications',
    sub: 'Industry Verified',
    color: 'text-amber-400',
  },
];

export default function IdentificationSection() {
  const summary =
    'Subject identified as a highly capable AI Systems Engineer with demonstrated expertise in deep learning architectures, temporal fusion transformers, and multi-agent orchestration systems. Multiple confirmed deployments to production environments with measurable performance gains. Active research contributor with publications in structural engineering ML applications.';

  const { displayed, done } = useTypewriter(summary, 18);

  return (
    <section className="relative w-full py-16 px-4 md:px-8 lg:px-16" id="identification">
      {/* ── Case File Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="text-xs tracking-[0.3em] text-slate-500 uppercase font-mono">
            Case File #001
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-wider text-cyan-400 uppercase">
          Identification
        </h2>
        <div className="h-px bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent mt-3" />
      </motion.div>

      {/* ── TOP SECRET Stamp ── */}
      <motion.div
        initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
        animate={{ opacity: 1, rotate: -6, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-24 right-6 md:right-16 z-10 pointer-events-none select-none"
      >
        <div className="dossier-stamp border-2 border-red-500/80 rounded-sm px-4 py-2 transform -rotate-6 bg-red-500/10 backdrop-blur-sm">
          <span className="dossier-stamp-text text-red-500 font-mono font-black text-sm md:text-base tracking-[0.2em] uppercase">
            Top Secret // NOFORN
          </span>
        </div>
      </motion.div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* ── Left: Photo + Identity ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="lg:col-span-4 space-y-6"
        >
          {/* Agent Photo */}
          <div className="dossier-card p-6 flex flex-col items-center gap-4">
            <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/10">
              <Image
                src="/farhan-photo.jpg"
                alt="Agent Photograph"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {/* Fallback gray box — always present, visible if image fails */}
              <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                  Photo Classified
                </span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl md:text-2xl font-mono font-bold tracking-wider text-white uppercase leading-tight">
                Farhan Akhtar
                <br />
                Makandar
              </h3>
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              <p className="text-xs font-mono tracking-[0.15em] text-purple-400 uppercase">
                AI Systems Engineer /
                <br />
                Deep Learning Specialist
              </p>
            </div>
          </div>

          {/* Clearance Level */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="dossier-card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Scan className="w-4 h-4 text-red-400" />
              <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
                Clearance Level
              </span>
            </div>
            <div className="relative inline-block">
              <span className="text-sm font-mono text-red-400 tracking-wider">
                [REDACTED]
              </span>
              <div className="absolute inset-0 bg-slate-900/90 -translate-y-[2px]" />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: Summary + Stats ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="lg:col-span-8 space-y-6"
        >
          {/* Summary */}
          <div className="dossier-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-mono">
                Subject Summary
              </span>
            </div>
            <p className="text-sm font-mono text-slate-300 leading-relaxed">
              {displayed}
              <span
                className={`inline-block w-2 h-4 ml-1 bg-cyan-400 align-middle ${
                  done ? 'animate-pulse' : ''
                }`}
              />
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.12, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="dossier-glass-card p-5 flex flex-col items-center text-center gap-3 cursor-default group"
              >
                <div className="w-10 h-10 rounded-md bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center group-hover:border-cyan-400/40 group-hover:shadow-md group-hover:shadow-cyan-400/10 transition-all">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-sm font-mono font-semibold text-white tracking-wide">
                  {stat.label}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                  {stat.sub}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
