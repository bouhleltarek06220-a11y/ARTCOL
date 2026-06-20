"use client";

import { useEffect, useRef } from "react";
import { useVilla } from "../store";
import { touchInput, resetTouchInput } from "../core/touchInput";

/** Rayon max de débattement du joystick (px). */
const R = 52;

/**
 * Contrôles tactiles (mobile / tablette) : joystick de déplacement en bas à
 * gauche, bouton « Sortir », et astuce de regard. Le regard lui-même est géré
 * par le <Player/> (glisser sur la scène). Visible seulement pendant la visite.
 */
export function TouchControls() {
  const phase = useVilla((s) => s.phase);
  const setPhase = useVilla((s) => s.setPhase);
  const visible = phase === "visiting";

  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!visible) resetTouchInput();
  }, [visible]);

  const start = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = base.current!.getBoundingClientRect();
    origin.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  const move = (e: React.PointerEvent) => {
    if (!origin.current) return;
    let dx = e.clientX - origin.current.x;
    let dy = e.clientY - origin.current.y;
    const d = Math.hypot(dx, dy) || 1;
    if (d > R) {
      dx = (dx / d) * R;
      dy = (dy / d) * R;
    }
    if (knob.current) knob.current.style.transform = `translate(${dx}px, ${dy}px)`;
    touchInput.move.x = dx / R;
    touchInput.move.y = -dy / R; // haut = avancer
  };
  const end = () => {
    origin.current = null;
    if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
    touchInput.move.x = 0;
    touchInput.move.y = 0;
  };

  if (!visible) return null;

  return (
    <>
      {/* Joystick de déplacement */}
      <div
        ref={base}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className="pointer-events-auto absolute bottom-8 left-8 z-20 flex h-32 w-32 touch-none select-none items-center justify-center rounded-full"
        style={{
          background: "rgba(20,14,6,.28)",
          border: "1px solid rgba(255,247,235,.28)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          ref={knob}
          className="h-14 w-14 rounded-full"
          style={{
            background: "rgba(255,247,235,.85)",
            boxShadow: "0 4px 14px rgba(0,0,0,.35)",
            transition: "transform .03s linear",
          }}
        />
      </div>

      {/* Bouton Sortir */}
      <button
        type="button"
        onClick={() => setPhase("intro")}
        className="pointer-events-auto absolute bottom-12 right-8 z-20 rounded-full px-5 py-3 text-[11px] uppercase text-[#fff7eb]"
        style={{
          background: "rgba(20,14,6,.4)",
          border: "1px solid rgba(255,247,235,.3)",
          letterSpacing: "0.2em",
          backdropFilter: "blur(6px)",
        }}
      >
        Sortir
      </button>

      {/* Astuce regard */}
      <div
        className="pointer-events-none absolute right-8 top-1/2 z-10 -translate-y-1/2 text-right text-[10px] uppercase leading-relaxed text-[#fff7eb]/70"
        style={{ letterSpacing: "0.2em", textShadow: "0 1px 12px rgba(0,0,0,.6)" }}
      >
        glissez pour
        <br />
        regarder
      </div>
    </>
  );
}
