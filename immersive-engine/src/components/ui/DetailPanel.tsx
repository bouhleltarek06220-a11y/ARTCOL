"use client";

/**
 * Fiche détail d'une œuvre (ouverte au clic sur un écran). Aperçu + technos + lien.
 */
import { AnimatePresence, motion } from "framer-motion";
import { PATH } from "@/data/experience";
import { useExperience } from "@/stores/useExperience";

export default function DetailPanel() {
  const detail = useExperience((s) => s.detail);
  const close = useExperience((s) => s.openDetail);
  const node = PATH.find((n) => n.id === detail);

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* voile */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => close(null)} />

          <motion.div
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#0b0816]/90 shadow-[0_30px_120px_rgba(0,0,0,0.7)]"
            initial={{ y: 30, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ borderColor: (node.accent ?? "#36e0ff") + "55" }}
          >
            {node.video ? (
              <video
                className="h-56 w-full object-cover md:h-72"
                src={`/assets/video/${node.video}.mp4`}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div
                className="h-56 w-full bg-cover bg-center md:h-72"
                style={{ backgroundImage: `url(/assets/textures/${node.preview}.png)` }}
              />
            )}
            <div className="p-7">
              <div className="mb-2 text-[11px] uppercase tracking-[0.3em]" style={{ color: node.accent }}>
                {node.type}
              </div>
              <h2 className="font-serif text-3xl text-white md:text-4xl">{node.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {node.tech?.map((t) => (
                  <span key={t} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-3">
                {node.url && node.url !== "#" && (
                  <a
                    href={node.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-6 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
                    style={{ background: node.accent }}
                  >
                    Ouvrir le site ↗
                  </a>
                )}
                <button
                  onClick={() => close(null)}
                  className="rounded-full border border-white/25 px-6 py-2.5 text-sm text-white/80 transition hover:border-white/60 hover:text-white"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
