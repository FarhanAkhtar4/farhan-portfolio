'use client';

import { motion } from 'framer-motion';
import { Bot, GitBranch, Users, ExternalLink, Lock } from 'lucide-react';

/* ─── Project Data ─── */
const projects = [
  {
    codename: 'AgentOS',
    description:
      '[PLACEHOLDER] — Multi-agent orchestration framework enabling autonomous task decomposition and execution. Coordinates specialized AI agents through a central planning module with dynamic resource allocation.',
    tags: ['Multi-Agent', 'Orchestration', 'Python'],
    /* SVG diagram: 1 planner → 3 workers */
    svg: (
      <svg viewBox="0 0 200 120" className="w-full h-auto">
        {/* Planner */}
        <circle cx="100" cy="25" r="18" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <text x="100" y="29" textAnchor="middle" fontSize="8" fill="#00f0ff" fontFamily="monospace">PLANNER</text>
        {/* Arrows */}
        <line x1="75" y1="38" x2="40" y2="68" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="100" y1="43" x2="100" y2="68" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="125" y1="38" x2="160" y2="68" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3,2" />
        {/* Workers */}
        <circle cx="40" cy="85" r="16" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <text x="40" y="88" textAnchor="middle" fontSize="7" fill="#a855f7" fontFamily="monospace">WORKER</text>
        <circle cx="100" cy="85" r="16" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <text x="100" y="88" textAnchor="middle" fontSize="7" fill="#a855f7" fontFamily="monospace">WORKER</text>
        <circle cx="160" cy="85" r="16" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <text x="160" y="88" textAnchor="middle" fontSize="7" fill="#a855f7" fontFamily="monospace">WORKER</text>
      </svg>
    ),
  },
  {
    codename: 'RAG Pipeline',
    description:
      '[PLACEHOLDER] — Retrieval-Augmented Generation pipeline with vector database integration. Enables context-aware responses through semantic search over large document corpora with chunking and reranking strategies.',
    tags: ['RAG', 'Vector DB', 'LLM'],
    /* SVG diagram: query → retriever → generator → response */
    svg: (
      <svg viewBox="0 0 220 100" className="w-full h-auto">
        <rect x="5" y="30" width="40" height="30" rx="4" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <text x="25" y="49" textAnchor="middle" fontSize="7" fill="#00f0ff" fontFamily="monospace">QUERY</text>
        <line x1="45" y1="45" x2="65" y2="45" stroke="#00f0ff" strokeWidth="1" markerEnd="url(#arrow)" />
        <rect x="65" y="30" width="50" height="30" rx="4" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <text x="90" y="42" textAnchor="middle" fontSize="6" fill="#a855f7" fontFamily="monospace">RETRIEVER</text>
        <text x="90" y="52" textAnchor="middle" fontSize="5" fill="#4a6b7c" fontFamily="monospace">Vector DB</text>
        <line x1="115" y1="45" x2="135" y2="45" stroke="#a855f7" strokeWidth="1" markerEnd="url(#arrow)" />
        <rect x="135" y="30" width="50" height="30" rx="4" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <text x="160" y="42" textAnchor="middle" fontSize="6" fill="#00f0ff" fontFamily="monospace">GENERATOR</text>
        <text x="160" y="52" textAnchor="middle" fontSize="5" fill="#4a6b7c" fontFamily="monospace">LLM</text>
        <line x1="185" y1="45" x2="200" y2="45" stroke="#00f0ff" strokeWidth="1" markerEnd="url(#arrow)" />
        {/* Arrow marker */}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#00f0ff" />
          </marker>
        </defs>
        {/* DB icon */}
        <ellipse cx="90" cy="80" rx="18" ry="8" fill="none" stroke="#4a6b7c" strokeWidth="1" />
        <line x1="72" y1="80" x2="72" y2="88" stroke="#4a6b7c" strokeWidth="1" />
        <line x1="108" y1="80" x2="108" y2="88" stroke="#4a6b7c" strokeWidth="1" />
        <ellipse cx="90" cy="88" rx="18" ry="8" fill="none" stroke="#4a6b7c" strokeWidth="1" />
        <line x1="90" y1="60" x2="90" y2="72" stroke="#4a6b7c" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    ),
  },
  {
    codename: 'TalentScout AI',
    description:
      '[PLACEHOLDER] — AI-powered talent acquisition system with automated resume screening, skill matching, and candidate ranking. Integrates NLP models for semantic skill extraction from diverse resume formats.',
    tags: ['NLP', 'Screening', 'Automation'],
    /* SVG diagram: resumes → parser → matcher → ranked list */
    svg: (
      <svg viewBox="0 0 220 100" className="w-full h-auto">
        {/* Input resumes */}
        <rect x="5" y="25" width="35" height="24" rx="3" fill="none" stroke="#4a6b7c" strokeWidth="1" />
        <rect x="5" y="55" width="35" height="24" rx="3" fill="none" stroke="#4a6b7c" strokeWidth="1" />
        <text x="22" y="40" textAnchor="middle" fontSize="6" fill="#4a6b7c" fontFamily="monospace">RES</text>
        <text x="22" y="70" textAnchor="middle" fontSize="6" fill="#4a6b7c" fontFamily="monospace">RES</text>
        {/* Arrows to parser */}
        <line x1="40" y1="37" x2="60" y2="50" stroke="#4a6b7c" strokeWidth="1" />
        <line x1="40" y1="67" x2="60" y2="50" stroke="#4a6b7c" strokeWidth="1" />
        {/* Parser */}
        <rect x="60" y="35" width="45" height="30" rx="4" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <text x="82" y="53" textAnchor="middle" fontSize="7" fill="#00f0ff" fontFamily="monospace">PARSER</text>
        {/* Arrow */}
        <line x1="105" y1="50" x2="125" y2="50" stroke="#00f0ff" strokeWidth="1" markerEnd="url(#arrow2)" />
        {/* Matcher */}
        <rect x="125" y="35" width="50" height="30" rx="4" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <text x="150" y="53" textAnchor="middle" fontSize="7" fill="#a855f7" fontFamily="monospace">MATCHER</text>
        {/* Arrow */}
        <line x1="175" y1="50" x2="190" y2="50" stroke="#a855f7" strokeWidth="1" markerEnd="url(#arrow2)" />
        {/* Output */}
        <rect x="190" y="35" width="25" height="30" rx="4" fill="none" stroke="#10b981" strokeWidth="1.5" />
        <text x="202" y="50" textAnchor="middle" fontSize="5" fill="#10b981" fontFamily="monospace">RANK</text>
        <text x="202" y="58" textAnchor="middle" fontSize="5" fill="#10b981" fontFamily="monospace">LIST</text>
        <defs>
          <marker id="arrow2" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#00f0ff" />
          </marker>
        </defs>
      </svg>
    ),
  },
];

export default function AgenticSection() {
  return (
    <section className="relative w-full py-16 px-4 md:px-8 lg:px-16" id="agentic">
      {/* ── Section Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-16" />

      {/* ── Case File Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <span className="text-xs tracking-[0.3em] text-slate-500 uppercase font-mono">
            Case File #003-AGENTIC
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-mono font-bold tracking-wider text-cyan-400 uppercase leading-tight">
          Agentic AI Operations
          <br />
          <span className="text-purple-400">{'// Multi-Agent Orchestration'}</span>
        </h2>
        <div className="h-px bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent mt-4" />
      </motion.div>

      {/* ── Project Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project.codename}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.15 * idx, duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="dossier-card overflow-hidden group"
          >
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-cyan-400/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono font-bold text-cyan-400 tracking-wider uppercase">
                  {project.codename}
                </span>
              </div>
              <Lock className="w-3.5 h-3.5 text-slate-600" />
            </div>

            {/* SVG Diagram */}
            <div className="px-5 py-4 bg-slate-900/40 border-b border-slate-700/30">
              {project.svg}
            </div>

            {/* Description */}
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border border-cyan-400/20 bg-cyan-400/5 text-cyan-400/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo Button */}
            <div className="px-5 py-3 border-t border-slate-700/30 bg-slate-900/20">
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded border border-slate-600/40 bg-slate-800/40 text-slate-500 font-mono text-[10px] tracking-wider uppercase cursor-not-allowed opacity-60"
              >
                <ExternalLink className="w-3 h-3" />
                Demo: Link Placeholder
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
