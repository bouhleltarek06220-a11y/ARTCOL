# 👋 Onboarding Julie & Myriam — Premier lancement du CRM

> **À transmettre à Julie et Myriam** une fois leur compte créé dans Supabase.

---

## 🔗 L'adresse du CRM

L'app vit sur cette adresse (à coller dans Chrome, Edge ou Safari) :

**https://playazur-crm.vercel.app**

*(Tarek te confirmera l'URL exacte après le déploiement Vercel — peut-être avec un domaine perso type `crm.playazur.fr`.)*

---

## 1️⃣ Premier login

1. Ouvre l'adresse ci-dessus.
2. Tu arrives sur l'écran de login avec le logo Play Azur animé.
3. Saisis :
   - **Email** : celui que Tarek t'a transmis (ton mail pro).
   - **Mot de passe** : le mot de passe temporaire (commence par `Jp2026#...`).
4. Clique **Se connecter**.
5. L'app détecte que c'est ta première connexion → **écran de changement de mot de passe**.
6. Choisis ton vrai mot de passe (minimum 10 caractères, au moins 1 majuscule et 1 chiffre).
   → **Important : note-le quelque part (gestionnaire de mots de passe type 1Password, Bitwarden, ou trousseau Apple).** Aucune récupération possible si tu le perds — il faudra demander un reset à Tarek.
7. Tu rentres directement dans le CRM. 🎉

---

## 2️⃣ Installer l'app sur ton bureau (recommandé)

Avoir le CRM comme une vraie application avec son icône, sans avoir à ouvrir Chrome à chaque fois :

### 🖥️ Sur Windows ou Mac (Chrome, Edge ou Brave)

1. Une fois connectée au CRM, regarde la **barre d'adresse en haut**.
2. Tu vois une **petite icône `+` (ou `⊕`, ou un écran avec une flèche)** à droite de l'URL.
3. Clique dessus → **Installer Play Azur CRM** → confirme.
4. L'app s'ouvre dans sa propre fenêtre (sans barre d'adresse) et apparaît :
   - 🍎 Dans le **Dock** (macOS)
   - 🪟 Dans la **Barre des tâches** + menu Démarrer (Windows)
5. Tu peux maintenant lancer l'app comme n'importe quel logiciel : Cmd+Space "Play Azur" sur Mac, ou touche Windows "Play Azur".

> Tu peux aussi cliquer directement sur le bouton **📲** qui apparaît dans la barre supérieure du CRM.

### 📱 Sur iPhone / iPad (Safari uniquement)

1. Ouvre l'URL dans Safari.
2. Touche le bouton **Partager ⬆️** en bas de l'écran.
3. Fais défiler → **Sur l'écran d'accueil**.
4. Confirme → l'icône Play Azur apparaît sur ton écran d'accueil comme une vraie app.

### 🤖 Sur Android (Chrome)

1. Une bannière "Installer l'application" peut apparaître automatiquement.
2. Sinon : menu ⋮ en haut à droite → **Installer l'application** ou **Ajouter à l'écran d'accueil**.

---

## 3️⃣ Comment ça marche — Vue d'ensemble

| Vue | À quoi ça sert |
|---|---|
| 📋 **Prospects** | Liste filtrable de toutes les agences à contacter |
| 🗂️ **Pipeline** | Vue Kanban des prospects par étape (Lead → Contacté → RDV → Signé) |
| 🗺️ **Carte** | Vision géo de ta zone, heatmap, calcul d'itinéraires terrain |
| 📊 **Dashboard** | Tes KPI : taux de conversion, top prospects, etc. |
| 📅 **Calendrier** | Tes RDV et rappels |
| 📞 **Mes Calls** | Historique de tes appels guidés + stats |
| 📧 **Campagnes** | Séquences mailing (via Brevo) |
| 🎯 **Assistant Vente** | Scripts d'appel par axe (Lieux, Streamers, Financeurs) |
| 🏛️ **Play Azur** | Tout savoir sur le projet Lost Chapter, le PAF, les références |
| 🛡️ **Objections** | Battle cards pour les objections récurrentes |

---

## 4️⃣ Le flow type pour un appel

1. Vue **Prospects** → tu trouves une agence à appeler.
2. Tu cliques sur sa ligne → fiche détaillée s'ouvre.
3. Tu cliques sur **📞 Appel guidé** (bouton rouge).
4. Une fenêtre dédiée s'ouvre avec :
   - Le **timer** de l'appel (objectif : < 4 min)
   - Le **script de découverte** adapté à l'axe (Lieu / Streamer / Financeur)
   - Des champs pour noter en direct ce que dit le prospect
   - 🎙 **Enregistrement audio** optionnel (mic + voix prospect si tu utilises Ringover)
   - Transcription automatique post-call (via Whisper) + résumé IA (via Claude)
5. À la fin → bouton **Enregistrer le call** → l'historique remonte dans **Mes Calls** + sur la fiche du prospect.

---

## 5️⃣ La synchro temps réel

Toi, Tarek et Myriam êtes connectées au **même cloud Supabase** :

- Quand tu changes le statut d'un prospect, ton collègue le voit s'actualiser **en direct** dans son onglet.
- Quand quelqu'un d'autre modifie un prospect que tu as ouvert, un toast bleu apparaît : *"🔄 Tarek → ERA Immobilier : statut → RDV"*.
- Indicateur ☁️ dans le header : **vert** = sync OK, **rouge** = perdu (reconnexion auto).

Aucune action manuelle : pas de bouton "Save", pas de "Sync now". Tout est automatique.

---

## 6️⃣ Bonnes pratiques

- ✅ **Connecte-toi via Chrome ou Edge sur ton ordi de travail** (meilleur support PWA + enregistrement audio).
- ✅ **Active la 2FA** dès que possible (Settings → MFA → Activer) — c'est rapide et ça protège l'accès aux données prospects.
- ✅ **Mets à jour quand un toast bleu apparaît** : ça veut dire que Tarek a poussé une amélioration.
- ❌ **Ne partage jamais ton mot de passe**, même à Tarek.
- ❌ **N'exporte pas la base prospects** sur ton ordi perso, c'est la donnée commerciale de Play Azur Production.
- ❌ **Ne te connecte pas depuis un café/wifi public** sans VPN.

---

## 7️⃣ Tu as un souci ?

- **Mot de passe oublié** → écran de login → "Mot de passe oublié ?" → tu reçois un email Supabase de reset.
- **Compte bloqué après plusieurs tentatives** → attends 30 min OU appelle Tarek (il peut débloquer depuis son dashboard sécurité 🛡️).
- **Bug ou comportement bizarre** → F12 → onglet Console → screenshot et envoie à Tarek.
- **L'app a planté** → ferme et rouvre. Aucune donnée perdue (tout est cloud).
- **Forcer un rechargement complet de l'app** (si pb après update) :
  - Ouvre l'app, F12 → Console → tape : `PA_PWA.clearCachesAndReload()` → ↵
  - Ça vide le cache local et rebascule sur la dernière version.

---

Bienvenue dans l'équipe BizDev Lost Chapter ! 🎲🏛️
