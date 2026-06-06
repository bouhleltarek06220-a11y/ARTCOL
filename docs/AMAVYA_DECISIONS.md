# 🧠 AMAVYA — Journal des décisions

> Historique des choix techniques et stratégiques.
> Une entrée = une décision non-triviale, daté, justifiée.
> Si une décision est revue plus tard, on **ajoute** une nouvelle entrée (on n'écrase pas l'historique).

---

## DEC-000 — Infrastructure : OVH (domaine + mail) + Vercel (hébergement)

**Date** : 2026-06-06
**Étape** : 0

**Décision** : domaine `amavya.cloud` chez OVH, site hébergé sur Vercel (plan Hobby), mail pro via OVH MX Plan gratuit, redirigé vers Gmail perso.

**Raisons** :
- OVH = registrar français, fiable, MX Plan **gratuit** (5 Go, 10 adresses)
- Vercel = déploiement instant pour Next.js, Edge Network mondial, plan Hobby suffisant
- Redirection OVH → Gmail = on garde l'UX Gmail (mobile, recherche) + copie OVH pour archivage

**Alternatives écartées** :
- Google Workspace : 6€/mois/user — pas nécessaire au stade actuel
- Cloudflare Pages : plus complexe pour Next.js Server Components

---

## DEC-001 — Analytics : Vercel Analytics + Speed Insights

**Date** : 2026-06-06
**Étape** : 1

**Décision** : utiliser `@vercel/analytics` + `@vercel/speed-insights` (officiels Vercel) plutôt que Plausible ou Google Analytics 4.

**Raisons** :
- **Intégration native** : 2 lignes de code dans `layout.jsx`, zéro config serveur
- **RGPD-friendly** : pas de cookie, anonyme par défaut → pas de bannière obligatoire
- **Gratuit** : 2 500 événements/mois inclus dans le plan Hobby → largement suffisant pour démarrer
- **Speed Insights** : performance réelle vécue par les vrais visiteurs (Core Web Vitals), pas seulement Lighthouse
- **Pas de tracking tiers** : aligné avec le positionnement éthique d'AMAVYA

**Alternatives écartées** :
- **Plausible** : excellent mais 9€/mois → on garde sous le coude si on grossit
- **Google Analytics 4** : puissant mais lourd, RGPD compliqué (bannière cookies obligatoire), aligné Google → ne colle pas au positionnement "tech humaniste"
- **PostHog** : sur-dimensionné pour un site vitrine, mieux pour des SaaS

**Implémentation** :
- Packages ajoutés à `amavya/package.json`
- Composants `<Analytics />` et `<SpeedInsights />` montés dans `app/layout.jsx`
- Aucune config supplémentaire — Vercel détecte automatiquement à partir du déploiement Production

**Limite à surveiller** : si on dépasse 2 500 événements/mois (≈ ~5 000 pageviews), passer en plan Pro Vercel (20$/mois) ou migrer vers Plausible.

**Effet attendu** :
- Dashboard Analytics : `https://vercel.com/bouhleltarek06220-4609s-projects/artcol/analytics`
- Dashboard Speed : `https://vercel.com/bouhleltarek06220-4609s-projects/artcol/speed-insights`
- Premières données ~24h après merge en prod.

---

## DEC-002 — OG image générée dynamiquement par Next.js (`opengraph-image.js`)

**Date** : 2026-06-06
**Étape** : 2

**Décision** : générer l'image Open Graph (et Twitter) **à la compilation** via `app/opengraph-image.js` + `ImageResponse` (runtime Edge), plutôt qu'un PNG statique.

**Raisons** :
- ✅ Pas de fichier binaire à versionner / re-uploader si on change le texte
- ✅ Modification = 1 ligne de code (titre, tagline, couleurs)
- ✅ Toujours net (vectorisé jusqu'au rendu final)
- ✅ Permet plus tard de faire des **OG dynamiques par page** (`/pricing` aura son propre visuel sans rien dupliquer)
- ✅ Format optimal 1200×630 (LinkedIn, Twitter, WhatsApp, Slack, Discord, etc.)

**Charte de l'OG** :
- Fond : `radial-gradient(ellipse at 50% 0%, #1a1408 0%, #050505 60%)` (sombre, légère lumière dorée en haut)
- Titre : **AMAVYA** en dégradé doré `linear-gradient(110deg, #a87f2e, #f0d27a 55%, #d4af37)`
- Tagline : **« Quand l'IA travaille pour vous »** (validé par Tarek)
- Pied de page : `amavya.cloud` en lettres espacées, entre 2 points dorés

**Validation finale** (après merge) :
- LinkedIn Post Inspector : https://www.linkedin.com/post-inspector/
- Twitter Card Validator : https://cards-dev.twitter.com/validator
- Google Rich Results Test : https://search.google.com/test/rich-results

---

## DEC-003 — Tagline officielle AMAVYA : "Quand l'IA travaille pour vous"

**Date** : 2026-06-06
**Étape** : 2

**Décision** : adopter "Quand l'IA travaille pour vous" comme tagline officielle pour OG, Twitter, et titres SEO.

**Raisons** :
- Positionnement **humain** (l'IA au service des humains, pas l'inverse)
- Court (5 mots), mémorisable
- Promesse claire (résultat business, pas techno-bavardage)
- Choisi par Tarek parmi 3 options proposées

---

## DEC-004 — Twitter handle retiré (`@amavya` non actif)

**Date** : 2026-06-06
**Étape** : 2

**Décision** : retirer `creator: "@amavya"` du metadata Twitter tant qu'aucun compte officiel n'existe.

**Raisons** : un handle invalide nuit à la crédibilité (Twitter peut afficher un fallback dégradé). Quand un vrai compte sera créé, on remettra `creator` + `site`.

---

## DEC-005 — Schema.org : ajout de `contactPoint` (`contact@amavya.cloud`)

**Date** : 2026-06-06
**Étape** : 2

**Décision** : enrichir le Schema.org `Organization` avec un `contactPoint` (email + langues), et ajouter le `logo` pour Google Knowledge Panel. Adresse SASU reportée à plus tard.

**Raisons** :
- Google utilise `contactPoint` pour les **Knowledge Panels** (encart à droite des résultats)
- `logo` augmente les chances que le logo AMAVYA apparaisse dans les résultats Google
- L'adresse SASU : à ajouter quand on aura tranché sur la confidentialité (domiciliation vs adresse réelle)
