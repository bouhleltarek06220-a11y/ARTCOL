"use client";

import { useEffect, useRef } from "react";

/**
 * Sparkles — Aceternity UI inspired.
 * Particules dorées qui scintillent et flottent. Canvas 2D pour la perf.
 * Prop `density` = quantité de particules.
 * Prop `convergeAt` (0..1) = moment où elles convergent vers le centre.
 */
export default function Sparkles({
  density = 220,
  color = "#f0d27a",
  className = "",
  background = "transparent",
  speed = 1,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    function spawn() {
      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.4 * speed,
          vy: (Math.random() - 0.5) * 0.4 * speed,
          a: Math.random() * Math.PI * 2,
          tw: Math.random() * 0.02 + 0.008,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let raf;
    let t0 = performance.now();
    function tick(now) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        const alpha = 0.55 + Math.sin(t * 2 + p.phase) * 0.45;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
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
  }, [density, color, background, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
