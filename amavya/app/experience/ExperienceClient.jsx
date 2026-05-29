"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import Scene from "@/components/experience/Scene";
import Hud from "@/components/experience/Hud";
import { STOPS } from "@/components/experience/data";

export default function ExperienceClient() {
  const { lang } = useLang();
  const containerRef = useRef(null);

  // Progression scroll
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progressRef = useRef(0);
  const [stop, setStop] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const s = Math.max(0, Math.min(STOPS - 1, Math.round(v * (STOPS - 1))));
    setStop((prev) => (prev === s ? prev : s));
  });

  // Parallaxe souris (normalisée -0.5 .. 0.5)
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.y = -(e.clientY / window.innerHeight) + 0.5;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Module actif (référence partagée à Scene)
  const activeRef = useRef(-1);

  // Détection mobile pour adaptation qualité
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // État de chargement (laisse 600ms pour l'init WebGL)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#03050a]" style={{ height: `${STOPS * 100}vh` }}>
      {/* Viewport collant : c'est ici que la scène + le HUD vivent */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Scene progressRef={progressRef} mouseRef={mouseRef} activeRef={activeRef} mobile={mobile} />
        <Hud stop={stop} lang={lang} />

        {/* Écran de chargement initial */}
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#03050a]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold-bright" />
              <p className="text-[10px] uppercase tracking-[0.32em] text-paper/55">Initializing neural core</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
