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
    <div className="relative h-[78vh] w-full overflow-hidden rounded-3xl border border-gold/15 bg-black">
      {/* Voie lactée 3D en fond — clics qui passent à travers */}
      <div className="pointer-events-none absolute inset-0">
        {ready && (
          <Canvas
            camera={{ position: [0, 0, 50], fov: 55 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={["#020208"]} />
            <Suspense fallback={null}>
              <MilkyWay />
            </Suspense>
            <EffectComposer>
              <Bloom intensity={0.55} luminanceThreshold={0.45} mipmapBlur />
              <Vignette eskil={false} offset={0.2} darkness={0.75} />
            </EffectComposer>
          </Canvas>
        )}
      </div>

      {/* Voiles top/bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Hint d'usage */}
      <div className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-gold/30 bg-black/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold-bright backdrop-blur">
        {hint}
      </div>

      {/* Halo doré derrière le globe */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(240,210,122,0.25), transparent 65%)",
        }}
      />

      {/* Globe terre interactif au centre */}
      <div className="relative z-20 flex h-full items-center justify-center px-6 py-10 sm:px-10">
        <GlobeCosmos articles={articles} />
      </div>
    </div>
  );
}
