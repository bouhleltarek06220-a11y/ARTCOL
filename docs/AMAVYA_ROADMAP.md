# 🗺️ AMAVYA — Roadmap

> Feuille de route officielle du site **amavya.cloud**.
> Mise à jour à chaque étape franchie.

**Domaine** : https://amavya.cloud
**Stack** : Next.js 15 · React 19 · Tailwind 4 · Vercel · OVH (mail)
**Repo** : `bouhleltarek06220-a11y/ARTCOL` — dossier `amavya/`

---

## 📊 Vue d'ensemble

| # | Étape | Statut | Date |
|---|-------|--------|------|
| 0 | Domaine + Mail pro `contact@amavya.cloud` | ✅ Fait | 2026-06-06 |
| 1 | Analytics Vercel | ✅ Fait | 2026-06-06 |
| 2 | **SEO technique + Open Graph** | 🟢 **En cours** | 2026-06-06 |
| 3 | Internationalisation FR / EN / ES | ⏳ À faire | — |
| 4 | Page Pricing | ⏳ À faire | — |
| 5 | Chatbot IA AMAVYA | ⏳ À faire | — |
| 6 | Polissage visuel des sections | ⏳ À faire | — |
| 7 | Blog SEO | ⏳ À faire | — |
| 8 | Pages immersives | ⏳ À faire | — |
| 9 | Stripe / paiement direct | ⏳ À faire | — |

---

## 🧭 Détail des étapes

### ✅ Étape 0 — Infra : domaine + mail pro

- Domaine `amavya.cloud` chez OVH connecté à Vercel (A → `216.150.1.1`, CNAME `www`)
- Boîte `contact@amavya.cloud` créée (MX Plan OVH gratuit)
- SPF, DKIM, DMARC en place
- Redirection OVH → Gmail (`bouhleltarek06220@gmail.com`)
- Formulaire de contact du site → SMTP OVH → notification email + archivage Supabase
- Vars d'env Vercel configurées : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### 🟢 Étape 1 — Analytics Vercel (en cours)

**Objectif** : mesurer le trafic, comprendre les visiteurs, piloter par la donnée.

**Choix** : Vercel Analytics + Speed Insights (cf. `AMAVYA_DECISIONS.md` #001).

**Livrables** :
- `@vercel/analytics` + `@vercel/speed-insights` installés
- Composants branchés dans `app/layout.jsx`
- Dashboards accessibles sur Vercel après ~24h de trafic

### ⏳ Étape 2 — SEO technique + Open Graph

**Objectif** : améliorer le rendu Google + l'aperçu LinkedIn/WhatsApp/Twitter.

**À prévoir** :
- Image OG dédiée (1200×630, avec logo + tagline)
- Schema.org enrichi (LocalBusiness ? FAQPage ?)
- `robots.txt` + `sitemap.xml` vérifiés
- Performance Lighthouse > 90 sur mobile

### ⏳ Étape 3 — i18n FR / EN / ES

**Objectif** : élargir au marché international (EN = 10x marché tech B2B).

**À prévoir** :
- Compléter les traductions manquantes dans `lib/i18n.js`
- Détection auto de la langue navigateur
- Sélecteur visible dans la navbar
- SEO multilingue : hreflang + URLs `/en/` `/es/` (optionnel : `next-intl`)

### ⏳ Étape 4 — Page Pricing

**Objectif** : conversion directe — les visiteurs veulent voir les prix.

**À prévoir** :
- 3 offres (Starter / Pro / Sur mesure)
- Bouton "Réserver un appel" en bas de chaque
- FAQ courte sous le tableau

### ⏳ Étape 5 — Chatbot IA AMAVYA

**Objectif** : preuve par l'exemple — "ils utilisent l'IA qu'ils vendent".

**À prévoir** :
- Bulle flottante en bas à droite
- API Claude/OpenAI (probablement Claude Haiku 4.5 pour le coût)
- Prompt système qui connaît AMAVYA + propose RDV
- Capture email avant fin de conversation

### ⏳ Étape 6 — Polissage visuel

**Objectif** : rendu premium, perception pro.

**À prévoir** : micro-animations, cohérence typographique, espacements, copywriting.

### ⏳ Étape 7 — Blog SEO

**Objectif** : trafic organique long terme.

### ⏳ Étape 8 — Pages immersives

**Objectif** : différenciation + mémorabilité (comme `/matrix`, `/experience`).

### ⏳ Étape 9 — Stripe

**Objectif** : vendre directement des petits produits (audit, mini-formation…).

---

## 📌 Convention

- Une étape = un commit (ou une PR si l'étape est large)
- Chaque étape : on documente dans `AMAVYA_DECISIONS.md` les choix non-triviaux
- `AMAVYA_TODO.md` = backlog opérationnel (vivant, peut être bougé)
