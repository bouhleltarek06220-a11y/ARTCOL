# 🚀 Déploiement sur Vercel — Guide pas à pas

Objectif : avoir une URL publique du type `https://playazur-crm.vercel.app` que toi, Julie et Myriam ouvrez dans Chrome, et qui se met à jour automatiquement à chaque modification du code.

**Durée : 10 minutes la première fois. Ensuite plus jamais à toucher.**

---

## Étape 1 — Compte Vercel (2 min)

1. Va sur [vercel.com](https://vercel.com/signup).
2. Clique **Continue with GitHub** (utilise le même compte GitHub que pour ce repo).
3. Autorise Vercel à accéder à tes repos.
4. Choisis le plan **Hobby** (gratuit) — largement suffisant pour le CRM.

---

## Étape 2 — Importer le repo (3 min)

1. Dashboard Vercel → bouton **Add New… → Project**.
2. Liste de tes repos GitHub → trouve **`bouhleltarek06220-a11y/artcol`** → clique **Import**.
3. Tu arrives sur l'écran de configuration. **STOP, attention à 3 réglages :**

### ⚙️ Configuration projet

| Champ | Valeur |
|---|---|
| **Project Name** | `playazur-crm` (ou ce que tu veux, ça donnera l'URL) |
| **Framework Preset** | `Other` |
| **Root Directory** | clique **Edit** → sélectionne `playazur-crm` ⚠️ **TRÈS IMPORTANT** |
| **Build Command** | (laisse vide / Override : OFF) |
| **Output Directory** | (laisse vide / Override : OFF) |
| **Install Command** | (laisse vide / Override : OFF) |

> **Pourquoi `Root Directory: playazur-crm`** ?
> Parce que le repo `artcol` contient aussi un projet React indépendant (`ARTCOL`).
> En disant à Vercel "regarde uniquement dans le sous-dossier `playazur-crm`", on déploie SEULEMENT le CRM, pas le reste.

4. Clique **Deploy**.
5. Attends ~30 secondes — Vercel build et déploie.
6. URL prête ! Exemple : `https://playazur-crm.vercel.app`.

---

## Étape 3 — Vérifier que tout marche (2 min)

1. Ouvre l'URL Vercel dans Chrome.
2. Tu dois voir l'écran de login Play Azur (animation bleue/orange, formulaire à droite).
3. Connecte-toi avec ton compte habituel (celui de Supabase) — tout doit fonctionner exactement comme en local.
4. **Test PWA** : regarde la barre d'adresse Chrome → tu dois voir une **icône `+`** ou **`⊕`** à droite, dans l'URL bar. Clique dessus → "Installer Play Azur CRM" → Installer.
5. L'app s'ouvre dans sa propre fenêtre, avec l'icône Play Azur dans le Dock/Barre des tâches. 🎉

> Si tu ne vois pas l'icône `+`, ouvre la console (F12 → Console) et tape :
> `navigator.serviceWorker.getRegistration()` — tu dois voir une promesse retournée. Si erreur, le service worker n'est pas enregistré (souvent un problème de HTTPS / mauvais path).

---

## Étape 4 — Domaine personnalisé (optionnel, 5 min)

Si tu veux `crm.playazur.fr` au lieu de `playazur-crm.vercel.app` :

1. Achète ou récupère le domaine `playazur.fr` (ou autre).
2. Dans Vercel → Project → **Settings → Domains** → Add → `crm.playazur.fr`.
3. Vercel te dit quels champs CNAME ajouter chez ton registrar (OVH, Gandi, etc.).
4. 5-30 min de propagation DNS et c'est en ligne.

---

## Étape 5 — Workflow de mise à jour (à connaître)

À partir de maintenant, à chaque fois que je fais un changement de code et que je push sur la branche `main` (ou que tu mergeras une PR depuis une branche de feature) :

1. Vercel détecte le push.
2. Build + déploiement automatique en ~30 secondes.
3. Toi, Julie, Myriam ouvrez le CRM → un toast bleu apparaît en bas : **"🚀 Nouvelle version disponible — Recharger"**.
4. Clic sur Recharger → la nouvelle version est en place. Aucun travail perdu (toutes les modifs sont sync cloud Supabase en temps réel).

> Tu n'as **plus jamais** à renvoyer le fichier par mail / WeTransfer. Tout le monde est sur la même URL = toujours la dernière version.

---

## 🔐 Variables d'environnement (optionnel mais recommandé)

Actuellement, les clés `SUPA_URL` et `SUPA_KEY` sont **en dur dans le HTML**. C'est OK parce que la clé anon Supabase est publique par design (protégée par RLS).

Si plus tard tu veux les sortir du code (pour pouvoir changer d'environnement, faire du staging, etc.) :

1. Vercel Project → **Settings → Environment Variables** → ajoute :
   - `SUPABASE_URL = https://dmztalsmreugfwojsaar.supabase.co`
   - `SUPABASE_ANON_KEY = ...`
2. Et on remplacera dans le code `const SUPA_URL = '...'` par un lookup au runtime via un endpoint `/config.json` généré par Vercel.

Pas urgent.

---

## ❓ FAQ

**Q : Si je modifie le HTML en local, je dois faire quoi pour que ça se déploie ?**
R : `git commit -am "message"` puis `git push`. Vercel fait le reste tout seul.

**Q : Combien ça coûte ?**
R : 0 € sur le plan Hobby tant qu'on reste sous 100 GB de bande passante / mois. Pour 3 utilisateurs internes, on est 100x sous la limite.

**Q : Et si Vercel tombe ?**
R : Le service worker garde une copie en cache local, l'app continue de tourner. Quand Vercel revient, ça resync.

**Q : C'est privé ou public ?**
R : L'URL est publique (n'importe qui qui la connaît peut y accéder), MAIS sans compte Supabase valide, on s'arrête à l'écran de login. Pour rendre l'URL elle-même privée, il faut le plan Pro (20 $/mois) avec "Vercel Authentication" (SSO devant le site). Pas indispensable au début.

**Q : Comment je restaure une ancienne version si je casse tout ?**
R : Vercel garde l'historique de tous les déploiements → Project → Deployments → clique sur un déploiement précédent → **Promote to Production**. Rollback en 5 secondes.
