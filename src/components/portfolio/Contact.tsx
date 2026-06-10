'use client';

import { siteConfig } from '@/lib/data';
import { resumeDownloads } from '@/lib/resume-data';
import FadeIn from './FadeIn';
import { Mail, Phone, MapPin, Download, ChevronDown } from 'lucide-react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [openResume, setOpenResume] = useState(false);

  return (
    <section id="contact" className="py-24 sm:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-mono font-medium text-emerald-500/70 uppercase tracking-widest mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/95">
            Let&apos;s Work Together
          </h2>
          <p className="mt-3 text-white/40 text-sm max-w-xl">
            I&apos;m currently open to ML/AI engineering roles, research collaborations,
            and interesting freelance projects. Reach out and let&apos;s talk.
          </p>
        </FadeIn>

        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl">
          {/* Contact info */}
          <FadeIn delay={0.1}>
            <div className="space-y-5">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] card-glow group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-white/35 font-medium">Email</p>
                  <p className="text-sm text-white/70 group-hover:text-emerald-400 transition-colors">
                    {siteConfig.email}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] card-glow group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-white/35 font-medium">Phone</p>
                  <p className="text-sm text-white/70 group-hover:text-emerald-400 transition-colors">
                    {siteConfig.phone}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-white/35 font-medium">Location</p>
                  <p className="text-sm text-white/70">{siteConfig.location}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Resume downloads + Social */}
          <FadeIn delay={0.15}>
            <div className="space-y-5">
              {/* Resume dropdown */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setOpenResume(!openResume)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Download size={16} className="text-emerald-400" />
                    <span className="text-sm font-medium text-white/80">
                      Download Resume
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-white/30 transition-transform ${openResume ? 'rotate-180' : ''}`}
                  />
                </button>
                {openResume && (
                  <div className="px-4 pb-4 space-y-1">
                    {resumeDownloads.map((r) => (
                      <a
                        key={r.label}
                        href={r.href}
                        className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
                      >
                        <div>
                          <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                            {r.label}
                          </p>
                          <p className="text-[11px] text-white/25">{r.description}</p>
                        </div>
                        <Download size={13} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Social profiles */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
                <p className="text-xs text-white/35 font-medium mb-4">Profiles</p>
                <div className="space-y-3">
                  {[
                    { icon: Github, label: 'GitHub', href: siteConfig.github, handle: '@FarhanAkhtar4' },
                    { icon: Linkedin, label: 'LinkedIn', href: siteConfig.linkedin, handle: 'Farhan Akhtar' },
                    { icon: ExternalLink, label: 'HuggingFace', href: siteConfig.huggingface, handle: '@FarhanAkhtar11' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-2 group"
                    >
                      <div className="flex items-center gap-3">
                        <link.icon size={16} className="text-white/30 group-hover:text-emerald-400 transition-colors" />
                        <div>
                          <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                            {link.label}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-white/25 font-mono">{link.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}