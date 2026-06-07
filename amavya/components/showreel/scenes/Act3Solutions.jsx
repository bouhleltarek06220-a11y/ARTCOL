"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  IconAgent,
  IconCRM,
  IconAutomation,
  IconProspection,
  IconSaaS,
  IconFormation,
} from "@/components/Icons";
import BackgroundBeams from "../ui/BackgroundBeams";
import BlurFade from "../ui/BlurFade";
import TextGenerateEffect from "../ui/TextGenerateEffect";

const ICONS = [IconAgent, IconCRM, IconAutomation, IconProspection, IconSaaS, IconFormation];

/**
 * Acte 3 — SOLUTIONS
 * Les 6 solutions défilent rapidement (1.4s chacune), puis la phrase
 * "Six solutions. Une mission." apparaît en finale.
 */
export default function Act3Solutions({ t }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i < 5 ? i + 1 : i));
    }, 1300);
    return () => clearInterval(id);
  }, []);

  const Icon = ICONS[idx];
  const label = t.act3.solutions[idx];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#04040a]">
      {/* Beams dorés rayonnants */}
      <BackgroundBeams beams={24} color="#f0d27a" duration={5} />

      {/* Grille de fond subtile */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,210,122,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(240,210,122,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <BlurFade delay={0.2} duration={0.8}>
        <div className="absolute left-1/2 top-[12%] z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.45em] text-gold-bright">
          {t.act3.pre}
        </div>
      </BlurFade>

      {/* Carousel d'icônes */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)", rotate: -8 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0 }}
            exit={{ opacity: 0, scale: 1.3, filter: "blur(16px)", rotate: 8 }}
            transition={{ duration: 0.45, ease: [0.85, 0, 0.15, 1] }}
            className="flex flex-col items-center gap-7"
          >
            <div
              className="flex h-32 w-32 items-center justify-center rounded-3xl border border-gold/30 sm:h-44 sm:w-44"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,127,46,0.45), rgba(240,210,122,0.18))",
                boxShadow: "0 30px 80px -20px rgba(240,210,122,0.65)",
              }}
            >
              <Icon width={64} height={64} className="text-gold-bright" />
            </div>
            <div
              className="text-[6vmin] font-bold leading-[1] tracking-tight text-paper sm:text-5xl"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              {label}
            </div>
            <div className="text-xs uppercase tracking-[0.35em] text-gold-bright/80">
              0{idx + 1} / 06
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Phrase finale qui apparaît à la fin */}
      <motion.div
        className="absolute inset-x-0 bottom-[14%] z-10 text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: idx === 5 ? 1 : 0, y: idx === 5 ? 0 : 14 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-sm uppercase tracking-[0.3em] text-paper/80 sm:text-base">
          <TextGenerateEffect words={t.act3.cta} stagger={0.07} />
        </div>
      </motion.div>
    </div>
  );
}
