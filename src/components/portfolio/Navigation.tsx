'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, ChevronDown, Linkedin, Github, Globe, FileText, ExternalLink } from 'lucide-react';
import { navLinks, siteConfig } from '@/lib/data';
import { resumeDownloads, profileLinks } from '@/lib/resume-data';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCROLL_THRESHOLD = 50;
const INTERSECTION_THRESHOLD = 0.35;
const INTERSECTION_ROOT_MARGIN = '-10% 0px -60% 0px';

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(() =>
    typeof window !== 'undefined' && window.scrollY > SCROLL_THRESHOLD,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Close resume dropdown when clicking outside
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resumeRef.current && !resumeRef.current.contains(e.target as Node)) {
        setResumeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [activeSection, setActiveSection] = useState<string>(
    navLinks[0]?.href.replace('#', '') ?? 'home',
  );

  // Ref for Intersection Observer
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ---- Scroll listener (passive) ----
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ---- Smooth scroll handler ----
  const scrollToSection = useCallback((href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // ---- Intersection Observer for active section highlighting ----
  useEffect(() => {
    // Collect all section ids from nav links
    const sectionIds = navLinks.map((link) => link.href.replace('#', ''));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    // Track last scroll position for throttling intersection checks
    let ticking = false;
    let lastActive = navLinks[0]?.href.replace('#', '') ?? 'home';

    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        // Find the most recent intersecting entry
        for (let i = entries.length - 1; i >= 0; i--) {
          if (entries[i].isIntersecting) {
            const id = entries[i].target.id;
            if (id !== lastActive) {
              lastActive = id;
              setActiveSection(id);
            }
            break;
          }
        }
        ticking = false;
      });
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: INTERSECTION_ROOT_MARGIN,
      threshold: INTERSECTION_THRESHOLD,
    });

    sections.forEach((section) => observer.observe(section));
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  // ---- Lock body scroll when mobile menu is open ----
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // ---- Mobile nav link click handler ----
  const handleMobileLinkClick = useCallback(
    (href: string) => {
      scrollToSection(href);
      setMobileOpen(false);
    },
    [scrollToSection],
  );

  // ---- Memoize nav links rendering ----
  const desktopLinks = useMemo(
    () =>
      navLinks.map((link) => {
        const sectionId = link.href.replace('#', '');
        const isActive = activeSection === sectionId;

        return (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(link.href);
            }}
            className={`
              relative px-3 py-2 text-sm font-medium transition-colors duration-200
              ${
                isActive
                  ? 'text-cyan-400'
                  : 'text-white/60 hover:text-white/90'
              }
            `}
          >
            {link.label}
            {/* Active indicator dot */}
            {isActive && (
              <motion.span
                layoutId="nav-active-indicator"
                className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-cyan-400"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </a>
        );
      }),
    [activeSection, scrollToSection],
  );

  const mobileLinks = useMemo(
    () =>
      navLinks.map((link, index) => {
        const sectionId = link.href.replace('#', '');
        const isActive = activeSection === sectionId;

        return (
          <motion.a
            key={link.href}
            href={link.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.25 }}
            onClick={(e) => {
              e.preventDefault();
              handleMobileLinkClick(link.href);
            }}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${
                isActive
                  ? 'bg-white/10 text-cyan-400'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? 'bg-cyan-400' : 'bg-white/30'
              }`}
            />
            {link.label}
          </motion.a>
        );
      }),
    [activeSection, handleMobileLinkClick],
  );

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? 'backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg shadow-black/5'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ---- Logo / Name ---- */}
          <button
            type="button"
            onClick={() => scrollToSection('#home')}
            className="flex flex-col gap-0 leading-none"
          >
            <span className="text-lg font-bold tracking-widest bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
              {siteConfig.firstName.toUpperCase()}
            </span>
            <span className="text-[10px] font-medium tracking-wider text-white/40 uppercase">
              {siteConfig.roleShort.split('·')[0]?.trim()}
            </span>
          </button>

          {/* ---- Desktop Nav Links ---- */}
          <div className="hidden items-center gap-1 md:flex">
            {desktopLinks}
          </div>

          {/* ---- Right side: Resumes Dropdown + Hamburger ---- */}
          <div className="flex items-center gap-3">
            {/* Resumes Dropdown (desktop) */}
            <div ref={resumeRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setResumeOpen((prev) => !prev)}
                aria-expanded={resumeOpen}
                aria-haspopup="true"
                className={`
                  inline-flex items-center gap-2 rounded-lg px-4 py-2
                  text-sm font-medium transition-all duration-300
                  ${
                    isScrolled
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 hover:border-cyan-400/40'
                      : 'bg-white/10 text-white/80 border border-white/10 hover:bg-white/15 hover:text-white'
                  }
                `}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Resumes</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${resumeOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {resumeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#0f1629]/95 backdrop-blur-xl shadow-2xl shadow-black/40"
                  >
                    <div className="p-1.5">
                      {/* Resumes section */}
                      <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-400/60">
                        Download Resume
                      </p>
                      {resumeDownloads.map((option) => (
                        <a
                          key={option.label}
                          href={option.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 hover:bg-white/[0.06] group"
                          onClick={() => setResumeOpen(false)}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/50 group-hover:bg-cyan-500/15 group-hover:text-cyan-400 transition-colors duration-150">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white/90">{option.label}</p>
                            <p className="text-xs text-white/40">{option.description}</p>
                          </div>
                          <ExternalLink className="h-3 w-3 text-white/20 group-hover:text-cyan-400/50 transition-colors" />
                        </a>
                      ))}

                      {/* Divider */}
                      <div className="my-1.5 h-px bg-white/[0.06]" />

                      {/* Profiles section */}
                      <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-400/60">
                        Connect
                      </p>
                      {profileLinks.map((option) => {
                        const Icon = option.icon === 'Linkedin' ? Linkedin : option.icon === 'Github' ? Github : Globe;
                        return (
                          <a
                            key={option.label}
                            href={option.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 hover:bg-white/[0.06] group"
                            onClick={() => setResumeOpen(false)}
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/50 group-hover:bg-cyan-500/15 group-hover:text-cyan-400 transition-colors duration-150">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-white/90">{option.label}</p>
                              <p className="text-xs text-white/40">{option.description}</p>
                            </div>
                            <ExternalLink className="h-3 w-3 text-white/20 group-hover:text-cyan-400/50 transition-colors" />
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`
                relative flex h-10 w-10 items-center justify-center rounded-lg
                transition-colors duration-200 md:hidden
                ${
                  isScrolled
                    ? 'bg-white/10 text-white/80 hover:bg-white/15'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }
              `}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ---- Mobile Menu Overlay ---- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-16 left-0 right-0 origin-top overflow-hidden border-b border-white/10 bg-black/80 backdrop-blur-xl"
            >
              <div className="mx-auto max-w-6xl px-4 py-4">
                {/* Nav Links */}
                <div className="flex flex-col gap-1">
                  {mobileLinks}
                </div>

                {/* Divider */}
                <div className="my-3 h-px bg-white/10" />

                {/* Resumes (mobile) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.25 }}
                  className="flex flex-col gap-1"
                >
                  <p className="px-4 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-400/50">
                    Download Resume
                  </p>
                  {resumeDownloads.map((option) => (
                    <a
                      key={option.label}
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors duration-200"
                    >
                      <FileText className="h-4 w-4" />
                      <span>{option.label}</span>
                    </a>
                  ))}

                  <div className="my-2 h-px bg-white/[0.06]" />

                  {/* Profiles (mobile) */}
                  <p className="px-4 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-400/50">
                    Connect
                  </p>
                  {profileLinks.map((option) => {
                    const Icon = option.icon === 'Linkedin' ? Linkedin : option.icon === 'Github' ? Github : Globe;
                    return (
                      <a
                        key={option.label}
                        href={option.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors duration-200"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </a>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
