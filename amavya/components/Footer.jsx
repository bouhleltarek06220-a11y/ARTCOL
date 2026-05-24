import { Linkedin, Twitter, Github, Mail } from "lucide-react";
import { LogoMark, LogoWordmark } from "./Logo";

const columns = [
  {
    title: "Solutions",
    links: [
      { label: "Agents IA", href: "#services" },
      { label: "CRM intelligent", href: "#services" },
      { label: "Automatisation", href: "#services" },
      { label: "SaaS sur mesure", href: "#services" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "Vision", href: "#vision" },
      { label: "Technologies", href: "#technologies" },
      { label: "Fondateur", href: "#founder" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "#" },
      { label: "Confidentialité", href: "#" },
      { label: "CGV", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

const socials = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "X / Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "mailto:contact@amavya.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <a href="#hero" className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <LogoWordmark className="text-lg" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              SASU française spécialisée en intelligence artificielle,
              automatisation, SaaS et agents IA. Des outils intelligents au
              service de l&apos;humain.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AMAVYA SASU. Tous droits réservés.
          </p>
          <p className="text-xs text-white/40">
            Conçu avec IA + humain · France
          </p>
        </div>
      </div>
    </footer>
  );
}
