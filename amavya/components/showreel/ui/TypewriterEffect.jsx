"use client";

import { useEffect, useState } from "react";

/**
 * TypewriterEffect — Aceternity UI inspired.
 * Tape un texte caractère par caractère + curseur clignotant.
 */
export default function TypewriterEffect({
  text = "",
  speedMs = 28,
  className = "",
  caret = true,
  caretColor = "#f0d27a",
  startDelayMs = 0,
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    let cancelled = false;
    const start = setTimeout(() => {
      if (cancelled) return;
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i++;
        setShown(i);
        if (i < text.length) setTimeout(tick, speedMs);
      };
      tick();
    }, startDelayMs);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [text, speedMs, startDelayMs]);

  return (
    <span className={className}>
      <span>{text.slice(0, shown)}</span>
      {caret && (
        <span
          aria-hidden="true"
          className="ml-1 inline-block w-[2px] animate-pulse align-middle"
          style={{
            height: "1em",
            background: caretColor,
            verticalAlign: "middle",
          }}
        />
      )}
    </span>
  );
}
