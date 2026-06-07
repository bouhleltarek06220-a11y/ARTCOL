"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor cinéma : un dot doré qui suit la souris avec lerp.
 * Désactivé si l'utilisateur a un input tactile ou prefers-reduced-motion.
 */
export default function ShowreelCursor() {
  const ref = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduceMotion) return;
    setEnabled(true);
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    current.current = { ...target.current };
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    let raf;
    const tick = () => {
      current.current = {
        x: current.current.x + (target.current.x - current.current.x) * 0.18,
        y: current.current.y + (target.current.y - current.current.y) * 0.18,
      };
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x - 8}px, ${current.current.y - 8}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[110] h-4 w-4 rounded-full"
      style={{
        background:
          "radial-gradient(circle, #f0d27a 30%, rgba(240,210,122,0.4) 60%, transparent 75%)",
        boxShadow: "0 0 18px 3px rgba(240,210,122,0.45)",
        willChange: "transform",
      }}
    />
  );
}
