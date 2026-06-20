import { create } from "zustand";
import type { ArtworkMeta } from "./world/artworks";

/**
 * État global de l'expérience villa-galerie (Zustand).
 * Architecture pensée pour grandir bloc par bloc (visite, inspection d'œuvre,
 * conversation avec le personnage…).
 */
export type Phase = "intro" | "visiting" | "inspecting" | "talking";

/** Élément actuellement visé au centre de l'écran (feedback réticule). */
export type Aim = "guide" | "artwork" | null;

interface VillaState {
  phase: Phase;
  zone: string;
  /** Œuvre en cours d'inspection (panneau cartel), sinon null. */
  artwork: ArtworkMeta | null;
  /** Ce que le réticule survole (alimenté par le Player, lu par le HUD). */
  aim: Aim;
  /** Verrouillage du pointeur, enregistré par le Player (déclenché par l'UI). */
  lock?: () => void;

  setPhase: (phase: Phase) => void;
  setZone: (zone: string) => void;
  setAim: (aim: Aim) => void;
  /** Ouvre l'inspection d'une œuvre (zoom cinématique géré par le Player). */
  inspect: (artwork: ArtworkMeta) => void;
  /** Ferme l'inspection et revient à la visite. */
  stopInspect: () => void;
  registerLock: (lock: () => void) => void;
}

export const useVilla = create<VillaState>((set) => ({
  phase: "intro",
  zone: "Allée privée",
  artwork: null,
  aim: null,
  lock: undefined,

  setPhase: (phase) => set({ phase }),
  setZone: (zone) => set({ zone }),
  setAim: (aim) => set({ aim }),
  inspect: (artwork) => set({ artwork, phase: "inspecting", aim: null }),
  stopInspect: () => set({ artwork: null, phase: "visiting" }),
  registerLock: (lock) => set({ lock }),
}));
