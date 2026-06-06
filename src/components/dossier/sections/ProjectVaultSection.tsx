'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  FolderOpen,
  Folder,
  ExternalLink,
  Github,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lock,
  ImageOff,
  X,
} from 'lucide-react';

/* ─── Project Data ─── */
const projects = [
  {
    id: 'tft',
    name: 'TFT Seismic Predictor',
    tags: ['PyTorch', 'TFT', 'Seismic'],
    caseFile: '#002-TFT',
    problem:
      '[PLACEHOLDER] — Predicting seismic response of Buckling-Restrained Braced Frames using Temporal Fusion Transformer architecture with multi-horizon quantile forecasting.',
    architecture:
      '[PLACEHOLDER] — Encoder-decoder architecture with variable selection networks, LSTM layers, multi-head temporal attention, and quantile output heads for probabilistic predictions.',
    challenges:
      '[PLACEHOLDER] — Handling highly nonlinear structural responses, dealing with limited ground motion data, ensuring model generalizability across different structural configurations.',
  },
  {
    id: 'agentos',
    name: 'AgentOS',
    tags: ['Multi-Agent', 'Python', 'LLM'],
    caseFile: '#003-AGENTIC',
    problem:
      '[PLACEHOLDER] — Building autonomous multi-agent orchestration framework for complex task decomposition and parallel execution with dynamic resource management.',
    architecture:
      '[PLACEHOLDER] — Central planning agent with hierarchical task decomposition, specialized worker agents for different domains, shared memory state, and feedback loop integration.',
    challenges:
      '[PLACEHOLDER] — Ensuring agent coordination reliability, managing context window limitations across agents, handling failure recovery and retry strategies.',
  },
  {
    id: 'rag',
    name: 'RAG Pipeline',
    tags: ['RAG', 'Vector DB', 'LangChain'],
    caseFile: '#003-AGENTIC',
    problem:
      '[PLACEHOLDER] — Building production-grade retrieval-augmented generation system for domain-specific knowledge queries with high accuracy and low latency.',
    architecture:
      '[PLACEHOLDER] — Hybrid search pipeline combining dense vector embeddings with sparse BM25 retrieval, multi-stage reranking, and context-aware prompt engineering for grounded generation.',
    challenges:
      '[PLACEHOLDER] — Optimizing chunking strategies for domain documents, managing vector database scalability, reducing hallucination rates in generated responses.',
  },
  {
    id: 'saint',
    name: 'SAINT Architecture',
    tags: ['Tabular', 'Attention', 'Transformer'],
    caseFile: '#004-SAINT',
    problem:
      '[PLACEHOLDER] — Applying Self-Attention and Intersample Attention Transformer (SAINT) architecture for tabular data classification tasks with mixed feature types.',
    architecture:
      '[PLACEHOLDER] — Dual attention mechanism with row-wise (intrasample) self-attention and column-wise (intersample) attention, augmented with feature and column embedding layers.',
    challenges:
      '[PLACEHOLDER] — Handling heterogeneous feature types (categorical, numerical), preventing overfitting on small tabular datasets, optimizing attention computation for tabular structures.',
  },
  {
    id: 'talentscout',
    name: 'TalentScout AI',
    tags: ['NLP', 'Screening', 'FastAPI'],
    caseFile: '#003-AGENTIC',
    problem:
      '[PLACEHOLDER] — Automating talent acquisition pipeline with AI-powered resume parsing, skill extraction, and intelligent candidate-job matching.',
    architecture:
      '[PLACEHOLDER] — NLP pipeline with named entity recognition for skill extraction, semantic similarity matching using transformer embeddings, and multi-criteria ranking algorithm.',
    challenges:
      '[PLACEHOLDER] — Handling diverse resume formats, ensuring fair and unbiased screening, maintaining real-time performance with large applicant pools.',
  },
  {
    id: 'style-transfer',
    name: 'Neural Style Transfer',
    tags: ['CNN', 'Computer Vision', 'Art'],
    caseFile: '#006-NS',
    problem:
      '[PLACEHOLDER] — Implementing neural style transfer using convolutional neural networks to blend artistic styles with photographic content in real-time.',
    architecture:
      '[PLACEHOLDER] — Encoder-decoder architecture with pre-trained VGG19 feature extraction, adaptive instance normalization for style transfer, and content-style loss optimization.',
    challenges:
      '[PLACEHOLDER] — Balancing content preservation with style application, achieving real-time inference speeds, handling high-resolution outputs without artifacts.',
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analyzer',
    tags: ['NLP', 'BERT', 'Classification'],
    caseFile: '#007-SA',
    problem:
      '[PLACEHOLDER] — Building multi-class sentiment analysis system for social media text with fine-grained emotion detection and aspect-based sentiment extraction.',
    architecture:
      '[PLACEHOLDER] — Fine-tuned transformer model with domain-adaptive pretraining, attention-based aspect extraction heads, and multi-task learning for combined sentiment and emotion classification.',
    challenges:
      '[PLACEHOLDER] — Handling sarcasm and implicit sentiment in informal text, managing class imbalance in emotion categories, adapting to domain-specific language patterns.',
  },
  {
    id: 'object-detection',
    name: 'Object Detection Suite',
    tags: ['YOLO', 'Detection', 'OpenCV'],
    caseFile: '#008-OD',
    problem:
      '[PLACEHOLDER] — Developing real-time object detection system for surveillance and industrial quality control with custom training pipeline and deployment optimization.',
    architecture:
      '[PLACEHOLDER] — YOLO-based detection backbone with custom data annotation pipeline, transfer learning from pre-trained weights, and ONNX/TensorRT optimized inference engine.',
    challenges:
      '[PLACEHOLDER] — Achieving real-time performance on edge devices, handling occlusion and small object detection, managing dataset annotation quality and consistency.',
  },
];

/* ─── Single Project Card ─── */
function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Folder Card ── */}
      <motion.div
        layout
        whileHover={{ y: -3 }}
        className="dossier-folder-card cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Folder Tab */}
        <div className="dossier-folder-tab" />

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <h4 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
                {project.name}
              </h4>
            </div>
            <span className="text-[8px] font-mono tracking-wider text-slate-600 shrink-0">
              {project.caseFile}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block text-[8px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border border-slate-600/30 bg-slate-800/50 text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Open File Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider uppercase text-cyan-400/70 hover:text-cyan-400 transition-colors group-hover:text-cyan-400"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Close File' : 'Open File'}
          </button>
        </div>
      </motion.div>

      {/* ── Expandable Detail Panel ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="dossier-card mt-1 p-5 border-t-0 rounded-t-none space-y-4">
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setExpanded(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Problem */}
              <div>
                <span className="text-[9px] font-mono tracking-[0.2em] text-amber-400/70 uppercase block mb-1">
                  Problem Description
                </span>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* Architecture */}
              <div>
                <span className="text-[9px] font-mono tracking-[0.2em] text-cyan-400/70 uppercase block mb-1">
                  Architecture
                </span>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  {project.architecture}
                </p>
              </div>

              {/* Screenshot Placeholder */}
              <div className="w-full h-32 bg-slate-800/30 border border-dashed border-slate-600/40 rounded flex items-center justify-center">
                <div className="text-center space-y-1">
                  <ImageOff className="w-5 h-5 mx-auto text-slate-600" />
                  <span className="text-[8px] font-mono tracking-[0.3em] text-slate-600 uppercase">
                    Screenshot Placeholder
                  </span>
                </div>
              </div>

              {/* GitHub + Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-emerald-400/70 uppercase block mb-1">
                    Source
                  </span>
                  <button
                    disabled
                    className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider uppercase px-2 py-1 rounded border border-slate-600/30 bg-slate-800/30 text-slate-500 cursor-not-allowed"
                  >
                    <Github className="w-3 h-3" />
                    GitHub Link Placeholder
                  </button>
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-red-400/70 uppercase block mb-1">
                    Challenges
                  </span>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectVaultSection() {
  return (
    <section className="relative w-full py-16 px-4 md:px-8 lg:px-16" id="vault">
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
          <Lock className="w-5 h-5 text-cyan-400" />
          <span className="text-xs tracking-[0.3em] text-slate-500 uppercase font-mono">
            Case File #005-VAULT
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-mono font-bold tracking-wider text-cyan-400 uppercase leading-tight">
          Classified Project Archive
        </h2>
        <div className="flex items-center gap-2 mt-3">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400/60" />
          <span className="text-[9px] font-mono tracking-[0.2em] text-amber-400/60 uppercase">
            Access restricted — authorization required
          </span>
        </div>
        <div className="h-px bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent mt-4" />
      </motion.div>

      {/* ── Project Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.05 * idx, duration: 0.5 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      {/* ── Footer notice ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 text-center"
      >
        <span className="text-[8px] font-mono tracking-[0.3em] text-slate-600 uppercase">
          End of Archive // Additional files pending declassification
        </span>
      </motion.div>
    </section>
  );
}
