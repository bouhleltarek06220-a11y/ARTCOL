"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useVilla } from "../store";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Caméra d'ambiance pendant l'écran d'intro : lent travelling orbital autour
 * de la villa au coucher de soleil (derrière l'overlay AMAVYA). Dès que la
 * visite commence (phase « visiting »), le <Player/> prend la main.
 */
export function CameraRig() {
  const { camera } = useThree();
  const phase = useVilla((s) => s.phase);
  const reduce = usePrefersReducedMotion();
  const target = useMemo(() => new Vector3(0, 4.2, -2), []);
  const t = useRef(0);

  useEffect(() => {
    camera.position.set(18, 4.5, 19);
    camera.lookAt(target);
  }, [camera, target]);

  // Travelling orbital plus bas et plus proche : cadre la villa contre
  // l'horizon doré plutôt que le ciel zénithal clair.
  useFrame((_, delta) => {
    if (phase !== "intro") return;
    if (!reduce) t.current += delta * 0.045;
    const a = t.current;
    camera.position.set(Math.sin(a) * 19 + 1, 4.6 + Math.sin(a * 0.6) * 0.8, Math.cos(a) * 19);
    camera.lookAt(target);
  });

  return null;
}
