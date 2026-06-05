import { create } from 'zustand';

export interface RoomConfig {
  id: string;
  label: string;
  position: [number, number, number];
}

export const ROOM_POSITIONS: RoomConfig[] = [
  { id: 'entry', label: 'Entry', position: [0, 2, 30] },
  { id: 'command', label: 'Command Center', position: [0, 2, -10] },
  { id: 'seismic', label: 'Seismic Lab', position: [0, 2, -50] },
  { id: 'agentic', label: 'Agentic AI', position: [0, 2, -90] },
  { id: 'deeplearning', label: 'Deep Learning', position: [0, 2, -130] },
  { id: 'projects', label: 'Project Vault', position: [0, 2, -170] },
  { id: 'career', label: 'Career', position: [0, 2, -210] },
  { id: 'skills', label: 'AI Systems', position: [0, 2, -250] },
  { id: 'certs', label: 'Certifications', position: [0, 2, -290] },
  { id: 'recruiter', label: 'Recruiter', position: [0, 2, -330] },
  { id: 'contact', label: 'Contact', position: [0, 2, -370] },
];

interface FacilityState {
  currentRoom: number;
  isTransitioning: boolean;
  hasEntered: boolean;
  setCurrentRoom: (index: number) => void;
  setTransitioning: (val: boolean) => void;
  setHasEntered: (val: boolean) => void;
}

export const useFacilityStore = create<FacilityState>((set) => ({
  currentRoom: 0,
  isTransitioning: false,
  hasEntered: false,
  setCurrentRoom: (index) => set({ currentRoom: index }),
  setTransitioning: (val) => set({ isTransitioning: val }),
  setHasEntered: (val) => set({ hasEntered: val }),
}));
