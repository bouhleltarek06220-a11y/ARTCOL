export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="AMAVYA"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="amavya-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6dd9b" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="amavya-silver" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#9aa3b2" />
          <stop offset="100%" stopColor="#e7ebf2" />
        </linearGradient>
        <linearGradient id="amavya-letter" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5b8dff" />
          <stop offset="100%" stopColor="#b98bff" />
        </linearGradient>
      </defs>
      {/* Upper gold arc */}
      <path
        d="M10 30 A22 22 0 0 1 54 30"
        stroke="url(#amavya-gold)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* Lower silver arc */}
      <path
        d="M54 34 A22 22 0 0 1 10 34"
        stroke="url(#amavya-silver)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* Stylised A monogram */}
      <path
        d="M32 19 L42 45 H37 L32 31 L27 45 H22 Z"
        fill="url(#amavya-letter)"
      />
      <circle cx="32" cy="49" r="2.1" fill="url(#amavya-gold)" />
    </svg>
  );
}

export function LogoWordmark({ className = "" }) {
  return (
    <span
      className={`font-semibold tracking-[0.22em] text-gradient-gold ${className}`}
    >
      AMAVYA
    </span>
  );
}

export function Logo({ className = "" }) {
  return (
    <a href="#hero" className={`group flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[8deg]" />
      <LogoWordmark className="text-lg" />
    </a>
  );
}
