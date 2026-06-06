# 📝 AMAVYA — TODO opérationnel

> Backlog vivant. Ce qui est à faire / en cours / fait.
> Les éléments faits passent dans `AMAVYA_ROADMAP.md` (statut ✅) et restent ici barrés en bas pour traçabilité courte.

---

## 🟢 En cours

- [x] **Étape 7 — Blog Cosmos AMAVYA (squelette + 1er article)** : MDX + index 3D + Cosmos + page article + SEO complet

---

## ⏸️ Stand by

### Étape 4 — Page Pricing
**Raison** : attend la finalisation de l'immatriculation SASU AMAVYA (cf. DEC-007).
Reprise dès que Kbis + TVA intracommunautaire sont OK.

---

## 🔜 Prochaine étape

### Étape 7 — Blog SEO

**Objectif** : créer une section `/blog` avec une structure pour publier des articles techniques (cas client, conseils IA pour PME, comparatifs). Chaque article = une porte d'entrée SEO supplémentaire pour `amavya.cloud`. Cumul à 3-6 mois = trafic organique qualifié.

**Avant de coder, à valider avec Tarek** :
- [ ] Choisir le format : MDX (markdown + composants React, idéal pour AMAVYA) OU CMS (Sanity / Contentful, plus lourd à brancher)
- [ ] Définir 3-5 sujets d'articles "starter" à écrire ensemble
- [ ] Décider : auteur unique (Tarek) ou plusieurs auteurs ?
- [ ] Pour les images : un dossier `/public/blog/` ou un service externe (Cloudinary) ?

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

- [x] Étape 7 — Blog Cosmos AMAVYA squelette + 1er article "5 automatisations PME" (2026-06-06)
- [x] **Étape 6 TERMINÉE** — Polissage visuel des 9 sections (Lots 1+2+3)
- [x] Étape 6 — Polissage visuel Lot 3 (DashboardMockup + FinalCTA + Footer) (2026-06-06)
- [x] Étape 6 — Polissage visuel Lot 2 (Vision + Technologies + Founder) (2026-06-06)
- [x] Étape 6 — Polissage visuel Lot 1 (Hero + Services + SectionHeading + bugfix ES ServiceDemos) (2026-06-06)
- [x] Étape 5 — Chatbot IA AMAVYA (Claude Haiku 4.5 + streaming + i18n FR/EN/ES) (2026-06-06)
- [x] Étape 3.1 — i18n client-side FR/EN/ES (ES ajouté + détection navigateur + 3e drapeau) (2026-06-06)
- [x] Étape 2 — SEO + Open Graph : OG image dynamique, sitemap enrichi, robots durci, Schema.org +contactPoint (2026-06-06)
- [x] Étape 1 — Analytics Vercel + Speed Insights + docs/ (2026-06-06)
- [x] Étape 0 — Domaine + mail pro `contact@amavya.cloud` (2026-06-06)
