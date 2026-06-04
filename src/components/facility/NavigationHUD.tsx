'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Lock,
} from 'lucide-react';
import { useFacilityStore } from '@/store/facility-store';

const ROOMS = [
  { id: 'entry', label: 'Entry', icon: Shield },
  { id: 'command', label: 'Command Center', icon: User },
  { id: 'seismic', label: 'Seismic Lab', icon: Activity },
  { id: 'agentic', label: 'Agentic AI', icon: Brain },
  { id: 'deeplearning', label: 'Deep Learning', icon: Cpu },
  { id: 'projects', label: 'Project Vault', icon: FolderOpen },
  { id: 'career', label: 'Career', icon: Briefcase },
  { id: 'skills', label: 'AI Systems', icon: Wrench },
  { id: 'certs', label: 'Certifications', icon: Award },
  { id: 'recruiter', label: 'Recruiter', icon: Download },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export default function NavigationHUD() {
  const currentRoom = useFacilityStore((s) => s.currentRoom);
  const isTransitioning = useFacilityStore((s) => s.isTransitioning);
  const hasEntered = useFacilityStore((s) => s.hasEntered);
  const setCurrentRoom = useFacilityStore((s) => s.setCurrentRoom);
  const [navOpen, setNavOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  const navigateTo = (index: number) => {
    if (!isTransitioning && hasEntered) {
      setCurrentRoom(index);
      setNavOpen(false);
    }
  };

  const handleEnter = () => {
    (window as unknown as Record<string, (() => void) | undefined>).__facilityEnter?.();
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Entry overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            key="entry-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-2"
              >
                <Lock className="w-6 h-6 text-cyan-400 mx-auto mb-4 opacity-60" />
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="text-cyan-400">FARHAN</span>{' '}
                  <span className="text-slate-300">AI RESEARCH</span>{' '}
                  <span className="text-amber-400">FACILITY</span>
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="text-xs sm:text-sm text-slate-500 font-mono mb-8"
              >
                IMMERSIVE PORTFOLIO EXPERIENCE
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnter}
                className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono hover:bg-cyan-500/20 transition-colors"
              >
                INITIALIZE ACCESS
              </motion.button>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1, delay: 2.5 }}
                className="text-[10px] text-slate-600 font-mono mt-4"
              >
                Scroll or use navigation to explore the facility
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <AnimatePresence>
        {hasEntered && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0 pointer-events-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[rgba(3,7,18,0.7)] backdrop-blur-md border-b border-[rgba(6,182,212,0.1)]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400/60 uppercase">
                  Room {String(currentRoom).padStart(2, '0')}
                </span>
                <span className="text-slate-500/30">|</span>
                <span className="text-xs font-mono text-slate-400">
                  {ROOMS[currentRoom]?.label}
                </span>
              </div>
              <button
                onClick={() => setMuted(!muted)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-700/50 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Right navigation */}
      <AnimatePresence>
        {hasEntered && (
          <motion.nav
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-auto"
          >
            {ROOMS.map((room, i) => {
              const Icon = room.icon;
              const active = i === currentRoom;
              return (
                <button
                  key={room.id}
                  onClick={() => navigateTo(i)}
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    active
                      ? 'w-4 h-4 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                      : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  title={room.label}
                >
                  {active && (
                    <span className="absolute w-6 h-6 rounded-full border border-cyan-400/30 animate-ping" />
                  )}
                  <span
                    className={`absolute right-full mr-3 whitespace-nowrap text-[10px] font-mono text-slate-400 bg-[rgba(3,7,18,0.9)] border border-slate-700/50 rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity pointer-events-none ${
                      active ? '!opacity-100 !text-cyan-400 !border-cyan-500/30' : ''
                    }`}
                  >
                    {room.label}
                  </span>
                </button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Bottom arrows */}
      <AnimatePresence>
        {hasEntered && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto"
          >
            <button
              onClick={() => navigateTo(Math.max(0, currentRoom - 1))}
              disabled={currentRoom === 0 || isTransitioning}
              className="w-10 h-10 rounded-full border border-slate-700/50 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-600">
              {currentRoom + 1} / {ROOMS.length}
            </span>
            <button
              onClick={() => navigateTo(Math.min(ROOMS.length - 1, currentRoom + 1))}
              disabled={currentRoom === ROOMS.length - 1 || isTransitioning}
              className="w-10 h-10 rounded-full border border-slate-700/50 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll/keyboard handler */}
      {hasEntered && <WheelListener />}
    </div>
  );
}

function WheelListener() {
  const currentRoom = useFacilityStore((s) => s.currentRoom);
  const isTransitioning = useFacilityStore((s) => s.isTransitioning);
  const setCurrentRoom = useFacilityStore((s) => s.setCurrentRoom);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (e.deltaY > 30) {
          setCurrentRoom(Math.min(10, currentRoom + 1));
        } else if (e.deltaY < -30) {
          setCurrentRoom(Math.max(0, currentRoom - 1));
        }
      }, 50);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setCurrentRoom(Math.min(10, currentRoom + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setCurrentRoom(Math.max(0, currentRoom - 1));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentRoom, isTransitioning, setCurrentRoom]);

  return null;
}
