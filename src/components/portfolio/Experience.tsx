'use client';

import { experience } from '@/lib/data';
import FadeIn from './FadeIn';
import { Building2, Calendar } from 'lucide-react';

export default function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-mono font-medium text-emerald-500/70 uppercase tracking-widest mb-3">
            Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/95">
            Where I&apos;ve Worked
          </h2>
        </FadeIn>

        <div className="mt-12 max-w-3xl">
          {experience.map((exp, idx) => (
            <FadeIn key={exp.id} delay={0.1 + idx * 0.1}>
              <div className="relative pl-8 pb-10 last:pb-0">
                {/* Timeline line */}
                {idx < experience.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 to-transparent" />
                )}
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-2 border-emerald-500/50 bg-[hsl(0,0%,2%)] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 glow-dot" />
                </div>

                {/* Card */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] card-glow">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-white/90">{exp.role}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 size={13} className="text-emerald-500/60" />
                        <span className="text-sm text-emerald-400/70 font-medium">
                          {exp.company}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/35 font-mono">
                      <Calendar size={12} />
                      {exp.period}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-white/45 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500/50 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}