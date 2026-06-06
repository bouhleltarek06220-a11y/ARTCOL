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
