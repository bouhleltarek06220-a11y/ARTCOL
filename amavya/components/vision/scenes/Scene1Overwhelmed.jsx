"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import BlurFade from "@/components/showreel/ui/BlurFade";
import TextGenerateEffect from "@/components/showreel/ui/TextGenerateEffect";

const POS = [
  { top: "12%", left: "8%" },
  { top: "18%", left: "62%" },
  { top: "32%", left: "26%" },
  { top: "38%", left: "78%" },
  { top: "48%", left: "12%" },
  { top: "54%", left: "48%" },
  { top: "62%", left: "72%" },
  { top: "72%", left: "18%" },
  { top: "78%", left: "56%" },
  { top: "22%", left: "42%" },
];

/* Scène 1 — chaos visuel : des notifications/cartes flottent partout,
   puis tout s'efface pour laisser apparaître la phrase coup-de-poing. */
export default function Scene1Overwhelmed({ t }) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowText(true), 4800);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#040614]">
      {/* Vignette rouge subtile pour exprimer la pression */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(239,68,68,0.08), transparent 70%)",
          boxShadow: "inset 0 0 200px 80px rgba(0,0,0,0.85)",
        }}
      />

      {/* Cartes notifications qui spawnent en chaos */}
      <AnimatePresence>
        {!showText &&
          t.s1.cards.map((card, i) => (
            <motion.div
              key={card}
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0.6, 0],
                scale: [0.6, 1, 1.02, 0.96, 0.6],
                y: [20, 0, -4, -16, -40],
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: 5.2,
                delay: i * 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ top: POS[i % POS.length].top, left: POS[i % POS.length].left }}
              className="absolute z-10 flex max-w-[260px] items-center gap-3 rounded-2xl border border-white/15 bg-[#0c1024]/90 px-4 py-3 backdrop-blur-md shadow-[0_18px_60px_-12px_rgba(0,0,0,0.8)]"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
              </span>
              <span className="text-[12px] text-paper/85">{card}</span>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Eyebrow hint au début */}
      <BlurFade delay={0.2} duration={0.7}>
        <div className="absolute inset-x-0 top-[8%] text-center text-[10px] uppercase tracking-[0.45em] text-red-300/80">
          {t.s1.hint}
        </div>
      </BlurFade>

      {/* Texte final */}
      <AnimatePresence>
        {showText && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <h2
              className="text-balance text-3xl font-semibold leading-tight text-paper sm:text-5xl lg:text-[5.5vw]"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                filter: "drop-shadow(0 6px 30px rgba(0,0,0,0.85))",
              }}
            >
              <div className="text-paper/85">
                <TextGenerateEffect words={t.s1.pull} stagger={0.07} />
              </div>
              <div className="mt-2 text-red-300">
                <TextGenerateEffect words={t.s1.strong} stagger={0.07} delay={0.6} />
              </div>
              <div className="mt-2 text-paper/85">
                <TextGenerateEffect words={t.s1.tail} stagger={0.07} delay={1.2} />
              </div>
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
