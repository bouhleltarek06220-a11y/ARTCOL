"use client";

/**
 * Interface superposée (hologrammes / panneaux flottants) : titre de la station
 * active, barre de progression du parcours, navigation par points + boutons.
 * Reste lisible malgré la 3D (règle : spectaculaire mais clair).
 */
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/stores/useExperience";
import { STATIONS, EXPERIENCE } from "@/data/experience";

export default function Hud() {
  const active = useExperience((s) => s.active);
  const total = useExperience((s) => s.total);
  const t = useExperience((s) => s.t);
  const goTo = useExperience((s) => s.goTo);
  const station = STATIONS[active] ?? STATIONS[0];
  const align =
    station.side === "left" ? "items-start text-left" : station.side === "right" ? "items-end text-right" : "items-center text-center";

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      {/* marque */}
      <div className="flex items-center justify-between px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-white/70 md:px-12">
        <span className="font-semibold text-white">{EXPERIENCE.name}</span>
        <span className="hidden sm:block">{EXPERIENCE.tagline}</span>
        <span>{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>

      {/* panneau holographique de la station active */}
      <div className={`absolute inset-x-0 bottom-28 flex flex-col px-8 md:bottom-32 md:px-20 ${align}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-cyan-300">{station.kicker}</div>
            <h1 className="font-serif text-4xl leading-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] md:text-6xl">
              {station.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 md:text-base">{station.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* navigation par points (clic = aller à la station) */}
      <div className="pointer-events-auto absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 md:right-10">
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            aria-label={s.title}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full border border-white/40 transition-all ${
              i === active ? "scale-125 bg-cyan-300 shadow-[0_0_12px_#5ad1ff]" : "bg-white/10 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* boutons précédent / suivant */}
      <div className="pointer-events-auto absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button
          onClick={() => goTo(Math.max(0, active - 1))}
          className="rounded-full border border-white/25 px-5 py-2 text-xs uppercase tracking-widest text-white/80 backdrop-blur transition hover:border-cyan-300 hover:text-white"
        >
          ← Précédent
        </button>
        <button
          onClick={() => goTo(Math.min(total - 1, active + 1))}
          className="rounded-full border border-cyan-300/60 bg-cyan-300/10 px-5 py-2 text-xs uppercase tracking-widest text-white backdrop-blur transition hover:bg-cyan-300/20"
        >
          Avancer →
        </button>
      </div>

      {/* barre de progression */}
      <div className="absolute left-0 top-0 h-[3px] bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${t * 100}%` }} />

      {/* indice de navigation */}
      <div className="absolute bottom-8 left-6 hidden text-[10px] uppercase tracking-[0.3em] text-white/40 md:block">
        molette · flèches · glisser
      </div>
    </div>
  );
}
