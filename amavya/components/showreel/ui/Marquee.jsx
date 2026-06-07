"use client";

/**
 * Marquee — Magic UI inspired.
 * Défilement horizontal en boucle, pause au survol.
 */
export default function Marquee({
  items = [],
  durationS = 26,
  reverse = false,
  className = "",
  itemClassName = "",
}) {
  const loop = [...items, ...items];
  return (
    <>
      <style>{`
        @keyframes amavya-marquee {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className={`relative flex overflow-hidden ${className}`}
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="flex w-max items-center gap-12 whitespace-nowrap"
          style={{
            animation: `amavya-marquee ${durationS}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {loop.map((item, i) => (
            <div key={i} className={itemClassName}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
