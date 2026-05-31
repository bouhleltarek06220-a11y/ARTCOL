import { create } from 'zustand';
import { zones } from './data/zones';

export type Phase = 'loading' | 'gate' | 'entering' | 'inside';
export type TourPhase = 'idle' | 'dungeon' | 'transition' | 'cathedral' | 'done';

interface ExperienceState {
  phase: Phase;
  progress: number;
  muted: boolean;
  reducedMotion: boolean;
  selectedZone: string | null;
  selectedCharacter: { id: string; name: string; lines: string[]; pos: [number, number, number] } | null;
  tourPhase: TourPhase;
  /** Timestamp (ms) auquel la visite caméra commence vraiment dans le donjon.
   *  Sert au reveal progressif des titres de portes pendant le tour. */
  tourCameraStartedAt: number | null;
  setProgress: (p: number) => void;
  ready: () => void;
  enter: () => void;
  arrived: () => void;
  skip: () => void;
  toggleMute: () => void;
  selectZone: (id: string) => void;
  closeZone: () => void;
  stepZone: (dir: 1 | -1) => void;
  selectCharacter: (c: { id: string; name: string; lines: string[]; pos: [number, number, number] }) => void;
  closeCharacter: () => void;
  startTour: () => void;
  setTourPhase: (p: TourPhase) => void;
  endTour: () => void;
  markTourCameraStart: () => void;
}

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// On garde l'état muet en localStorage pour qu'il survive à la navigation
// entre /experience-v3/ et /experience-v4/ pendant l'intro guidée.
const initialMuted = typeof window !== 'undefined'
  ? localStorage.getItem('lc-muted') !== 'false'
  : true;

export const useExperience = create<ExperienceState>((set, get) => ({
  phase: 'loading',
  progress: 0,
  muted: initialMuted,
  reducedMotion: prefersReduced,
  selectedZone: null,
  selectedCharacter: null,
  setProgress: (p) => set({ progress: Math.max(get().progress, p) }),
  ready: () => set((s) => (s.phase === 'loading' ? { phase: 'gate' } : {})),
  enter: () =>
    set((s) => (s.phase === 'gate' ? { phase: get().reducedMotion ? 'inside' : 'entering' } : {})),
  arrived: () => set((s) => (s.phase === 'entering' ? { phase: 'inside' } : {})),
  skip: () => set({ phase: 'inside' }),
  toggleMute: () => set((s) => {
    const next = !s.muted;
    if (typeof window !== 'undefined') localStorage.setItem('lc-muted', String(next));
    return { muted: next };
  }),
  selectZone: (id) => set({ selectedZone: id }),
  closeZone: () => set({ selectedZone: null }),
  stepZone: (dir) =>
    set((s) => {
      if (!s.selectedZone) return {};
      const i = zones.findIndex((z) => z.id === s.selectedZone);
      if (i < 0) return {};
      const next = (i + dir + zones.length) % zones.length;
      return { selectedZone: zones[next].id };
    }),
  selectCharacter: (c) => set({ selectedCharacter: c }),
  closeCharacter: () => set({ selectedCharacter: null }),
  tourPhase: 'idle',
  tourCameraStartedAt: null,
  startTour: () => set({ tourPhase: 'dungeon', tourCameraStartedAt: null }),
  setTourPhase: (p) => set({ tourPhase: p }),
  endTour: () => set({ tourPhase: 'done' }),
  markTourCameraStart: () => set({ tourCameraStartedAt: Date.now() }),
}));
