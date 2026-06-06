'use client';

import { create } from 'zustand';

export type SectionId =
  | 'identification'
  | 'seismic'
  | 'agents'
  | 'deep'
  | 'projects'
  | 'career'
  | 'stack'
  | 'certs'
  | 'recruiter'
  | 'contact';

export const SECTION_DISPLAY_NAMES: Record<SectionId, string> = {
  identification: 'IDENTIFICATION',
  seismic: 'SEISMIC_PREDICTION',
  agents: 'AGENTIC_AI',
  deep: 'DEEP_LEARNING',
  projects: 'PROJECT_ARCHIVE',
  career: 'CAREER_LOG',
  stack: 'TECH_STACK',
  certs: 'CERT_DATABASE',
  recruiter: 'RECRUITER_ACCESS',
  contact: 'COMM_CHANNEL',
};

export const SECTION_ICONS: Record<SectionId, string> = {
  identification: '◉',
  seismic: '◈',
  agents: '⬡',
  deep: '⬢',
  projects: '▣',
  career: '▤',
  stack: '▥',
  certs: '◆',
  recruiter: '⬟',
  contact: '✦',
};

export const ALL_SECTIONS: SectionId[] = [
  'identification',
  'seismic',
  'agents',
  'deep',
  'projects',
  'career',
  'stack',
  'certs',
  'recruiter',
  'contact',
];

interface CommandMapping {
  command: string;
  section: SectionId;
  description: string;
}

export const COMMAND_MAP: CommandMapping[] = [
  { command: 'home', section: 'identification', description: 'Return to identification terminal' },
  { command: 'projects', section: 'projects', description: 'Access project archive' },
  { command: 'resume', section: 'career', description: 'View career history' },
  { command: 'seismic', section: 'seismic', description: 'Seismic Response Prediction details' },
  { command: 'agents', section: 'agents', description: 'Agentic AI systems' },
  { command: 'deep', section: 'deep', description: 'Deep Learning models' },
  { command: 'stack', section: 'stack', description: 'Technology stack' },
  { command: 'cert', section: 'certs', description: 'Certification database' },
  { command: 'recruiter', section: 'recruiter', description: 'Recruiter access panel' },
  { command: 'contact', section: 'contact', description: 'Communication channels' },
];

interface TerminalState {
  activeSection: SectionId;
  isTransitioning: boolean;
  commandHistory: string[];
  currentCommand: string;
  isLoaded: boolean;
  audioEnabled: boolean;
  previousSection: SectionId | null;

  setActiveSection: (section: SectionId) => void;
  executeCommand: (cmd: string) => void;
  toggleAudio: () => void;
  setLoaded: (loaded: boolean) => void;
  clearHistory: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  activeSection: 'identification',
  isTransitioning: false,
  commandHistory: [],
  currentCommand: '',
  isLoaded: false,
  audioEnabled: false,
  previousSection: null,

  setActiveSection: (section: SectionId) => {
    const { activeSection, isTransitioning } = get();
    if (section === activeSection || isTransitioning) return;

    set({
      previousSection: activeSection,
      activeSection: section,
      isTransitioning: true,
      commandHistory: [...get().commandHistory, section],
    });

    setTimeout(() => {
      set({ isTransitioning: false });
    }, 600);
  },

  executeCommand: (cmd: string) => {
    const normalizedCmd = cmd.trim().toLowerCase();

    // Special commands
    if (normalizedCmd === 'clear') {
      set({ commandHistory: [] });
      return;
    }

    if (normalizedCmd === 'help') {
      set((state) => ({
        commandHistory: [...state.commandHistory, 'help'],
        activeSection: 'identification',
        isTransitioning: true,
        previousSection: state.activeSection,
      }));
      setTimeout(() => set({ isTransitioning: false }), 600);
      return;
    }

    if (normalizedCmd === 'download resume') {
      // Trigger resume download
      const link = document.createElement('a');
      link.href = '/resumes/Farhan_Akhtar_AI_General.pdf';
      link.download = 'Farhan_Akhtar_AI_General.pdf';
      link.click();
      set((state) => ({
        commandHistory: [...state.commandHistory, 'download resume'],
      }));
      return;
    }

    if (normalizedCmd === 'stats') {
      set((state) => ({
        commandHistory: [...state.commandHistory, 'stats'],
        activeSection: 'stack',
        isTransitioning: true,
        previousSection: state.activeSection,
      }));
      setTimeout(() => set({ isTransitioning: false }), 600);
      return;
    }

    // Map command to section
    const mapping = COMMAND_MAP.find(
      (m) => m.command === normalizedCmd
    );

    if (mapping) {
      get().setActiveSection(mapping.section);
      return;
    }

    // Unknown command — do nothing or show help
    console.warn(`[TERMINAL] Unknown command: ${cmd}`);
  },

  toggleAudio: () => {
    set((state) => ({ audioEnabled: !state.audioEnabled }));
  },

  setLoaded: (loaded: boolean) => {
    set({ isLoaded: loaded });
  },

  clearHistory: () => {
    set({ commandHistory: [] });
  },
}));
