"use client";

/**
 * Transforme TOUS les inputs en déplacement sur le rail (pas de scroll 2D classique) :
 *  1. molette / trackpad  → avance en profondeur
 *  2. flèches / Z,S,W     → avance / recule
 *  3. tactile (swipe vertical) → avance / recule
 * Le clic sur un point d'intérêt est géré côté UI (store.goTo).
 */
import { useEffect } from "react";
import { useExperience } from "@/stores/useExperience";

export function useNavigation() {
  useEffect(() => {
    const railOnly = () => useExperience.getState().mode === "rail";
    const nudge = (d: number) => useExperience.getState().nudge(d);

    const onWheel = (e: WheelEvent) => { if (railOnly()) nudge(e.deltaY * 0.00022); };

    const onKey = (e: KeyboardEvent) => {
      if (!railOnly()) return; // en marche, le clavier est géré par KeyboardControls
      if (["ArrowDown", "ArrowRight"].includes(e.key)) nudge(0.05);
      if (["ArrowUp", "ArrowLeft"].includes(e.key)) nudge(-0.05);
    };

    let lastY: number | null = null;
    const onTouchStart = (e: TouchEvent) => (lastY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (lastY === null || !railOnly()) return;
      const y = e.touches[0].clientY;
      nudge((lastY - y) * 0.0011);
      lastY = y;
    };
    const onTouchEnd = () => (lastY = null);

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
}
