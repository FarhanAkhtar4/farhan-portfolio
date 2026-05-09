'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  MapPin,
  Phone,
  Github,
  Linkedin,
  User,
  MessageSquare,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { siteConfig } from '@/lib/data';
import {
  fadeUpSlow,
  slideLeft,
  slideRight,
  easeSmooth,
  transitionSmooth,
} from '@/lib/animations';
import type { Variants } from 'framer-motion';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeSmooth },
  },
};

// ---------------------------------------------------------------------------
// Form validation
// ---------------------------------------------------------------------------

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = 'Subject is required';
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={transitionSmooth}
      className="mb-14 text-center"
    >
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/70">
        Let&apos;s Connect
      </p>
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
        Get In <span className="gradient-text">Touch</span>
      </h2>
      <div className="heading-gradient-line mx-auto mt-2 w-24 sm:w-32" />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Contact info card
// ---------------------------------------------------------------------------

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay?: number;
}

function ContactCard({ icon, label, value, href, delay = 0 }: ContactCardProps) {
  const Wrapper = href ? 'a' : 'div';
  const linkProps = href
    ? {
        href,
        target: href.startsWith('http') ? '_blank' : undefined,
        rel: href.startsWith('http') ? 'noopener noreferrer' : undefined,
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: easeSmooth }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
    >
      <Wrapper
        {...linkProps}
        className="glass-card flex items-center gap-4 cursor-pointer group"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-purple-500/10 border border-white/[0.06] text-cyan-400 transition-colors group-hover:from-cyan-500/25 group-hover:to-purple-500/20 group-hover:border-cyan-500/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
            {label}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-cyan-300 truncate">
            {value}
          </p>
        </div>
      </Wrapper>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Social link button
// ---------------------------------------------------------------------------

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[var(--text-secondary)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 hover:shadow-[0_0_24px_rgba(6,182,212,0.15)]"
    >
      {icon}
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// Form input component
// ---------------------------------------------------------------------------

interface FormFieldProps {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  rows?: number;
}

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  icon,
  value,
  error,
  onChange,
  onBlur,
  rows,
}: FormFieldProps) {
  const baseInputStyles = `
    w-full rounded-xl border bg-white/[0.03] backdrop-blur-sm
    pl-11 pr-4 py-3 text-sm text-[var(--text-primary)]
    placeholder:text-[var(--text-secondary)]/50
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40
  `;

  const borderStyles = error
    ? 'border-red-500/40 focus:ring-red-500/40 focus:border-red-500/40'
    : 'border-white/[0.08] hover:border-white/[0.14]';

  const sharedProps = {
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    className: `${baseInputStyles} ${borderStyles}`,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/60">
          {icon}
        </div>
        {rows ? (
          <textarea
            id={name}
            rows={rows}
            {...sharedProps}
            className={`${sharedProps.className} resize-none pt-3`}
            style={{ paddingLeft: '2.75rem' }}
          />
        ) : (
          <input
            id={name}
            type={type}
            {...sharedProps}
          />
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContactSection — main exported component
// ---------------------------------------------------------------------------

function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = () => {
    // Validate on blur to show inline errors
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Full validation
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Success
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});

      // Reset success state after 4 seconds
      setTimeout(() => setIsSuccess(false), 4000);
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative z-10 section-padding">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[120px]" />
        <div className="absolute -right-32 bottom-1/3 h-72 w-72 rounded-full bg-purple-600/[0.05] blur-[120px]" />
      </div>

      <div className="container-custom relative">
        <SectionHeading />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-10 lg:gap-14">
          {/* ---- Left column: Contact info (2/5) ---- */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-6 md:col-span-2"
          >
            {/* Description */}
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              I&apos;m always open to discussing new projects, research collaborations, or
              opportunities to be part of something amazing.
            </p>

            {/* Contact cards */}
            <div className="flex flex-col gap-3">
              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={siteConfig.email}
                href={`mailto:${siteConfig.email}`}
                delay={0.1}
              />
              <ContactCard
                icon={<Phone className="h-5 w-5" />}
                label="Phone"
                value={siteConfig.phone}
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                delay={0.2}
              />
              <ContactCard
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={siteConfig.location}
                delay={0.3}
              />
            </div>

            {/* Social links */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                Connect with me
              </p>
              <div className="flex items-center gap-3">
                <SocialLink
                  href={siteConfig.github}
                  icon={<Github className="h-4.5 w-4.5" />}
                  label="GitHub"
                />
                <SocialLink
                  href={siteConfig.linkedin}
                  icon={<Linkedin className="h-4.5 w-4.5" />}
                  label="LinkedIn"
                />
                <SocialLink
                  href={`mailto:${siteConfig.email}`}
                  icon={<Mail className="h-4.5 w-4.5" />}
                  label="Email"
                />
              </div>
            </div>
          </motion.div>

          {/* ---- Right column: Contact form (3/5) ---- */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="md:col-span-3"
          >
            <motion.form
              onSubmit={handleSubmit}
              variants={scaleIn}
              className="glass-card flex flex-col gap-5 p-6 sm:p-8"
            >
              {/* Name + Email row */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label="Name"
                  name="name"
                  placeholder="Your name"
                  icon={<User className="h-4 w-4" />}
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {/* Subject */}
              <FormField
                label="Subject"
                name="subject"
                placeholder="What's this about?"
                icon={<MessageSquare className="h-4 w-4" />}
                value={formData.subject}
                error={errors.subject}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {/* Message */}
              <FormField
                label="Message"
                name="message"
                placeholder="Tell me about your project, idea, or just say hello..."
                icon={<MessageSquare className="h-4 w-4" />}
                value={formData.message}
                error={errors.message}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
              />

              {/* Server error */}
              {submitError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-center text-sm text-red-400"
                >
                  {submitError}
                </motion.p>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
                whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
                className={`
                  group relative mt-1 flex w-full items-center justify-center gap-2.5 overflow-hidden
                  rounded-xl px-6 py-3.5 text-sm font-semibold
                  transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70
                  ${
                    isSuccess
                      ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-gray-950 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30'
                  }
                `}
              >
                {/* Shine overlay */}
                {!isSuccess && (
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                )}

                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
