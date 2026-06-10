'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  Loader2,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { siteConfig } from '@/lib/data';
import { toast } from 'sonner';

export default function ContactTerminal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        toast.success('Message sent successfully!');
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const socialLinks = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}`, accent: 'var(--accent-cyan)' },
    { icon: <Github className="w-5 h-5" />, label: 'GitHub', value: 'FarhanAkhtar4', href: siteConfig.github, accent: 'var(--text-secondary)' },
    { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', value: 'Farhan Akhtar', href: siteConfig.linkedin, accent: '#0a66c2' },
    { icon: <Globe className="w-5 h-5" />, label: 'Hugging Face', value: 'FarhanAkhtar11', href: siteConfig.huggingface, accent: '#ff9d00' },
  ];

  return (
    <div ref={sectionRef} className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl w-full mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Room 10 — Contact Terminal</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-[var(--accent-cyan)]">Get In</span>{' '}
            <span className="text-[var(--text-primary)]">Touch</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Open for collaboration, research opportunities, and AI projects
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass-card">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-[var(--accent-emerald)] mb-4" />
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Message Sent!</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="px-4 py-2 rounded-lg border border-[var(--border-glass)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[rgba(6,182,212,0.3)] transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[rgba(15,23,42,0.5)] border border-[var(--border-glass)] text-sm text-[var(--text-primary)] placeholder:text-[rgba(148,163,184,0.3)] focus:border-[rgba(6,182,212,0.3)] focus:outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[rgba(15,23,42,0.5)] border border-[var(--border-glass)] text-sm text-[var(--text-primary)] placeholder:text-[rgba(148,163,184,0.3)] focus:border-[rgba(6,182,212,0.3)] focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[rgba(15,23,42,0.5)] border border-[var(--border-glass)] text-sm text-[var(--text-primary)] placeholder:text-[rgba(148,163,184,0.3)] focus:border-[rgba(6,182,212,0.3)] focus:outline-none transition-colors"
                      placeholder="Project collaboration"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[rgba(15,23,42,0.5)] border border-[var(--border-glass)] text-sm text-[var(--text-primary)] placeholder:text-[rgba(148,163,184,0.3)] focus:border-[rgba(6,182,212,0.3)] focus:outline-none transition-colors resize-none"
                      placeholder="Tell me about your project or opportunity..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.25)] text-sm font-medium text-[var(--accent-cyan)] hover:bg-[rgba(6,182,212,0.15)] hover:border-[rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-4">Connect</h3>
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="glass-card flex items-center gap-4 group hover:border-[rgba(6,182,212,0.2)] cursor-pointer block"
                style={{ color: link.accent }}
              >
                <div className="w-10 h-10 rounded-lg border border-[var(--border-glass)] bg-[rgba(15,23,42,0.6)] flex items-center justify-center transition-all group-hover:border-[rgba(6,182,212,0.2)]">
                  {link.icon}
                </div>
                <div>
                  <span className="text-sm font-semibold text-[var(--text-primary)] block">{link.label}</span>
                  <span className="text-xs font-mono text-[var(--text-secondary)]">{link.value}</span>
                </div>
              </motion.a>
            ))}

            {/* Location info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="glass-card mt-6"
            >
              <div className="text-center">
                <p className="text-xs font-mono text-[var(--text-secondary)] mb-1">Location</p>
                <p className="text-sm text-[var(--text-primary)]">{siteConfig.location}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
