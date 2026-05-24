"use client";

import { useState } from "react";

/**
 * Emblème vectoriel doré (repli) — un "A" métallique or/argent.
 * Sert de fallback tant que /logo.png n'est pas présent, et de signature.
 */
export function LogoMark({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="amavya-gold" x1="8" y1="42" x2="40" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a87f2e" />
          <stop offset="0.5" stopColor="#f0d27a" />
          <stop offset="1" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="amavya-silver" x1="14" y1="34" x2="34" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8a909c" />
          <stop offset="1" stopColor="#e6e9f0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="13" fill="#0a0a0b" />
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="13"
        stroke="url(#amavya-gold)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Le "A" stylisé */}
      <path
        d="M16 34 L24 13 L32 34"
        stroke="url(#amavya-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 27 L28.5 27"
        stroke="url(#amavya-silver)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="13" r="2.4" fill="#f0d27a" />
    </svg>
  );
}

/**
 * Logo de marque : emblème AMAVYA (poignée de main robot/humain) + wordmark.
 * Utilise /logo-mark.png (emblème carré détouré du logo officiel) afin que le
 * nom reste net et lisible à petite taille. Repli sur l'emblème vectoriel doré
 * si l'image est absente.
 */
export default function Logo({ size = 40, showWordmark = true, className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {failed ? (
        <LogoMark size={size} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo-mark.png"
          alt="AMAVYA"
          onError={() => setFailed(true)}
          width={size}
          height={size}
          style={{ height: size, width: size }}
          className="select-none object-contain"
        />
      )}
      {showWordmark && (
        <span
          className="font-semibold leading-none tracking-[0.28em] text-gradient"
          style={{ fontSize: Math.round(size * 0.42) }}
        >
          AMAVYA
        </span>
      )}
    </span>
  );
}
