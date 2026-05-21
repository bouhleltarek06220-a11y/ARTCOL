# 🌸 ARTCOL — App Mobile (Phases 1 + 2 + 3)

Réseau social cross-platform pour artistes en quête de visibilité.
Stack : **React Native + Expo + Supabase + Cloudinary** · Design : **ARTCOL**

---

## 📦 Ce qui est livré (Phases 1 + 2 + 3)

**Phase 1** ✅
- Setup complet React Native + Expo (TypeScript strict)
- Auth Supabase (signup, signin, signout, persistance session)
- Schéma DB Postgres avec **Row Level Security** (table `profiles`)
- Trigger SQL : création auto de profil à l'inscription
- Écrans : Welcome, SignUp, SignIn, Home, Profile, EditProfile
- Design system ARTCOL (palette, fontes, composants)
- Navigation conditionnelle (Auth vs App selon session)

**Phase 2** ✅
- Composant `Avatar` réutilisable (image ou fallback initiales, ring néon)
- Picker photo via `expo-image-picker` (galerie, crop carré 1:1)
- Compression locale via `expo-image-manipulator` (resize 512×512, JPEG 0.8)
- Upload vers bucket Supabase `avatars` (path `{uid}/avatar.jpg`, cohérent RLS, upsert)
- Cache-busting via query string `?v=timestamp`
- Avatar visible dans Home (header tappable), Profile et EditProfile

**Phase 3** ✅
- Tables `posts`, `post_likes`, `post_comments` + RLS + bucket Storage `posts`
- Migration SQL dédiée : `supabase/migrations/002_phase3_feed.sql`
- Composant `PostCard` : auteur, texte, photo (ratio 4:5), like (optimiste) + count, comment count
- Composant `CommentItem` : avatar + auteur + texte + horodatage relatif
- `HomeScreen` devient le feed global (FlatList, pull-to-refresh, refresh on focus, FAB +)
- `CreatePostScreen` : compose texte (max 2000) + photo optionnelle (resize 1600px, JPEG 0.85)
- `PostDetailScreen` : post complet + liste commentaires + composer ancré clavier
- Helpers `src/lib/feed.ts` : fetchFeed, fetchPostWithComments, createPost, toggleLike, addComment
- Util `src/lib/time.ts` : horodatage relatif FR (5s · 12min · 3h · 2j · 3 sept.)

❌ **Pas encore** : amis/follow, collaborations, notifications push, vidéo/audio, Cloudinary CDN
(arrivent en Phases 4-7)

---

## 🚀 Setup — Étapes dans l'ordre

### 1️⃣ Prérequis sur ton iMac (à vérifier une seule fois)

```bash
# Vérifier que tu as Node.js 20+ et npm
node -v   # doit afficher v20.x ou v22.x
npm -v    # doit afficher 10.x ou +

# Si non, installer Node via Homebrew :
brew install node@20
```

Tu auras aussi besoin de **Xcode** (déjà installé sur ton iMac pour ARTCOL SwiftUI) et de **Watchman** pour les performances de Metro :

```bash
brew install watchman
```

Pour tester sur ton **iPhone réel** (recommandé), installe l'app **Expo Go** depuis l'App Store. Pour tester sur ton **PC Windows ASUS**, idem Expo Go depuis le Play Store.

---

### 2️⃣ Installer les dépendances

Dans le dossier `artcol-app` :

```bash
npm install
```

Ça prend 2-3 minutes. Si tu as une erreur de version Node, utilise nvm (`brew install nvm`).

---

### 3️⃣ Créer ton projet Supabase

1. Va sur https://supabase.com (compte gratuit, 500 Mo de DB, 1 Go de storage — largement suffisant pour démarrer)
2. **New project** → nom : `artcol-prod` → choisis une région (Frankfurt pour la France) → mot de passe DB fort (note-le mais **garde-le pour toi**)
3. Une fois le projet créé (~2 min), va dans **Project Settings → API** et note :
   - **Project URL** (du type `https://xxxxx.supabase.co`)
   - **anon / public key** (la longue clé `eyJhbGc...`) — **CETTE CLÉ EST PUBLIQUE, OK à mettre dans l'app**
   - ⚠️ **service_role key** — **JAMAIS dans l'app, JAMAIS dans le chat, JAMAIS dans Git**. Elle bypass RLS. À garder uniquement côté serveur si un jour tu fais un backend custom.

---

### 4️⃣ Exécuter le schéma SQL

Dans Supabase → **SQL Editor** → **New query**.

1. Copie-colle d'abord l'intégralité du fichier `supabase/schema.sql` → **Run**.
   - Table `profiles` créée
   - Bucket `avatars` créé dans Storage
   - 4 policies RLS actives sur `profiles`
   - 4 policies RLS actives sur `storage.objects`
2. Puis copie-colle `supabase/migrations/002_phase3_feed.sql` → **Run**.
   - Tables `posts`, `post_likes`, `post_comments` créées
   - Bucket `posts` créé
   - Policies RLS pour les 3 tables + 4 policies storage sur `posts`

---

### 5️⃣ Configurer le `.env`

Copie `.env.example` en `.env` :

```bash
cp .env.example .env
```

Édite `.env` avec **tes** valeurs Supabase :

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

⚠️ Le `.env` est dans `.gitignore` — il ne sera **jamais** commit. Tu ne dois jamais le partager (même la anon key — c'est public mais autant pas la diffuser).

---

### 6️⃣ Lancer l'app

```bash
npx expo start
```

Un QR code apparaît dans le terminal :
- **Sur iPhone** : ouvre Expo Go, scanne le QR avec l'appareil photo
- **Sur Android** : ouvre Expo Go directement et scanne le QR depuis l'app

L'app se lance sur ton tel. Hot reload activé : chaque modif du code recharge instantanément.

Pour tester sur **simulateur iOS** (Xcode requis) : appuie sur `i` dans le terminal.
Pour **émulateur Android** : appuie sur `a`.

---

## 🧪 Tester Phase 1

1. **Welcome screen** → tu vois le logo ARTCOL + le néon vert
2. Clique **"Créer mon profil artiste"**
3. Remplis nom + email + password → **Créer mon compte**
4. Va dans ta boîte mail → confirme l'adresse (Supabase envoie un email automatique)
5. Reviens dans l'app → **"J'ai déjà un compte"** → connecte-toi
6. Home → **"Voir / éditer mon profil"**
7. **"Éditer mon profil"** → ajoute une bio, ta ville, sélectionne tes domaines artistiques (multi-select)
8. **Enregistrer** → tu reviens sur le profil, les infos sont là

Si tu vas dans Supabase → **Table editor → profiles**, tu verras ta ligne créée par le trigger, et mise à jour quand tu édites.

---

## 🗂️ Structure du projet

```
artcol-app/
├── App.tsx                  # Point d'entrée + fontes
├── app.json                 # Config Expo (icône, splash, bundleId)
├── package.json             # Dépendances
├── tsconfig.json            # TypeScript strict + alias @/
├── .env.example             # Template variables
├── supabase/
│   └── schema.sql           # Schéma DB à exécuter dans Supabase
└── src/
    ├── lib/
    │   ├── theme.ts         # Tokens ARTCOL (couleurs, fontes, spacings)
    │   └── supabase.ts      # Client Supabase configuré
    ├── components/
    │   ├── Screen.tsx       # Wrapper safe area + bg
    │   ├── Button.tsx       # Bouton (primary/secondary/ghost)
    │   ├── Input.tsx        # Input avec label + erreur + focus glow
    │   └── Logo.tsx         # Logo ARTCOL avec dot néon
    ├── context/
    │   └── AuthContext.tsx  # Provider session globale
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   └── AppNavigator.tsx
    ├── screens/
    │   ├── auth/
    │   │   ├── WelcomeScreen.tsx
    │   │   ├── SignUpScreen.tsx
    │   │   └── SignInScreen.tsx
    │   └── app/
    │       ├── HomeScreen.tsx
    │       ├── ProfileScreen.tsx
    │       └── EditProfileScreen.tsx
    └── types/
        └── database.ts
```

---

## 🛣️ Roadmap des prochaines phases

| Phase | Contenu | Statut |
|-------|---------|--------|
| **2** | Avatar upload (Supabase Storage), composant Avatar réutilisable | ✅ livrée |
| **3** | Feed de performances : posts texte/photo, like, commentaire | ✅ livrée |
| **3 bis** | Vidéo / audio dans les posts | À venir |
| **4** | Système d'amis : follow, demande, liste, recherche d'artistes | 2-3 sessions |
| **5** | Collaborations : invitations entre artistes, statuts (en cours / accepté / refusé) | 2-3 sessions |
| **6** | Notifications push (Expo Notifications) + écran notifications | 1-2 sessions |
| **7** | Polish + soumission App Store (icône, screenshots, description, build EAS) | 1 session |

À la fin de chaque phase : on teste à fond avant de passer à la suivante (**finisher discipline**).

---

## 🆘 Si ça plante

- **"Cannot find module @/lib/theme"** → relance `npx expo start --clear`
- **"Network request failed" au signup** → vérifie ton `.env` (URL + clé) et que tu as bien run le SQL
- **Email de confirmation jamais reçu** → Supabase → Authentication → Email Templates : check si tu as un quota gratuit dépassé (faut un domaine custom pour > 4 emails/h par défaut). Pour tester rapidement, Supabase → Authentication → Providers → Email → **désactive "Confirm email"** temporairement (ne le fais PAS en prod).
- **Le profile n'apparaît pas** → check que le trigger `on_auth_user_created` est bien créé (SQL Editor → Triggers)

---

## 🌸 Notes de Xiaomi

- Le bundle ID `com.tarkus.artcol` est déjà configuré pour ton compte Apple Developer.
- Pour la **soumission App Store** (Phase 7), tu auras besoin d'EAS Build (`npx eas-cli build`). On verra ça le moment venu.
- Les icônes `assets/icon.png`, `splash.png`, `adaptive-icon.png` sont des placeholders à remplacer par tes designs ARTCOL — je peux te les générer plus tard avec Canvas si tu veux.

**Prêt à tester Phase 1 ? Dis-moi quand tu as fini chaque étape et on attaque Phase 2.** 🚀
