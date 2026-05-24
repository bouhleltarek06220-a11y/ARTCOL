# AMAVYA — Landing page officielle

Landing page premium d'**AMAVYA**, SASU française spécialisée en intelligence
artificielle, automatisation, SaaS, CRM et agents IA.

Fondateur : **Tarek Bouhlel**.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) (config CSS-first)
- [Framer Motion](https://www.framer.com/motion/) pour les animations

## Démarrer

```bash
cd amavya
npm install
npm run dev      # http://localhost:3000
```

## Build de production

```bash
npm run build
npm run start
```

## Structure

```
amavya/
├── app/
│   ├── layout.jsx       # SEO, metadata, JSON-LD, police Inter
│   ├── page.jsx         # Assemblage des sections
│   ├── globals.css      # Design system (tokens, glass, animations)
│   ├── icon.svg         # Favicon de marque
│   ├── sitemap.js
│   └── robots.js
└── components/
    ├── Logo.jsx              # Logo vectoriel AMAVYA (à remplacer par le fichier de marque)
    ├── AnimatedBackground.jsx
    ├── Navbar.jsx
    ├── Hero.jsx / DashboardMockup.jsx
    ├── Services.jsx / Icons.jsx
    ├── Vision.jsx
    ├── Technologies.jsx
    ├── Founder.jsx
    ├── FinalCTA.jsx
    ├── Footer.jsx
    └── Reveal.jsx / SectionHeading.jsx / Button.jsx
```

## Identité visuelle

- Palette : noir profond, or, argent, blanc (identité luxe)
- Glassmorphism subtil, halos dorés/argentés dérivants, grille technique masquée
- Accessibilité : respect de `prefers-reduced-motion`

## À personnaliser

- **Logo** : déposez le logo officiel dans **`amavya/public/logo.png`**.
  Il s'affiche automatiquement dans la navbar et le footer. Tant que le
  fichier est absent, un emblème vectoriel doré de repli (`components/Logo.jsx`)
  est affiché à la place — aucune image cassée.
- **Photo du fondateur** : placeholder « TB » dans `components/Founder.jsx`.
- **Liens** : réseaux sociaux, mentions légales et contact dans `Footer.jsx`
  et `FinalCTA.jsx` (email `contact@amavya.cloud`).
- **Domaine** : `https://amavya.cloud` est utilisé dans le SEO
  (`app/layout.jsx`, `sitemap.js`, `robots.js`).
```
