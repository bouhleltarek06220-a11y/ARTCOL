"use client";

import { useEffect, useState } from "react";

/**
 * Détecte un appareil principalement tactile (mobile / tablette) côté client.
 * Sert à activer les contrôles tactiles et à masquer les contrôles souris/clavier.
 */
export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const coarse =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches || "ontouchstart" in window);
    setTouch(!!coarse);
  }, []);
  return touch;
}
