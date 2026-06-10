'use client';

import { skillCategories } from '@/lib/data';
import FadeIn from './FadeIn';
import { motion } from 'framer-motion';

/* Proficiency weights for visual bars — based on project evidence */
const skillProficiency: Record<string, number> = {
  // LLM & Agentic AI (core — highest)
  'RAG Pipelines': 95,
  'Prompt Engineering': 92,
  'LLM Integration': 90,
  'Agentic Workflows': 92,
  'Vector Databases': 88,
  'LangChain': 90,
  'Fine-Tuning': 85,
  'Embeddings': 85,
  // ML & Deep Learning
  'PyTorch': 92,
  'Transformers': 90,
  'Scikit-learn': 85,
  'TensorFlow': 78,
  'Keras': 78,
  'XGBoost': 80,
  'CNN': 80,
  'LSTM': 82,
  'RNN': 78,
  'GANs': 70,
  // Languages
  'Python': 95,
  'SQL': 82,
  'C': 60,
  'R': 65,
  'HTML/CSS': 75,
  // Data Science
  'Pandas': 90,
  'NumPy': 88,
  'Feature Engineering': 85,
  'Matplotlib': 82,
  'Seaborn': 82,
  'Jupyter': 88,
  // Cloud & Tools
  'Git/GitHub': 90,
  'AWS': 72,
  'Cloudflare': 75,
  'Vercel': 78,
  'Oracle Cloud': 65,
};

export default function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-mono font-medium text-emerald-500/70 uppercase tracking-widest mb-3">
            Skills
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/95">
            Technical Toolkit
          </h2>
          <p className="mt-3 text-white/40 text-sm max-w-xl leading-relaxed">
            Proficiency levels are derived from project evidence — each bar
            represents demonstrated capability across shipped work.
          </p>
        </FadeIn>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((cat, idx) => (
            <FadeIn key={cat.name} delay={0.05 * idx}>
              <div
                className={`p-5 rounded-xl border card-glow h-full ${
                  cat.highlight
                    ? 'bg-emerald-500/[0.02] border-emerald-500/12'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                  {cat.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-dot" />
                  )}
                  {cat.name}
                  {cat.highlight && (
                    <span className="ml-auto text-[10px] font-mono text-emerald-500/50 uppercase">
                      Core
                    </span>
                  )}
                </h3>
                <div className="space-y-3">
                  {cat.skills.map((skill) => {
                    const prof = skillProficiency[skill] || 70;
                    return (
                      <div key={skill}>
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-medium ${
                              cat.highlight
                                ? 'text-emerald-300/70'
                                : 'text-white/50'
                            }`}
                          >
                            {skill}
                          </span>
                          <span className="text-[10px] font-mono text-white/20">
                            {prof}%
                          </span>
                        </div>
                        <div className="skill-bar-track">
                          <motion.div
                            className="skill-bar-fill"
                            initial={{ transform: 'scaleX(0)' }}
                            whileInView={{ transform: `scaleX(${prof / 100})` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              ease: [0.25, 0.1, 0.25, 1],
                              delay: 0.1,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}