# AMAVYA — Étude stratégique & Plan d'action plateforme

> Document de cadrage produit. Objectif : transformer la landing page AMAVYA
> en une vraie plateforme où un client qui signe peut **ouvrir un compte, se
> connecter, et utiliser ses agents IA** — dans le bon ordre, sans se disperser.
> Rédigé pour Tarek Bouhlel, fondateur AMAVYA.

---

## 0. Résumé en 30 secondes

- AMAVYA a **deux produits qui n'en font qu'un dans la tête du client** :
  1. **Le service** (tu construis des agents/sites/automatisations POUR le client) ;
  2. **La plateforme** (le client se connecte et voit/pilote ses agents).
- **Le piège à éviter** : vouloir livrer « la machine à centaines d'agents
  autonomes » avant d'avoir un seul client payant. On fait l'inverse :
  on vend une **promesse + un espace client crédible**, on opère **à la main
  en coulisses** au début (méthode « concierge / Magicien d'Oz »), puis on
  automatise au fur et à mesure que les revenus financent le moteur.
- **Ordre non négociable** : Vitrine qui convertit → Capture de leads → Espace
  client (auth) → 1 agent réel qui fait 1 chose utile → Facturation → Scale.

---

## 1. Ce que tu as DÉJÀ (et c'est beaucoup)

| Brique | État | Fichier / preuve |
|---|---|---|
| Landing premium (3D, animations) | ✅ Production | `app/page.jsx`, `components/Hero,Services,Vision...` |
| 6 services définis et rédigés | ✅ | `lib/i18n.js` |
| Capture de leads fonctionnelle | ✅ | `app/api/contact/route.js` → Supabase `partner_leads` + email |
| Base de données Supabase | ✅ branchée (contacts) | `app/api/contact/route.js` |
| Chatbot IA Claude (streaming, multilingue) | ✅ | `app/api/chat/route.js`, `lib/chatbot-prompt.js` |
| Pages démo plateforme | ✅ (maquettes) | `/command-center`, `/reseau`, `/login` |
| Multilingue FR/EN/ES | ✅ | `lib/i18n.js` |
| SEO / Analytics | ✅ | `app/layout.jsx`, Vercel Analytics |

**Conclusion** : tu n'es PAS à zéro. Il manque le « moteur » (auth réelle,
données par client, agents qui agissent, facturation) — mais les fondations
marketing et techniques existent.

---

## 2. Étude marketing

### 2.1 Positionnement
Studio IA français premium, orienté **PME/ETI B2B** (commercial-driven).
Promesse : *« L'IA travaille pour vous, 24/7, pour renforcer l'humain. »*
Posture haut de gamme (branding doré, design soigné) = tu peux **vendre cher**,
mais tu dois **tenir la promesse de fiabilité** que ce niveau de design implique.

### 2.2 Cible
- **Qui** : dirigeants de PME, directeurs commerciaux, responsables ops.
- **Où** : France (PACA en base), extensible EN/ES.
- **Douleur** : prospection chronophage, leads mal suivis, tâches répétitives.

### 2.3 L'offre (6 services)
1. **Agents IA** — collaborateurs numériques autonomes 24/7
2. **CRM intelligent** — qualifie, priorise, enrichit les contacts
3. **Automatisation métier** — connecte les outils, supprime le répétitif
4. **Prospection automatisée** — ciblage ICP, séquences, relances
5. **SaaS sur mesure** — plateformes web/mobile pour le client
6. **Formation IA & Business** — montée en compétence des équipes

> 💡 Insight clé : ces 6 « services » sont en réalité **les modules de TA
> plateforme**. Le client n'achète pas 6 prestations séparées : il achète
> **un espace où ces modules s'allument selon son forfait.**

### 2.4 Le tunnel actuel
`Landing → CTA "Réserver une démo" → ContactModal → email + Supabase → Tarek rappelle`

C'est un tunnel **agence** (lead → RDV humain → devis). Il fonctionne pour
signer les **premiers** clients. Ce qu'il manque pour devenir **SaaS** :
après la signature, le client n'a **nulle part où aller**. C'est exactement
le trou qu'on va combler.

### 2.5 Ce qui manque (vu produit)
- ❌ Auth réelle (le `/login` actuel redirige sans vérifier).
- ❌ Données par client (tables `users`, `workspaces`, `agents`, `leads`…).
- ❌ Agents qui font une action réelle (au-delà du chatbot vitrine).
- ❌ Facturation / forfaits (Stripe).
- ⚠️ Sécurité : clé Supabase en dur dans le code → à sortir en variable d'env.
- ⚠️ Pages légales (RGPD, CGU/CGV) = coquilles vides → obligatoire avant de
  stocker des données clients d'autres entreprises.

---

## 3. La clarification stratégique (le cœur du sujet)

### 3.1 Tu vends une PLATEFORME, pas 6 prestations
Modèle cible **multi-tenant** (plusieurs clients isolés sur une même plateforme) :

```
🟡 TOI — Super-Admin AMAVYA
   ├── crées les comptes clients, actives/coupes des modules, vois tout
   │
   ├── 🏢 CLIENT A (Admin de son espace)   ← isolé totalement du client B
   │     ├── voit SES prospects, SES agents, SES campagnes
   │     └── 👤 ses employés (utilisateurs simples)
   └── 🏢 CLIENT B ...
```
**Règle d'or** : le client A ne voit JAMAIS une donnée du client B. Ça se
décide dès le jour 1 (Supabase + Row Level Security).

### 3.2 « Je n'ai pas encore les agents » → c'est NORMAL, et voici la méthode
On ne construit pas les agents avant d'avoir un client. On utilise la méthode
**concierge (Magicien d'Oz)**, utilisée par la plupart des SaaS à succès :

1. Le client signe et reçoit un **vrai espace de connexion** (crédible, beau).
2. Dans cet espace, il voit **ses** données réelles (ses prospects, ses
   demandes entrantes, ses suivis).
3. Au début, **c'est toi (ou un agent semi-automatique) qui fais le travail
   en coulisses** : tu qualifies les leads, tu lances les séquences à la main
   ou avec Claude en assistant.
4. Le client, lui, voit « son agent qui travaille ». Il paie pour le
   **résultat**, pas pour la tuyauterie.
5. Mois après mois, tu **automatises** les tâches que tu faisais à la main →
   l'agent devient progressivement autonome, financé par l'abonnement.

> Ça veut dire qu'on peut **vendre et encaisser AVANT** que les agents soient
> 100 % autonomes. C'est la clé pour démarrer sans des mois de dev à perte.

---

## 4. Les 3 scénarios possibles (choisis ta trajectoire)

### Scénario A — « Portail client d'abord » (RECOMMANDÉ pour démarrer)
On construit l'**espace client minimal mais réel** : connexion sécurisée +
le client voit ses prospects/demandes entrantes + toi tu vois tout (admin).
Le 1er « agent » est semi-manuel (concierge).
- ✅ Vendable tout de suite, encaisse vite, risque faible.
- ✅ Te sert AUSSI à toi (ton propre CRM de prospection AMAVYA).
- ⏱️ Le plus rapide vers un 1er client payant.

### Scénario B — « Démo agent spectaculaire d'abord »
On construit 1 agent IA réel et bluffant (ex : qualification auto de prospect
par Claude) branché sur une fausse data, pour **closer en rendez-vous**.
- ✅ Très convaincant en démo de vente.
- ⚠️ Ne gère pas encore les vrais comptes clients (à faire après).

### Scénario C — « Plateforme complète d'un coup »
Auth + multi-tenant + 6 modules + facturation Stripe d'entrée.
- ✅ Produit « fini ».
- ❌ Long, coûteux, risqué AVANT d'avoir validé le marché. **Déconseillé maintenant.**

**Ma reco : A, puis on greffe B dedans (un agent réel sur des vraies données),
puis la facturation (C par morceaux).**

---

## 5. Architecture cible (les briques, dans l'ordre de dépendance)

```
1. VITRINE (déjà là)         → attire, explique, capture le lead
        │
2. AUTH & COMPTES            → inscription / connexion réelle (Supabase Auth)
        │                       rôles : super-admin (toi) / admin client / user
3. ESPACE CLIENT (portail)   → chaque client voit SES données (isolation RLS)
        │   ├── Prospects / demandes entrantes (formulaires → DB → dashboard)
        │   ├── Suivi / statuts / notes
        │   └── Vue "mes agents" (état, activité)
4. AGENTS (1 par 1)          → commencer par 1 agent réel (ex : qualif. lead
        │                       via Claude). Concierge au début, puis auto.
5. FACTURATION               → forfaits + Stripe (abonnement mensuel)
        │
6. SCALE                     → intégrations (HubSpot, LinkedIn…), + d'agents,
                                automatisations, admin avancé
```

Chaque brique dépend de la précédente. On ne saute pas d'étape.

---

## 6. Plan d'action par phases

> Durées indicatives (à valider selon ton rythme). Chaque phase = livrable
> visible + valeur business concrète.

### PHASE 0 — Cadrage & hygiène (court)
- Corriger l'incohérence de marque (fondateur = **Tarek Bouhlel**).
- Sécuriser la clé Supabase (variable d'env, pas dans le code).
- Brancher le vrai logo (fait ✅).
- **Valeur** : base saine et cohérente avant d'empiler.

### PHASE 1 — Auth & comptes réels
- Inscription / connexion réelle via **Supabase Auth** (email + Google).
- 3 rôles : super-admin (toi) / admin client / utilisateur.
- Protéger `/command-center` (accessible seulement connecté).
- **Ce que le client vit** : « Je me connecte à MON espace, sécurisé. »
- **Valeur** : la plateforme devient réelle, plus une maquette.

### PHASE 2 — Espace client : prospects & demandes entrantes
- Les formulaires du site → arrivent dans le **dashboard du bon compte**.
- Liste de prospects, statuts (nouveau/qualifié/RDV/gagné), notes, suivi.
- Toi (admin) : vue globale de tous les clients ; client : seulement le sien.
- **Ce que le client vit** : « Je vois mes leads et mes demandes en direct. »
- **Valeur** : tu utilises DÉJÀ la plateforme pour ta propre prospection.

### PHASE 3 — Le 1er agent réel (concierge → auto)
- Ex : à chaque nouveau prospect, **Claude le qualifie** (score + résumé +
  réponse suggérée) — d'abord déclenché par toi, puis automatique.
- **Ce que le client vit** : « Mon agent a traité ce prospect tout seul. »
- **Valeur** : preuve vivante à montrer en vente. Premier vrai « WOW » utile.

### PHASE 4 — Forfaits & facturation
- Définir 2-3 forfaits (ex : Starter / Pro / Sur-mesure).
- Stripe : abonnement mensuel, activation/désactivation des modules.
- **Valeur** : tu encaisses de façon récurrente (MRR).

### PHASE 5 — Scale (à la demande, financé par les revenus)
- Intégrations (HubSpot, LinkedIn, Gmail…) **une par client qui paie**.
- Agents supplémentaires (marketing, support, analyse…).
- Admin avancé, RGPD complet, logs, monitoring.

---

## 7. Points durs à anticiper (le côté « pro »)

- **🔒 RGPD** : tu stockes des données de prospects d'autres entreprises →
  responsabilité légale. Mentions + consentement + hébergement EU dès la Phase 1.
- **💰 Coûts variables** : chaque appel IA coûte quelques centimes. Le modèle
  de prix doit les couvrir (marge).
- **🎯 Scope** : la vision (centaines d'agents) = excellent pour **vendre**,
  mais on **construit** par petits morceaux livrables.
- **🛠️ Maintenance** : un SaaS vivant demande des mises à jour continues.

---

## 8. Décision : par quoi on commence ?

Reco : **Scénario A → Phase 0 + Phase 1** (cadrage + auth réelle), parce que
c'est la fondation de tout le reste et que ça rend la plateforme « vraie ».
Ensuite Phase 2 (tes prospects), puis Phase 3 (1er agent).

À valider avec toi avant de coder une seule ligne.
