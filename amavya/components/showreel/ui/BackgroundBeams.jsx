"use client";

import { motion } from "framer-motion";

/**
 * BackgroundBeams — Aceternity UI inspired.
 * Faisceaux dorés qui rayonnent depuis le centre, en SVG (perf top).
 */
export default function BackgroundBeams({
  beams = 32,
  color = "#f0d27a",
  duration = 4,
  className = "",
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="beam-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="60%" stopColor={color} stopOpacity="0.0" />
          </radialGradient>
        </defs>
        {Array.from({ length: beams }).map((_, i) => {
          const angle = (i * 360) / beams;
          const len = 80 + (i % 3) * 10;
          const delay = (i % 8) * 0.1;
          return (
            <motion.line
              key={i}
              x1="50"
              y1="50"
              x2={50 + Math.cos((angle * Math.PI) / 180) * len}
              y2={50 + Math.sin((angle * Math.PI) / 180) * len}
              stroke={color}
              strokeWidth="0.15"
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: [0, 0.9, 0.3, 0.9, 0], pathLength: 1 }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
        <circle cx="50" cy="50" r="40" fill="url(#beam-grad)" opacity="0.25" />
      </svg>
    </div>
  );
}
