"use client";

/**
 * Le <Canvas> racine : caméra, environnement, rig, post-traitement (glow néon).
 * Monté côté client uniquement (voir page.tsx → dynamic ssr:false).
 */
import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Environment from "./Environment";
import CameraRig from "./CameraRig";
import { TOTAL } from "@/lib/path";
import { useExperience } from "@/stores/useExperience";
import { THEME } from "@/data/experience";

export default function Experience() {
  const setTotal = useExperience((s) => s.setTotal);
  useEffect(() => setTotal(TOTAL), [setTotal]);

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 300, position: [0, 1.3, 6] }}
      style={{ position: "fixed", inset: 0 }}
    >
      <Environment />
      <CameraRig />

      <EffectComposer>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
