'use client';

import { motion } from 'framer-motion';
import {
  Send,
  Mail,
  Github,
  Linkedin,
  Download,
  Radio,
  Globe,
} from 'lucide-react';

/* ───────────── Contact Links ───────────── */
interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
}

const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    value: '[PLACEHOLDER EMAIL]',
    href: '#placeholder',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    label: 'GitHub',
    value: '[PLACEHOLDER GITHUB]',
    href: '#placeholder',
    icon: <Github className="w-5 h-5" />,
  },
  {
    label: 'LinkedIn',
    value: '[PLACEHOLDER LINKEDIN]',
    href: '#placeholder',
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    label: 'Hugging Face',
    value: '[PLACEHOLDER HUGGINGFACE]',
    href: '#placeholder',
    icon: <Globe className="w-5 h-5" />,
  },
];

/* ───────────── Main Component ───────────── */
export default function ContactSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8" id="contact">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono tracking-[0.3em] text-cyan-400/70 uppercase">
            Case File #010-COMMS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-cyan-300 font-mono">
          SECURE TRANSMISSION TERMINAL
        </h2>
        <div className="mt-4 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ── Contact Form ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-lg border border-cyan-500/15 p-6 sm:p-8"
          style={{ background: 'rgba(3, 15, 25, 0.75)' }}
        >
          <h3 className="text-sm font-bold font-mono text-cyan-300 tracking-[0.15em] uppercase mb-6 flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            Transmit Message
          </h3>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
          >
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-gray-400 tracking-[0.2em] uppercase">
                Operative Name
              </label>
              <input
                type="text"
                placeholder="Enter name..."
                readOnly
                className="w-full px-4 py-2.5 rounded-md border border-cyan-500/15 bg-gray-950/80 text-sm font-mono text-gray-300 placeholder-gray-600 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-gray-400 tracking-[0.2em] uppercase">
                Secure Channel
              </label>
              <input
                type="email"
                placeholder="Enter email..."
                readOnly
                className="w-full px-4 py-2.5 rounded-md border border-cyan-500/15 bg-gray-950/80 text-sm font-mono text-gray-300 placeholder-gray-600 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-gray-400 tracking-[0.2em] uppercase">
                Encrypted Payload
              </label>
              <textarea
                placeholder="Type your message..."
                rows={5}
                readOnly
                className="w-full px-4 py-2.5 rounded-md border border-cyan-500/15 bg-gray-950/80 text-sm font-mono text-gray-300 placeholder-gray-600 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="button"
              whileHover={{
                scale: 1.03,
                boxShadow: '0 0 24px rgba(0, 240, 255, 0.25)',
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-md bg-cyan-400 text-gray-950 font-mono text-sm font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-cyan-300 transition-colors duration-200 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send (Encrypted)
            </motion.button>
          </form>
        </motion.div>

        {/* ── Contact Links & Resume Download ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Contact Links Grid */}
          <div className="rounded-lg border border-cyan-500/15 p-6 sm:p-8" style={{ background: 'rgba(3, 15, 25, 0.75)' }}>
            <h3 className="text-sm font-bold font-mono text-cyan-300 tracking-[0.15em] uppercase mb-5 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Communication Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contactLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{
                    scale: 1.03,
                    borderColor: 'rgba(0, 240, 255, 0.35)',
                    boxShadow: '0 0 16px rgba(0, 240, 255, 0.08)',
                  }}
                  className="flex items-center gap-3 p-3.5 rounded-lg border border-cyan-500/15 bg-cyan-400/[0.03] transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-md bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400/80 group-hover:text-cyan-400 group-hover:border-cyan-400/40 transition-all duration-300 shrink-0">
                    {link.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-gray-500 tracking-[0.15em] uppercase">
                      {link.label}
                    </p>
                    <p className="text-xs font-mono text-cyan-300/80 truncate">
                      {link.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Download Resume Card */}
          <motion.div
            whileHover={{
              borderColor: 'rgba(0, 240, 255, 0.35)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)',
            }}
            className="rounded-lg border border-cyan-500/15 p-6 flex items-center gap-4"
            style={{ background: 'rgba(3, 15, 25, 0.75)' }}
          >
            <div className="w-12 h-12 rounded-lg bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold font-mono text-cyan-300 tracking-wide">
                Download Full Dossier
              </h4>
              <p className="text-xs font-mono text-gray-500 mt-0.5">
                Complete personnel file — PDF format
              </p>
            </div>
            <a
              href="#placeholder"
              className="px-4 py-2 rounded-md bg-cyan-400/10 border border-cyan-400/25 text-xs font-mono text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/40 transition-all duration-200 whitespace-nowrap"
            >
              Download
            </a>
          </motion.div>

          {/* Encryption Notice */}
          <div className="rounded-lg border border-cyan-500/10 p-4 flex items-start gap-3" style={{ background: 'rgba(3, 15, 25, 0.5)' }}>
            <div className="w-8 h-8 rounded-md bg-cyan-400/[0.06] border border-cyan-400/15 flex items-center justify-center shrink-0">
              <span className="text-cyan-400/60 text-xs font-mono font-bold">E2E</span>
            </div>
            <div>
              <p className="text-xs font-mono text-cyan-300/70 tracking-wide font-medium">
                End-to-End Encryption
              </p>
              <p className="text-[11px] font-mono text-gray-500 leading-relaxed mt-0.5">
                All transmissions are secured with AES-256 encryption. Channel integrity verified.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
