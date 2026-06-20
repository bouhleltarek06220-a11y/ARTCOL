/**
 * État global de l'expérience (Zustand).
 * `target` = position visée par les inputs (scroll/clavier/clic) sur le rail [0..1].
 * `t`      = position lissée réellement rendue (mise à jour par le CameraRig).
 * La caméra suit une courbe ; on ne manipule jamais la caméra ailleurs qu'ici + CameraRig.
 */
import { create } from "zustand";

export type Quality = "high" | "low";
export type Mode = "rail" | "explore";

type ExperienceState = {
  t: number;
  target: number;
  active: number;        // index de la station la plus proche
  total: number;         // nombre de stations
  quality: Quality;
  mode: Mode;            // "rail" = caméra guidée · "explore" = marche 1re personne
  detail: string | null; // id de la station ouverte en vue détaillée
  targeted: string | null; // id de l'œuvre visée par le viseur (mode explore)

  setTotal: (n: number) => void;
  setTarget: (v: number) => void;
  nudge: (d: number) => void;
  goTo: (index: number) => void;
  setT: (v: number) => void;
  setQuality: (q: Quality) => void;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  openDetail: (id: string | null) => void;
  setTargeted: (id: string | null) => void;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const useExperience = create<ExperienceState>((set, get) => ({
  t: 0,
  target: 0,
  active: 0,
  total: 1,
  quality: "high",
  mode: "rail",
  detail: null,
  targeted: null,

  setTotal: (n) => set({ total: Math.max(1, n) }),
  setTarget: (v) => set({ target: clamp01(v) }),
  nudge: (d) => set({ target: clamp01(get().target + d) }),
  goTo: (index) => {
    const { total } = get();
    const v = total > 1 ? index / (total - 1) : 0;
    set({ target: clamp01(v) });
  },
  setT: (v) => {
    const { total } = get();
    const active = total > 1 ? Math.round(v * (total - 1)) : 0;
    set({ t: v, active });
  },
  setQuality: (q) => set({ quality: q }),
  setMode: (m) => set({ mode: m }),
  toggleMode: () => set({ mode: get().mode === "rail" ? "explore" : "rail" }),
  openDetail: (id) => set({ detail: id }),
  setTargeted: (id) => set({ targeted: id }),
}));
