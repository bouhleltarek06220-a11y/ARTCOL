# 📝 AMAVYA — TODO opérationnel

> Backlog vivant. Ce qui est à faire / en cours / fait.
> Les éléments faits passent dans `AMAVYA_ROADMAP.md` (statut ✅) et restent ici barrés en bas pour traçabilité courte.

---

## 🟢 En cours

- [x] **Étape 3.1 — i18n client-side FR/EN/ES** (mergé, ES disponible, détection navigateur)

---

## 🔜 Prochaine étape

### Étape 3.2 — i18n SEO (URLs `/en/` `/es/` + hreflang)

**Avant de coder, à valider avec Tarek** :
- [ ] Choisir entre Next.js i18n routing natif OU `next-intl` (plus puissant, plus de migration)
- [ ] Décider si la racine `/` reste FR (avec `/fr/` qui redirige vers `/`) ou si tout passe en `/fr/` `/en/` `/es/`
- [ ] Vérifier que la sitemap inclura les 3 versions de chaque page

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

- [x] Étape 3.1 — i18n client-side FR/EN/ES (ES ajouté + détection navigateur + 3e drapeau) (2026-06-06)
- [x] Étape 2 — SEO + Open Graph : OG image dynamique, sitemap enrichi, robots durci, Schema.org +contactPoint (2026-06-06)
- [x] Étape 1 — Analytics Vercel + Speed Insights + docs/ (2026-06-06)
- [x] Étape 0 — Domaine + mail pro `contact@amavya.cloud` (2026-06-06)
