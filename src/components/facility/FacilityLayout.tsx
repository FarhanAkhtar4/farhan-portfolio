'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  User,
  Activity,
  Brain,
  Cpu,
  FolderOpen,
  Briefcase,
  Wrench,
  Award,
  Download,
  Mail,
  Volume2,
  VolumeX,
  ChevronRight,
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import EntryExperience from './EntryExperience';
import CommandCenter from './CommandCenter';
import SeismicLab from './SeismicLab';
import AgenticAICenter from './AgenticAICenter';
import DeepLearningChamber from './DeepLearningChamber';
import ProjectVault from './ProjectVault';
import CareerObservatory from './CareerObservatory';
import AISystemsLab from './AISystemsLab';
import CertificationArchive from './CertificationArchive';
import RecruiterCenter from './RecruiterCenter';
import ContactTerminal from './ContactTerminal';

interface Room {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const rooms: Room[] = [
  { id: 'entry', label: 'Entry', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'command', label: 'Command Center', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'seismic', label: 'Seismic Lab', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'agentic', label: 'Agentic AI', icon: <Brain className="w-3.5 h-3.5" /> },
  { id: 'deeplearning', label: 'Deep Learning', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'projects', label: 'Project Vault', icon: <FolderOpen className="w-3.5 h-3.5" /> },
  { id: 'career', label: 'Career', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: 'skills', label: 'AI Systems', icon: <Wrench className="w-3.5 h-3.5" /> },
  { id: 'certs', label: 'Certifications', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'recruiter', label: 'Recruiter', icon: <Download className="w-3.5 h-3.5" /> },
  { id: 'contact', label: 'Contact', icon: <Mail className="w-3.5 h-3.5" /> },
];

export default function FacilityLayout() {
  const [activeRoom, setActiveRoom] = useState(0);
  const [entered, setEntered] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [musicMuted, setMusicMuted] = useState(true);

  const scrollToRoom = useCallback((index: number) => {
    setActiveRoom(index);
    const element = document.getElementById(rooms[index].id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Track active room based on scroll position
  useEffect(() => {
    if (!entered) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const index = Math.round(scrollY / windowHeight);
      if (index >= 0 && index < rooms.length && index !== activeRoom) {
        setActiveRoom(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [entered, activeRoom]);

  const handleEnter = useCallback(() => {
    setEntered(true);
    setTimeout(() => scrollToRoom(1), 100);
  }, [scrollToRoom]);

  return (
    <div className="relative">
      <ParticleBackground />

      {/* Top Bar */}
      <AnimatePresence>
        {entered && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 glass-nav"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              <button
                onClick={() => scrollToRoom(0)}
                className="text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
              >
                <span className="hidden sm:inline">FARHAN AI RESEARCH FACILITY</span>
                <span className="sm:hidden">FARHAN AI</span>
              </button>
              <button
                onClick={() => setMusicMuted(!musicMuted)}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--accent-purple)] hover:border-[rgba(139,92,246,0.3)] transition-all"
                aria-label={musicMuted ? 'Unmute' : 'Mute'}
              >
                {musicMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Side Navigation */}
      <AnimatePresence>
        {entered && (
          <motion.nav
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1.5"
          >
            {/* Toggle expand on mobile */}
            <button
              onClick={() => setNavExpanded(!navExpanded)}
              className="mb-1 w-7 h-7 flex items-center justify-center rounded-full border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-all md:hidden"
              aria-label="Toggle navigation"
            >
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${navExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Nav dots */}
            {rooms.map((room, index) => (
              <button
                key={room.id}
                onClick={() => scrollToRoom(index)}
                className="group relative"
                aria-label={`Go to ${room.label}`}
              >
                {/* Tooltip (visible on hover / expanded on mobile) */}
                <span
                  className={`absolute right-full mr-2 whitespace-nowrap text-xs font-mono text-[var(--text-secondary)] bg-[rgba(3,7,18,0.9)] border border-[var(--border-glass)] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    navExpanded ? '!opacity-100' : ''
                  }`}
                >
                  {room.label}
                </span>
                {/* Dot */}
                <span
                  className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                    index === activeRoom
                      ? 'w-3 h-3 bg-[var(--accent-cyan)] shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'w-2 h-2 bg-[rgba(148,163,184,0.3)] hover:bg-[rgba(148,163,184,0.6)]'
                  }`}
                >
                  {index === activeRoom && (
                    <span className="absolute w-5 h-5 rounded-full border border-[rgba(6,182,212,0.3)] animate-ping" />
                  )}
                </span>
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Scrollable Content */}
      <main className="relative z-10">
        {/* Room 0: Entry */}
        <section id="entry" className="min-h-screen flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!entered ? (
              <EntryExperience onEnter={handleEnter} />
            ) : (
              <motion.div
                key="entered-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-screen"
              />
            )}
          </AnimatePresence>
        </section>

        {/* Room 1: Command Center */}
        <section id="command" className="min-h-screen">
          <CommandCenter />
        </section>

        {/* Room 2: Seismic Lab */}
        <section id="seismic" className="min-h-screen">
          <SeismicLab />
        </section>

        {/* Room 3: Agentic AI */}
        <section id="agentic" className="min-h-screen">
          <AgenticAICenter />
        </section>

        {/* Room 4: Deep Learning */}
        <section id="deeplearning" className="min-h-screen">
          <DeepLearningChamber />
        </section>

        {/* Room 5: Project Vault */}
        <section id="projects" className="min-h-screen">
          <ProjectVault />
        </section>

        {/* Room 6: Career Observatory */}
        <section id="career" className="min-h-screen">
          <CareerObservatory />
        </section>

        {/* Room 7: AI Systems Lab */}
        <section id="skills" className="min-h-screen">
          <AISystemsLab />
        </section>

        {/* Room 8: Certification Archive */}
        <section id="certs" className="min-h-screen">
          <CertificationArchive />
        </section>

        {/* Room 9: Recruiter Center */}
        <section id="recruiter" className="min-h-screen">
          <RecruiterCenter />
        </section>

        {/* Room 10: Contact Terminal */}
        <section id="contact" className="min-h-screen">
          <ContactTerminal />
        </section>
      </main>
    </div>
  );
}
