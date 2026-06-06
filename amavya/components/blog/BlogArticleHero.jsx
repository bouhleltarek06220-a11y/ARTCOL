"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

/* Charge le globe Terre côté client uniquement (canvas WebGL). */
const GlobeCosmos = dynamic(() => import("./celestial/GlobeCosmos"), {
  ssr: false,
});

export default function BlogArticleHero({ article }) {
  return (
    <div className="relative h-[65vh] min-h-[460px] w-full overflow-hidden bg-[#050505]">
      {/* Halo coloré derrière */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${article.planet.color}33, transparent 65%)`,
        }}
      />

      {/* Mini globe — marker pulsant cliquable du sujet de l'article */}
      <div className="absolute inset-0 flex items-center justify-center pt-10">
        <div className="w-[60vw] max-w-md">
          <GlobeCosmos articles={[article]} size="md" />
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
