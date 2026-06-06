# 📝 AMAVYA — TODO opérationnel

> Backlog vivant. Ce qui est à faire / en cours / fait.
> Les éléments faits passent dans `AMAVYA_ROADMAP.md` (statut ✅) et restent ici barrés en bas pour traçabilité courte.

---

## 🟢 En cours

- [x] **Étape 1 — Analytics Vercel** (code mergé, données dispo ~24h après mise en prod)

---

## 🔜 Prochaine étape

### Étape 2 — SEO technique + Open Graph

**Avant de coder, à valider avec Tarek** :
- [ ] Concevoir l'image OG (1200×630) — design : logo + tagline AMAVYA sur fond doré/sombre
- [ ] Décider si on enrichit Schema.org (Organization déjà OK → ajouter `LocalBusiness` ? `FAQPage` ?)
- [ ] Vérifier qu'un favicon haute résolution existe pour tous les devices (Apple touch, Android)

**Plan d'action prévu** :
1. Générer une vraie image OG (sera un PNG dans `/public/og.png`)
2. Mettre à jour `app/layout.jsx` → `openGraph.images` et `twitter.images` pour pointer dessus
3. Audit Lighthouse → corriger ce qui manque
4. Vérifier que `sitemap.xml` couvre bien toutes les pages publiques
5. Test sur les outils : LinkedIn Post Inspector, Twitter Card Validator, Google Rich Results Test

---

## 📅 Plus tard (backlog priorisé)

- [ ] Étape 3 — i18n FR/EN/ES (compléter `lib/i18n.js`, détection navigateur, hreflang)
- [ ] Étape 4 — Page Pricing (3 offres + FAQ + CTA RDV)
- [ ] Étape 5 — Chatbot IA AMAVYA (Claude Haiku 4.5 + prompt système métier)
- [ ] Étape 6 — Polissage visuel (passe Founder, Services, Démos, Experience)
- [ ] Étape 7 — Blog SEO (3 premiers articles + structure `/blog/[slug]`)
- [ ] Étape 8 — Pages immersives (idées : `/lab`, `/clients` globe 3D)
- [ ] Étape 9 — Stripe (audit IA Express 199€ — premier produit pilote)

---

## 💡 Idées en vrac (à trier plus tard)

- Page "Cas client" avec preuve sociale chiffrée
- Lead magnet : "Checklist 10 automatisations pour PME" (PDF contre email)
- Newsletter (Buttondown ou Resend)
- Page `/manifeste` AMAVYA (vision long terme)
- Dark mode déjà géré ? À vérifier
- Refonte navbar mobile si besoin
- Repasser `SMTP_PASS` en "Sensitive" sur Vercel (sécurité)
- Nettoyer 2-3 entrées DNS résiduelles (`ftp`, `TXT "1|www.amavya.cloud"`, `TXT "3|welcome"`)
- Configurer "Send as" dans Gmail pour répondre AVEC `contact@amavya.cloud`

---

## ✅ Récemment fait

- [x] Étape 0 — Domaine + mail pro `contact@amavya.cloud` (2026-06-06)
