"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { ACESFilmicToneMapping } from "three";
import { VillaArchitecture } from "./villa/VillaArchitecture";
import { VillaGrounds } from "./villa/VillaGrounds";
import { CinematicRig } from "./villa/CinematicRig";
import { CanvasLoader } from "./CanvasLoader";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { SceneFallback } from "@/components/ui/SceneFallback";

/**
 * Expérience extérieure : villa d'art contemporain au coucher de soleil.
 * Ciel HDRI premium, soleil rasant doré, éclairage architectural, piscine à
 * débordement miroir, caméra cinématographique puis contrôle libre, et
 * post-traitement (bloom, profondeur de champ, vignette, anti-aliasing).
 *
 * Tout le Canvas est encapsulé dans ce composant client, avec une alternative
 * sans 3D si WebGL est indisponible.
 */
export function HouseScene() {
  const hasWebGL = useHasWebGL();

  if (hasWebGL === null) {
    return <div className="h-full w-full" aria-hidden />;
  }
  if (hasWebGL === false) {
    return <SceneFallback />;
  }

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [2, 1.9, 34], fov: 42, near: 0.1, far: 600 }}
      gl={{
        antialias: false,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: "high-performance",
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Ciel + éclairage d'ambiance : HDRI coucher de soleil premium. */}
        <Environment
          files="/hdri/venice_sunset_2k.hdr"
          background
          backgroundBlurriness={0.02}
          environmentIntensity={1.0}
        />

        {/* Soleil rasant doré (ombres longues du golden hour). */}
        <directionalLight
          position={[-34, 11, 24]}
          intensity={2.6}
          color="#ffd39a"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-camera-near={1}
          shadow-camera-far={120}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />
        <ambientLight intensity={0.18} color="#ffe6c4" />

        <VillaArchitecture />
        <VillaGrounds />

        {/* Ombre de contact douce sous la villa (ancrage réaliste). */}
        <ContactShadows
          position={[0, 0.04, 0]}
          scale={70}
          resolution={1024}
          far={20}
          blur={2.6}
          opacity={0.5}
          color="#1c150c"
        />
      </Suspense>

      <CinematicRig target={[0, 3.4, -2]} />

      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={0.02} focalLength={0.035} bokehScale={1.6} />
        <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.9} luminanceSmoothing={0.25} />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
