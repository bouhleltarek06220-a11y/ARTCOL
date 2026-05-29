"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import Scene from "@/components/matrix/Scene";
import Hud from "@/components/matrix/Hud";
import { STOPS } from "@/components/matrix/data";

const TOTAL_VH = 600; // 6× viewport pour avoir une longue traversée

export default function MatrixClient() {
  const { lang } = useLang();
  const containerRef = useRef(null);

  // Progression de scroll
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [stop, setStop] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setProgress(v);
    const s = Math.max(0, Math.min(STOPS - 1, Math.floor(v * STOPS)));
    setStop((prev) => (prev === s ? prev : s));
  });

  // Parallaxe souris
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.y = -(e.clientY / window.innerHeight) + 0.5;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Détection mobile pour qualité adaptative
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Loader court le temps que WebGL s'initialise
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(id);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-black" style={{ height: `${TOTAL_VH}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Scene progressRef={progressRef} mouseRef={mouseRef} mobile={mobile} />
        <Hud progress={progress} stop={stop} lang={lang} />

        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
              <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-emerald-400/70">
                Loading the construct
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
