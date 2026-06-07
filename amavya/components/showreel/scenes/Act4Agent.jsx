"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Spotlight from "../ui/Spotlight";
import BlurFade from "../ui/BlurFade";
import TypewriterEffect from "../ui/TypewriterEffect";

/**
 * Tête de robot dorée (réutilise le design du chatbot).
 */
function RobotHeadXL({ size = 220 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-[0_18px_50px_rgba(240,210,122,0.45)]"
    >
      <defs>
        <linearGradient id="rh-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a87f2e" />
          <stop offset="55%" stopColor="#f0d27a" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
      <line x1="16" y1="2.5" x2="16" y2="6" stroke="url(#rh-grad)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="2.5" r="1.4" fill="url(#rh-grad)" />
      <rect x="5" y="6.5" width="22" height="18" rx="5" stroke="url(#rh-grad)" strokeWidth="1.8" fill="none" />
      <circle cx="11.5" cy="14.5" r="2.1" fill="url(#rh-grad)" />
      <circle cx="20.5" cy="14.5" r="2.1" fill="url(#rh-grad)" />
      <path d="M12 19.2 Q16 21.5 20 19.2" stroke="url(#rh-grad)" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <rect x="2.5" y="13" width="2.5" height="5" rx="1" fill="url(#rh-grad)" opacity="0.85" />
      <rect x="27" y="13" width="2.5" height="5" rx="1" fill="url(#rh-grad)" opacity="0.85" />
      <rect x="13" y="24" width="6" height="2.5" rx="0.8" fill="url(#rh-grad)" opacity="0.55" />
    </svg>
  );
}

export default function Act4Agent({ t }) {
  const [bubble, setBubble] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setBubble(1), 2200);
    const t2 = setTimeout(() => setBubble(2), 4400);
    const t3 = setTimeout(() => setBubble(3), 6600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const dialogue = t.act4.dialogue;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#04040a]">
      <Spotlight fill="#f0d27a" side="top" />

      {/* Tête de robot pulsante */}
      <motion.div
        className="absolute left-1/2 top-[28%] z-10 -translate-x-1/2"
        initial={{ opacity: 0, y: 30, scale: 0.7, filter: "blur(20px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <RobotHeadXL size={220} />
        </motion.div>
      </motion.div>

      {/* Eyebrow */}
      <BlurFade delay={0.4} duration={0.8}>
        <div className="absolute left-1/2 top-[14%] z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.45em] text-gold-bright">
          {t.act4.pre}
        </div>
      </BlurFade>

      {/* Bulles de dialogue */}
      <div className="absolute inset-x-0 bottom-[12%] z-10 flex flex-col items-center gap-3 px-6 text-center sm:gap-4">
        <AnimatePresence mode="wait">
          {bubble >= 1 && (
            <motion.div
              key={`b-${bubble}`}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-gold/30 bg-black/70 px-6 py-3.5 text-lg text-paper backdrop-blur-xl sm:text-2xl"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              <TypewriterEffect
                text={dialogue[bubble - 1] || ""}
                speedMs={26}
                caretColor="#f0d27a"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
