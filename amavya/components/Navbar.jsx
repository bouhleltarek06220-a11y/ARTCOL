"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Button from "./Button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLang } from "./LangProvider";

/* Préfixe les liens d'ancre par "/" quand on n'est pas sur la home,
   pour qu'un clic sur "#services" ramène à la home et scrolle. */
function resolveHref(href, pathname) {
  if (!href.startsWith("#")) return href;
  if (pathname === "/") return href;
  return `/${href}`;
}

export default function Navbar() {
  const { t } = useLang();
  const pathname = usePathname() || "/";
  const LINKS = t.nav.links;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  // Header solidifié au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy : la section qui occupe le centre du viewport devient active
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.replace("#", "")).filter(Boolean);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [LINKS]);

  // Polish menu mobile : ESC, lock du scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6 ${
          scrolled ? "glass-strong shadow-[0_8px_40px_-20px_rgba(212,175,55,0.5)]" : "bg-transparent"
        }`}
      >
        <a href="#top" aria-label="AMAVYA — accueil" className="rounded-md">
          <Logo />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            const isAnchor = link.href.startsWith("#");
            const isActive =
              (isAnchor && link.href === `#${activeId}`) ||
              (!isAnchor && pathname.startsWith(link.href));
            return (
              <a
                key={link.href}
                href={resolveHref(link.href, pathname)}
                aria-current={isActive ? "page" : undefined}
                className={`relative text-sm font-medium transition-colors ${isActive ? "text-paper" : "text-muted hover:text-paper"}`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navActive"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-bright to-transparent"
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Button href="#contact" variant="primary" className="px-5 py-2.5">
            {t.nav.cta}
          </Button>
        </div>

        {/* Burger mobile */}
        <button
          type="button"
          aria-label={t.nav.openMenu}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl glass md:hidden"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 bg-paper transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-paper transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-paper transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Backdrop + panneau mobile */}
      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-sm md:hidden"
          />
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong absolute inset-x-4 top-20 z-50 rounded-2xl p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {LINKS.map((link) => {
                const isAnchor = link.href.startsWith("#");
                const isActive =
                  (isAnchor && link.href === `#${activeId}`) ||
                  (!isAnchor && pathname.startsWith(link.href));
                return (
                  <a
                    key={link.href}
                    href={resolveHref(link.href, pathname)}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/5 text-paper border-l-2 border-gold-bright"
                        : "text-muted hover:bg-white/5 hover:text-paper"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <Button href="#contact" variant="primary" className="mt-2 w-full">
                {t.nav.cta}
              </Button>
              <div className="mt-3 flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.header>
  );
}
