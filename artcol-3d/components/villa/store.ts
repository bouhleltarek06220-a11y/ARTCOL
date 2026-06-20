import { create } from "zustand";

/**
 * État global de l'expérience villa-galerie (Zustand).
 * Architecture pensée pour grandir bloc par bloc (visite, inspection d'œuvre,
 * conversation avec le personnage…).
 */
export type Phase = "intro" | "visiting" | "inspecting" | "talking";

interface VillaState {
  phase: Phase;
  zone: string;
  /** Verrouillage du pointeur, enregistré par le Player (déclenché par l'UI). */
  lock?: () => void;

  setPhase: (phase: Phase) => void;
  setZone: (zone: string) => void;
  registerLock: (lock: () => void) => void;
}

export const useVilla = create<VillaState>((set) => ({
  phase: "intro",
  zone: "Allée privée",
  lock: undefined,

  setPhase: (phase) => set({ phase }),
  setZone: (zone) => set({ zone }),
  registerLock: (lock) => set({ lock }),
}));
