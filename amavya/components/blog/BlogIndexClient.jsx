"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BlogGrid from "./BlogGrid";
import { useLang } from "@/components/LangProvider";

// Le Canvas R3F est lourd : on le charge dynamiquement, uniquement côté client.
const BlogCosmos = dynamic(() => import("./BlogCosmos"), { ssr: false });

const TEXT = {
  fr: {
    eyebrow: "Cosmos AMAVYA · Revue de presse mondiale",
    title: "Un voyage dans l'IA, point par point.",
    description:
      "Tournez la Terre, cliquez sur un point pour lire la presse mondiale sur l'IA — dans la langue du pays.",
    hint: "Tournez · molette pour zoomer · cliquez sur un point",
    toggle3D: "Mode Globe",
    toggleGrid: "Mode grille",
    empty: "Le cosmos est vide pour l'instant. Le premier article arrive bientôt.",
  },
  en: {
    eyebrow: "AMAVYA Cosmos · World press review",
    title: "A journey into AI, point by point.",
    description:
      "Spin the Earth, click a point to read world press coverage on AI — in the country's own language.",
    hint: "Spin · scroll to zoom · click a point",
    toggle3D: "Globe mode",
    toggleGrid: "Grid mode",
    empty: "The cosmos is empty for now. The first article is coming soon.",
  },
  es: {
    eyebrow: "Cosmos AMAVYA · Revista de prensa mundial",
    title: "Un viaje a la IA, punto por punto.",
    description:
      "Gire la Tierra, haga clic en un punto para leer la prensa mundial sobre IA — en el idioma del país.",
    hint: "Gire · rueda para zoom · haga clic en un punto",
    toggle3D: "Modo Globo",
    toggleGrid: "Modo cuadrícula",
    empty: "El cosmos está vacío por ahora. El primer artículo llega pronto.",
  },
};

export default function BlogIndexClient({ articles }) {
  const { lang } = useLang();
  const t = TEXT[lang] || TEXT.fr;

  const [forceGrid, setForceGrid] = useState(false);
  const [userPreference, setUserPreference] = useState(null);

  useEffect(() => {
    const isSmall = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setForceGrid(isSmall || reduceMotion);
  }, []);

  const useCosmos =
    userPreference === "cosmos" ||
    (userPreference === null && !forceGrid);

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-40 text-center">
        <p className="rounded-2xl border border-white/10 bg-white/5 p-10 text-sm text-muted">
          {t.empty}
        </p>
      </div>
    );
  }

  if (!useCosmos) {
    // Mode grille : layout classique avec marges et padding
    return (
      <section className="relative pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-gold-bright">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
              {t.eyebrow}
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              {t.title.split("point").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <span className="text-gradient">point</span>
                  </span>
                ) : (
                  part
                ),
              )}
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted">
              {t.description}
            </p>
            {!forceGrid && (
              <ModeToggle
                useCosmos={useCosmos}
                onCosmos={() => setUserPreference("cosmos")}
                onGrid={() => setUserPreference("grid")}
                t={t}
              />
            )}
          </div>
          <div className="mt-12">
            <BlogGrid articles={articles} />
          </div>
        </div>
      </section>
    );
  }

  // Mode COSMOS : full-viewport, le globe + la voie lactée prennent toute la place
  return (
    <>
      <BlogCosmos articles={articles} hint={t.hint} />

      {/* Titre/desc en overlay (dégradé du haut le rend lisible) */}
      <div className="pointer-events-none absolute inset-x-0 top-28 z-30 flex flex-col items-center gap-3 px-5 text-center sm:top-32">
        <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-gold-bright backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
          {t.eyebrow}
        </span>
        <h1 className="text-balance text-3xl font-semibold leading-tight text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-4xl">
          {t.title.split("point").map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <span className="text-gradient">point</span>
              </span>
            ) : (
              part
            ),
          )}
        </h1>
      </div>

      {/* Toggle mode dans le coin haut-droit, en overlay */}
      <div className="absolute right-5 top-28 z-30 hidden sm:block">
        <ModeToggle
          useCosmos={useCosmos}
          onCosmos={() => setUserPreference("cosmos")}
          onGrid={() => setUserPreference("grid")}
          t={t}
          compact
        />
      </div>
    </>
  );
}

function ModeToggle({ useCosmos, onCosmos, onGrid, t, compact = false }) {
  const wrap = compact
    ? "inline-flex items-center gap-1 rounded-full border border-gold/30 bg-black/60 p-1 backdrop-blur"
    : "mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1";
  return (
    <div className={wrap}>
      <button
        type="button"
        onClick={onCosmos}
        aria-pressed={useCosmos}
        className={`rounded-full px-3 py-1 text-xs transition-all ${
          useCosmos ? "bg-gold/15 text-gold-bright" : "text-muted hover:text-paper"
        }`}
      >
        {t.toggle3D}
      </button>
      <button
        type="button"
        onClick={onGrid}
        aria-pressed={!useCosmos}
        className={`rounded-full px-3 py-1 text-xs transition-all ${
          !useCosmos ? "bg-gold/15 text-gold-bright" : "text-muted hover:text-paper"
        }`}
      >
        {t.toggleGrid}
      </button>
    </div>
  );
}
