"use client";

import { motion } from "framer-motion";

/**
 * TextGenerateEffect — Aceternity UI inspired.
 * Le texte se révèle MOT par MOT avec blur → focus.
 * Cadence rapide pour cinéma (delay 0.08s).
 */
export default function TextGenerateEffect({
  words,
  className = "",
  stagger = 0.08,
  delay = 0,
  blur = 8,
  duration = 0.55,
}) {
  const arr = (words || "").split(" ").filter(Boolean);
  return (
    <span className={className}>
      {arr.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: `blur(${blur}px)`, y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word}
          {i < arr.length - 1 && <span>&nbsp;</span>}
        </motion.span>
      ))}
    </span>
  );
}
