"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { useVilla } from "./store";
import { Lighting } from "./core/Lighting";
import { PostFX } from "./core/PostFX";
import { CameraRig } from "./core/CameraRig";
import { Player } from "./core/Player";
import { IntroScreen } from "./ui/IntroScreen";
import { Hud } from "./ui/Hud";
import { ConversationPanel } from "./ui/ConversationPanel";
import { CharacterGuide } from "./character/CharacterGuide";
import { VillaFurniture } from "./world/VillaFurniture";
import { VillaKitchenDining } from "./world/VillaKitchenDining";
import { VillaArchitecture } from "@/components/3d/villa/VillaArchitecture";
import { VillaInterior } from "@/components/3d/villa/VillaInterior";
import { VillaGrounds } from "@/components/3d/villa/VillaGrounds";
import { CanvasLoader } from "@/components/3d/CanvasLoader";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { SceneFallback } from "@/components/ui/SceneFallback";

/**
 * Point d'entrée de l'expérience villa-galerie (Bloc 1 — fondation).
 * Assemble le monde 3D, l'éclairage, la caméra d'intro / le joueur FP et le
 * post-traitement, plus les couches UI (intro AMAVYA + HUD). Le tout est
 * piloté par le store Zustand (phase de l'expérience).
 */
export function VillaExperience() {
  const hasWebGL = useHasWebGL();
  const phase = useVilla((s) => s.phase);

  if (hasWebGL === null) {
    return <div className="h-full w-full bg-[#0a0e14]" aria-hidden />;
  }
  if (hasWebGL === false) {
    return <SceneFallback />;
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&display=swap"
        rel="stylesheet"
      />

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [24, 9, 22], fov: 50, near: 0.1, far: 600 }}
        gl={{
          antialias: false,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 0.82,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Environment
            files="/hdri/qwantani_sunset_puresky_2k.hdr"
            background
            backgroundBlurriness={0.015}
            environmentIntensity={0.42}
          />
          <Lighting />

          <VillaArchitecture />
          <VillaInterior />
          <VillaGrounds />
          <VillaFurniture />
          <VillaKitchenDining />
          <CharacterGuide position={[-3.4, 0, 1.2]} rotation={0.2} />

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

        <CameraRig />
        {phase !== "intro" && <Player />}
        <PostFX />
      </Canvas>

      <IntroScreen />
      <Hud />
      <ConversationPanel />
    </>
  );
}
