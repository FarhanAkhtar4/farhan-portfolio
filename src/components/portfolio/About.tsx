'use client';

import { siteConfig, education, experience, projects, certifications } from '@/lib/data';
import FadeIn from './FadeIn';
import { MapPin, GraduationCap, Briefcase, Award, Github, Linkedin, ExternalLink } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-mono font-medium text-emerald-500/70 uppercase tracking-widest mb-3">
            About
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/95">
            Background &amp; Education
          </h2>
        </FadeIn>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Bio */}
          <FadeIn delay={0.1}>
            <div className="space-y-5">
              <p className="text-white/55 leading-relaxed text-[15px]">
                I&apos;m <span className="text-white/80 font-medium">Farhan Akhtar Makandar</span>,
                an ML Systems Engineer based in {siteConfig.location}. I specialize in building
                production-grade AI systems — from Temporal Fusion Transformers for seismic prediction
                to multi-agent orchestration platforms with LLM-powered reasoning and retrieval.
              </p>
              <p className="text-white/55 leading-relaxed text-[15px]">
                I hold a B.E. in Artificial Intelligence &amp; Machine Learning from
                Yenepoya Institute of Technology (VTU) and completed a research internship
                at NIT Calicut working on transformer-based predictive models. My work spans deep
                learning, agentic AI workflows, RAG pipelines, and full-stack SaaS applications.
              </p>
              <p className="text-white/55 leading-relaxed text-[15px]">
                I believe in building systems that are not just academically sound but
                production-ready — with clean architecture, proper evaluation, and real-world
                deployment in mind.
              </p>

              {/* Social row */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-emerald-400 transition-colors"
                >
                  <Github size={15} />
                  GitHub
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-emerald-400 transition-colors"
                >
                  <Linkedin size={15} />
                  LinkedIn
                </a>
                <a
                  href={siteConfig.huggingface}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink size={15} />
                  HuggingFace
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Right — Cards */}
          <div className="space-y-4">
            {/* Education */}
            <FadeIn delay={0.15}>
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] card-glow">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <GraduationCap size={16} className="text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/80">Education</h3>
                </div>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.institution}>
                      <p className="text-sm text-white/75 font-medium">{edu.degree}</p>
                      <p className="text-xs text-white/40 mt-0.5">{edu.institution}</p>
                      <p className="text-xs text-emerald-500/60 font-mono mt-0.5">{edu.period}</p>
                      {edu.details && (
                        <p className="text-xs text-white/35 mt-1.5 leading-relaxed">{edu.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Stats grid */}
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Briefcase, label: 'Experience', value: '7+ months', sub: 'NIT Calicut' },
                  { icon: MapPin, label: 'Location', value: 'Karnataka', sub: 'India' },
                  { icon: Award, label: 'Certifications', value: `${certifications.length}`, sub: 'IBM, NVIDIA, AWS, Oracle' },
                  { icon: Github, label: 'Projects', value: `${projects.length}+`, sub: 'AI, ML, SaaS' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] card-glow"
                  >
                    <item.icon size={15} className="text-emerald-500/60 mb-2" />
                    <p className="text-lg font-bold text-white/90">{item.value}</p>
                    <p className="text-[11px] text-white/40 font-medium">{item.label}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}