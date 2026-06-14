---
name: web-builder
description: "Création complète d'un site web de bout en bout : choix de stack (single-file HTML, Next.js, Astro, SvelteKit), hébergement et DNS/HTTPS (Vercel, Netlify, OVH, Cloudflare), formulaires (Resend, Formspree, Brevo), analytics privacy-first (Plausible, Umami, Fathom), Core Web Vitals (LCP, CLS, INP), SEO on-page (meta, OG, sitemap, robots), pipeline de déploiement CI/CD, checklist de mise en ligne, et cas rapide single-file HTML auto-contenu. Utiliser pour : démarrer un site de zéro, choisir la bonne stack et le bon hébergeur, configurer DNS + HTTPS, intégrer un formulaire sans back-end, optimiser les vitals, préparer le lancement. Mots-clés : site web, création site, stack, Vercel, Netlify, OVH, Cloudflare, DNS, HTTPS, formulaire, analytics, Core Web Vitals, LCP, CLS, SEO, sitemap, déploiement, CI/CD, single-file HTML, landing page, mise en ligne, performance, Lighthouse, Plausible, Resend."
---

# Web Builder — Du besoin à la prod

Guide complet pour **lancer un site en production** : de la question « quelle stack ? » à la mise en ligne avec DNS, HTTPS, formulaires, analytics et score Lighthouse vert.

## Quand l'activer
Démarrer un nouveau site, choisir un hébergeur, configurer le DNS, intégrer un formulaire ou des analytics, optimiser les Core Web Vitals, préparer un go-live.

---

## Choix de stack — arbre de décision

| Besoin | Stack recommandée |
|--------|-------------------|
| Démo rapide, livrable isolé | **Single-file HTML** (ARTCOL) |
| Landing/marketing statique | **Astro** (0 JS par défaut, islands) |
| App React avec SSR/ISR, blog, SaaS | **Next.js App Router** |
| Site léger sans framework | **SvelteKit** |
| CMS headless | Astro ou Next.js + Sanity / Contentful |

Règle : **ne pas sur-engineerer**. Un site vitrine de 5 pages n'a pas besoin de Next.js.

---

## Single-file HTML (cas rapide)

Structure minimale ARTCOL auto-contenue :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nom — Description courte</title>
  <meta name="description" content="…max 155 caract.…">
  <meta property="og:title" content="…">
  <meta property="og:image" content="https://…/og.png"> <!-- 1200×630 -->
  <link rel="canonical" href="https://domaine.com/">
  <!-- Google Fonts ARTCOL -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>/* tokens ARTCOL + styles */</style>
</head>
<body>
  <!-- contenu -->
  <script type="module">/* JS ici */</script>
</body>
</html>
```
Déploiement : glisser-déposer dans Netlify Drop ou `vercel --prod` sur le dossier.

---

## Hébergement — comparatif rapide

| Hébergeur | Idéal pour | Free tier | Notes |
|-----------|-----------|-----------|-------|
| **Vercel** | Next.js, React, apps SSR | Oui | CI/CD auto, Edge Functions, analytics built-in |
| **Netlify** | Sites statiques, Astro, single-file | Oui | Forms natifs, redirects, branch previews |
| **Cloudflare Pages** | Sites statiques ultra-rapides | Oui | CDN mondial, Workers en bonus |
| **OVH** | PHP/WordPress, e-mail pro inclus | Non | Bon pour clients non-tech, contrôle DNS total |

**Recommandation par défaut** : Vercel (Next.js) ou Netlify (statique). OVH quand le client a déjà son hébergement et son e-mail pro.

---

## DNS & HTTPS — étapes

1. Acheter le domaine (OVH, Namecheap, Cloudflare Registrar).
2. Dans l'hébergeur : récupérer l'IP ou le CNAME cible.
3. Dans le gestionnaire DNS : ajouter `A` (racine) + `CNAME www → racine`.
4. Propagation : 5 min (Cloudflare) à 24 h (registrars lents).
5. HTTPS : automatique sur Vercel/Netlify (Let's Encrypt). Sur OVH : activer le certificat SSL dans le panel.
6. Vérifier avec `curl -I https://monsite.com` → `200 OK` + `Strict-Transport-Security`.
7. Forcer le redirect HTTP → HTTPS + www → racine (ou l'inverse — choisir et s'y tenir).

---

## Formulaires sans back-end

| Solution | Quand | Limite free |
|----------|-------|-------------|
| **Resend** + endpoint API route | Next.js, e-mails transactionnels | 3 000/mois |
| **Netlify Forms** | Sites Netlify statiques | 100 soumissions/mois |
| **Formspree** | N'importe quel HTML | 50/mois |
| **Brevo (Sendinblue)** | CRM + e-mail marketing intégré | 300 e-mails/jour |

Toujours ajouter : honeypot field + rate limiting (ou turnstile Cloudflare) contre le spam.

---

## Analytics privacy-first

Éviter Google Analytics (RGPD, bandeau cookie obligatoire). Alternatives :
- **Plausible** — léger (< 1 ko), RGPD-compliant, self-hostable.
- **Umami** — open-source, self-host sur Vercel/Railway gratuitement.
- **Fathom** — payant, simple, bon pour clients.

Intégration Plausible (une ligne) :
```html
<script defer data-domain="monsite.com" src="https://plausible.io/js/script.js"></script>
```

---

## Core Web Vitals — objectifs & leviers

| Métrique | Cible | Leviers principaux |
|----------|-------|--------------------|
| **LCP** (chargement) | < 2,5 s | Image hero en `<img>` + `fetchpriority="high"`, WebP/AVIF, `preload` |
| **CLS** (stabilité) | < 0,1 | `width`/`height` sur images, `font-display: swap`, pas de banner injectés |
| **INP** (réactivité) | < 200 ms | Éviter les long tasks JS, code splitting, `defer` sur les scripts non-critiques |

Mesurer : **Lighthouse** (DevTools), **PageSpeed Insights**, **web-vitals** npm.

---

## SEO on-page (minimum viable)

```html
<!-- Dans <head> -->
<title>Mot-clé principal — Nom du site</title>          <!-- max 60 caract. -->
<meta name="description" content="…">                    <!-- max 155 caract. -->
<link rel="canonical" href="https://…">
<meta property="og:title" content="…">
<meta property="og:description" content="…">
<meta property="og:image" content="https://…/og.png">   <!-- 1200×630 -->
<meta name="twitter:card" content="summary_large_image">
```

Fichiers obligatoires :
- `/sitemap.xml` — généré automatiquement (Astro : built-in, Next.js : `next-sitemap`).
- `/robots.txt` — `User-agent: * / Allow: /` minimum.
- `/favicon.ico` + `/apple-touch-icon.png`.

Structure HTML sémantique : un seul `<h1>`, `<main>`, `<nav>`, `<footer>`, `<article>` selon contexte.

---

## Pipeline de déploiement CI/CD

```yaml
# Vercel — automatique sur push main
# Netlify — idem, ou via netlify.toml :
[build]
  command = "npm run build"
  publish = "dist"       # ou .next, out, build selon stack

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200           # SPA fallback
```

Bonnes pratiques :
- **Preview branches** : chaque PR = URL preview → montrer au client avant merge.
- Variables d'environnement dans le dashboard hébergeur, jamais dans le repo.
- `npm run lint && npm run build` en pre-commit ou CI (GitHub Actions).

---

## Checklist go-live

- [ ] HTTPS actif, HTTP redirige vers HTTPS
- [ ] `www` redirige vers racine (ou l'inverse)
- [ ] `<title>` + `<meta description>` uniques sur chaque page
- [ ] OG image présente (1200×630), testée sur opengraph.xyz
- [ ] `/sitemap.xml` accessible et soumis à Google Search Console
- [ ] `/robots.txt` correct
- [ ] Favicon + apple-touch-icon
- [ ] Lighthouse > 90 sur Performance, Accessibility, SEO
- [ ] Formulaire testé end-to-end (e-mail reçu)
- [ ] Analytics actif (visites trackées)
- [ ] 404 personnalisée
- [ ] Responsive testé sur mobile réel (ou BrowserStack)
- [ ] `prefers-reduced-motion` respecté
- [ ] Pas de console.error en prod

---

## Do / Don't

| Do | Don't |
|----|-------|
| Single-file HTML pour les démos et landing simples | Créer un projet React pour un site 3 pages |
| Plausible/Umami pour l'analytics (RGPD) | GA4 sans bandeau consentement |
| `fetchpriority="high"` sur l'image hero | Lazy-loader l'image above-the-fold |
| Variables d'env dans le dashboard hébergeur | `.env` commité dans le repo |
| Preview URL à chaque PR | Merger direct sur main sans revue |

> Skills sœurs : `artcol-design-system` (tokens, single-file), `ui-ux-pro-max` (patterns UX), `motion-design` (animations), `visual-qa` (audit final), `cinematic-scroll` (expériences scroll), `web3d-threejs` (hero 3D).
