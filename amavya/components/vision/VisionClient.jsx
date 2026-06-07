"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { VISION_SCENES, VISION_TEXT, VISION_TOTAL_MS } from "@/lib/vision-config";

import ShowreelHud from "@/components/showreel/ShowreelHud";
import ShowreelGrain from "@/components/showreel/ShowreelGrain";
import ShowreelCursor from "@/components/showreel/ShowreelCursor";

import Scene1Overwhelmed from "./scenes/Scene1Overwhelmed";
import Scene2Arrival from "./scenes/Scene2Arrival";
import Scene3CommandCenter from "./scenes/Scene3CommandCenter";
import Scene4Agents from "./scenes/Scene4Agents";
import Scene5Orchestration from "./scenes/Scene5Orchestration";
import Scene6GlobalFuture from "./scenes/Scene6GlobalFuture";
import Scene7Finale from "./scenes/Scene7Finale";

const SCENES = [
  Scene1Overwhelmed,
  Scene2Arrival,
  Scene3CommandCenter,
  Scene4Agents,
  Scene5Orchestration,
  Scene6GlobalFuture,
  Scene7Finale,
];

export default function VisionClient() {
  const router = useRouter();
  const { lang } = useLang();
  const t = VISION_TEXT[lang] || VISION_TEXT.fr;

  const [sceneIndex, setSceneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const currentScene = VISION_SCENES[sceneIndex];
  const isFinal = currentScene.durationMs === Infinity;

  // Timer RAF
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

  // Auto-advance
  useEffect(() => {
    if (isFinal) return;
    if (elapsed >= currentScene.durationMs) {
      const next = Math.min(sceneIndex + 1, VISION_SCENES.length - 1);
      setSceneIndex(next);
      setElapsed(0);
    }
  }, [elapsed, currentScene.durationMs, sceneIndex, isFinal]);

  // Audio
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    if (isPlaying) {
      a.play().catch(() => {});
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

  // Keyboard
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
    if (sceneIndex < VISION_SCENES.length - 1) {
      setSceneIndex((i) => i + 1);
      setElapsed(0);
    }
  };
  const replay = () => {
    setSceneIndex(0);
    setElapsed(0);
    setIsPlaying(true);
  };

  const totalElapsed =
    VISION_SCENES.slice(0, sceneIndex).reduce(
      (s, sc) => s + (sc.durationMs === Infinity ? 0 : sc.durationMs),
      0,
    ) + (isFinal ? 0 : elapsed);

  const CurrentScene = SCENES[sceneIndex];

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      style={{ cursor: "none" }}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src="/ambient.mp3" loop preload="auto" playsInline />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1] }}
          className="absolute inset-0"
        >
          <CurrentScene t={t} onClose={() => router.push("/")} />
        </motion.div>
      </AnimatePresence>

      <ShowreelGrain />

      <ShowreelHud
        sceneLabel={t.sceneLabels[currentScene.id]}
        totalElapsedMs={totalElapsed}
        totalDurationMs={VISION_TOTAL_MS}
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

      <ShowreelCursor />
    </div>
  );
}
