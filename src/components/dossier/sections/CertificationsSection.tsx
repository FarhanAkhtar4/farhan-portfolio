'use client';

import { motion } from 'framer-motion';
import { Award, Shield, ShieldCheck } from 'lucide-react';

interface Certification {
  title: string;
  issuer: string;
  icon: React.ReactNode;
}

const certifications: Certification[] = [
  {
    title: '[PLACEHOLDER — e.g., AWS ML Specialty]',
    issuer: '[PLACEHOLDER ISSUER]',
    icon: <Award className="w-7 h-7" />,
  },
  {
    title: '[PLACEHOLDER — e.g., GCP Professional ML]',
    issuer: '[PLACEHOLDER ISSUER]',
    icon: <Shield className="w-7 h-7" />,
  },
  {
    title: '[PLACEHOLDER — e.g., TensorFlow Developer]',
    issuer: '[PLACEHOLDER ISSUER]',
    icon: <ShieldCheck className="w-7 h-7" />,
  },
  {
    title: '[PLACEHOLDER — e.g., Deep Learning Specialization]',
    issuer: '[PLACEHOLDER ISSUER]',
    icon: <Award className="w-7 h-7" />,
  },
  {
    title: '[PLACEHOLDER — e.g., Azure AI Engineer]',
    issuer: '[PLACEHOLDER ISSUER]',
    icon: <Shield className="w-7 h-7" />,
  },
  {
    title: '[PLACEHOLDER — e.g., MLOps Engineering]',
    issuer: '[PLACEHOLDER ISSUER]',
    icon: <ShieldCheck className="w-7 h-7" />,
  },
  {
    title: '[PLACEHOLDER — e.g., NLP Specialization]',
    issuer: '[PLACEHOLDER ISSUER]',
    icon: <Award className="w-7 h-7" />,
  },
  {
    title: '[PLACEHOLDER — e.g., GenAI Architect]',
    issuer: '[PLACEHOLDER ISSUER]',
    icon: <ShieldCheck className="w-7 h-7" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function CertificationsSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8" id="certifications">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono tracking-[0.3em] text-cyan-400/70 uppercase">
            Case File #008-CERTS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-cyan-300 font-mono">
          SECURITY CLEARANCES & CERTIFICATIONS
        </h2>
        <div className="mt-4 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </motion.div>

      {/* Certifications Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              scale: 1.04,
              borderColor: 'rgba(0, 240, 255, 0.4)',
              boxShadow: '0 0 24px rgba(0, 240, 255, 0.12), 0 0 48px rgba(0, 240, 255, 0.04)',
            }}
            className="relative group flex flex-col items-center justify-center text-center p-6 rounded-lg border border-cyan-500/15 bg-cyan-500/[0.03] min-h-[200px] sm:min-h-[220px]"
            style={{ background: 'rgba(3, 15, 25, 0.75)' }}
          >
            {/* Redacted Stamp Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-red-500/25 text-2xl font-bold tracking-[0.5em] -rotate-12 border-2 border-red-500/10 px-6 py-1 rounded-sm uppercase select-none">
                Redacted
              </span>
            </div>

            {/* Icon */}
            <div className="mb-4 w-14 h-14 rounded-lg bg-cyan-400/[0.08] border border-cyan-400/20 flex items-center justify-center text-cyan-400/80 group-hover:text-cyan-400 group-hover:border-cyan-400/40 transition-all duration-300">
              {cert.icon}
            </div>

            {/* Cert Title */}
            <h3 className="text-sm font-bold font-mono text-cyan-200/90 tracking-wide leading-snug mb-2">
              {cert.title}
            </h3>

            {/* Issuer */}
            <p className="text-xs font-mono text-gray-500 tracking-wider uppercase">
              {cert.issuer}
            </p>

            {/* Subtle Bottom Glow Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
