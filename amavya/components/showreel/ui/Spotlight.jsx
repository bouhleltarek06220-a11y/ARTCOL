"use client";

/**
 * Spotlight — Aceternity UI inspired.
 * Cône de lumière incliné qui éclaire la scène depuis un coin.
 */
export default function Spotlight({
  className = "",
  fill = "#f0d27a",
  side = "left", // "left" | "right" | "top"
}) {
  const transforms = {
    left: "translate(-25%, -10%) rotate(-25deg)",
    right: "translate(25%, -10%) rotate(25deg)",
    top: "translate(0, -30%) rotate(0deg)",
  };
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse 60% 90% at 50% 0%, ${fill}cc, ${fill}33 35%, transparent 65%)`,
          transform: transforms[side] || transforms.left,
          filter: "blur(40px)",
          opacity: 0.85,
        }}
      />
    </div>
  );
}
