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
  inputValue: string;
  commandOutput: string[];

  setActiveSection: (section: SectionId) => void;
  executeCommand: (cmd: string) => void;
  toggleAudio: () => void;
  setLoaded: (loaded: boolean) => void;
  clearHistory: () => void;
  setInputValue: (v: string) => void;
  addCommandOutput: (line: string) => void;
  clearCommandOutput: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  activeSection: 'identification',
  isTransitioning: false,
  commandHistory: [],
  currentCommand: '',
  isLoaded: false,
  audioEnabled: false,
  previousSection: null,
  inputValue: '',
  commandOutput: [],

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

    // Add the command to output
    const outputLine = `> ${cmd}`;
    set((state) => ({
      commandOutput: [...state.commandOutput.slice(-8), outputLine],
    }));

    // Special commands
    if (normalizedCmd === 'clear') {
      set({ commandOutput: [] });
      return;
    }

    if (normalizedCmd === 'help') {
      set((state) => ({
        commandOutput: [
          ...state.commandOutput.slice(-8),
          outputLine,
          '[ AVAILABLE COMMANDS ]',
          ...COMMAND_MAP.map((m) => `  ${m.command.padEnd(12)} — ${m.description}`),
          '  clear           — Clear terminal output',
          '  download resume — Download resume PDF',
          '',
        ],
        commandHistory: [...state.commandHistory, 'help'],
        activeSection: 'identification',
        isTransitioning: true,
        previousSection: state.activeSection,
      }));
      setTimeout(() => set({ isTransitioning: false }), 600);
      return;
    }

    if (normalizedCmd === 'download resume') {
      try {
        const link = document.createElement('a');
        link.href = '/resumes/Farhan_Akhtar_AI_General.pdf';
        link.download = 'Farhan_Akhtar_AI_General.pdf';
        link.click();
        set((state) => ({
          commandOutput: [
            ...state.commandOutput.slice(-8),
            outputLine,
            '[ DOWNLOAD INITIATED ] Resume PDF downloading...',
            '',
          ],
          commandHistory: [...state.commandHistory, 'download resume'],
        }));
      } catch {
        set((state) => ({
          commandOutput: [
            ...state.commandOutput.slice(-8),
            outputLine,
            '[ ERROR ] File not found.',
            '',
          ],
        }));
      }
      return;
    }

    if (normalizedCmd === 'stats') {
      set((state) => ({
        commandOutput: [
          ...state.commandOutput.slice(-8),
          outputLine,
          `[ NAV ] Redirecting to TECH_STACK...`,
          '',
        ],
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
      set((state) => ({
        commandOutput: [
          ...state.commandOutput.slice(-8),
          outputLine,
          `[ NAV ] Switching to ${mapping.section.toUpperCase()}...`,
          '',
        ],
      }));
      get().setActiveSection(mapping.section);
      return;
    }

    // Unknown command
    set((state) => ({
      commandOutput: [
        ...state.commandOutput.slice(-8),
        outputLine,
        `[ ERROR ] Unknown command: "${cmd}" — type "help" for available commands.`,
        '',
      ],
    }));
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

  setInputValue: (v: string) => {
    set({ inputValue: v });
  },

  addCommandOutput: (line: string) => {
    set((state) => ({
      commandOutput: [...state.commandOutput.slice(-20), line],
    }));
  },

  clearCommandOutput: () => {
    set({ commandOutput: [] });
  },
}));
