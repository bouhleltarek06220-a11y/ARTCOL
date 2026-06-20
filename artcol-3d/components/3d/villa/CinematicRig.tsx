"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/**
 * Caméra cinématographique : à l'arrivée, travelling fluide depuis l'allée
 * vers la villa, puis passage en contrôle libre (orbite). Respecte
 * `prefers-reduced-motion` (démarrage direct sur la vue héro).
 */
export function CinematicRig({
  target = [0, 3.4, -2],
  skip = false,
  onDone,
}: {
  target?: [number, number, number];
  skip?: boolean;
  onDone?: () => void;
}) {
  const { camera } = useThree();
  const reduce = usePrefersReducedMotion();

  const start = useMemo(() => new Vector3(2, 1.9, 34), []);
  const hero = useMemo(() => new Vector3(19, 10.5, 27), []);
  const look = useMemo(() => new Vector3(...target), [target]);

  const t = useRef(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce || skip) {
      camera.position.copy(hero);
      camera.lookAt(look);
      setDone(true);
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    if (done) return;
    t.current = Math.min(1, t.current + delta / 6.5);
    camera.position.lerpVectors(start, hero, easeInOutCubic(t.current));
    camera.lookAt(look);
    if (t.current >= 1) {
      setDone(true);
      onDone?.();
    }
  });

  if (!done) return null;

  return (
    <OrbitControls
      makeDefault
      target={target}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={10}
      maxDistance={70}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.15}
    />
  );
}
