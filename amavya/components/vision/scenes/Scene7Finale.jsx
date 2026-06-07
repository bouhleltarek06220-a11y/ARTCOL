"use client";

import { motion } from "framer-motion";
import BlurFade from "@/components/showreel/ui/BlurFade";
import Sparkles from "@/components/showreel/ui/Sparkles";
import Spotlight from "@/components/showreel/ui/Spotlight";
import ShimmerButton from "@/components/showreel/ui/ShimmerButton";

export default function Scene7Finale({ t, onClose }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#020208]">
      <Spotlight fill="#f0d27a" side="top" />
      <Sparkles density={180} color="#f0d27a" />

      {/* Grille de fond subtile */}
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
        {/* Phrase d'ouverture */}
        <BlurFade delay={0.3} duration={0.9} yOffset={18}>
          <p
            className="max-w-3xl text-base leading-relaxed text-paper/85 sm:text-lg lg:text-xl"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
          >
            {t.s7.pre}
          </p>
        </BlurFade>

        {/* Phrase principale en deux lignes */}
        <BlurFade delay={1.1} duration={1} yOffset={20} blur={10}>
          <h1
            className="mt-8 max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[5vw]"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.85))",
            }}
          >
            <span className="text-paper">{t.s7.title}</span>
            <br />
            <span className="bg-[linear-gradient(110deg,#a87f2e,#f0d27a_50%,#d4af37)] bg-clip-text text-transparent">
              {t.s7.title2}
            </span>
          </h1>
        </BlurFade>

        {/* Logo AMAVYA officiel — image vraie, plus pro */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10"
        >
          {/* Halo doré qui respire derrière le logo */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -m-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(240,210,122,0.45), transparent 65%)",
              filter: "blur(40px)",
            }}
            animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={t.s7.brand}
            className="relative h-auto w-[40vmin] max-w-[460px]"
            style={{
              filter:
                "drop-shadow(0 22px 70px rgba(240,210,122,0.65)) drop-shadow(0 0 40px rgba(240,210,122,0.45))",
            }}
          />
        </motion.div>

        <BlurFade delay={3.3} duration={0.9} yOffset={14}>
          <p className="mt-3 text-sm uppercase tracking-[0.32em] text-paper/65 sm:text-base">
            {t.s7.subtitle}
          </p>
        </BlurFade>

        <BlurFade delay={4} duration={0.9} yOffset={16}>
          <div className="mt-10">
            <ShimmerButton
              onClick={() => {
                if (onClose) onClose();
                if (typeof window !== "undefined") window.location.href = "/#contact";
              }}
              className="text-base"
            >
              {t.s7.cta}
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
