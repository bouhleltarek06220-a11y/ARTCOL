"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { ThreeElements } from "@react-three/fiber";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type SpinningKnotProps = ThreeElements["mesh"];

/**
 * Mesh de démonstration animé via `useFrame` (et non via le state React,
 * pour éviter les re-rendus). L'animation est coupée quand l'utilisateur
 * a activé `prefers-reduced-motion`.
 */
export function SpinningKnot(props: SpinningKnotProps) {
  const meshRef = useRef<Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || prefersReducedMotion) return;

    // `delta` (secondes) rend l'animation indépendante du framerate.
    mesh.rotation.x += delta * 0.3;
    mesh.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow {...props}>
      <torusKnotGeometry args={[1, 0.35, 220, 32]} />
      <meshStandardMaterial color="#6366f1" roughness={0.25} metalness={0.45} />
    </mesh>
  );
}
