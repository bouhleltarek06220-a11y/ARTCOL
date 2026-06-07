"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useMemo } from "react";
import BlurFade from "@/components/showreel/ui/BlurFade";
import { PRESS_COVERAGE } from "@/lib/press-coverage";

/* Le vrai globe de la page Cosmos. Chargé en client only. */
const GlobeCosmos = dynamic(
  () => import("@/components/blog/celestial/GlobeCosmos"),
  { ssr: false },
);

export default function Scene6GlobalFuture({ t }) {
  /* On reprend les markers de la revue de presse mondiale — cohérent
     avec le Cosmos : un point par grande ville couverte par AMAVYA. */
  const markers = useMemo(
    () =>
      PRESS_COVERAGE.map((p) => ({
        id: `vision-${p.id}`,
        location: [p.lat, p.lng],
        label: `${p.city} · ${p.country}`,
        delay: (Math.random() * 2) % 2,
        onClick: () => {},
      })),
    [],
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#02030a]">
      {/* Voile spatial : étoiles fixes en CSS, plus léger qu'une nouvelle
          scène R3F dédiée. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(15,18,40,0.4), #02030a 70%)",
        }}
      />

      {/* Halo doré derrière le globe (cohérent avec la home Cosmos) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          width: "70vmin",
          height: "70vmin",
          background:
            "radial-gradient(circle, rgba(240,210,122,0.28), transparent 65%)",
        }}
      />

      <BlurFade delay={0.4} duration={0.7}>
        <div className="absolute left-1/2 top-[10%] z-10 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.45em] text-gold-bright">
          {t.s6.eyebrow}
        </div>
      </BlurFade>

      {/* Le vrai globe Cosmos en grand, centré */}
      <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
        <div className="w-[min(72vh,80vmin)]">
          {/* Le composant gère son propre rendu cobe + markers HTML.
              Note : on n'utilise pas pointer-events ici parce que la scène
              s'auto-skip — l'interaction utilisateur via les markers
              n'a pas vraiment de sens pendant le voyage cinéma. */}
          <GlobeCosmos markers={markers} size="lg" enableZoom={false} />
        </div>
      </div>

      <BlurFade delay={3.6} duration={0.9} yOffset={20}>
        <div className="absolute inset-x-0 bottom-[10%] z-30 px-6 text-center">
          <h2
            className="text-balance text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-[3.6vw]"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.85))",
            }}
          >
            <span className="bg-[linear-gradient(110deg,#a87f2e,#f0d27a_50%,#d4af37)] bg-clip-text text-transparent">
              {t.s6.title}
            </span>
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-paper/70 sm:text-base">
            {t.s6.sub}
          </p>
        </div>
      </BlurFade>
    </div>
  );
}
