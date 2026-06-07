"use client";

import { motion } from "framer-motion";

/**
 * BlurFade — Magic UI inspired.
 * Apparition élégante : blur 10px → 0 + opacity 0 → 1 + translation Y.
 */
export default function BlurFade({
  children,
  delay = 0,
  duration = 0.7,
  yOffset = 14,
  blur = 8,
  ease = [0.22, 1, 0.36, 1],
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: `blur(${blur}px)` }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
