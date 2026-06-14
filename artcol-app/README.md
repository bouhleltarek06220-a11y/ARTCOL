# 🌸 ARTCOL — App Mobile (Phases 1 → 5)

Réseau social cross-platform pour artistes en quête de visibilité.
Stack : **React Native + Expo + Supabase + Cloudinary** · Design : **ARTCOL**

---

## 📦 Ce qui est livré (Phases 1 → 5)

**Phase 1** ✅
- Setup complet React Native + Expo (TypeScript strict)
- Auth Supabase (signup, signin, signout, persistance session)
- Schéma DB Postgres avec **Row Level Security** (table `profiles`)
- Trigger SQL : création auto de profil à l'inscription
- Design system ARTCOL (palette, fontes, composants)
- Navigation conditionnelle (Auth vs App selon session)

**Phase 2** ✅
- Composant `Avatar` réutilisable
- Picker photo + compression locale (512×512 JPEG 0.8)
- Upload bucket Supabase `avatars` cohérent RLS, cache-busting

**Phase 3** ✅
- Tables `posts`, `post_likes`, `post_comments` + bucket `posts` (`002_phase3_feed.sql`)
- Composants `PostCard` (like optimiste), `CommentItem`
- Feed global avec pull-to-refresh, refresh on focus
- `CreatePostScreen` (texte + photo optionnelle resize 1600px)
- `PostDetailScreen` avec composer ancré clavier
- Util `src/lib/time.ts` (horodatage relatif FR)

**Phase 4** ✅
- Table `follows` + RLS (`003_phase4_follows.sql`)
- Helpers `src/lib/follows.ts` : searchArtists, fetchProfileWithStats, follow/unfollow
- Composants `FollowButton` (optimiste), `ArtistRow`
- `SearchScreen` (recherche debounce 300ms par username / display_name)
- `UserProfileScreen` (profil d'autres artistes + own profile en lecture)
- Stats followers / following / posts intégrées au profil

**Phase 5** ✅
- Type enum `collab_status` + table `collaborations` (`004_phase5_collabs.sql`)
- Trigger SQL garde-fou : transitions valides (initiator → cancelled, recipient → accepted/declined)
- Helpers `src/lib/collabs.ts` : createCollab, fetchMyCollabs, respondToCollab, cancelCollab
- Composant `CollabCard` (badge statut + parties)
- `CollabsScreen` (filtres Toutes / En attente / Acceptées + notice invitations en attente)
- `NewCollabScreen` (depuis profil d'un artiste → modal proposition)
- `CollabDetailScreen` (accepter / refuser / annuler selon rôle)

**Refacto navigation** ✅
- Bottom tabs (`@react-navigation/bottom-tabs`) avec barre custom
- 4 tabs : Feed · Découvrir · Collabs · Moi
- Stack root contient les modaux et les détails (PostDetail, UserProfile, CreatePost, NewCollab, CollabDetail, EditProfile)

❌ **Pas encore (Phases 6-7)** : notifications push (Expo Notifications), vidéo/audio dans les posts,
Cloudinary CDN, soumission App Store, assets définitifs (icône + splash).

Voir section « Roadmap » en bas pour le détail.

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

Dans Supabase → **SQL Editor** → **New query**. Exécuter dans l'ordre :

1. `supabase/schema.sql` → table `profiles`, bucket `avatars`, RLS
2. `supabase/migrations/002_phase3_feed.sql` → posts + likes + comments + bucket `posts`
3. `supabase/migrations/003_phase4_follows.sql` → table `follows` + RLS
4. `supabase/migrations/004_phase5_collabs.sql` → enum + table `collaborations` + trigger transitions

Après chaque Run, vérifier les onglets **Table editor** et **Storage** que les objets ont bien été créés.

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
| **2** | Avatar upload (Supabase Storage), composant Avatar | ✅ livrée |
| **3** | Feed posts texte/photo, like, commentaire | ✅ livrée |
| **4** | Follow + recherche + profil d'autres artistes + stats | ✅ livrée |
| **5** | Collaborations entre artistes (invit / accepter / refuser / annuler) | ✅ livrée |
| **3 bis** | Vidéo / audio dans les posts | À venir |
| **6** | Notifications push (Expo Notifications) — **nécessite compte Apple Developer + token EAS Push** | À venir |
| **7** | Build EAS + soumission App Store / Play Store — **nécessite comptes développeurs + assets définitifs** | À venir |
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
