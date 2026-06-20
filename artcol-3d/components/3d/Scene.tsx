"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { SpinningKnot } from "./SpinningKnot";
import { CanvasLoader } from "./CanvasLoader";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { SceneFallback } from "@/components/ui/SceneFallback";

/**
 * Composant client qui encapsule le <Canvas> React Three Fiber.
 *
 * Règles respectées :
 * - Tout Canvas vit dans un composant `"use client"`.
 * - Privilégier les helpers drei (OrbitControls, ContactShadows…) au
 *   Three.js impératif.
 * - Le contenu asynchrone est monté sous <Suspense>.
 * - Alternative sans 3D si WebGL est indisponible (accessibilité).
 */
export function Scene() {
  const hasWebGL = useHasWebGL();

  // Pendant la détection (SSR / premier paint) on réserve l'espace.
  if (hasWebGL === null) {
    return <div className="h-full w-full" aria-hidden />;
  }

  // Pas de WebGL → contenu équivalent accessible, sans 3D.
  if (hasWebGL === false) {
    return <SceneFallback />;
  }

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.5, 6], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      // Le Canvas est purement décoratif : le contenu textuel équivalent
      // est fourni hors-canvas (voir page.tsx).
      aria-hidden
    >
      <color attach="background" args={["#0a0a0a"]} />

      {/* Éclairage de base */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, -2, -4]} intensity={0.6} color="#a855f7" />

      <Suspense fallback={<CanvasLoader />}>
        <SpinningKnot position={[0, 0.6, 0]} />
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.5}
          scale={12}
          blur={2.5}
          far={4}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={4}
        maxDistance={10}
      />
    </Canvas>
  );
}
