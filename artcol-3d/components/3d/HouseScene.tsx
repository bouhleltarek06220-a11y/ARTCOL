"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { ACESFilmicToneMapping } from "three";
import { SponzaModel } from "./SponzaModel";
import { CanvasLoader } from "./CanvasLoader";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { SceneFallback } from "@/components/ui/SceneFallback";

/**
 * Démo « maison » réaliste : intérieur architectural (Sponza) éclairé par
 * une HDRI (image-based lighting), ombres dynamiques et post-processing
 * (bloom, vignette, anti-aliasing) pour un rendu vivant.
 *
 * Tout le Canvas est encapsulé dans ce composant client, avec alternative
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
      camera={{ position: [-8, 4, 1], fov: 60, near: 0.1, far: 100 }}
      gl={{
        antialias: false, // SMAA s'en charge dans le composer
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        powerPreference: "high-performance",
      }}
      aria-hidden
    >
      {/* Éclairage par image (HDRI locale) : remplit la scène + sert de fond */}
      <Environment files="/hdri/venice_sunset_1k.hdr" background backgroundBlurriness={0.04} />

      {/* Soleil directionnel pour les ombres portées et les rais de lumière */}
      <directionalLight
        position={[12, 18, 6]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />
      <ambientLight intensity={0.15} />

      <Suspense fallback={<CanvasLoader />}>
        <SponzaModel />
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 3, 0]}
        enablePan={false}
        minDistance={3}
        maxDistance={22}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 1.9}
      />

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.6} luminanceThreshold={1.0} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
