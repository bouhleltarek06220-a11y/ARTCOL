# AMAVYA — Landing Page

Landing page officielle d'**AMAVYA**, SASU française spécialisée en intelligence
artificielle, automatisation, SaaS, CRM et agents IA.

Positionnement : premium, futuriste, professionnel — inspiré des meilleures
startups IA (OpenAI, Apple, Notion, Linear, Vercel, Anthropic).

## Stack

- **[Next.js 15](https://nextjs.org/)** (App Router)
- **[React 19](https://react.dev/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Framer Motion](https://www.framer.com/motion/)** (animations)
- **[lucide-react](https://lucide.dev/)** (icônes)

## Démarrage

```bash
cd amavya
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lance le build de production |
| `npm run lint` | Analyse ESLint |

## Structure

```
amavya/
├── app/
│   ├── layout.jsx        # Layout racine + SEO (metadata, JSON-LD, OpenGraph)
│   ├── page.jsx          # Assemblage des sections
│   ├── globals.css       # Design system (tokens, glassmorphism, animations)
│   ├── robots.js         # robots.txt
│   └── sitemap.js        # sitemap.xml
├── components/
│   ├── Navbar.jsx         # Navigation sticky + menu mobile
│   ├── Hero.jsx           # Section hero + CTA
│   ├── DashboardMockup.jsx# Mockup dashboard IA animé
│   ├── Services.jsx       # 6 cards de services premium
│   ├── Vision.jsx         # Storytelling + illustration holographique
│   ├── Technologies.jsx   # Marquee infini de la stack
│   ├── Founder.jsx        # Présentation de Tarek Bouhlel
│   ├── CTA.jsx            # Appel à l'action final
│   ├── Footer.jsx         # Pied de page
│   ├── Logo.jsx           # Logo / wordmark AMAVYA (SVG)
│   ├── AnimatedBackground.jsx # Fond animé (aurora, grille, grain)
│   └── ui/                # Briques réutilisables (Button, Reveal, SectionHeading)
└── public/
    └── favicon.svg
```

## Sections

1. **Hero** — titre impactant, CTAs, mockup dashboard IA animé
2. **Services** — Agents IA, CRM intelligent, Automatisation, Prospection, SaaS, Formation
3. **Vision** — « L'IA doit renforcer l'humain »
4. **Technologies** — OpenAI, Claude, Supabase, Vercel, Next.js, React, Node.js, PostgreSQL
5. **Fondateur** — Tarek Bouhlel
6. **CTA final** — « Prêt à transformer votre entreprise avec l'IA ? »
7. **Footer** — liens, réseaux sociaux, mentions légales

## Notes

- Responsive mobile / tablette / desktop
- Animations au scroll (réduites si `prefers-reduced-motion`)
- SEO : metadata, OpenGraph, Twitter cards, JSON-LD `Organization`, sitemap & robots
- Le logo et la photo du fondateur sont des placeholders SVG — remplacez-les par
  les assets définitifs dans `public/`.
