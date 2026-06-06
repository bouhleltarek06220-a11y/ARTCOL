"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BlogGrid from "./BlogGrid";
import { useLang } from "@/components/LangProvider";

// Le Canvas R3F est lourd : on le charge dynamiquement, uniquement côté client.
const BlogCosmos = dynamic(() => import("./BlogCosmos"), { ssr: false });

const TEXT = {
  fr: {
    eyebrow: "Le Cosmos AMAVYA",
    title: "Un voyage dans l'IA, point par point.",
    description:
      "Faites tourner la Terre, cliquez sur un point lumineux pour ouvrir l'article correspondant.",
    hint: "Tournez la Terre · cliquez sur un point",
    toggle3D: "Mode Globe",
    toggleGrid: "Mode grille",
    empty: "Le cosmos est vide pour l'instant. Le premier article arrive bientôt.",
  },
  en: {
    eyebrow: "The AMAVYA Cosmos",
    title: "A journey into AI, point by point.",
    description:
      "Spin the Earth, click a glowing point to open the matching article.",
    hint: "Spin the Earth · click a point",
    toggle3D: "Globe mode",
    toggleGrid: "Grid mode",
    empty: "The cosmos is empty for now. The first article is coming soon.",
  },
  es: {
    eyebrow: "El Cosmos AMAVYA",
    title: "Un viaje a la IA, punto por punto.",
    description:
      "Gire la Tierra, haga clic en un punto luminoso para abrir el artículo correspondiente.",
    hint: "Gire la Tierra · haga clic en un punto",
    toggle3D: "Modo Globo",
    toggleGrid: "Modo cuadrícula",
    empty: "El cosmos está vacío por ahora. El primer artículo llega pronto.",
  },
};

export default function BlogIndexClient({ articles }) {
  const { lang } = useLang();
  const t = TEXT[lang] || TEXT.fr;

  // Détecte si on est sur mobile (< 768px) ou si motion réduite est demandée.
  const [forceGrid, setForceGrid] = useState(false);
  const [userPreference, setUserPreference] = useState(null);

  useEffect(() => {
    const isSmall = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setForceGrid(isSmall || reduceMotion);
  }, []);

  const useCosmos =
    userPreference === "cosmos" ||
    (userPreference === null && !forceGrid);

  if (articles.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-muted">
        {t.empty}
      </p>
    );
  }

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

          {/* Toggle visible que si l'utilisateur peut basculer (desktop) */}
          {!forceGrid && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setUserPreference("cosmos")}
                aria-pressed={useCosmos}
                className={`rounded-full px-3 py-1 text-xs transition-all ${
                  useCosmos
                    ? "bg-gold/15 text-gold-bright"
                    : "text-muted hover:text-paper"
                }`}
              >
                {t.toggle3D}
              </button>
              <button
                type="button"
                onClick={() => setUserPreference("grid")}
                aria-pressed={!useCosmos}
                className={`rounded-full px-3 py-1 text-xs transition-all ${
                  !useCosmos
                    ? "bg-gold/15 text-gold-bright"
                    : "text-muted hover:text-paper"
                }`}
              >
                {t.toggleGrid}
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          {useCosmos ? (
            <BlogCosmos articles={articles} hint={t.hint} />
          ) : (
            <BlogGrid articles={articles} />
          )}
        </div>
      </div>
    </section>
  );
}
