"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+=<>?/\\|";

/**
 * Effet "decode" : affiche un texte cible avec des caractères aléatoires
 * qui se figent progressivement (façon Matrix / Mr Robot). Quand `active`
 * passe à true, l'animation démarre du début.
 */
export default function DecodeText({ target, active, duration = 1400 }) {
  const [display, setDisplay] = useState("");
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!active || !target) {
      setDisplay("");
      return;
    }
    const start = performance.now();
    const len = target.length;
    const tick = (now) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = target[i];
        if (ch === " ") { out += " "; continue; }
        // chaque lettre se "fige" à un moment décalé
        const cp = p * (len + 6) - i;
        if (cp <= 0) out += " ";
        else if (cp >= 1) out += ch;
        else out += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
      }
      setDisplay(out);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active, duration]);

  return <>{display}</>;
}
