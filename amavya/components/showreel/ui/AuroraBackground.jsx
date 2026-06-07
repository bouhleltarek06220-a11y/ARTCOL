"use client";

/**
 * AuroraBackground — Aceternity UI inspired.
 * Voiles colorés qui défilent doucement façon aurore boréale.
 * Pur CSS (gradient + animation keyframes) pour la perf.
 */
export default function AuroraBackground({
  className = "",
  colors = ["#f0d27a", "#33ccdd", "#a87f2e"],
}) {
  const [c1, c2, c3] = colors;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <style>{`
        @keyframes aurora-1 {
          0% { transform: translate(-20%, -10%) rotate(-20deg) scale(1.6); }
          100% { transform: translate(20%, 10%) rotate(20deg) scale(1.8); }
        }
        @keyframes aurora-2 {
          0% { transform: translate(30%, 20%) rotate(40deg) scale(1.8); }
          100% { transform: translate(-30%, -20%) rotate(-40deg) scale(1.4); }
        }
        @keyframes aurora-3 {
          0% { transform: translate(-10%, 30%) rotate(60deg) scale(1.4); }
          100% { transform: translate(10%, -30%) rotate(-60deg) scale(1.7); }
        }
      `}</style>
      <div
        className="absolute inset-0 opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(circle at 30% 40%, ${c1}, transparent 60%)`,
          animation: "aurora-1 10s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0 opacity-50 blur-3xl"
        style={{
          background: `radial-gradient(circle at 70% 60%, ${c2}, transparent 60%)`,
          animation: "aurora-2 12s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0 opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${c3}, transparent 60%)`,
          animation: "aurora-3 14s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}
