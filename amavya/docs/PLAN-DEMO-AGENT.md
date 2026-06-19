# AMAVYA — Plan détaillé : Scénario B « Démo agent d'abord »

> Suite de `STRATEGIE-PLATEFORME.md`. Cadrage opérationnel du scénario choisi :
> construire **un agent IA réel et bluffant** pour closer en rendez-vous, avec
> forfaits/prix, spécification de l'espace client, et estimation budget/temps.
> AUCUN code tant que ce plan n'est pas validé.

---

## 1. Quel agent pour la démo ? → **Agent Prospection (Qualification IA)**

C'est le meilleur choix car : (a) il s'appuie sur ce que tu as DÉJÀ (Claude +
formulaire de contact + Supabase), (b) il parle directement à ta cible
(dirigeants/commerciaux), (c) le « avant/après » est spectaculaire en 30 secondes.

### Ce que l'agent fait, en direct devant le prospect
Entrée : un lead (nom, société, email, message) — saisi en live ou venant d'un
vrai formulaire. En ~5 secondes, **Claude** produit :

1. **Score de qualification** 0–100 + justification courte.
2. **Résumé du besoin** en 1 phrase.
3. **Correspondance ICP** (« cible idéale ? oui/non + pourquoi »).
4. **Réponse personnalisée** prête à envoyer (email rédigé).
5. **Prochaine action** recommandée (RDV / relance / écarter).
6. **Contexte société** déduit (secteur, taille estimée) à partir du nom/domaine.

### Mise en scène (le « WOW »)
Carte animée façon command-center : `Agent Prospection — analyse en cours…`
puis les blocs apparaissent un par un (score qui monte, badge ICP, email qui
se rédige). On reste dans l'esthétique dorée déjà validée.

### Pourquoi c'est honnête ET vendable
C'est un **vrai** appel à Claude sur de **vraies** données saisies par le
prospect. Pas une animation scriptée. Le prospect peut taper SON propre lead et
voir l'agent le traiter → preuve immédiate.

---

## 2. Le script de vente (déroulé du rendez-vous)

1. **Accroche** : « Combien de temps votre équipe passe à trier et relancer les
   leads ? » → douleur.
2. **Connexion** : tu ouvres `/login`, tu te connectes (espace crédible).
3. **Démo live** : tu colles un lead réel du prospect (ou un cas type de son
   secteur) → l'Agent Prospection le qualifie en direct.
4. **Bascule** : « Imaginez ça sur vos 200 leads/mois, 24/7, sans votre équipe. »
5. **Offre** : tu présentes les forfaits (section 3).
6. **Close** : signature → ouverture de SON espace (concierge au début).

---

## 3. Forfaits & prix (proposition à ajuster)

Modèle **hybride agence + SaaS** : un **frais de mise en place** (onboarding,
paramétrage de l'agent à son métier) + un **abonnement mensuel**. C'est le
standard pour ce type d'offre premium B2B en France.

> ⚠️ Prix = PROPOSITIONS de départ, à caler selon ta marge et ton marché.
> Logique : couvrir les coûts IA + le temps concierge + une marge premium.
> On vend de la **valeur** (un RDV signé vaut des milliers d'€), pas des tokens.

| | **STARTER** | **PRO** ⭐ | **SUR-MESURE** |
|---|---|---|---|
| Cible | TPE / indé / test | PME en croissance | ETI / besoins spécifiques |
| Mise en place (one-shot) | 490 € | 1 490 € | sur devis (3 000 €+) |
| Abonnement | **297 €/mois** | **690 €/mois** | **dès 1 500 €/mois** |
| Agents inclus | 1 (Prospection) | 3 (Prospection, CRM, Relance) | jusqu'à 6 modules |
| Volume leads/mois | 150 | 800 | illimité (fair use) |
| Espace client | ✅ | ✅ | ✅ + multi-utilisateurs |
| Intégrations | — | 1 au choix | sur mesure |
| Support | Email | Prioritaire | Dédié + SLA |
| Idéal pour | Valider la valeur | Le cœur de cible | Closer les gros comptes |

**Engagement** : mensuel sans engagement OU -2 mois si annuel (classique SaaS).

**Pourquoi ce pricing tient** :
- Le coût IA réel d'une qualification ≈ quelques centimes → marge énorme.
- La mise en place finance ton temps de paramétrage concierge.
- 690 €/mois est « rien » face à 1 RDV qualifié supplémentaire/semaine.

---

## 4. Maquette de l'espace client (spécification)

L'espace post-connexion réutilise l'esthétique `/command-center` mais avec de la
VRAIE data du client. Structure proposée :

```
ESPACE CLIENT (après login)
├── 🏠 Vue d'ensemble        → KPI réels du client (leads, qualifiés, RDV)
├── 🎯 Prospects             → liste des leads + score IA + statut + actions
│      └── Fiche prospect    → détail + analyse de l'Agent Prospection + email suggéré
├── 🤖 Mes agents           → état des agents (actif/pause), activité récente
├── 📨 Demandes entrantes    → formulaires reçus depuis son site/landing
├── 📊 Performance           → graphiques (conversion, volume) — réels
└── ⚙️ Paramètres           → profil société, ICP, ton de voix de l'agent

CÔTÉ TOI (super-admin)
├── 👥 Clients               → liste, statut abonnement, activité
├── 🔧 Agents par client     → activer/couper modules, voir les coûts IA
└── 💶 Facturation          → MRR, paiements Stripe
```

**Différence clé avec la maquette actuelle** : ici les chiffres viennent de la
base de données filtrée par client (isolation), pas de valeurs en dur.

---

## 5. Budget & temps (estimation)

### 5.1 Effort de construction (par lot)
| Lot | Contenu | Effort indicatif |
|---|---|---|
| Hygiène (Phase 0) | Fondateur, clé Supabase en env, légal de base | 0,5 j |
| **Agent démo** (le WOW) | Route API qualification Claude + UI animée | 1–2 j |
| Maquette espace client | Pages avec vraie structure (data simulée d'abord) | 2–3 j |
| Auth réelle (si on enchaîne) | Supabase Auth + 3 rôles + protection routes | 2–3 j |
| Prospects réels (Phase 2) | Formulaire → DB → dashboard par client | 2–3 j |
| Facturation Stripe | Forfaits + abonnement + portail | 2–4 j |

> « j » = jours de développement assisté. Avec moi, plusieurs lots avancent vite.

### 5.2 Coûts récurrents réels (à prévoir)
| Poste | Coût | Quand |
|---|---|---|
| Claude API (Haiku) | ~quelques centimes / qualification | à l'usage |
| Supabase | 0 € (free) → ~25 $/mois (Pro) | quand data réelle |
| Vercel | 0 € (hobby) → ~20 $/mois (Pro) | au trafic |
| Stripe | ~1,5 % + 0,25 € / transaction | par paiement |
| Domaine | déjà (amavya.cloud) | — |

**Lecture** : tant que tu es petit, l'infra coûte ~0–50 €/mois. Les coûts ne
montent que quand tu encaisses → modèle sain.

### 5.3 Seuil de rentabilité (exemple)
1 seul client PRO (690 €/mois) couvre **largement** toute l'infra et l'IA.
À partir du 2ᵉ client, c'est de la marge. Objectif réaliste : 3–5 clients
pilotes → MRR ~2 000–3 500 €/mois pour valider le modèle.

---

## 6. Ordre de marche recommandé pour le Scénario B

1. **Valider ce plan** (prix, agent choisi, structure espace client). ← on est ici
2. **Phase 0** : hygiène rapide (fondateur, clé Supabase).
3. **Agent démo** : construire l'Agent Prospection réel + son UI WOW.
4. **Maquette espace client** branchée autour de l'agent (data simulée).
5. **Démo de vente** prête → tu prospectes / closes tes 1ers pilotes.
6. **Puis** auth réelle + prospects réels + Stripe (on bascule sur le moteur).

---

## 7. Décisions qui t'appartiennent (à trancher)
- 💶 **Prix** : valides-tu la grille (Starter/Pro/Sur-mesure) ou tu ajustes ?
- 🤖 **Agent** : Prospection/Qualification confirmé comme 1ʳᵉ démo ?
- 🎨 **Espace client** : on commence par la maquette visuelle ou direct le branchement data ?
- ⚖️ **Légal** : veux-tu que je rédige des bases RGPD/CGU avant la collecte de données ?
