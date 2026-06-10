'use client';

import { skillCategories } from '@/lib/data';
import FadeIn from './FadeIn';

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
          <p className="mt-3 text-white/40 text-sm max-w-xl">
            My core competencies span the full ML/AI stack — from foundational programming
            to production deployment and agentic orchestration.
          </p>
        </FadeIn>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((cat, idx) => (
            <FadeIn key={cat.name} delay={0.05 * idx}>
              <div
                className={`p-5 rounded-xl border card-glow h-full ${
                  cat.highlight
                    ? 'bg-emerald-500/[0.03] border-emerald-500/15'
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
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        cat.highlight
                          ? 'bg-emerald-500/8 text-emerald-300/70 border border-emerald-500/10'
                          : 'bg-white/[0.04] text-white/50 border border-white/[0.06]'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}