"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import Scene from "@/components/matrix/Scene";
import Hud from "@/components/matrix/Hud";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { JOURNEY_DURATION, UI } from "@/components/matrix/data";

// Scène Spline : humanoïde 3D qui suit le curseur
const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function MatrixClient() {
  const { lang, setLang } = useLang();

  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(true);
  const lastT = useRef(0);
  const rafRef = useRef(0);

  // Boucle d'avancement automatique du voyage
  useEffect(() => {
    const tick = (now) => {
      if (lastT.current === 0) lastT.current = now;
      const dt = (now - lastT.current) / 1000;
      lastT.current = now;

      if (playingRef.current) {
        let next = progressRef.current + dt / JOURNEY_DURATION;
        if (next >= 1) {
          next = 1;
          playingRef.current = false;
          setPlaying(false);
        }
        progressRef.current = next;
        setProgress(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying((prev) => {
      const next = !prev;
      // Si on relance depuis la fin, on repart au début
      if (next && progressRef.current >= 1) {
        progressRef.current = 0;
        setProgress(0);
      }
      playingRef.current = next;
      return next;
    });
  }, []);

  const scrub = useCallback((v) => {
    progressRef.current = v;
    setProgress(v);
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const replay = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    playingRef.current = true;
    setPlaying(true);
  }, []);

  // Barre d'espace = play/pause
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay]);

  // Mobile
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setMobile(window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [ready, setReady] = useState(false);
  const ui = UI[lang] || UI.fr;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Scene progressRef={progressRef} mobile={mobile} lang={lang} onReady={() => setReady(true)} />

      {/* Humanoïde Spline (suit le curseur) — calque transparent par-dessus
          la scène Matrix, le code reste visible derrière. */}
      <div className="absolute inset-0 z-[5]">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#f0d27a" />
        <SplineScene scene={SPLINE_SCENE} className="h-full w-full" />
      </div>

      <Hud
        progress={progress}
        playing={playing}
        onTogglePlay={togglePlay}
        onScrub={scrub}
        onReplay={replay}
        lang={lang}
        setLang={setLang}
      />

      {/* Loader */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: ready ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 z-20 flex items-center justify-center bg-black ${ready ? "pointer-events-none" : ""}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
          <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-emerald-400/70">
            {ui.loading}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
