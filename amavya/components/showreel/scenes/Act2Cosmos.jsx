"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AuroraBackground from "../ui/AuroraBackground";
import BlurFade from "../ui/BlurFade";

/**
 * Acte 2 — COSMOS
 * Étoiles qui défilent vers la caméra (hyperspeed), puis aurore qui flash,
 * puis tagline "pour le monde" qui apparaît.
 */
function Hyperspeed() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let stars = [];
    const COUNT = 400;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    function spawn() {
      stars = Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w,
        pz: 0,
      }));
    }
    let raf;
    function tick() {
      ctx.fillStyle = "rgba(0,0,4,0.45)";
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      for (const s of stars) {
        s.pz = s.z;
        s.z -= 18;
        if (s.z < 1) {
          s.x = (Math.random() - 0.5) * w;
          s.y = (Math.random() - 0.5) * h;
          s.z = w;
          s.pz = s.z;
        }
        const sx = (s.x / s.z) * w;
        const sy = (s.y / s.z) * w;
        const psx = (s.x / s.pz) * w;
        const psy = (s.y / s.pz) * w;
        const a = 1 - s.z / w;
        ctx.strokeStyle = `rgba(255,240,200,${a})`;
        ctx.lineWidth = a * 2;
        ctx.beginPath();
        ctx.moveTo(psx, psy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      ctx.restore();
      raf = requestAnimationFrame(tick);
    }
    const ro = new ResizeObserver(() => {
      resize();
      spawn();
    });
    ro.observe(canvas);
    resize();
    spawn();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default function Act2Cosmos({ t }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Étoiles à 1000km/h */}
      <Hyperspeed />

      {/* Flash blanc bref à mi-parcours */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{ duration: 5, times: [0, 0.55, 0.6, 0.7] }}
      />

      {/* Aurore qui prend le relais après le flash */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.9] }}
        transition={{ duration: 8, times: [0, 0.6, 1] }}
      >
        <AuroraBackground colors={["#f0d27a", "#33ccdd", "#a87f2e"]} />
      </motion.div>

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 220px 60px rgba(0,0,0,0.85)" }}
      />

      {/* Texte */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <BlurFade delay={6.5} duration={0.9} yOffset={20} blur={10}>
          <div className="text-[10px] uppercase tracking-[0.45em] text-gold-bright">
            {t.act2.pre}
          </div>
        </BlurFade>
        <BlurFade delay={7} duration={1} yOffset={24} blur={12}>
          <h2
            className="mt-5 text-[10vmin] font-bold leading-[1] tracking-tight text-paper sm:text-[7rem]"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              filter: "drop-shadow(0 6px 30px rgba(0,0,0,0.7))",
            }}
          >
            {t.act2.title}
          </h2>
        </BlurFade>
      </div>
    </div>
  );
}
