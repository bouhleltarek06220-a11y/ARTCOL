# 🚀 Déploiement Vercel — Les 2 minutes qui restent

**État au 18 mai 2026** :
- ✅ Code pushé sur la branche `claude/code-analysis-discussion-CYK7g`
- ✅ PWA configurée (manifest + service worker + icônes)
- ✅ `vercel.json` racine prêt (sert `playazur-crm/` à l'URL racine)
- ✅ Compte Supabase : 3 utilisatrices (Tarek, Julie, Myriam) déjà créées et confirmées
- ⏳ **Reste UNIQUEMENT à connecter Vercel ↔ GitHub via ton navigateur**

> Le déploiement automatisé n'est pas faisable depuis mon environnement parce que Vercel exige un login OAuth interactif (par sécurité). C'est la seule étape manuelle, et tu n'auras à le faire qu'**une seule fois**. Après ça, tous mes pushes redéploieront automatiquement.

---

## 🪜 Étape par étape (compte minuté : 2 min)

### 1. Compte Vercel (skip si déjà fait)

1. Va sur [vercel.com/signup](https://vercel.com/signup).
2. **Continue with GitHub** → autorise → choisis le plan **Hobby** (gratuit).

### 2. Importer le repo

1. Dashboard Vercel → **Add New… → Project**.
2. Tu vois la liste de tes repos GitHub.
3. À droite de **`bouhleltarek06220-a11y/artcol`** → clique **Import**.

> Si tu ne vois pas le repo : clique sur **Adjust GitHub App Permissions** en bas → autorise Vercel à accéder à ce repo précis.

### 3. Configurer le projet (l'écran "Configure Project")

| Champ | Valeur à mettre |
|---|---|
| Project Name | `playazur-crm` (ou ce que tu veux) |
| Framework Preset | `Other` (laissé par défaut si Vercel devine "Other") |
| Root Directory | **Laisse `.`** ⚠️ NE CHANGE PAS — le `vercel.json` racine gère déjà tout |
| Build and Output Settings | Laisse tout par défaut (`vercel.json` les définit) |
| Environment Variables | Aucune à ajouter |

> **Pourquoi laisser Root Directory à `.` ?** Parce que j'ai mis un `vercel.json` à la racine du repo avec `outputDirectory: "playazur-crm"`. Vercel lit cette config et sert le sous-dossier comme le contenu de l'URL. Si tu changes Root Directory, ça casse.

### 4. Branche de production

Sur l'écran d'import, juste après le nom du projet, il y a un champ **Production Branch**.

- Par défaut Vercel propose `main`.
- **Change-le pour `claude/code-analysis-discussion-CYK7g`** pendant que la PR n'est pas mergée.
- (Après le merge, tu pourras revenir à `main` dans Settings → Git.)

### 5. Deploy

Clique **Deploy** → attends ~30 secondes → 🎉 URL prête.

Exemple : `https://playazur-crm.vercel.app` (ou avec un hash : `playazur-crm-abc123.vercel.app`).

---

## ✅ Vérifier que tout marche (30 sec)

1. Ouvre l'URL Vercel dans Chrome ou Edge.
2. Tu dois voir le login Play Azur (logo animé bleu/orange).
3. Connecte-toi avec ton compte habituel (`tarek.bouhlel@rocket-school.eu`).
4. **Test PWA** : regarde la barre d'adresse Chrome → **icône `+` ou `⊕`** à droite → clique → **Installer Play Azur CRM**.
5. L'app s'ouvre dans sa propre fenêtre, icône Play Azur dans le Dock/Barre des tâches.

Si tu vois ça, c'est gagné. Envoie l'URL à Julie et Myriam avec leur mot de passe temporaire (par Signal/téléphone, pas par mail !).

---

## 🔄 Workflow de mise à jour (à connaître)

À partir de maintenant :

1. Je pousse un commit (ex : nouveau bouton, correction de bug).
2. Vercel détecte le push → redéploie en ~30 sec.
3. Vous 3 ouvrez le CRM → un toast bleu apparaît en bas :
   **"🚀 Nouvelle version disponible — Recharger"**
4. Clic sur Recharger → la nouvelle version est en place.

**Plus jamais besoin de renvoyer un fichier HTML par mail.**

---

## 🌐 Domaine perso (optionnel, 5 min)

Si tu veux `crm.playazur.fr` au lieu de `playazur-crm.vercel.app` :

1. Vercel → Project → **Settings → Domains** → Add → `crm.playazur.fr`.
2. Vercel te dit quels CNAME ajouter chez le registrar du domaine.
3. 5-30 min de propagation DNS → c'est en ligne.

---

## ❓ FAQ

**Q : Combien ça coûte ?**
R : 0 € sur le plan Hobby. Les limites (100 GB bande passante/mois, 100 déploiements/jour) sont 100× au-dessus de nos besoins.

**Q : Et si je casse tout en pushant un commit ?**
R : Vercel garde l'historique de TOUS les déploiements → Project → Deployments → clique sur un déploiement précédent qui marchait → **"Promote to Production"**. Rollback en 5 secondes.

**Q : L'URL est-elle publique ?**
R : Oui, n'importe qui qui la connaît peut l'ouvrir. MAIS l'accès au CRM lui-même est protégé par Supabase Auth (email + mot de passe + anti brute-force + MFA optionnel). Sans compte valide, on s'arrête à l'écran de login.

**Q : Si Vercel tombe, on fait quoi ?**
R : Le service worker garde une copie en cache local sur ton ordi → l'app continue de tourner en mode dégradé. Dès que Vercel revient, ça resync. Et Vercel a 99.99% d'uptime.

**Q : Puis-je voir les logs si quelque chose ne marche pas ?**
R : Vercel → Project → Deployments → clique sur un déploiement → **Build Logs** + **Runtime Logs**. Je peux aussi les lire à distance via mes outils Vercel — envoie-moi l'URL de déploiement et je diagnostique.
