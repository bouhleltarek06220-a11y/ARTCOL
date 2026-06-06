"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRouter } from "next/navigation";
import MilkyWay from "./celestial/MilkyWay";
import GlobeCosmos from "./celestial/GlobeCosmos";
import PressCard from "./PressCard";
import { PRESS_COVERAGE } from "@/lib/press-coverage";

/* Pool de fallback pour les articles AMAVYA sans coords explicites. */
const DEFAULT_LOCATIONS = [
  [48.8566, 2.3522],
  [40.7128, -74.006],
  [35.6762, 139.6503],
  [51.5074, -0.1278],
  [1.3521, 103.8198],
  [-33.8688, 151.2093],
  [55.7558, 37.6173],
  [19.4326, -99.1332],
  [-23.5505, -46.6333],
  [25.2048, 55.2708],
];

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function locationForArticle(article, index) {
  if (
    article.planet?.lat != null &&
    article.planet?.lng != null &&
    !Number.isNaN(article.planet.lat) &&
    !Number.isNaN(article.planet.lng)
  ) {
    return [article.planet.lat, article.planet.lng];
  }
  return DEFAULT_LOCATIONS[(hashSlug(article.slug) + index) % DEFAULT_LOCATIONS.length];
}

export default function BlogCosmos({ articles, hint }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [pressItem, setPressItem] = useState(null);

  useEffect(() => {
    setReady(true);
  }, []);

  // Combine articles AMAVYA + revue de presse mondiale → markers du globe.
  const markers = useMemo(() => {
    const articleMarkers = articles.map((a, i) => ({
      id: `art-${a.slug}`,
      location: locationForArticle(a, i),
      label: a.title,
      onClick: () => router.push(`/blog/${a.slug}`),
    }));
    const pressMarkers = PRESS_COVERAGE.map((p) => ({
      id: p.id,
      location: [p.lat, p.lng],
      label: `${p.source} — ${p.title}`,
      onClick: () => setPressItem(p),
    }));
    return [...articleMarkers, ...pressMarkers];
  }, [articles, router]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Voie lactée plein écran derrière */}
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

      {/* Voile haut pour lisibilité de la navbar et du titre */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-72 bg-gradient-to-b from-black via-black/40 to-transparent" />

      {/* Hint d'usage en bas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
        <div className="rounded-full border border-gold/30 bg-black/50 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold-bright backdrop-blur">
          {hint}
        </div>
      </div>

      {/* Globe terre interactif au centre */}
      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="w-[min(80vh,90vw)]">
          <GlobeCosmos markers={markers} />
        </div>
      </div>

      {/* Modal Revue de presse */}
      <PressCard item={pressItem} onClose={() => setPressItem(null)} />
    </div>
  );
}
