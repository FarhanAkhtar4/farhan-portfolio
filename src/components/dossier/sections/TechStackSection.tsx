'use client';

import { motion } from 'framer-motion';
import { Cpu, Brain, FlaskConical } from 'lucide-react';

interface TechColumn {
  category: string;
  icon: React.ReactNode;
  tags: string[];
}

const techColumns: TechColumn[] = [
  {
    category: 'LLM & AGENTIC',
    icon: <Cpu className="w-5 h-5" />,
    tags: [
      'LangChain',
      'LlamaIndex',
      'OpenAI API',
      'Hugging Face',
      'CrewAI',
      'AutoGen',
      'Vector DBs',
      'RAG',
    ],
  },
  {
    category: 'DEEP LEARNING',
    icon: <Brain className="w-5 h-5" />,
    tags: [
      'PyTorch',
      'TensorFlow',
      'Transformers',
      'Hugging Face',
      'ONNX',
      'CUDA',
      'Weights & Biases',
    ],
  },
  {
    category: 'RESEARCH ENGINEERING',
    icon: <FlaskConical className="w-5 h-5" />,
    tags: [
      'Python',
      'pandas',
      'NumPy',
      'scikit-learn',
      'Docker',
      'Git',
      'Linux',
      'FastAPI',
      'PostgreSQL',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

export default function TechStackSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8" id="techstack">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono tracking-[0.3em] text-cyan-400/70 uppercase">
            Case File #007-STACK
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-cyan-300 font-mono">
          AUTHORIZED TECHNOLOGIES
        </h2>
        <div className="mt-4 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </motion.div>

      {/* Tech Columns Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {techColumns.map((column, colIndex) => (
          <motion.div
            key={colIndex}
            variants={columnVariants}
            className="rounded-lg border border-cyan-500/15 bg-cyan-500/[0.03] p-5 sm:p-6"
            style={{ background: 'rgba(3, 15, 25, 0.7)' }}
          >
            {/* Column Header */}
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-cyan-500/15">
              <div className="w-9 h-9 rounded-md bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400">
                {column.icon}
              </div>
              <h3 className="text-sm font-bold font-mono tracking-[0.15em] text-cyan-300 uppercase">
                {column.category}
              </h3>
            </div>

            {/* Tags Grid */}
            <motion.div
              variants={containerVariants}
              className="flex flex-wrap gap-2"
            >
              {column.tags.map((tag, tagIndex) => (
                <motion.span
                  key={tagIndex}
                  variants={tagVariants}
                  whileHover={{
                    scale: 1.08,
                    borderColor: 'rgba(0, 240, 255, 0.5)',
                    backgroundColor: 'rgba(0, 240, 255, 0.08)',
                    boxShadow: '0 0 12px rgba(0, 240, 255, 0.15)',
                  }}
                  className="inline-flex items-center px-3 py-1.5 rounded-md border border-cyan-500/20 bg-cyan-400/[0.04] text-xs font-mono text-cyan-300/90 tracking-wide cursor-default transition-colors duration-200"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
