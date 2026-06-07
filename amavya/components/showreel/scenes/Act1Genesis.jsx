"use client";

import { motion } from "framer-motion";
import Sparkles from "../ui/Sparkles";
import TextGenerateEffect from "../ui/TextGenerateEffect";
import BlurFade from "../ui/BlurFade";
import AnimatedGradientText from "../ui/AnimatedGradientText";

const EASE = [0.85, 0, 0.15, 1];

export default function Act1Genesis({ t }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Sparkles dorées denses qui scintillent */}
      <Sparkles density={260} color="#f0d27a" />

      {/* Halo central qui grossit */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(240,210,122,0.35), transparent 60%)",
          filter: "blur(40px)",
        }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.2, 1], opacity: [0, 0.8, 0.5] }}
        transition={{ duration: 5, times: [0, 0.4, 1], ease: EASE }}
      />

      {/* Contenu texte */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <BlurFade delay={0.3} duration={0.9} blur={12} yOffset={20}>
          <div className="text-[10px] uppercase tracking-[0.45em] text-gold-bright">
            {t.act1.pre}
          </div>
        </BlurFade>

        {/* Logo "AMAVYA" letter-by-letter */}
        <motion.h1
          className="mt-7 text-[14vmin] font-bold leading-[0.95] tracking-tight"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            background:
              "linear-gradient(110deg, #a87f2e, #f0d27a 50%, #d4af37)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 12px 40px rgba(240,210,122,0.4))",
          }}
        >
          {t.act1.brand.split("").map((c, i) => (
            <motion.span
              key={`${c}-${i}`}
              initial={{ opacity: 0, y: 30, filter: "blur(16px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 1.0 + i * 0.12,
                ease: EASE,
              }}
              className="inline-block"
            >
              {c}
            </motion.span>
          ))}
        </motion.h1>

        <BlurFade delay={2.6} duration={0.9} blur={8} yOffset={10}>
          <p className="mt-8 text-[3vmin] font-light text-paper/85 sm:text-2xl">
            <AnimatedGradientText durationS={8}>{t.act1.tagline}</AnimatedGradientText>
          </p>
        </BlurFade>
      </div>

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 200px 60px rgba(0,0,0,0.85)" }}
      />
    </div>
  );
}
