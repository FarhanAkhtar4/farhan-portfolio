'use client';

import { useState } from 'react';
import { certifications, certCategories, categoryDots } from '@/lib/data';
import FadeIn from './FadeIn';
import { ExternalLink, Award } from 'lucide-react';

export default function Certifications() {
  const [active, setActive] = useState<string>('All');

  const filtered =
    active === 'All'
      ? certifications
      : certifications.filter((c) => c.category === active);

  return (
    <section id="certifications" className="py-24 sm:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-mono font-medium text-emerald-500/70 uppercase tracking-widest mb-3">
            Certifications
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/95">
            Credentials &amp; Verification
          </h2>
          <p className="mt-3 text-white/40 text-sm max-w-xl">
            Verified certifications from IBM, NVIDIA, AWS, Oracle, and more —
            each with direct verification links where available.
          </p>
        </FadeIn>

        {/* Category filter */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mt-8">
            {certCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active === cat
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Certs grid */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cert, idx) => (
            <FadeIn key={cert.title} delay={0.03 * idx}>
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] card-glow h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Award size={15} className="text-white/40" />
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${categoryDots[cert.category]}`}
                  />
                </div>
                <h3 className="text-sm font-semibold text-white/80 leading-snug mb-1">
                  {cert.title}
                </h3>
                <p className="text-xs text-white/35 mb-3">{cert.issuer}</p>
                <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
                  {cert.category}
                </span>
                <div className="mt-auto pt-3">
                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-500/60 hover:text-emerald-400 transition-colors"
                    >
                      <ExternalLink size={11} />
                      Verify
                    </a>
                  )}
                  {cert.certFile && !cert.verifyUrl && (
                    <a
                      href={cert.certFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                    >
                      <Award size={11} />
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}