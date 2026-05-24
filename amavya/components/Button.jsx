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
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-bright";

  const variants = {
    primary:
      "text-white shadow-[0_8px_40px_-12px_rgba(79,139,255,0.7)] bg-[linear-gradient(110deg,#2b6bff,#8b5cff)] hover:shadow-[0_12px_50px_-10px_rgba(139,92,255,0.85)] hover:-translate-y-0.5",
    secondary:
      "glass text-paper hover:bg-white/10 hover:-translate-y-0.5",
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
