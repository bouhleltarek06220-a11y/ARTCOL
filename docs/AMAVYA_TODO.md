# 📝 AMAVYA — TODO opérationnel

> Backlog vivant. Ce qui est à faire / en cours / fait.
> Les éléments faits passent dans `AMAVYA_ROADMAP.md` (statut ✅) et restent ici barrés en bas pour traçabilité courte.

---

## 🟢 En cours

_(rien — étape 5 prête à démarrer)_

---

## ⏸️ Stand by

### Étape 4 — Page Pricing
**Raison** : attend la finalisation de l'immatriculation SASU AMAVYA (cf. DEC-007).
Reprise dès que Kbis + TVA intracommunautaire sont OK.

---

## 🔜 Prochaine étape

### Étape 5 — Chatbot IA AMAVYA

**Idée** : une bulle flottante en bas à droite. Le visiteur pose des questions sur AMAVYA, un agent IA répond avec ton positionnement, qualifie le besoin, propose un rendez-vous si pertinent. **Preuve par l'exemple** : tu vends de l'IA, ton site EN UTILISE.

**Avant de coder, à valider avec Tarek** :
- [ ] Choix du LLM : Claude Haiku 4.5 (rapide, pas cher ~$0.001/conv) OU Claude Sonnet 4.6 (meilleur dialogue, ~$0.01/conv) ?
- [ ] Tonalité du bot (professionnel chaleureux / direct / formel ?)
- [ ] Périmètre des questions : seulement AMAVYA, ou aussi conseil IA général ?
- [ ] Action quand le visiteur veut un RDV : ouvrir le formulaire de contact OU lien Calendly direct ?

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
