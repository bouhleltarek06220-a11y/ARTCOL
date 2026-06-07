"use client";

/**
 * Grain — overlay SVG noise très léger pour effet film/cinéma.
 * Performance : un seul élément, opacity faible.
 */
export default function ShowreelGrain({ opacity = 0.06 }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] mix-blend-overlay"
      style={{ opacity }}
    >
      <svg className="h-full w-full">
        <filter id="amavya-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#amavya-grain)" />
      </svg>
    </div>
  );
}
