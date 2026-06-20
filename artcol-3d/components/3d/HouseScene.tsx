"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
} from "@react-three/drei";
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

/** Couleur de fond unie (ambiance galerie d'art sombre). */
const BG = "#0a0a0c";

/**
 * Maison 3D présentée comme une galerie immersive et sombre :
 * - fond uni + brouillard pour fondre les bords dans le noir (plus d'effet
 *   « bâtiment qui flotte dans le vide ») ;
 * - grand sol légèrement réfléchissant sous la maison ;
 * - HDRI utilisée uniquement pour l'éclairage et les reflets (pas en décor),
 *   pour ne pas afficher un ciel qui jure avec l'architecture ;
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
      camera={{ position: [9, 5, 11], fov: 55, near: 0.1, far: 120 }}
      gl={{
        antialias: false, // SMAA s'en charge dans le composer
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: "high-performance",
      }}
      aria-hidden
    >
      {/* Fond sombre uni + brouillard : les bords du bâtiment se fondent dans
          le noir au lieu de révéler le vide autour. */}
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 22, 70]} />

      {/* Éclairage par image (HDRI locale) SANS l'afficher en décor :
          sert seulement aux reflets et à la lumière d'ambiance. */}
      <Environment files="/hdri/venice_sunset_1k.hdr" environmentIntensity={0.55} />

      {/* Soleil directionnel pour les ombres portées et le modelé. */}
      <directionalLight
        position={[12, 18, 6]}
        intensity={2.1}
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
      <ambientLight intensity={0.12} />

      <Suspense fallback={<CanvasLoader />}>
        <SponzaModel />

        {/* Grand sol réfléchissant (look galerie) qui s'étend bien au-delà de
            la maison pour combler le vide alentour. Placé juste sous la base
            du modèle pour éviter le z-fighting avec son propre sol. */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <MeshReflectorMaterial
            mirror={0}
            resolution={1024}
            blur={[400, 200]}
            mixBlur={1}
            mixStrength={1.2}
            roughness={0.85}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0b0b0d"
            metalness={0.5}
          />
        </mesh>
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 4, 0]}
        enablePan={false}
        minDistance={5}
        maxDistance={26}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.05}
      />

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.5} luminanceThreshold={1.0} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
