"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import MilkyWay from "./celestial/MilkyWay";
import GlobeCosmos from "./celestial/GlobeCosmos";

export default function BlogCosmos({ articles, hint }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Voie lactée plein écran derrière — voyage 3D */}
      <div className="pointer-events-none absolute inset-0">
        {ready && (
          <Canvas
            camera={{ position: [0, 0, 50], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={["#020208"]} />
            <Suspense fallback={null}>
              <MilkyWay />
            </Suspense>
            <EffectComposer>
              <Bloom intensity={0.7} luminanceThreshold={0.4} mipmapBlur />
              <Vignette eskil={false} offset={0.3} darkness={0.7} />
            </EffectComposer>
          </Canvas>
        )}
      </div>

      {/* Voile haut pour lisibilité du titre (navbar + texte) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-72 bg-gradient-to-b from-black via-black/40 to-transparent" />

      {/* Hint d'usage en bas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
        <div className="rounded-full border border-gold/30 bg-black/50 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold-bright backdrop-blur">
          {hint}
        </div>
      </div>

      {/* Halo doré derrière le globe (donne du poids visuel) */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(240,210,122,0.22), transparent 65%)",
        }}
      />

      {/* Globe terre interactif au centre */}
      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="w-[min(80vh,90vw)]">
          <GlobeCosmos articles={articles} />
        </div>
      </div>
    </div>
  );
}
