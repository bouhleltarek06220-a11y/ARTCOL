"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { useVilla } from "./store";
import { Lighting } from "./core/Lighting";
import { PostFX } from "./core/PostFX";
import { CameraRig } from "./core/CameraRig";
import { Player } from "./core/Player";
import { IntroScreen } from "./ui/IntroScreen";
import { Hud } from "./ui/Hud";
import { ConversationPanel } from "./ui/ConversationPanel";
import { ArtworkPanel } from "./ui/ArtworkPanel";
import { TouchControls } from "./ui/TouchControls";
import { CharacterGuide } from "./character/CharacterGuide";
import { VillaFurniture } from "./world/VillaFurniture";
import { VillaDining } from "./world/VillaDining";
import { VillaRooms } from "./world/VillaRooms";
import { VillaOffice } from "./world/VillaOffice";
import { VillaArchitecture } from "@/components/3d/villa/VillaArchitecture";
import { VillaInterior } from "@/components/3d/villa/VillaInterior";
import { UpperFloors } from "@/components/3d/villa/UpperFloors";
import { VillaGrounds } from "@/components/3d/villa/VillaGrounds";
import { GardenSport } from "@/components/3d/villa/GardenSport";
import { PoolHouse } from "@/components/3d/villa/PoolHouse";
import { LandscapePlanting } from "@/components/3d/villa/LandscapePlanting";
import { EntranceGate } from "@/components/3d/villa/EntranceGate";
import { CanvasLoader } from "@/components/3d/CanvasLoader";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { useIsTouch } from "@/hooks/useIsTouch";
import { SceneFallback } from "@/components/ui/SceneFallback";

/** Vue de contrôle (dev) : `?cam=x,y,z,tx,ty,tz` place une caméra orbitale
 *  fixe pour inspecter une pièce en capture. Inerte en usage normal. */
function DebugView({ spec }: { spec: string }) {
  const { camera } = useThree();
  const n = useMemo(() => spec.split(",").map(Number), [spec]);
  useEffect(() => {
    if (n.length >= 6) {
      camera.position.set(n[0], n[1], n[2]);
      camera.lookAt(n[3], n[4], n[5]);
    }
  }, [camera, n]);
  return (
    <OrbitControls makeDefault target={n.length >= 6 ? [n[3], n[4], n[5]] : [0, 2, 0]} />
  );
}

/**
 * Point d'entrée de l'expérience villa-galerie. Assemble le monde 3D,
 * l'éclairage, la caméra d'intro / le joueur FP et le post-traitement, plus les
 * couches UI (intro AMAVYA + HUD). Piloté par le store Zustand.
 */
export function VillaExperience() {
  const hasWebGL = useHasWebGL();
  const touch = useIsTouch();
  const phase = useVilla((s) => s.phase);
  const debugCam = useMemo(
    () => (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("cam") : null),
    [],
  );

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
            backgroundBlurriness={0.04}
            environmentIntensity={0.36}
          />
          <Lighting />

          <VillaArchitecture />
          <VillaInterior />
          <UpperFloors />
          <VillaGrounds />
          <GardenSport />
          <PoolHouse />
          <LandscapePlanting />
          <EntranceGate />
          <VillaRooms />
          <VillaOffice />
          <VillaFurniture />
          <VillaDining />
          <CharacterGuide position={[-3.4, 0, 1.2]} rotation={Math.PI + 0.2} />

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

        {debugCam ? (
          <DebugView spec={debugCam} />
        ) : (
          <>
            <CameraRig />
            {phase !== "intro" && <Player touch={touch} />}
          </>
        )}
        <PostFX />
      </Canvas>

      {!debugCam && (
        <>
          <IntroScreen />
          <Hud />
          {touch && <TouchControls />}
          <ConversationPanel />
          <ArtworkPanel />
        </>
      )}
    </>
  );
}
