# 🚀 AMAVYA — Mise en ligne : OVH + Vercel + Mail pro

Guide ultra-simple, **dans l'ordre**. Coche au fur et à mesure.

---

## ⚠️ Pourquoi tu dois faire ces étapes toi-même

Ton compte OVH et ton compte Vercel sont **protégés par ton mot de passe**.
Personne ne peut s'y connecter à ta place — c'est ta propriété et c'est mieux ainsi.
Mais le code (formulaire de contact, envoi de mail) **est déjà prêt**. Il s'activera
automatiquement dès que tu auras fini les étapes ci-dessous.

---

## ✅ Étape 1 — Brancher `amavya.cloud` à Vercel (le site)

### A. Côté Vercel
1. Va sur **https://vercel.com/bouhleltarek06220-4609s-projects/artcol**
2. **Settings** (en haut) → **Domains** (à gauche)
3. Tape `amavya.cloud` → clique **Add**
4. Recommence avec `www.amavya.cloud` → quand Vercel propose de **rediriger** l'un vers l'autre, accepte (garde `amavya.cloud` comme principal)
5. Vercel affiche **2 lignes DNS à copier** chez OVH (note-les ou laisse l'onglet ouvert)

### B. Côté OVH (Zone DNS)
1. Va sur **https://www.ovh.com/manager** → connecte-toi
2. À gauche : **Web Cloud** → **Noms de domaine** → clique sur `amavya.cloud`
3. Onglet **Zone DNS** (en haut)
4. Si tu vois un **A 213.186.33.5** ou un **CNAME vers cluster0XX.hosting.ovh.net** → **supprime-le** (sinon il conflit avec Vercel)
5. **Ajouter une entrée** :

| Type | Sous-domaine | Cible |
|------|-------------|-------|
| **A** | (laisser vide) | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com.` |

6. Attendre 5 à 30 min (parfois 1h). Vercel affichera "Valid configuration" ✅

---

## ✅ Étape 2 — Créer la boîte mail pro `contact@amavya.cloud`

### A. Activer MX Plan (gratuit, inclus avec le domaine)
1. Manager OVH → **Web Cloud** → **Emails** (menu de gauche)
2. **Commander** → **MX Plan** (gratuit, 5 Go, 10 adresses)
3. Choisis le domaine `amavya.cloud` → valide (0,00 €)

### B. Créer la boîte
1. Menu **Emails** → `amavya.cloud` → onglet **E-mails**
2. **Ajouter un compte e-mail**
   - Adresse : `contact`
   - Mot de passe : **choisis-en un solide** et note-le, on en aura besoin à l'étape 3
3. Confirme. **Boîte créée** ✅

### C. Vérifier que les DNS mail sont posés (OVH le fait normalement tout seul)

Retour dans **Zone DNS** — tu dois voir :

| Type | Sous-domaine | Cible |
|------|-------------|-------|
| **MX** (priorité 1) | (vide) | `mx1.mail.ovh.net.` |
| **MX** (priorité 5) | (vide) | `mx2.mail.ovh.net.` |
| **MX** (priorité 50) | (vide) | `mx3.mail.ovh.net.` |
| **TXT** (SPF) | (vide) | `v=spf1 include:mx.ovh.com ~all` |
| **CNAME** | `autodiscover` | `mailconfig.ovh.net.` |

Si une ligne manque, ajoute-la manuellement.

### D. Activer DKIM (anti-spam — important)
1. Menu **Emails** → `amavya.cloud` → onglet **DKIM**
2. Clique **Configurer DKIM**
3. OVH génère une clé → clique **Appliquer**

### E. Ajouter DMARC (anti-usurpation)

Dans **Zone DNS** → Ajouter une entrée TXT :

| Type | Sous-domaine | Cible |
|------|-------------|-------|
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:contact@amavya.cloud; aspf=s; adkim=s` |

---

## ✅ Étape 3 — Brancher le formulaire de contact sur la boîte mail

Le code est **déjà prêt** : `app/api/contact/route.js` envoie une notification
sur `contact@amavya.cloud` à chaque message reçu via le site. Il manque juste
les identifiants SMTP.

1. Va sur **https://vercel.com/bouhleltarek06220-4609s-projects/artcol**
2. **Settings** → **Environment Variables**
3. Ajoute **ces 4 variables** (Production + Preview + Development) :

| Nom | Valeur |
|-----|--------|
| `SMTP_HOST` | `ssl0.ovh.net` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `contact@amavya.cloud` |
| `SMTP_PASS` | **le mot de passe** créé à l'étape 2.B |

4. **Redéploie** : onglet **Deployments** → dernier deploy → bouton **⋯** → **Redeploy**

✅ Désormais, chaque message reçu via le formulaire AMAVYA :
- est enregistré dans Supabase (CRM)
- t'envoie une **notification email** sur `contact@amavya.cloud`

---

## ✅ Étape 4 — Accéder à ta boîte mail

### Webmail
- https://www.ovh.com/mail/ (identifiant : `contact@amavya.cloud`)

### Sur ton téléphone / Outlook / Apple Mail
- **Réception (IMAP)** : `ssl0.ovh.net` — port **993** — SSL/TLS
- **Envoi (SMTP)** : `ssl0.ovh.net` — port **465** — SSL/TLS
- **Identifiant** : `contact@amavya.cloud` (l'adresse complète)
- **Mot de passe** : celui créé à l'étape 2.B

---

## 🧪 Étape 5 — Tester que tout marche

1. Va sur **https://amavya.cloud**
2. Le site doit s'afficher (sinon, DNS pas encore propagés — patiente 30 min)
3. Ouvre le formulaire de contact, remplis-le, envoie
4. Tu dois recevoir le mail sur `contact@amavya.cloud` (vérifie aussi les spams au début)
5. Vérifie aussi dans Supabase que le lead apparaît dans `partner_leads`

---

## 🆘 Si ça coince

- **Vercel dit "Invalid configuration"** → vérifie que tu as bien supprimé l'ancien A et que le nouveau pointe vers `76.76.21.21`
- **Mail pas reçu** → vérifie sur Vercel que les 4 variables d'env sont bien là, et **redéploie**
- **Mail tombe en spam** → vérifie DKIM (étape 2.D) et DMARC (étape 2.E)
- **OVH ne propose pas MX Plan gratuit** → c'est bien gratuit, cherche "MX Plan" dans la rubrique Emails. Sinon contacte-moi.

---

## 📞 Quand tu as fini

Reviens me dire **"OVH OK"** et je vérifie tout pour toi :
- DNS site
- DNS mail (MX, SPF, DKIM, DMARC)
- Envoi de mail depuis le formulaire

Tu n'es pas seul, on y va étape par étape 💪
