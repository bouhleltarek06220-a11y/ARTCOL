import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Solutions",
    links: [
      { label: "Agents IA", href: "#services" },
      { label: "CRM intelligent", href: "#services" },
      { label: "Automatisation", href: "#services" },
      { label: "Prospection", href: "#services" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "Vision", href: "#vision" },
      { label: "Fondateur", href: "#fondateur" },
      { label: "Technologies", href: "#technologies" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "#" },
      { label: "Confidentialité", href: "#" },
      { label: "CGU / CGV", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    path: "M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.5 8.5h3V21h-3zM10 8.5h2.9v1.7h.04c.4-.76 1.4-1.56 2.9-1.56 3.1 0 3.66 2 3.66 4.7V21h-3v-5.2c0-1.24-.02-2.84-1.74-2.84-1.74 0-2 1.36-2 2.76V21h-3z",
  },
  {
    label: "X",
    href: "#",
    path: "M17.5 3h3l-6.6 7.5L21.7 21h-5.9l-4.3-5.6L6.3 21H3.3l7-8L2.6 3h6l3.9 5.2zM16.4 19.2h1.7L7.7 4.7H5.9z",
  },
  {
    label: "GitHub",
    href: "#",
    path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/10 pt-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Marque */}
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Solutions IA, SaaS et automatisations intelligentes pour les
              entreprises modernes. SASU française.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:text-paper"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-paper">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bas de footer */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs text-muted-soft sm:flex-row">
          <p>© {year} AMAVYA · Tous droits réservés.</p>
          <p className="flex items-center gap-2">
            Conçu avec
            <span className="text-electric-bright">l'intelligence artificielle</span>
            · Fait en France 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
