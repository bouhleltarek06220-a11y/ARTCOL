"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import Scene from "@/components/matrix/Scene";
import Hud from "@/components/matrix/Hud";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { JOURNEY_DURATION } from "@/components/matrix/data";

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

  // Musique de fond : démarrage au premier geste (autoplay sonore bloqué),
  // + bouton son on/off discret.
  const audioRef = useRef(null);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const audio = new Audio("/matrix-music.mp3");
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    const start = () => {
      audio.play().catch(() => {});
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    window.addEventListener("touchstart", start);

    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setSoundOn((on) => {
      const next = !on;
      audio.muted = !next;
      if (next && audio.paused) audio.play().catch(() => {});
      return next;
    });
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Scene progressRef={progressRef} mobile={mobile} lang={lang} onReady={() => setReady(true)} />

      {/* Humanoïde Spline (suit le curseur) — calque transparent par-dessus
          la scène Matrix, le code reste visible derrière. */}
      <div className="absolute inset-0 z-[5]">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#f0d27a" />
        <SplineScene scene={SPLINE_SCENE} className="h-full w-full" />
      </div>

      <Hud progress={progress} />

      {/* Bouton son discret (icône seule) */}
      <button
        onClick={toggleSound}
        aria-label={soundOn ? "Couper le son" : "Activer le son"}
        className="absolute right-5 top-5 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur-md transition-all hover:scale-110 hover:text-white"
      >
        {soundOn ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a9 9 0 0 1 0 14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      {/* Loader (sans texte) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: ready ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 z-20 flex items-center justify-center bg-black ${ready ? "pointer-events-none" : ""}`}
      >
        <span className="loader" />
      </motion.div>
    </div>
  );
}
