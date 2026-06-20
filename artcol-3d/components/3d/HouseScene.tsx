"use client";

import { Suspense, useRef, useState } from "react";
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
import { VillaInterior } from "./villa/VillaInterior";
import { VillaGrounds } from "./villa/VillaGrounds";
import { CinematicRig } from "./villa/CinematicRig";
import { FirstPersonControls } from "./villa/FirstPersonControls";
import { CanvasLoader } from "./CanvasLoader";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { SceneFallback } from "@/components/ui/SceneFallback";

type Mode = "orbit" | "walk";

/**
 * Expérience villa d'art contemporain au coucher de soleil épuré, VISITABLE :
 * mode « extérieur » (caméra cinématographique + orbite) ou mode « intérieur »
 * (première personne, on entre et on marche dans la villa-galerie).
 */
export function HouseScene() {
  const hasWebGL = useHasWebGL();
  const [mode, setMode] = useState<Mode>("orbit");
  const introPlayed = useRef(false);

  if (hasWebGL === null) {
    return <div className="h-full w-full" aria-hidden />;
  }
  if (hasWebGL === false) {
    return <SceneFallback />;
  }

  return (
    <>
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
          {/* Ciel coucher de soleil épuré (puresky) + éclairage d'ambiance. */}
          <Environment
            files="/hdri/qwantani_sunset_puresky_2k.hdr"
            background
            backgroundBlurriness={0.015}
            environmentIntensity={1.0}
          />

          {/* Soleil rasant doré (ombres longues du golden hour). */}
          <directionalLight
            position={[-34, 12, 22]}
            intensity={2.6}
            color="#ffd6a0"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0004}
            shadow-camera-near={1}
            shadow-camera-far={120}
            shadow-camera-left={-44}
            shadow-camera-right={44}
            shadow-camera-top={44}
            shadow-camera-bottom={-44}
          />
          <ambientLight intensity={0.2} color="#ffe6c4" />

          <VillaArchitecture />
          <VillaInterior />
          <VillaGrounds />

          <ContactShadows
            position={[0, 0.04, 0]}
            scale={70}
            resolution={1024}
            far={22}
            blur={2.6}
            opacity={0.5}
            color="#1c150c"
          />
        </Suspense>

        {mode === "orbit" ? (
          <CinematicRig
            target={[0, 3.4, -2]}
            skip={introPlayed.current}
            onDone={() => {
              introPlayed.current = true;
            }}
          />
        ) : (
          <FirstPersonControls />
        )}

        <EffectComposer multisampling={0}>
          <DepthOfField focusDistance={0.025} focalLength={0.04} bokehScale={1.4} />
          <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.9} luminanceSmoothing={0.25} />
          <Vignette eskil={false} offset={0.2} darkness={0.8} />
          <SMAA />
        </EffectComposer>
      </Canvas>

      {/* Commande extérieur / intérieur. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2">
        {mode === "walk" && (
          <p className="rounded-full bg-black/45 px-3 py-1 text-xs text-white/85 backdrop-blur">
            Clique pour regarder · ZQSD / WASD pour marcher · Échap pour libérer la souris
          </p>
        )}
        <button
          type="button"
          onClick={() => setMode((m) => (m === "orbit" ? "walk" : "orbit"))}
          className="pointer-events-auto rounded-full bg-white/90 px-6 py-3 text-sm font-medium text-black shadow-xl backdrop-blur transition hover:bg-white"
        >
          {mode === "orbit" ? "Entrer dans la villa ▸" : "◂ Revenir à l’extérieur"}
        </button>
      </div>
    </>
  );
}
