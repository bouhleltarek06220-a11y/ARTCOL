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

  // ----- Visite guidée (waypoints) -----
  /** Destination courante (point de vue où l'on se trouve / vers lequel on va). */
  tourId: string | null;
  /** Destination demandée que le TourController doit animer (jeton). */
  tourGo: { id: string; n: number } | null;
  /** Vrai pendant un glissement caméra (verrouille les clics + la marche). */
  tourBusy: boolean;
  /** Niveau à appliquer au joueur après le vol (−1/0/1/2), consommé une fois. */
  syncLevel: number | null;
  /** Pile des points de vue précédents (pour le bouton Retour). */
  history: string[];

  setPhase: (phase: Phase) => void;
  setZone: (zone: string) => void;
  setAim: (aim: Aim) => void;
  /** Ouvre l'inspection d'une œuvre (zoom cinématique géré par le Player). */
  inspect: (artwork: ArtworkMeta) => void;
  /** Ferme l'inspection et revient à la visite. */
  stopInspect: () => void;
  registerLock: (lock: () => void) => void;

  /** Vole vers une destination (empile l'historique). */
  flyTo: (id: string, level: number) => void;
  /** Revient au point de vue précédent. */
  flyBack: (levels: Record<string, number>) => void;
  /** Appelé par le TourController à l'arrivée (fin du glissement). */
  tourArrived: () => void;
  /** Consomme la synchro de niveau (lu par le Player). */
  consumeSyncLevel: () => void;
}

export const useVilla = create<VillaState>((set, get) => ({
  phase: "intro",
  zone: "Allée privée",
  artwork: null,
  aim: null,
  lock: undefined,

  tourId: "ext-entree", // on démarre au point de vue de l'entrée
  tourGo: null,
  tourBusy: false,
  syncLevel: null,
  history: [],

  setPhase: (phase) => set({ phase }),
  setZone: (zone) => set({ zone }),
  setAim: (aim) => set({ aim }),
  inspect: (artwork) => set({ artwork, phase: "inspecting", aim: null }),
  stopInspect: () => set({ artwork: null, phase: "visiting" }),
  registerLock: (lock) => set({ lock }),

  flyTo: (id, level) => {
    const s = get();
    if (s.tourBusy || id === s.tourId) return;
    const n = (s.tourGo?.n ?? 0) + 1;
    set({
      history: s.tourId ? [...s.history, s.tourId] : s.history,
      tourId: id,
      tourGo: { id, n },
      tourBusy: true,
      syncLevel: level,
    });
  },
  flyBack: (levels) => {
    const s = get();
    if (s.tourBusy || s.history.length === 0) return;
    const prev = s.history[s.history.length - 1];
    const n = (s.tourGo?.n ?? 0) + 1;
    set({
      history: s.history.slice(0, -1),
      tourId: prev,
      tourGo: { id: prev, n },
      tourBusy: true,
      syncLevel: levels[prev] ?? 0,
    });
  },
  tourArrived: () => set({ tourBusy: false }),
  consumeSyncLevel: () => set({ syncLevel: null }),
}));
