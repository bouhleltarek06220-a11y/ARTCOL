/**
 * Bouton de marque. variant: "primary" | "secondary" | "ghost".
 */
export default function Button({
  children,
  href = "#",
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

  const variants = {
    primary:
      "text-ink shadow-[0_8px_40px_-12px_rgba(212,175,55,0.7)] bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] hover:shadow-[0_12px_50px_-10px_rgba(240,210,122,0.85)] hover:-translate-y-0.5",
    secondary:
      "glass text-paper hover:bg-white/8 hover:-translate-y-0.5",
    ghost: "text-muted hover:text-paper",
  };

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="shimmer-line absolute inset-x-0 top-0 h-px opacity-70" />
        </span>
      )}
      {children}
    </a>
  );
}
