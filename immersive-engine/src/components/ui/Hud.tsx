"use client";

/**
 * Interface AMAVYA : marque, bascule Vue guidée / Exploration, et selon le mode :
 * libellé + navigation (rail) ou consignes de marche (explore).
 */
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/stores/useExperience";
import { PATH, EXPERIENCE } from "@/data/experience";

export default function Hud() {
  const active = useExperience((s) => s.active);
  const total = useExperience((s) => s.total);
  const t = useExperience((s) => s.t);
  const goTo = useExperience((s) => s.goTo);
  const mode = useExperience((s) => s.mode);
  const toggleMode = useExperience((s) => s.toggleMode);
  const node = PATH[active] ?? PATH[0];
  const rail = mode === "rail";

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      <div className="flex items-center justify-between px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-white/70 md:px-12">
        <span className="font-semibold text-white">{EXPERIENCE.name}</span>
        <span className="hidden sm:block">{EXPERIENCE.tagline}</span>
        <span>{rail ? `${String(active + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}` : "EXPLORATION"}</span>
      </div>

      {/* Bascule de mode */}
      <button
        onClick={toggleMode}
        className="pointer-events-auto absolute right-6 top-16 rounded-full border border-cyan-300/60 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-widest text-white backdrop-blur transition hover:bg-cyan-300/20 md:right-10"
      >
        {rail ? "🚶 Explorer" : "🎥 Vue guidée"}
      </button>

      {rail ? (
        <>
          {/* libellé du nœud courant */}
          <div className="absolute inset-x-0 bottom-28 flex flex-col items-center px-8 text-center md:bottom-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl"
              >
                {node.kicker && <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-cyan-300">{node.kicker}</div>}
                <h1 className="font-serif text-4xl leading-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] md:text-6xl">{node.title}</h1>
                {node.body && <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/75 md:text-base">{node.body}</p>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* points de navigation */}
          <div className="pointer-events-auto absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 md:right-10">
            {PATH.map((n, i) => (
              <button
                key={n.id}
                aria-label={n.title}
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 rounded-full border border-white/40 transition-all ${
                  i === active ? "scale-125 bg-cyan-300 shadow-[0_0_12px_#36e0ff]" : "bg-white/10 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* précédent / suivant */}
          <div className="pointer-events-auto absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
            <button onClick={() => goTo(Math.max(0, active - 1))} className="rounded-full border border-white/25 px-5 py-2 text-xs uppercase tracking-widest text-white/80 backdrop-blur transition hover:border-cyan-300 hover:text-white">← Précédent</button>
            <button onClick={() => goTo(Math.min(total - 1, active + 1))} className="rounded-full border border-cyan-300/60 bg-cyan-300/10 px-5 py-2 text-xs uppercase tracking-widest text-white backdrop-blur transition hover:bg-cyan-300/20">Avancer →</button>
          </div>

          <div className="absolute left-0 top-0 h-[3px] bg-gradient-to-r from-cyan-300 to-fuchsia-500" style={{ width: `${t * 100}%` }} />
          <div className="absolute bottom-8 left-6 hidden text-[10px] uppercase tracking-[0.3em] text-white/40 md:block">molette · flèches · glisser · cliquer une œuvre</div>
        </>
      ) : (
        <>
          {/* viseur centre */}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
          {/* consignes de marche */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/40 px-5 py-2 text-center text-[11px] uppercase tracking-[0.25em] text-white/70 backdrop-blur">
            Clique pour marcher · ZQSD / WASD · Espace = saut · Échap = libérer la souris
          </div>
        </>
      )}
    </div>
  );
}
