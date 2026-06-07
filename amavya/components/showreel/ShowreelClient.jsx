"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { SHOWREEL_SCENES, SHOWREEL_TEXT, SHOWREEL_TOTAL_MS } from "@/lib/showreel-config";

import ShowreelHud from "./ShowreelHud";
import ShowreelGrain from "./ShowreelGrain";
import ShowreelCursor from "./ShowreelCursor";

import Act1Genesis from "./scenes/Act1Genesis";
import Act2Cosmos from "./scenes/Act2Cosmos";
import Act3Solutions from "./scenes/Act3Solutions";
import Act4Agent from "./scenes/Act4Agent";
import Act5World from "./scenes/Act5World";
import Act6CTA from "./scenes/Act6CTA";

const ACTS = [Act1Genesis, Act2Cosmos, Act3Solutions, Act4Agent, Act5World, Act6CTA];

export default function ShowreelClient() {
  const router = useRouter();
  const { lang } = useLang();
  const t = SHOWREEL_TEXT[lang] || SHOWREEL_TEXT.fr;

  const [sceneIndex, setSceneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const currentScene = SHOWREEL_SCENES[sceneIndex];
  const isFinal = currentScene.durationMs === Infinity;

  // Timer principal — RAF pour cohérence visuelle
  useEffect(() => {
    if (!isPlaying || isFinal) return;
    let lastT = performance.now();
    let raf;
    const tick = (now) => {
      const dt = now - lastT;
      lastT = now;
      setElapsed((e) => e + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, isFinal, sceneIndex]);

  // Avance auto quand la scène est finie
  useEffect(() => {
    if (isFinal) return;
    if (elapsed >= currentScene.durationMs) {
      const next = Math.min(sceneIndex + 1, SHOWREEL_SCENES.length - 1);
      setSceneIndex(next);
      setElapsed(0);
    }
  }, [elapsed, currentScene.durationMs, sceneIndex, isFinal]);

  // Audio : démarrage doux + mute
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    if (isPlaying) {
      a.play().catch(() => {});
      // Fade in volume
      let v = 0;
      const id = setInterval(() => {
        v = Math.min(0.32, v + 0.04);
        a.volume = isMuted ? 0 : v;
        if (v >= 0.32) clearInterval(id);
      }, 80);
      return () => clearInterval(id);
    } else {
      a.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  // Raccourcis clavier
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === "Escape") {
        router.push("/");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        skip();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted((m) => !m);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const skip = () => {
    if (sceneIndex < SHOWREEL_SCENES.length - 1) {
      setSceneIndex((i) => i + 1);
      setElapsed(0);
    }
  };
  const replay = () => {
    setSceneIndex(0);
    setElapsed(0);
    setIsPlaying(true);
  };

  // Total elapsed (cumulatif sur les scènes finies + scène courante)
  const totalElapsed =
    SHOWREEL_SCENES.slice(0, sceneIndex).reduce(
      (s, sc) => s + (sc.durationMs === Infinity ? 0 : sc.durationMs),
      0,
    ) + (isFinal ? 0 : elapsed);

  const CurrentAct = ACTS[sceneIndex];

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      style={{ cursor: "none" }}
    >
      {/* Audio ambient */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src="/ambient.mp3"
        loop
        preload="auto"
        playsInline
      />

      {/* Acte courant avec crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1] }}
          className="absolute inset-0"
        >
          <CurrentAct t={t} onClose={() => router.push("/")} />
        </motion.div>
      </AnimatePresence>

      {/* Grain film */}
      <ShowreelGrain />

      {/* HUD */}
      <ShowreelHud
        sceneLabel={t.sceneLabels[currentScene.id]}
        totalElapsedMs={totalElapsed}
        totalDurationMs={SHOWREEL_TOTAL_MS}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onToggleMute={() => setIsMuted((m) => !m)}
        onSkip={skip}
        onClose={() => router.push("/")}
        onReplay={replay}
        t={t}
        showReplay={isFinal}
      />

      {/* Cursor doré custom */}
      <ShowreelCursor />
    </div>
  );
}
