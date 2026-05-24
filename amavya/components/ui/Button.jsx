export function Button({
  href = "#",
  children,
  variant = "primary",
  className = "",
  icon = null,
  ...props
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-void";

  const variants = {
    primary:
      "text-white shadow-[0_10px_40px_-12px_rgba(47,107,255,0.7)] hover:shadow-[0_16px_50px_-12px_rgba(139,92,246,0.8)] hover:-translate-y-0.5",
    secondary:
      "glass text-white/90 hover:bg-white/10 hover:-translate-y-0.5 hover:text-white",
    ghost: "text-white/70 hover:text-white",
  };

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {variant === "primary" ? (
        <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-electric-500 via-electric-500 to-neon-500 transition-[filter] duration-300 group-hover:brightness-110" />
      ) : null}
      {children}
      {icon ? (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </a>
  );
}
