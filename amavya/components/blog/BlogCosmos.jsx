"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRouter } from "next/navigation";
import SolarSystem from "./celestial/SolarSystem";

export default function BlogCosmos({ articles, hint }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const select = (article) => router.push(`/blog/${article.slug}`);

  return (
    <div className="relative h-[78vh] w-full overflow-hidden rounded-3xl border border-gold/15 bg-black">
      {/* Voile pour fondu top et bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black to-transparent" />

      {/* Indication d'usage */}
      <div className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-gold/30 bg-black/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold-bright backdrop-blur">
        {hint}
      </div>

      {ready && (
        <Canvas
          camera={{ position: [0, 8, 28], fov: 55 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={["#020208"]} />
          <fog attach="fog" args={["#020208", 45, 110]} />
          <Suspense fallback={null}>
            <SolarSystem articles={articles} onSelect={select} />
          </Suspense>
          <EffectComposer>
            <Bloom intensity={0.85} luminanceThreshold={0.4} mipmapBlur />
            <Vignette eskil={false} offset={0.2} darkness={0.75} />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}
