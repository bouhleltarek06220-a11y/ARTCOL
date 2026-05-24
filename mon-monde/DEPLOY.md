# 🚀 Déployer Mon Monde sur Vercel — guide clic par clic

## Ce que tu vas obtenir

- Une **URL HTTPS** (ex: `mon-monde-tarek.vercel.app`) accessible depuis n'importe quel appareil
- Une PWA installable sur iMac, Zenbook, iPhone, Android
- Un **edge proxy** qui garde ta clé Anthropic côté serveur (zéro fuite navigateur)
- Mises à jour automatiques à chaque push sur la branche

Compte Vercel **gratuit** suffisant pour tout ça.

---

## Étape 1 — Créer un compte Vercel (skip si tu en as déjà un)

1. Va sur **https://vercel.com/signup**
2. Clique **"Continue with GitHub"** (ton compte `bouhleltarek06220-a11y`)
3. Autorise Vercel à accéder à tes repos

---

## Étape 2 — Importer le projet

1. Sur https://vercel.com → **"Add New..."** (en haut à droite) → **"Project"**
2. Tu vois ta liste de repos GitHub. Cherche **`ARTCOL`** et clique **"Import"**

---

## Étape 3 — Configurer le projet

Cette étape est **critique**, lis attentivement :

| Champ | Valeur à mettre |
|---|---|
| **Project Name** | `mon-monde` |
| **Framework Preset** | `Other` |
| **Root Directory** | ⚠️ **clique "Edit" et tape `mon-monde`** |
| **Build Command** | (laisse vide) |
| **Output Directory** | (laisse vide) |
| **Install Command** | (laisse vide) |

> **⚠️ Le piège** : par défaut Vercel prend la racine du repo (qui contient l'app React ARTCOL). Tu DOIS changer **Root Directory** pour `mon-monde`. Si tu oublies cette étape, ça déploie le mauvais truc.

---

## Étape 4 — Variable d'environnement (la clé API Claude)

**Avant de cliquer Deploy**, déplie la section **"Environment Variables"** et ajoute :

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | ta clé `sk-ant-api03-...` (celle que tu as révoquée + recréée) |

> **🔒 Sécurité absolue confirmée** : cette clé reste sur Vercel, jamais transmise à ton navigateur. Ton edge function la lit depuis `process.env.ANTHROPIC_API_KEY` quand elle reçoit une requête.

Si tu n'as pas encore la clé, tu peux quand même déployer et ajouter la clé plus tard (Project Settings → Environment Variables → "Add New").

---

## Étape 5 — Déployer

Clique **"Deploy"**.

Vercel build le projet en ~30 secondes, puis affiche un écran de félicitations avec ton URL.

Ton URL : **`https://mon-monde-XXXX.vercel.app`** (ou `mon-monde.vercel.app` si le nom est libre)

---

## Étape 6 — Brancher la branche de développement (optionnel mais utile)

Par défaut Vercel déploie seulement depuis `main`. Pour que les Previews fonctionnent aussi depuis `claude/brain-implementation-gCULH` :

1. Va dans **Settings** → **Git**
2. **Production Branch** : laisse `main`
3. Toutes les autres branches → tu obtiens automatiquement une **URL Preview** à chaque commit (ex: `mon-monde-git-claude-brain.vercel.app`)

Donc dès que je push, tu as une URL Preview dans la PR.

---

## Étape 7 — Installer la PWA sur tes appareils

Une fois l'URL ouverte dans un navigateur, tu peux installer Mon Monde comme une vraie app :

**Sur iMac / Mac (Safari)** :
- Menu **Fichier** → **"Ajouter au Dock"** ou icône partage → **"Ajouter au Dock"**

**Sur iMac / Mac (Chrome)** :
- Icône `+` dans la barre d'URL → **"Installer Mon Monde"**

**Sur Zenbook / Windows (Edge ou Chrome)** :
- Icône d'installation dans la barre d'URL → **"Installer Mon Monde"**

**Sur iPhone (Safari)** :
- Bouton partage → **"Sur l'écran d'accueil"**

**Sur Android (Chrome)** :
- Menu → **"Installer l'application"**

Une fois installée, Mon Monde se lance comme une vraie app, plein écran, sans barre de navigation.

---

## Étape 8 — Custom domain (optionnel, plus tard)

Si tu veux `monmonde.tarek.app` au lieu de `mon-monde.vercel.app` :
1. Achète le domaine (Vercel ou OVH ou ailleurs, ~12 €/an)
2. Project Settings → **Domains** → **Add**
3. Suis les instructions DNS

---

## Vérifier que le proxy fonctionne

Une fois déployé, ouvre `https://ton-url.vercel.app` et :
1. Va dans **🌸 SHRINE** → déverrouille avec ta passphrase
2. La clé API n'apparaît jamais en clair côté navigateur — c'est l'edge function qui parle à Anthropic
3. Va dans **🌌 BRAIN** → **◎ CHAT** → active le mode IA → pose une question
4. Si tu reçois une réponse → tout marche ✓

**Pour debug** : ouvre la console (F12) et regarde l'onglet **Network**. Tu dois voir des requêtes vers `/api/claude` (et **pas** vers `api.anthropic.com`). C'est le SW qui a intercepté.

---

## En cas de souci

| Symptôme | Cause probable | Solution |
|---|---|---|
| Erreur 500 sur /api/claude | `ANTHROPIC_API_KEY` non configurée | Project Settings → Environment Variables → ajouter, puis Redeploy |
| Erreur 401 d'Anthropic | Clé invalide ou révoquée | Crée une nouvelle clé sur console.anthropic.com et mets-la à jour sur Vercel |
| L'app ne s'installe pas comme PWA | Service Worker non chargé | Ouvre `https://ton-url/sw.js` → tu dois voir du JS. Sinon refresh / Hard Reload |
| Mon Monde n'apparaît pas à la racine | Root Directory mal configuré | Settings → General → Root Directory → mettre `mon-monde` → Redeploy |

---

## Ce qui se passe sous le capot

```
   Ton navigateur                         Vercel (HTTPS)              Anthropic
   ┌──────────────┐                       ┌──────────────┐            ┌──────────┐
   │ Brain/Shrine │  fetch(api.anthropic) │ Service      │            │          │
   │ /Compta call │ ───────────────────►  │ Worker       │            │ Claude   │
   │ Claude API   │                       │ intercepte   │            │ API      │
   └──────────────┘                       └──────┬───────┘            └────▲─────┘
                                                 │ POST /api/claude        │
                                                 ▼                         │
                                          ┌──────────────┐                 │
                                          │ Edge function│                 │
                                          │ ajoute clé   │ ────────────────┘
                                          │ depuis env   │
                                          └──────────────┘
```

La clé Anthropic existe **uniquement** dans :
- Tes variables d'environnement Vercel
- La RAM de l'edge function (temporaire, le temps d'une requête)
- Jamais dans le navigateur, jamais dans Git, jamais dans le code source
