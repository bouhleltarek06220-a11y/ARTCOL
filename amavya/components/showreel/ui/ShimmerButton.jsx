"use client";

import { motion } from "framer-motion";

/**
 * ShimmerButton — Magic UI inspired.
 * Bouton avec reflet lumineux qui traverse en boucle + halo pulsant.
 */
export default function ShimmerButton({
  children,
  onClick,
  href,
  className = "",
}) {
  const inner = (
    <>
      {/* Halo pulsant derrière */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(240,210,122,0.55),transparent_70%)] blur-2xl"
        animate={{ opacity: [0.5, 0.95, 0.5], scale: [0.95, 1.15, 0.95] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Reflet qui traverse */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.4)_50%,transparent_70%)] [animation:amavya-shimmer_3.2s_linear_infinite]" />
      </span>
      <style>{`
        @keyframes amavya-shimmer {
          0% { transform: translateX(0%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
      <span className="relative z-10 flex items-center gap-2 font-semibold">
        {children}
      </span>
    </>
  );

  const cls =
    "group relative inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-7 py-3.5 text-sm text-ink shadow-[0_12px_50px_-10px_rgba(240,210,122,0.85)] transition-transform duration-300 hover:-translate-y-0.5 " +
    className;

  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
