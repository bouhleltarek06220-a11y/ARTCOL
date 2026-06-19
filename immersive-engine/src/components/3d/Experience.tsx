"use client";

/**
 * Canvas racine AMAVYA : galaxie + œuvres exposées + caméra sur rail + post-traitement.
 * Rendu client uniquement (WebGL) — voir page.tsx (dynamic ssr:false).
 */
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import Galaxy from "./Galaxy";
import Exhibit from "./Exhibit";
import Robot from "./Robot";
import CameraRig from "./CameraRig";
import Player from "./Player";
import Ground from "./Ground";
import { CREATIONS } from "@/data/experience";
import { TOTAL } from "@/lib/path";
import { useExperience } from "@/stores/useExperience";

export default function Experience() {
  const setTotal = useExperience((s) => s.setTotal);
  const mode = useExperience((s) => s.mode);
  useEffect(() => setTotal(TOTAL), [setTotal]);

  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      dpr={[1, 1.75]}
      camera={{ fov: 58, near: 0.1, far: 400, position: [0, 1.3, 10] }}
      style={{ position: "fixed", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Galaxy />
        {/* gardien : VRAI modèle 3D animé (glTF) */}
        <Robot position={[5.4, -3, -11]} scale={1.5} clip="Wave" spin={0.35} accent="#7CFF3D" />
        {CREATIONS.map((n) => (
          <Exhibit key={n.id} node={n} />
        ))}

        {/* mode marche 1re personne : physique + sol + joueur */}
        {mode === "explore" && (
          <Physics gravity={[0, -9.81, 0]}>
            <Ground />
            <Player />
          </Physics>
        )}
      </Suspense>

      {/* mode guidé : caméra sur rail */}
      {mode === "rail" && <CameraRig />}

      <EffectComposer>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.2} luminanceSmoothing={0.35} />
        <Vignette eskil={false} offset={0.22} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
