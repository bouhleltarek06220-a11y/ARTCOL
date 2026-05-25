import Link from "next/link";
import Logo from "./Logo";
import Footer from "./Footer";

/**
 * Gabarit commun des pages légales (lecture sobre, fond sombre, sans le
 * canvas animé pour ne pas distraire).
 */
export default function LegalShell({ title, updated, children }) {
  return (
    <div className="relative min-h-screen bg-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link href="/" aria-label="AMAVYA — accueil">
          <Logo />
        </Link>
        <Link href="/" className="text-sm text-muted transition-colors hover:text-paper">
          ← Accueil
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 pt-6">
        <h1 className="text-gradient text-3xl font-semibold sm:text-4xl">{title}</h1>
        {updated && (
          <p className="mt-3 text-sm text-muted-soft">Dernière mise à jour : {updated}</p>
        )}
        <div className="legal-prose mt-8 text-sm leading-relaxed text-muted">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
