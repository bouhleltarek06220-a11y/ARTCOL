"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const GlobeCosmos = dynamic(() => import("./celestial/GlobeCosmos"), {
  ssr: false,
});

function locationFor(article) {
  if (
    article.planet?.lat != null &&
    article.planet?.lng != null &&
    !Number.isNaN(article.planet.lat) &&
    !Number.isNaN(article.planet.lng)
  ) {
    return [article.planet.lat, article.planet.lng];
  }
  return [48.8566, 2.3522]; // Paris par défaut
}

export default function BlogArticleHero({ article }) {
  const heroMarker = {
    id: `hero-${article.slug}`,
    location: locationFor(article),
    label: article.title,
    onClick: () => {},
  };

  return (
    <div className="relative h-[80vh] min-h-[520px] w-screen overflow-hidden bg-[#020208]">
      {/* Mini globe avec le marker de l'article */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div className="w-[60vh] max-w-md">
          <GlobeCosmos markers={[heroMarker]} size="md" />
        </div>
      </div>

      {/* Voile + texte */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.0)_0%,rgba(5,5,5,0.5)_60%,rgba(5,5,5,0.95)_100%)]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.28em] text-gold-bright">
            {article.category.replace("-", " ")} ·{" "}
            {new Date(article.date).toLocaleDateString()} · {article.readingTime} min
          </div>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight sm:text-5xl">
            {article.title}
          </h1>
          {article.description && (
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {article.description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
