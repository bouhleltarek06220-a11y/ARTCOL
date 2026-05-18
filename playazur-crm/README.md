# Play Azur CRM — Mission Lost Chapter

CRM BizDev en ligne pour l'équipe Play Azur Production.
3 axes : **Lieux patrimoine · Streamers · Financeurs**.

Stack : HTML/JS vanilla · Supabase (auth + BDD + realtime) · Leaflet · Chart.js · Claude · Whisper · Brevo.
Hébergé sur **Vercel** comme **PWA installable** (bureau Mac/Windows + mobile).

---

## 🚀 Déploiement (à faire UNE seule fois)

Voir le pas-à-pas complet dans [`docs/02-DEPLOIEMENT-VERCEL.md`](docs/02-DEPLOIEMENT-VERCEL.md).

Résumé express :

1. Crée un compte gratuit sur [vercel.com](https://vercel.com/) (login GitHub recommandé).
2. **Import Project** → choisis le repo `bouhleltarek06220-a11y/artcol`.
3. **Root Directory** : `playazur-crm` (très important — la PWA est dans ce sous-dossier).
4. **Framework Preset** : `Other` (statique).
5. **Build Command** : laisse vide.
6. **Output Directory** : laisse vide (Vercel sert directement les fichiers statiques).
7. **Deploy**.

URL obtenue (exemple) : `https://playazur-crm.vercel.app`
→ partage-la à Julie et Myriam, chacune ouvre dans Chrome/Edge/Safari.

À chaque `git push`, Vercel redéploie automatiquement. Pas besoin de renvoyer un fichier.

---

## 👥 Ajouter Julie et Myriam

Voir [`docs/01-AJOUTER-JULIE-ET-MYRIAM.sql`](docs/01-AJOUTER-JULIE-ET-MYRIAM.sql) (commentaires en tête).

Étapes :
1. Supabase Dashboard → **Authentication → Users → Add user** (créer leur compte avec un mot de passe temporaire suivant le pattern `Jp2026#XXXXXXXXXXXX`).
2. Récupérer leurs UUID (colonne UID).
3. Exécuter le SQL fourni dans **SQL Editor** (remplacer `JULIE_USER_ID` et `MYRIAM_USER_ID` par les vrais UUID).
4. Leur transmettre email + mot de passe temporaire **via un canal sécurisé** (Signal, mot de passe à usage unique, jamais par email/SMS en clair).
5. Au premier login, le CRM les force à choisir leur propre mot de passe (≥ 10 caractères, 1 majuscule, 1 chiffre).

---

## 📲 Installation sur le bureau (PWA)

Voir le guide visuel pour Julie et Myriam dans [`docs/03-ONBOARDING-EQUIPE.md`](docs/03-ONBOARDING-EQUIPE.md).

- **Chrome / Edge (Windows, Mac, Android)** : ouvre l'URL → clique sur l'icône `+` ou `⊕` à droite de la barre d'adresse → **Installer**.
- **Safari iOS** : ouvre l'URL → bouton **Partager ⬆️** → **Sur l'écran d'accueil**.
- **Safari macOS 14+** : menu **Fichier → Ajouter au Dock**.

Le CRM apparaît alors comme une vraie application avec son icône Play Azur, ouvre dans sa propre fenêtre (sans la barre d'URL), et fonctionne même brièvement hors-ligne (les données synchronisent dès que la connexion revient).

Un bouton **📲** apparaît dans la barre supérieure de l'app quand l'installation est possible.

---

## 🔄 Synchronisation temps réel

La synchro est **déjà active** dès qu'au moins 2 personnes ont un compte :

- Quand Tarek modifie un prospect → Julie le voit s'actualiser **en temps réel** dans son onglet ouvert (Supabase Realtime).
- Polling toutes les 30 s en filet de sécurité (rattrapage si l'évènement realtime a été manqué).
- File d'attente automatique si un sync échoue (retry exponentiel).

Aucune action manuelle requise. Indicateur dans le header : ☁️ (vert = sync active, rouge = perdu, reconnexion auto).

---

## 🎨 Icônes / logo

Le logo officiel Play Azur n'a pas pu être inséré automatiquement.
Une icône SVG fidèle a été générée à sa place (cf. `icons/play-azur-logo.svg`).

Pour remplacer par le logo officiel :

```bash
# 1. Pose ton logo officiel ici (carré, 1024×1024 PNG ou SVG) :
cp /chemin/vers/play-azur-officiel.png icons/play-azur-logo.png

# 2. Régénère toutes les tailles d'icônes :
cd icons && node build-icons.cjs

# 3. Commit + push → Vercel redéploie tout seul
git add icons/ && git commit -m "feat(icons): logo officiel Play Azur" && git push
```

---

## 🗂️ Structure du dossier

```
playazur-crm/
├── index.html                    # L'app complète (mono-fichier)
├── manifest.json                 # Manifeste PWA (nom, icônes, couleurs)
├── sw.js                         # Service Worker (offline + auto-update)
├── vercel.json                   # Config déploiement Vercel
├── icons/
│   ├── play-azur-logo.svg        # Logo source (SVG, éditable)
│   ├── build-icons.cjs           # Script pour régénérer les PNG
│   ├── icon-192.png              # Icône PWA standard
│   ├── icon-512.png              # Icône PWA grande
│   ├── icon-maskable-512.png     # Icône avec safe area (Android adaptive)
│   ├── apple-touch-icon-180.png  # Icône iOS / Safari
│   ├── favicon-32.png            # Favicon onglet
│   └── favicon-16.png            # Favicon onglet (petit)
├── docs/
│   ├── 01-AJOUTER-JULIE-ET-MYRIAM.sql
│   ├── 02-DEPLOIEMENT-VERCEL.md
│   └── 03-ONBOARDING-EQUIPE.md
└── README.md                     # Ce fichier
```

---

## 🛠️ Développement local

```bash
# Servir l'app sur localhost:8080 :
cd playazur-crm
npx http-server -p 8080 -c-1 .

# Puis ouvre http://localhost:8080
```

Note : le service worker ne s'active **qu'en HTTPS ou sur localhost/127.0.0.1**, c'est volontaire (sécurité). En local tu auras donc la PWA complète.

---

## 🔐 Sécurité

- Auth Supabase (email + mot de passe) avec **anti brute-force** (verrouillage 30 min après 5 échecs), **MFA TOTP** optionnel, **device fingerprinting**, **journal des connexions**.
- CSP stricte, SRI sur tous les CDN.
- Dashboard sécurité réservé au propriétaire (icône 🛡️ dans le header).
- Clés API Claude / OpenAI / Brevo : à mettre dans **Settings** côté utilisateur (chiffrées en localStorage) ou via le **proxy Supabase Edge Function** (`ai-proxy`, voir code).

---

## 📞 Support

Concepteur : Tarek Bouhlel · Mission Play Azur Production · Lost Chapter 2026.
