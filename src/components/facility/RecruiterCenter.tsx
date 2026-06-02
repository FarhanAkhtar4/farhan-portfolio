'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Download,
  FileText,
  Bot,
  Brain,
  Cpu,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface ResumeInfo {
  filename: string;
  title: string;
  keywords: string[];
  icon: React.ReactNode;
  accent: string;
}

const resumes: ResumeInfo[] = [
  {
    filename: 'Farhan_Akhtar_ML_Engineer.pdf',
    title: 'ML Engineer',
    keywords: ['PyTorch', 'Transformers', 'NIT Calicut', 'XGBoost', 'Time Series'],
    icon: <Brain className="w-5 h-5" />,
    accent: 'var(--accent-emerald)',
  },
  {
    filename: 'Farhan_Akhtar_AI_Engineer.pdf',
    title: 'AI Engineer',
    keywords: ['Agentic AI', 'RAG', 'LLMs', 'LangChain', 'Vector DB'],
    icon: <Bot className="w-5 h-5" />,
    accent: 'var(--accent-purple)',
  },
  {
    filename: 'Farhan_Akhtar_GenAI_Engineer.pdf',
    title: 'GenAI Engineer',
    keywords: ['Prompt Engineering', 'RAG Agents', 'Fine-Tuning', 'Embeddings', 'NVIDIA'],
    icon: <Sparkles className="w-5 h-5" />,
    accent: 'var(--accent-cyan)',
  },
  {
    filename: 'Farhan_Akhtar_Agentic_AI_Engineer.pdf',
    title: 'Agentic AI Engineer',
    keywords: ['Multi-Agent', 'AgentOS', 'RAG Pipeline', 'Orchestration', 'SaaS'],
    icon: <Cpu className="w-5 h-5" />,
    accent: '#f59e0b',
  },
];

const atsKeywords = [
  'PyTorch', 'Transformers', 'RAG', 'LangChain', 'Vector Databases',
  'Fine-Tuning', 'Agentic AI', 'Multi-Agent', 'NIT Calicut', 'Research',
  'Deep Learning', 'Machine Learning', 'Python', 'SQL', 'AWS',
  'Prompt Engineering', 'LLM Integration', 'Embeddings', 'Time Series',
];

export default function RecruiterCenter() {
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
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 09 — Recruiter Resource Center</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[#f59e0b]">Recruiter</span>{' '}
            <span className="text-[var(--text-primary)]">Center</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            ATS-optimized resumes tailored for specific roles
          </p>
        </motion.div>

        {/* Note for recruiters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-card mb-8 border-[rgba(245,158,11,0.15)]"
        >
          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">For Recruiters</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Each resume is optimized for specific ATS systems and role requirements. 
                Download the one that best matches the position you&apos;re hiring for. 
                All resumes include the same core experience and projects, with different keyword emphasis.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Resume Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {resumes.map((resume, i) => (
            <motion.div
              key={resume.filename}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card spotlight-card group"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl border border-[var(--border-glass)] bg-[rgba(15,23,42,0.6)] flex items-center justify-center flex-shrink-0 transition-all group-hover:border-opacity-30"
                  style={{ color: resume.accent }}
                >
                  {resume.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">{resume.title}</h3>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resume.keywords.map(kw => (
                      <span
                        key={kw}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-[var(--border-glass)] text-[var(--text-secondary)]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Download */}
                  <a
                    href={`/resumes/${resume.filename}`}
                    download
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-glass)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[rgba(6,182,212,0.3)] transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ATS Keyword Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#f59e0b]" />
            ATS Keyword Coverage
          </h3>
          <div className="glass-card">
            <div className="flex flex-wrap gap-2">
              {atsKeywords.map((kw, i) => (
                <motion.span
                  key={kw}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.03, duration: 0.3 }}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-[rgba(16,185,129,0.06)] text-[var(--accent-emerald)] border border-[rgba(16,185,129,0.12)]"
                >
                  {kw}
                </motion.span>
              ))}
            </div>
            <p className="text-[10px] font-mono text-[rgba(148,163,184,0.5)] mt-3">
              All resumes cover these core ATS keywords with appropriate emphasis per role
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
