import { create } from 'zustand';

export type Phase = 'loading' | 'gate' | 'entering' | 'inside';

interface ExperienceState {
  phase: Phase;
  progress: number;
  muted: boolean;
  reducedMotion: boolean;
  selectedZone: string | null;
  setProgress: (p: number) => void;
  ready: () => void;
  enter: () => void;
  arrived: () => void;
  skip: () => void;
  toggleMute: () => void;
  selectZone: (id: string) => void;
  closeZone: () => void;
}

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useExperience = create<ExperienceState>((set, get) => ({
  phase: 'loading',
  progress: 0,
  muted: true,
  reducedMotion: prefersReduced,
  selectedZone: null,
  setProgress: (p) => set({ progress: Math.max(get().progress, p) }),
  ready: () => set((s) => (s.phase === 'loading' ? { phase: 'gate' } : {})),
  enter: () =>
    set((s) => (s.phase === 'gate' ? { phase: get().reducedMotion ? 'inside' : 'entering' } : {})),
  arrived: () => set((s) => (s.phase === 'entering' ? { phase: 'inside' } : {})),
  skip: () => set({ phase: 'inside' }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  selectZone: (id) => set({ selectedZone: id }),
  closeZone: () => set({ selectedZone: null }),
}));
