import { create } from 'zustand';

export type Phase = 'loading' | 'gate' | 'entering' | 'inside';

interface ExperienceState {
  phase: Phase;
  progress: number;        // 0..1 chargement
  muted: boolean;
  reducedMotion: boolean;
  setProgress: (p: number) => void;
  ready: () => void;       // chargement terminé -> écran porte
  enter: () => void;       // clic "Entrer" -> animation cinématique
  arrived: () => void;     // fin de l'animation -> hall
  skip: () => void;        // "Passer l'intro"
  toggleMute: () => void;
}

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useExperience = create<ExperienceState>((set, get) => ({
  phase: 'loading',
  progress: 0,
  muted: true,
  reducedMotion: prefersReduced,
  setProgress: (p) => set({ progress: Math.max(get().progress, p) }),
  ready: () => set((s) => (s.phase === 'loading' ? { phase: 'gate' } : {})),
  enter: () => set((s) => (s.phase === 'gate' ? { phase: get().reducedMotion ? 'inside' : 'entering' } : {})),
  arrived: () => set((s) => (s.phase === 'entering' ? { phase: 'inside' } : {})),
  skip: () => set({ phase: 'inside' }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
}));
