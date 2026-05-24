/**
 * Logo AMAVYA — marque vectorielle (logomark "A" + wordmark).
 * Remplaçable par le fichier de marque définitif.
 */
export function LogoMark({ size = 34, className = "" }) {
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
        <linearGradient id="amavya-mark" x1="6" y1="44" x2="42" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2b6bff" />
          <stop offset="0.55" stopColor="#4f8bff" />
          <stop offset="1" stopColor="#a978ff" />
        </linearGradient>
        <linearGradient id="amavya-spark" x1="24" y1="14" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3fe0ff" />
          <stop offset="1" stopColor="#8b5cff" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="13" fill="#080a14" />
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="13"
        stroke="url(#amavya-mark)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Le "A" stylisé */}
      <path
        d="M16 34 L24 13 L32 34"
        stroke="url(#amavya-mark)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 27 L28.5 27"
        stroke="url(#amavya-spark)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="13" r="2.4" fill="#3fe0ff" />
    </svg>
  );
}

export function Logo({ withWordmark = true, size = 34, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="text-[1.15rem] font-semibold tracking-[0.2em] text-paper">
          AMAVYA
        </span>
      )}
    </span>
  );
}

export default Logo;
