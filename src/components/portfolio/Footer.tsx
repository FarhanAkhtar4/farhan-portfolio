'use client';

import { siteConfig } from '@/lib/data';
import FadeIn from './FadeIn';
import { Github, Linkedin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8 px-6">
      <FadeIn>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/50 transition-colors"
              aria-label="GitHub"
            >
              <Github size={15} />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/50 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={15} />
            </a>
            <a
              href={siteConfig.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/50 transition-colors"
              aria-label="HuggingFace"
            >
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
}