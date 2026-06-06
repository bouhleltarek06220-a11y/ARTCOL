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

---

## DEC-006 — i18n : approche progressive (3.1 client-side, 3.2 URLs SEO)

**Date** : 2026-06-06
**Étape** : 3

**Décision** : faire l'i18n en 2 temps.

### Phase 3.1 (fait maintenant)
- Étendre le système custom existant (`LangProvider` + `lib/i18n.js`) pour ajouter l'**espagnol**
- Détection auto de la langue du navigateur au premier chargement
- Sélecteur 3 drapeaux (FR · GB · ES)
- Pas de changement d'URL : le contenu change côté client, l'URL reste `amavya.cloud`

### Phase 3.2 (plus tard)
- Migrer vers des **routes `/en/` et `/es/`** (Next.js i18n routing OU `next-intl`)
- Ajouter les tags `hreflang` pour que Google indexe les 3 versions séparément
- Trafic SEO international potentiel : 3x

**Raisons de couper en 2** :
- Phase 3.1 = 1h de travail, l'ES devient utilisable **immédiatement**
- Phase 3.2 = refonte des routes (impact toutes les pages), à faire posément
- Pas de mauvaise dette technique : la 3.2 réutilise tout ce qui a été fait en 3.1

**Castellano neutre** : les traductions ES utilisent un castellano "international", compréhensible aussi bien en Espagne qu'en Amérique Latine (formes en "usted", lexique sans régionalismes).

**Tonalité ES retenue** :
- "Quand l'IA travaille pour vous" → pas encore traduit dans i18n (reste le slogan visuel OG)
- "Soluciones IA, SaaS y automatizaciones inteligentes"
- "Reservar una demo" (vs "Reserve una demo" Amérique LATAM) — neutre

**Détection navigateur** : on lit `navigator.languages` (priorité aux langues préférées de l'utilisateur), puis `navigator.language`, puis fallback FR. Le choix manuel via les drapeaux **prime sur** la détection (stocké dans localStorage).

---

## DEC-007 — Page Pricing : STAND BY tant que la SASU n'est pas finalisée

**Date** : 2026-06-06
**Étape** : 4

**Décision** : reporter l'étape 4 (Page Pricing) jusqu'à la **finalisation de l'immatriculation SASU AMAVYA**.

**Raisons** :
- Annoncer des prix publics sans entité capable de facturer = problème juridique (TVA, factures conformes)
- Risque de devoir changer les tarifs après immatriculation → image abîmée
- Mieux vaut **un site sans pricing qu'un pricing à refaire**
- Décision prise par Tarek (fondateur)

**Reprise prévue** :
- Une fois SASU active (Kbis reçu, numéro TVA intracommunautaire OK)
- À ce moment-là : revoir les 3 offres + prix + CTA (Stripe possible immédiatement après — étape 9)

**En attendant** :
- Le formulaire de contact existant reste le canal principal d'entrée
- La page sera créée mais **non publiée** quand on sera prêts

---

## DEC-008 — Chatbot AMAVYA : Claude Haiku 4.5 + streaming + périmètre strict

**Date** : 2026-06-06
**Étape** : 5

**Décision** : implémenter le chatbot AMAVYA avec Claude Haiku 4.5, en streaming, périmètre strictement AMAVYA, tonalité professionnelle chaleureuse, RDV via formulaire de contact existant.

### Choix techniques

**Modèle** : `claude-haiku-4-5-20251001`
- Rapide (~1 s pour la 1ère réponse, streaming derrière)
- Quasi gratuit (~0,0003 € par message)
- Qualité largement suffisante pour qualification + redirection RDV
- Si plus tard on a besoin de plus profond → swap pour Sonnet 4.6 en 1 ligne

**Streaming token-par-token** : effet "qui tape", très professionnel + perception de rapidité.

**Rate limit** : 8 messages / 60 s par IP (in-memory). Best-effort (par instance Vercel), suffisant pour bloquer les abus sans gêner les vrais visiteurs.

**Affichage conditionnel** : le composant `Chatbot` interroge `/api/chat` (GET) au montage pour savoir si `ANTHROPIC_API_KEY` est configurée. **Si non, la bulle n'apparaît pas** → le site reste 100% fonctionnel sans la clé. Évite d'avoir une bulle qui plante quand on déploie sans clé.

**Mémoire** : `sessionStorage` (par onglet). Pas de BDD, pas de tracking persistant. RGPD-friendly.

### Choix produit (validés par Tarek)

- **Tonalité** : professionnel chaleureux (pas de tutoiement par défaut, peu d'emojis)
- **Périmètre** : strictement AMAVYA — redirige poliment hors sujet
- **Action RDV** : oriente vers le formulaire de contact (#contact), qui envoie sur `contact@amavya.cloud` (DEC-000)
- **Multilingue** : FR / EN / ES selon `lang` du LangProvider (DEC-006)
- **Pas de prix** : la SASU étant en cours de finalisation (DEC-007), le bot ne donne JAMAIS de prix précis — il propose un échange avec Tarek

### Sécurité

- Clé API jamais exposée côté client (route handler Node.js)
- Rate limit IP
- Historique sanitizé côté serveur (16 messages max, 2 000 chars/message)
- Pas de logs d'IP côté Vercel (seulement la rate map en RAM)

### Variables d'env requises

- `ANTHROPIC_API_KEY` — Sensitive dans Vercel

---

## DEC-009 — Polissage visuel : style "Subtil & premium" + lot par lot

**Date** : 2026-06-06
**Étape** : 6

**Décision** : Tarek a choisi (a) le découpage **lot par lot** (3 lots de 3 sections), (b) le style **subtil et premium** (esprit Linear/Vercel/Stripe — animations qu'on ne nomme pas mais qu'on ressent).

**Pourquoi** :
- Lot par lot = valide visuellement à chaque étape, on n'avance pas en aveugle
- Subtil = cohérent avec la cible B2B premium d'AMAVYA (pas du "wow startup à paillettes")
- Permet aussi de mesurer l'impact (analytics) de chaque lot

### Lot 1 (cette PR) — Hero + Services + SectionHeading + bugfix ServiceDemos
- **Hero** : halo doré subtil qui suit la souris (lerp 8%), cascade peaufinée (0 / 0.12 / 0.26 / 0.42s), reflet animé sur le titre highlight (14s de période, indétectable), respect `prefers-reduced-motion`
- **Services** : vraie cascade `i * 0.07` (effet domino sur 6 cartes), bordure dorée qui s'allume au hover, halo coin haut-droit, icône qui tourne `+6deg` + scale au hover, flèche "En savoir plus" qui glisse de +1 (au lieu de +0.5)
- **SectionHeading** : trait fin doré (gradient transparent→or→transparent) qui s'étend horizontalement à l'apparition — signature visuelle réutilisable sur toutes les sections
- **ServiceDemos (bugfix)** : ajout des traductions `es:` dans la constante `TAG` (sinon le visiteur espagnol voyait les tags en français — `TAG[lang] || TAG.fr`)

### Garde-fous appliqués
- Aucune logique métier modifiée
- Toutes les animations ont une durée < 1s (pas de bloat)
- Le halo Hero est `hidden md:block` (pas sur mobile, économise CPU)
- `prefers-reduced-motion` respecté (animation hero-sheen désactivée)

### À tester par Tarek après merge
- Au scroll : les cartes Services rentrent en cascade fluide
- Au hover sur une carte : bordure dorée + icône qui pivote légèrement
- Sur Hero : passe la souris → halo doré qui suit (desktop)
- Sur les titres : le trait fin doré s'étend au reveal
- En espagnol (drapeau ES) : ouvrir une démo de service → tags "El día a día / Con AMAVYA / El resultado"

### Lot 2 — Vision + Technologies + Founder
- **Vision** : les pastilles dorées des anneaux orbitaux pulsent doucement (3-5s, halo qui respire) ; les 3 points de la liste arrivent en cascade horizontale (`x: -16 → 0`) au scroll, avec hover sur l'icône (scale + rotation 8°)
- **Technologies** : le marquee se met **en pause** au survol (permet la lecture) ; les pastilles dorées scale 1.5 + glow au hover ; un soulignement doré apparaît sous chaque nom de techno au survol
- **Founder** :
  - Parallaxe douce sur le portrait (-30px → +30px au scroll de la section)
  - Halo doré du fond "respire" (opacity + scale, 7s)
  - Halo doré autour du portrait pulse aussi (5s)
  - Au survol du portrait : zoom léger 1.03 + zoom interne 1.05 sur la photo + un reflet doré qui traverse en 1s
  - Les facets (badges 20 ans, dev, business…) arrivent en cascade (delay 0.07s)
  - Boutons sociaux : élévation -1, ombre dorée + **couleur de marque au hover** (bleu LinkedIn, vert WhatsApp, doré Email)
