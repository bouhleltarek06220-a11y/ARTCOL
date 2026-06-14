---
name: cold-email-outreach
description: "Machine de cold email B2B de A à Z : construction de l'ICP & ciblage, copywriting haute conversion (accroche, structure AIDA/PAS, personnalisation à l'échelle, CTA unique), séquences multi-étapes et multicanal (email + LinkedIn + téléphone), A/B testing, MAIS AUSSI délivrabilité complète (domaine dédié, SPF/DKIM/DMARC, warmup progressif, volumes journaliers, spam words, bounce management) et conformité RGPD/CNIL (base légale intérêt légitime, opt-out obligatoire, conservation des données). Utiliser pour : lancer une campagne de prospection froide sur lemlist ou Brevo, écrire des séquences d'emails personnalisés pour des créateurs / lieux / sponsors, diagnostiquer un problème de délivrabilité, mettre en conformité une liste, passer en multicanal. Mots-clés : cold email, outreach, prospection, séquence, copywriting, délivrabilité, lemlist, Brevo, SPF, DKIM, DMARC, warmup, spam, RGPD, CNIL, ICP, personnalisation, multicanal, A/B test, taux d'ouverture, taux de réponse, bounce, relance."
---

# Cold Email Outreach — machine de prospection B2B

Un cold email performant repose sur **3 piliers égaux** : le ciblage (bon ICP → bon message), la délivrabilité (email reçu en boîte principale) et le copywriting (email lu + répondu). Manquer l'un des trois détruit les deux autres.

## Quand l'activer
Lancer une campagne de prospection froide, écrire ou réviser des séquences, auditer un problème de délivrabilité, mettre un envoi en conformité RGPD, passer en approche multicanal.

---

## Étape 1 — ICP & ciblage

Avant d'écrire une ligne, définir :
- **Segment cible** : qui exactement (taille, secteur, rôle, signal déclencheur).  
  Exemples PlayAzur : créateur YouTube gaming 50k–500k subs FR ; venue karting/bowling cherchant à monétiser ; marque gaming/esport sans activation IRL.
- **Déclencheur** = raison de contacter maintenant (nouveau financement, recrutement, post récent, lancement de produit, événement à venir, SIREN récent sur Pappers).
- **Volume raisonnable** : 50–200 leads ultra-qualifiés > 2 000 contacts aléatoires.
- **Données minimales nécessaires** : prénom, nom, email vérifié, entreprise, signal personnalisation.

---

## Étape 2 — Délivrabilité (à faire AVANT le premier envoi)

### Infrastructure
- Acheter un **domaine dédié à la prospection** (ex. `playazur-pro.fr`, jamais le domaine principal).
- Configurer les enregistrements DNS :
  - **SPF** : `v=spf1 include:sendgrid.net ~all` (adapter à l'ESP).
  - **DKIM** : clé 2048 bits, configurée dans lemlist/Brevo.
  - **DMARC** : `v=DMARC1; p=quarantine; rua=mailto:dmarc@tondomaine.fr`.
- Vérifier sur [MXToolbox](https://mxtoolbox.com) et [Mail-tester.com](https://mail-tester.com) → score ≥ 9/10.

### Warmup
- Brancher le domaine sur **lemwarm** (lemlist) ou équivalent : 2–3 semaines d'envois automatiques croissants.
- Progression volumes : S1 = 10/j → S2 = 20/j → S3 = 40/j → stable = 50–80 emails/j/boîte.
- **Ne jamais dépasser 100 emails/j/adresse** en cold.

### Hygiène en continu
- Vérifier les emails avant envoi : **NeverBounce**, **ZeroBounce**, ou Apollo built-in.
- Taux de bounce cible < 2 %. Au-delà, stopper et nettoyer.
- Taux de spam complaint < 0,08 % (Google Postmaster Tools).
- **Mots à bannir** dans sujet et corps : "gratuit", "offre limitée", "cliquez ici", "gagnez", majuscules abusives, trop de liens, images lourdes.

---

## Étape 3 — Copywriting

### Structure recommandée (email froid)
```
SUJET  : court (≤ 7 mots), spécifique, pas clickbait — ex. "Question rapide sur [Event Name]"
LIGNE 1: personnalisation vraie (signal récent, pas "J'ai vu votre site")
LIGNE 2: pont → douleur spécifique du segment
LIGNE 3: bénéfice concret (chiffre si possible), pas feature
CTA    : 1 seul, friction zéro — "Est-ce que ça vaut 15 min ?" ou "Je vous envoie plus d'infos ?"
```

### Formules qui convertissent
- **PAS** : Problème → Agitation (conséquences) → Solution.
- **AIDA** : Attention → Intérêt → Désir → Action.
- **"Moi → Toi → Ensemble"** pour les séquences de relance.

### Règles d'or
- ✅ Email < 150 mots. Un seul sujet. Un seul CTA.
- ✅ Écrire à la **1ère personne du singulier**, ton humain (pas corporate).
- ✅ Personnalisation réelle : mentionner un post, un produit, une actualité (variable `{{icebreaker}}` dans lemlist).
- ❌ Ne jamais attacher de pièce jointe dans un cold email.
- ❌ Ne jamais commencer par "Je m'appelle X et je travaille chez Y."
- ❌ Éviter les superlatifs ("solution révolutionnaire", "unique sur le marché").

### Personnalisation à l'échelle (avec Clay/lemlist)
- Variables dynamiques : `{{firstName}}`, `{{company}}`, `{{recentPost}}`, `{{icebreaker}}` générée par IA.
- Liquid syntax lemlist : conditions sur segment, taille, rôle.
- Limiter à **1–2 variables vraiment personnalisées** par email ; le reste = segmentation propre.

---

## Étape 4 — Séquences multi-étapes

### Structure type (5 touchpoints sur 14 jours)
| Étape | Délai | Canal | Objectif |
|-------|-------|-------|----------|
| J0    | —     | Email | Email d'accroche (< 150 mots) |
| J3    | +3j   | Email | Relance valeur ajoutée (angle différent, lien ressource utile) |
| J6    | +3j   | LinkedIn | Message court ou réaction à un post |
| J9    | +3j   | Email | Dernière tentative (breakup email) |
| J12   | +3j   | Téléphone | Appel optionnel si deal prioritaire |

### Le "breakup email" (étape 4)
```
Sujet : Dernier message
Corps : Je ne veux pas vous encombrer. Si ce n'est pas le bon moment, pas de souci. 
        Si jamais ça redevient pertinent, vous savez où me trouver.
        [prénom]
```
Ce format génère souvent des réponses de prospects silencieux.

---

## Étape 5 — A/B testing

- Ne tester **qu'une variable à la fois** : sujet, ligne 1, CTA, longueur.
- Taille minimale par variante : **100 envois**.
- Métriques prioritaires : **taux d'ouverture** (sujet) → **taux de clic/réponse** (corps+CTA).
- Itérer toutes les 2 semaines ; archiver les versions battues.

---

## Étape 6 — Conformité RGPD/CNIL

- **Base légale B2B** : intérêt légitime (Art. 6.1.f RGPD) — pertinence métier obligatoire.
- Chaque email doit contenir un **lien de désinscription** fonctionnel en 1 clic.
- Les désinscrits doivent être blacklistés **immédiatement** dans l'outil et dans le CRM.
- Durée de conservation des données prospects : **max 3 ans** sans interaction.
- Ne jamais acheter de listes cold sans vérifier l'origine des données.
- Sur lemlist : activer "Unsubscribe page" + synchroniser avec Brevo/CRM.

---

## Métriques cibles (cold B2B)

| Métrique | Acceptable | Bon | Excellent |
|----------|-----------|-----|-----------|
| Taux d'ouverture | 30 % | 45 % | > 60 % |
| Taux de réponse | 3 % | 6 % | > 10 % |
| Taux de réponse positive | 1 % | 2,5 % | > 5 % |
| Bounce | < 5 % | < 2 % | < 1 % |

---

## Livrables typiques à produire

- Infrastructure checklist (DNS + warmup plan)
- Séquence complète N étapes (email + LinkedIn)
- Template copywriting par persona (créateur / venue / sponsor)
- Plan A/B test avec hypothèses
- Audit délivrabilité d'une campagne existante

> **Skills sœurs** : `abm-meddic` (ciblage grand compte), `data-enrichment-b2b` (construire la liste ICP), `data-scraping-ethique` (sourcer les leads), `snap-selling` (adapter le message aux décideurs débordés), `disc` (adapter le ton au profil), `vente-4c` (suite du funnel après réponse positive).
