'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  X,
  AlertTriangle,
  Bot,
  BrainCircuit,
  Network,
  Sparkles,
  Workflow,
} from 'lucide-react';

/* ───────────── Resume Roles ───────────── */
interface ResumeRole {
  title: string;
  icon: React.ReactNode;
  description: string;
  coverage: number;
}

const resumeRoles: ResumeRole[] = [
  {
    title: 'AI Engineer',
    icon: <Bot className="w-5 h-5" />,
    description:
      'Focused on building production AI systems, model integration, and inference pipelines. Expertise in LLM deployment and evaluation frameworks.',
    coverage: 82,
  },
  {
    title: 'ML Engineer',
    icon: <BrainCircuit className="w-5 h-5" />,
    description:
      'Specializing in machine learning pipeline development, feature engineering, and model optimization for scalable production environments.',
    coverage: 75,
  },
  {
    title: 'DL Engineer',
    icon: <Network className="w-5 h-5" />,
    description:
      'Deep learning architecture design, custom model development, and neural network optimization using PyTorch and TensorFlow.',
    coverage: 70,
  },
  {
    title: 'GenAI Engineer',
    icon: <Sparkles className="w-5 h-5" />,
    description:
      'Generative AI systems development including fine-tuning, prompt engineering, and deployment of large language models.',
    coverage: 78,
  },
  {
    title: 'Agentic/RAG Engineer',
    icon: <Workflow className="w-5 h-5" />,
    description:
      'Building autonomous AI agents, retrieval-augmented generation systems, and multi-agent orchestration frameworks.',
    coverage: 85,
  },
];

/* ───────────── ATS Keyword Matrix ───────────── */
const keywords = ['Python', 'PyTorch', 'TensorFlow', 'LLM', 'RAG', 'Docker', 'Git', 'FastAPI', 'SQL', 'Pandas'];

// Hardcoded deterministic boolean matrix — NO Math.random()
// Rows = keywords, Columns = [AI Engineer, ML Engineer, DL Engineer, GenAI, Agentic]
const atsMatrix: boolean[][] = [
  [true, true, true, true, true],   // Python
  [true, false, true, true, true],   // PyTorch
  [true, false, true, false, false], // TensorFlow
  [true, true, false, true, true],   // LLM
  [false, false, false, true, true],// RAG
  [true, true, false, true, true],  // Docker
  [true, true, true, true, true],   // Git
  [true, true, false, true, true],   // FastAPI
  [true, true, false, false, false],// SQL
  [true, true, true, false, true],  // Pandas
];

const roleHeaders = ['AI Engineer', 'ML Engineer', 'DL Engineer', 'GenAI', 'Agentic'];

/* ───────────── Doughnut SVG Component ───────────── */
function DoughnutChart({ percentage, label }: { percentage: number; label: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="rgba(0, 240, 255, 0.08)"
            strokeWidth="6"
          />
          {/* Foreground arc */}
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="rgba(0, 240, 255, 0.6)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.4))' }}
          />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-mono font-bold text-cyan-300">
            {percentage}%
          </span>
        </div>
      </div>
      <span className="text-[11px] font-mono text-gray-400 tracking-wider text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

/* ───────────── Resume Preview Modal ───────────── */
function ResumePreviewModal({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: ResumeRole;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg border border-cyan-500/25 p-6 sm:p-8"
            style={{ background: 'rgba(3, 15, 25, 0.95)' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-mono text-cyan-300 tracking-wide">
                    {role.title}
                  </h3>
                  <span className="text-xs font-mono text-gray-500 tracking-wider">
                    RESUME PREVIEW — DEMO
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-md border border-cyan-500/20 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dummy Resume Content */}
            <div className="space-y-5 text-sm font-mono">
              <div>
                <h4 className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-2">
                  Professional Summary
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                  dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-2">
                  Experience
                </h4>
                <div className="space-y-3 text-gray-400">
                  <div className="pl-3 border-l-2 border-cyan-500/20">
                    <p className="text-cyan-300/80 text-xs">[PLACEHOLDER COMPANY] — [PLACEHOLDER ROLE]</p>
                    <p className="text-gray-500 text-xs">[PLACEHOLDER DATE RANGE]</p>
                    <p className="mt-1 text-gray-400 text-xs leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Developed scalable
                      machine learning pipelines for [PLACEHOLDER].
                    </p>
                  </div>
                  <div className="pl-3 border-l-2 border-cyan-500/20">
                    <p className="text-cyan-300/80 text-xs">[PLACEHOLDER COMPANY] — [PLACEHOLDER ROLE]</p>
                    <p className="text-gray-500 text-xs">[PLACEHOLDER DATE RANGE]</p>
                    <p className="mt-1 text-gray-400 text-xs leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Led research initiatives
                      in [PLACEHOLDER] resulting in [PLACEHOLDER].
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-2">
                  Education
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  [PLACEHOLDER UNIVERSITY] — [PLACEHOLDER DEGREE] — [PLACEHOLDER YEAR]
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-2">
                  Skills
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  [PLACEHOLDER SKILLS LIST — populated from actual resume data]
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t border-red-500/15 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-400/80 font-mono leading-relaxed">
                This is a DEMO preview. Actual resume content will replace this placeholder text.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────── Main Component ───────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function RecruiterHubSection() {
  const [previewRole, setPreviewRole] = useState<ResumeRole | null>(null);

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8" id="recruiter">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono tracking-[0.3em] text-cyan-400/70 uppercase">
            Case File #009-RECRUITER
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-cyan-300 font-mono">
          REQUEST PERSONNEL DOSSIER
        </h2>
        <div className="mt-4 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </motion.div>

      {/* ── Resume Cards ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-16"
      >
        {resumeRoles.map((role, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              borderColor: 'rgba(0, 240, 255, 0.35)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.08)',
            }}
            className="relative rounded-lg border border-cyan-500/15 p-5 flex flex-col gap-3"
            style={{ background: 'rgba(3, 15, 25, 0.75)' }}
          >
            {/* Role Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                {role.icon}
              </div>
              <h3 className="text-sm font-bold font-mono text-cyan-200 tracking-wide">
                {role.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-xs font-mono text-gray-400 leading-relaxed flex-1">
              {role.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-1">
              <a
                href="#placeholder"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-cyan-400/10 border border-cyan-400/25 text-xs font-mono text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/40 transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
              <button
                onClick={() => setPreviewRole(role)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-cyan-500/[0.04] border border-cyan-500/15 text-xs font-mono text-cyan-300/80 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all duration-200"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Keyword Coverage Doughnut Charts ── */}
      <div className="max-w-6xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold font-mono text-cyan-300 tracking-wider mb-2">
            KEYWORD COVERAGE
          </h3>
          <p className="text-xs font-mono text-gray-500 mb-8">
            Demo keyword coverage analysis based on fixed keyword list: Python, PyTorch, TensorFlow, LLM, RAG, Docker, Git, FastAPI, SQL, Pandas
          </p>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-10">
            {resumeRoles.map((role, index) => (
              <DoughnutChart key={index} percentage={role.coverage} label={role.title} />
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <p className="text-xs text-orange-400/80 font-mono tracking-wide">
            Illustrative analysis — not based on actual resume data
          </p>
        </div>
      </div>

      {/* ── ATS Matrix Table ── */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold font-mono text-cyan-300 tracking-wider mb-2">
            ATS KEYWORD MATRIX
          </h3>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            <p className="text-xs text-orange-400/80 font-mono tracking-wide">
              DEMO — Not based on actual resume data
            </p>
          </div>

          <div className="rounded-lg border border-cyan-500/15 overflow-hidden" style={{ background: 'rgba(3, 15, 25, 0.8)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-cyan-500/20">
                    <th className="text-left px-4 py-3 text-xs font-bold text-cyan-400/80 tracking-wider uppercase">
                      Keyword
                    </th>
                    {roleHeaders.map((header, i) => (
                      <th
                        key={i}
                        className="text-center px-3 py-3 text-[11px] font-bold text-cyan-400/80 tracking-wider uppercase whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((keyword, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="border-b border-cyan-500/10 last:border-b-0 hover:bg-cyan-400/[0.02] transition-colors"
                    >
                      <td className="px-4 py-2.5 text-xs text-cyan-300/90 font-medium">
                        {keyword}
                      </td>
                      {atsMatrix[rowIdx].map((hasKeyword, colIdx) => (
                        <td key={colIdx} className="text-center px-3 py-2.5">
                          {hasKeyword ? (
                            <span className="text-cyan-400 text-sm">✓</span>
                          ) : (
                            <span className="text-red-400/50 text-sm">✗</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        isOpen={previewRole !== null}
        onClose={() => setPreviewRole(null)}
        role={previewRole || resumeRoles[0]}
      />
    </section>
  );
}
