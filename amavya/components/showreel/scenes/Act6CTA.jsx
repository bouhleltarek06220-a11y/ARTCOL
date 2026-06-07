"use client";

import { motion } from "framer-motion";
import Spotlight from "../ui/Spotlight";
import BlurFade from "../ui/BlurFade";
import ShimmerButton from "../ui/ShimmerButton";
import AnimatedGradientText from "../ui/AnimatedGradientText";

/**
 * Acte 6 — L'INVITATION
 * Big logo + tagline + CTA shimmer. Reste affiché.
 */
export default function Act6CTA({ t, onClose }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#020208]">
      <Spotlight fill="#f0d27a" side="top" />

      {/* Lignes de grille fond */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,210,122,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(240,210,122,0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <BlurFade delay={0.3} duration={0.9} yOffset={20} blur={12}>
          <div className="text-[10px] uppercase tracking-[0.45em] text-gold-bright">
            {t.act6.footer}
          </div>
        </BlurFade>

        {/* Logo AMAVYA gigantesque en or */}
        <motion.h1
          className="mt-6 text-[16vmin] font-bold leading-[0.9] tracking-tight"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            filter: "drop-shadow(0 18px 60px rgba(240,210,122,0.55))",
          }}
          initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedGradientText durationS={6}>{t.act6.brand}</AnimatedGradientText>
        </motion.h1>

        <BlurFade delay={1.6} duration={0.9} yOffset={16}>
          <p className="mt-8 text-pretty text-xl font-light text-paper/90 sm:text-3xl">
            {t.act6.tagline}
          </p>
        </BlurFade>

        <BlurFade delay={2.3} duration={0.9} yOffset={16}>
          <div className="mt-10">
            <ShimmerButton
              onClick={() => {
                if (onClose) onClose();
                if (typeof window !== "undefined") window.location.href = "/#contact";
              }}
              className="text-base"
            >
              {t.act6.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ShimmerButton>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
