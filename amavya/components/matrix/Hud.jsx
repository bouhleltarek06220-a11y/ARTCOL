"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * HUD minimaliste : aucun texte, aucun contrôle visible. Le visiteur est
 * immergé. Seul un bouton portant le vrai logo AMAVYA apparaît à la fin
 * pour entrer sur le site.
 */
export default function Hud({ progress }) {
  const ended = progress > 0.96;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Vignette douce pour la profondeur (pas de texte) */}
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 240px 60px rgba(0,0,0,0.8)" }} />

      {/* Bouton logo AMAVYA — apparaît à la fin */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <Link
              href="/"
              aria-label="AMAVYA"
              className="group pointer-events-auto relative flex items-center justify-center rounded-2xl border border-[#f0d27a]/30 bg-black/40 p-3 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#f0d27a]/70"
              style={{ boxShadow: "0 12px 70px -12px rgba(240,210,122,0.55)" }}
            >
              {/* Halo doré au survol */}
              <span className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle,rgba(240,210,122,0.35),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              <Image
                src="/logo.png"
                alt="AMAVYA"
                width={220}
                height={220}
                priority
                className="relative h-20 w-auto drop-shadow-[0_0_18px_rgba(240,210,122,0.45)]"
              />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
