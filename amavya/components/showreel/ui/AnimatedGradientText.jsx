"use client";

/**
 * AnimatedGradientText — Magic UI inspired.
 * Texte avec un dégradé doré qui glisse en boucle (sheen).
 */
export default function AnimatedGradientText({
  children,
  className = "",
  from = "#a87f2e",
  via = "#f0d27a",
  to = "#d4af37",
  durationS = 6,
}) {
  return (
    <>
      <style>{`
        @keyframes amavya-grad-sheen {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      <span
        className={className}
        style={{
          background: `linear-gradient(110deg, ${from}, ${via} 50%, ${to}, ${via} 50%, ${from})`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: `amavya-grad-sheen ${durationS}s linear infinite`,
        }}
      >
        {children}
      </span>
    </>
  );
}
