"use client";

import { useEffect, useRef } from "react";

/**
 * Fond animé : réseau de "villes" (points lumineux) reliées par des routes
 * dorées, avec des impulsions de données qui circulent (le flux de connexion).
 * Purement décoratif. Respecte prefers-reduced-motion (image fixe).
 */
const GOLD = "212,175,55";
const GOLD_BRIGHT = "247,233,200";

export default function CityNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let nodes = [];
    let links = [];
    let pulses = [];
    let raf = 0;
    let resizeTimer;

    const rand = (a, b) => a + Math.random() * (b - a);

    function build() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(14, Math.min(34, Math.round((width * height) / 52000)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        const major = Math.random() < 0.16;
        nodes.push({
          x: rand(0, width),
          y: rand(0, height),
          vx: rand(-0.08, 0.08),
          vy: rand(-0.08, 0.08),
          r: major ? rand(2.4, 3.4) : rand(1, 1.8),
          twPhase: rand(0, Math.PI * 2),
        });
      }

      links = [];
      const seen = new Set();
      for (let i = 0; i < nodes.length; i++) {
        const neighbors = nodes
          .map((n, j) => ({ j, d: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 2);
        for (const { j } of neighbors) {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) continue;
          seen.add(key);
          links.push({ a: i, b: j });
        }
      }

      pulses = [];
      links.forEach((_, idx) => {
        if (Math.random() < 0.65) {
          pulses.push({ link: idx, t: Math.random(), speed: rand(0.0016, 0.0042) });
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Routes
      ctx.lineWidth = 1;
      for (const l of links) {
        const a = nodes[l.a];
        const b = nodes[l.b];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const alpha = 0.12 - dist / 9000;
        if (alpha <= 0.005) continue;
        ctx.strokeStyle = `rgba(${GOLD},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Impulsions (flux de données)
      for (const p of pulses) {
        const l = links[p.link];
        const a = nodes[l.a];
        const b = nodes[l.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${GOLD_BRIGHT},0.9)`;
        ctx.shadowColor = `rgba(${GOLD_BRIGHT},0.9)`;
        ctx.shadowBlur = 8;
        ctx.arc(x, y, 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (!reduce) {
          p.t += p.speed;
          if (p.t > 1) p.t = 0;
        }
      }

      // Villes
      const time = performance.now() * 0.001;
      for (const n of nodes) {
        const tw = 0.6 + 0.4 * Math.sin(time * 1.5 + n.twPhase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${GOLD_BRIGHT},${0.5 * tw + 0.2})`;
        ctx.shadowColor = `rgba(${GOLD},0.8)`;
        ctx.shadowBlur = n.r > 2 ? 12 : 5;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    }

    build();
    draw();

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(raf);
        build();
        draw();
      }, 200);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0"
      style={{ opacity: 0.5 }}
    />
  );
}
