"use client";

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      {/* Aurora blobs */}
      <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-electric-600/25 blur-[140px] animate-aurora" />
      <div className="absolute top-1/3 -left-40 h-[34rem] w-[34rem] rounded-full bg-neon-600/22 blur-[150px] animate-aurora [animation-delay:-6s]" />
      <div className="absolute bottom-0 right-0 h-[36rem] w-[36rem] translate-x-1/4 translate-y-1/4 rounded-full bg-electric-500/16 blur-[150px] animate-aurora [animation-delay:-11s]" />
      <div className="absolute top-2/3 left-1/4 h-72 w-72 rounded-full bg-gold-500/8 blur-[120px] animate-pulse-glow" />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg mask-fade-b opacity-60" />

      {/* Top radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(47,107,255,0.12),transparent_60%)]" />

      {/* Noise / grain */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
    </div>
  );
}
