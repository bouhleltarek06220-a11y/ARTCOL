# 🔑 Configurer les clés API (Claude, OpenAI, Brevo)

> **Objectif** : que **Xiaomi** (IA Claude), la **transcription Whisper** des appels, et l'**envoi mail Brevo** marchent automatiquement **pour toi, Julie et Myriam**, sans que personne n'ait à coller une clé dans le CRM.

---

## 🛡️ Pourquoi côté Supabase et pas dans le code ?

Si on met les clés dans le HTML ou dans le navigateur :
- ❌ N'importe qui qui ouvre la page peut les voler en faisant "Voir le code source"
- ❌ Si une utilisatrice quitte l'équipe, tu dois changer toutes les clés
- ❌ Les clés sont dupliquées 3 fois (toi, Julie, Myriam) avec autant de risques de fuite

Avec le proxy Supabase (`ai-proxy` edge function) :
- ✅ Les clés vivent **dans une zone protégée chez Supabase** — jamais exposées au navigateur
- ✅ **Une seule config** profite aux 3 utilisatrices
- ✅ Le proxy vérifie le **token Supabase** de chaque utilisatrice — seules tes user_roles peuvent l'appeler
- ✅ Si quelqu'un quitte l'équipe, tu révoques juste son accès Supabase, les clés restent intactes

Le code CRM (v12+) appelle **toujours le proxy en priorité** et tombe en fallback localStorage uniquement si le proxy ne répond pas.

---

## 🪜 Configuration en 5 minutes (à faire UNE seule fois par toi, Tarek)

### Étape 1 — Récupérer les 3 clés API

Tu dois avoir 3 comptes (gratuits ou pas) et récupérer une clé par compte :

| Service | Où récupérer la clé | Format | Coût |
|---|---|---|---|
| **Anthropic (Claude)** | https://console.anthropic.com/settings/keys → "Create Key" | `sk-ant-api03-...` | Pay-as-you-go (~quelques € par mois pour l'usage Xiaomi) |
| **OpenAI (Whisper)** | https://platform.openai.com/api-keys → "Create new secret key" | `sk-proj-...` | $0.006 / minute d'audio transcrit |
| **Brevo (mailing)** | https://app.brevo.com/settings/keys/api → "Generate a new API key" → "v3" | `xkeysib-...` | Gratuit jusqu'à 300 emails/jour |

**Garde ces 3 clés au chaud dans un gestionnaire de mots de passe (1Password, Bitwarden, trousseau Apple, Notion privé…).**
Si tu les perds, il faut les régénérer chez chaque fournisseur (l'ancienne devient invalide).

### Étape 2 — Ajouter les 3 secrets dans Supabase

1. Va sur **https://supabase.com/dashboard/project/dmztalsmreugfwojsaar/functions**
   (ou : Dashboard → projet `apimo-crm` → menu gauche **Edge Functions**)

2. En haut, onglet **"Secrets"** (à droite de "Functions").

3. Tu dois voir un écran avec un bouton **"Add new secret"** (ou "+ New secret").

4. Pour **chacune des 3 clés**, fais :
   - Clique **"Add new secret"**
   - **Name** : tape exactement (respecte les MAJUSCULES et l'underscore) :
     - `ANTHROPIC_API_KEY` pour Claude
     - `OPENAI_API_KEY` pour Whisper
     - `BREVO_API_KEY` pour Brevo
   - **Value** : colle la clé correspondante (le `sk-ant-...` / `sk-proj-...` / `xkeysib-...`)
   - Clique **Save**

5. Vérifie qu'il y a bien 3 lignes dans la liste des secrets :

   ```
   ANTHROPIC_API_KEY    ••••••••••••••••••
   OPENAI_API_KEY       ••••••••••••••••••
   BREVO_API_KEY        ••••••••••••••••••
   ```

> ⚠️ Une fois sauvée, la valeur est **masquée à vie** — tu ne pourras plus la relire dans l'UI Supabase. C'est volontaire (sécurité). Si tu as fait une faute de frappe, tu cliques sur la ligne → "Delete" → "Add new secret" et tu retapes.

### Étape 3 — Vérifier que ça marche

Dans le CRM (https://crm-play-azur.vercel.app), une fois connectée :

1. **Test Brevo** : Sidebar → **Campagnes** → ouvre une campagne (ou crée-en une vide) → onglet **⚙️ Config** → clique **🧪 Tester la connexion**.
   - Tu dois voir : `✅ Connecté : <ton email Brevo> · 🛡️ via proxy Supabase`
   - Si tu vois `via clé locale` → c'est que le proxy n'est pas joignable, vérifie l'étape 2.

2. **Test Xiaomi (Claude)** : Clique sur l'icône **🤖 verte en bas à droite** de l'écran → tape `analyse` → attends 2 sec.
   - Si Xiaomi répond avec un texte structuré, c'est gagné.
   - Si Xiaomi tombe en "mode local" (fallback), c'est que la clé Claude n'est pas chargée — re-vérifie le secret dans Supabase.

3. **Test Whisper (transcription)** : Ouvre un appel guidé → enregistre 10 sec → arrête → la transcription doit apparaître. Si non, vérifie la clé OpenAI.

---

## 🎯 Résultat pour l'équipe

Une fois les 3 secrets configurés :

| Utilisatrice | Doit-elle taper une clé ? | Que se passe-t-il ? |
|---|---|---|
| **Toi** (Tarek, owner) | ❌ Non | Tu peux laisser le champ "Clé API Brevo" vide dans le CRM, tout passe par le proxy |
| **Julie** (editor) | ❌ Non | Pareil, rien à configurer côté CRM |
| **Myriam** (editor) | ❌ Non | Pareil |

Toutes les fonctions IA + email marchent immédiatement après leur premier login.

---

## 🔧 Mode dégradé (si pour une raison X tu désactives le proxy)

Le code garde un **fallback localStorage** : si jamais le proxy Supabase est down ou pas configuré, chaque utilisatrice peut coller sa propre clé Brevo dans **Campagnes → Config**, et ses propres clés Claude/OpenAI dans **Paramètres → Intégrations**. Mais c'est exactement le scénario qu'on veut éviter (clés exposées au navigateur).

---

## 📊 Combien ça va coûter ?

Estimation pour 3 utilisatrices BizDev qui travaillent à plein temps :

| Service | Usage typique | Coût mensuel estimé |
|---|---|---|
| Claude (Xiaomi + résumés post-call) | ~500 messages/mois | 3–10 € |
| OpenAI Whisper (transcription) | ~10h d'audio/mois | 4 € |
| Brevo | <9000 emails/mois | **Gratuit** |
| **TOTAL** | | **~10–15 € / mois** |

À comparer avec n'importe quel autre CRM/outil sales à 30–50 €/utilisateur/mois 😉

---

## 🆘 Problèmes courants

**"Test connexion Brevo → ❌ BREVO_API_KEY not configured"**
→ Le secret n'est pas (ou mal) nommé. Retourne dans Supabase Secrets, vérifie l'orthographe exacte (majuscules + underscore).

**"Test Brevo → ✅ Connecté · 🔑 via clé locale" (au lieu de proxy)**
→ Soit le proxy Supabase est down (rare), soit la fonction Edge `ai-proxy` doit être redéployée. Dis-moi, je vérifie.

**"Test Brevo → ❌ Unauthorized"**
→ Tu n'es pas loggué dans le CRM, ou ta session Supabase a expiré. Déconnecte-toi, reconnecte, retest.

**"Xiaomi répond mais sans actions"**
→ Le proxy Claude marche mais peut-être que tu utilises l'ancienne clé Anthropic. Vérifie console.anthropic.com → Usage → tu dois voir des appels récents quand tu testes.
