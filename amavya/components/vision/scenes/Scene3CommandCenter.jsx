"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import BlurFade from "@/components/showreel/ui/BlurFade";

const SplineScene = dynamic(
  () => import("@/components/ui/splite").then((m) => m.SplineScene),
  { ssr: false },
);

const SPLINE_SCENE =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/* Carte holographique flottante. */
function HoloCard({ delay = 0, position, content }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 30, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ ...position, perspective: 1000 }}
      className="absolute z-20 max-w-[260px]"
    >
      <div
        className="rounded-2xl border border-cyan-300/30 bg-cyan-950/30 p-4 backdrop-blur-md"
        style={{
          boxShadow:
            "0 18px 60px -12px rgba(34,211,238,0.35), 0 0 0 1px rgba(34,211,238,0.15) inset",
        }}
      >
        {content}
      </div>
    </motion.div>
  );
}

export default function Scene3CommandCenter({ t }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#03050d]">
      {/* Grille de fond style hologramme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Scan lines verticales */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(56,189,248,0.18) 3px, rgba(56,189,248,0.18) 4px)",
        }}
      />

      {/* Halo au centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          width: "70vmin",
          height: "70vmin",
          background:
            "radial-gradient(circle, rgba(240,210,122,0.35), rgba(34,211,238,0.15), transparent 65%)",
        }}
      />

      {/* Humanoïde Spline centré */}
      <div className="absolute inset-0 z-10">
        <SplineScene scene={SPLINE_SCENE} className="h-full w-full" />
      </div>

      {/* Cartes holographiques flottantes */}
      <HoloCard
        delay={1.2}
        position={{ top: "16%", left: "6%" }}
        content={
          <>
            <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">
              Pipeline
            </div>
            <div className="mt-1 font-mono text-2xl text-paper">+38 %</div>
            <div className="text-[10px] text-paper/60">vs. mois dernier</div>
          </>
        }
      />
      <HoloCard
        delay={1.6}
        position={{ top: "60%", left: "4%" }}
        content={
          <>
            <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">
              Agents actifs
            </div>
            <div className="mt-1 font-mono text-2xl text-paper">12 / 12</div>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-1 w-3 rounded-sm bg-emerald-400/80" />
              ))}
            </div>
          </>
        }
      />
      <HoloCard
        delay={2}
        position={{ top: "18%", right: "5%", left: "auto" }}
        content={
          <>
            <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">
              Tâches automatisées
            </div>
            <div className="mt-1 font-mono text-2xl text-paper">8 542</div>
            <div className="text-[10px] text-emerald-300">+24 %</div>
          </>
        }
      />
      <HoloCard
        delay={2.4}
        position={{ top: "58%", right: "6%", left: "auto" }}
        content={
          <>
            <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">
              Temps de réponse
            </div>
            <div className="mt-1 font-mono text-2xl text-paper">1.2 s</div>
            <div className="text-[10px] text-paper/60">moyen 24h</div>
          </>
        }
      />

      {/* Texte */}
      <BlurFade delay={3.4} duration={0.9} yOffset={20}>
        <div className="absolute inset-x-0 bottom-[10%] z-30 px-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.45em] text-gold-bright">
            {t.s3.eyebrow}
          </div>
          <h2
            className="mt-3 text-balance text-2xl font-semibold leading-tight text-paper sm:text-3xl lg:text-[3.2vw]"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.85))",
            }}
          >
            <div>{t.s3.title}</div>
            <div className="mt-1 bg-[linear-gradient(110deg,#a87f2e,#f0d27a_50%,#d4af37)] bg-clip-text text-transparent">
              {t.s3.subtitle}
            </div>
          </h2>
        </div>
      </BlurFade>
    </div>
  );
}
