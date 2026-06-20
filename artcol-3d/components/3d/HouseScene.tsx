"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshReflectorMaterial, OrbitControls, Stars } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { ACESFilmicToneMapping } from "three";
import { ModernVilla } from "./ModernVilla";
import { CanvasLoader } from "./CanvasLoader";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { SceneFallback } from "@/components/ui/SceneFallback";

/** Couleur du ciel nocturne (fond + brouillard). */
const NIGHT = "#05070d";

/**
 * Villa moderne présentée de nuit, façon scène immersive :
 * - ciel sombre étoilé + brouillard pour fondre l'horizon ;
 * - grand sol réfléchissant qui capte la lueur des fenêtres et de la piscine ;
 * - clair de lune froid + lumières chaudes débordant de l'intérieur ;
 * - caméra fixe : le visiteur fait glisser pour tourner / molette pour zoomer.
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
      camera={{ position: [13, 6, 15], fov: 50, near: 0.1, far: 200 }}
      gl={{
        antialias: false, // SMAA s'en charge dans le composer
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: "high-performance",
      }}
      aria-hidden
    >
      {/* Nuit : fond sombre uni + brouillard + étoiles. */}
      <color attach="background" args={[NIGHT]} />
      <fog attach="fog" args={[NIGHT, 26, 90]} />
      <Stars radius={120} depth={50} count={2500} factor={4} saturation={0} fade speed={0.5} />

      {/* Clair de lune froid (ombres portées) + très léger remplissage. */}
      <directionalLight
        position={[14, 20, -8]}
        intensity={0.7}
        color="#9bb4ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
      <ambientLight intensity={0.08} color="#33405e" />

      <Suspense fallback={<CanvasLoader />}>
        <ModernVilla />

        {/* Grand sol réfléchissant (reflets nocturnes des fenêtres / piscine). */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[240, 240]} />
          <MeshReflectorMaterial
            resolution={1024}
            blur={[300, 120]}
            mixBlur={1}
            mixStrength={1.4}
            roughness={0.8}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#070709"
            metalness={0.6}
          />
        </mesh>
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 2.6, 0]}
        enablePan={false}
        minDistance={7}
        maxDistance={40}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.08}
      />

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.9} luminanceSmoothing={0.25} />
        <Vignette eskil={false} offset={0.25} darkness={0.9} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
