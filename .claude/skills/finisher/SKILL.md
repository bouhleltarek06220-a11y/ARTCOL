---
name: finisher
description: "Discipline de livraison pour profils multi-projets qui ouvrent plus de chantiers qu'ils n'en ferment : auditer un projet 'presque fini' et le passer à 100 % livré, définir la definition-of-done (DoD), cartographier la dette restante, construire un plan de clôture en sprints courts, et activer le mode préventif avant d'ouvrir un nouveau chantier. Utiliser pour : débloquer un projet qui traîne depuis des semaines, évaluer honnêtement ce qu'il reste avant de livrer, prioriser les derniers 20 % qui font 80 % de l'impression finale, décider si un projet mérite d'être abandonné ou relancé, éviter l'accumulation de projets zombies. Mots-clés : finir, livrer, definition of done, done, dette technique, backlog, priorisation, clôture de projet, projet zombie, multi-projet, procrastination, last 10%, perfectionnisme, lancement, go-live, discipline, focus."
---

# Finisher — Fermer ce qu'on ouvre

Pour les profils qui lancent beaucoup et livrent peu. Ce skill s'active quand un projet est "presque fini" depuis trop longtemps — et que le vrai problème n'est pas technique.

## Quand l'activer
Projet bloqué depuis > 2 semaines sans raison technique claire ; envie d'ouvrir un nouveau chantier avant de fermer les anciens ; doute sur ce qui reste vraiment à faire.

---

## Diagnostic initial — les 3 questions

Avant tout plan, répondre honnêtement :

1. **Qu'est-ce qui est réellement manquant pour livrer ?** (liste brute, pas filtrée)
2. **Pourquoi ça n'est pas encore fait ?** (technique / décision / envie / peur du jugement)
3. **À qui livre-t-on, et quelle est la valeur minimale acceptable pour eux ?**

La réponse à Q3 recadre tout : souvent, 70 % du projet suffit à livrer de la valeur.

---

## Audit d'un projet "presque fini"

Créer une table d'audit en 4 colonnes :

| Item | État (%) | Bloquant livraison ? | Effort restant (h) |
|------|----------|----------------------|---------------------|
| Feature X | 90 % | Oui | 2 h |
| Design polish | 60 % | Non | 8 h |
| Tests | 0 % | Partiel | 4 h |
| Documentation | 0 % | Non | — |
| Déploiement | 80 % | Oui | 1 h |

**Règle** : livraison = toutes les lignes "Bloquant: Oui" à 100 %. Tout le reste est post-lancement.

---

## Definition of Done (DoD) — à définir par projet

Un projet est livré quand ET SEULEMENT QUAND :

```
[ ] La fonctionnalité principale fonctionne end-to-end sur prod
[ ] Pas d'erreur bloquante en console (prod)
[ ] URL accessible, HTTPS actif
[ ] Le destinataire peut l'utiliser sans aide
[ ] Un message de livraison a été envoyé au destinataire
```

Tout ce qui n'est pas dans la DoD est du **scope creep** ou de la perfection inutile.

---

## Cartographier la dette restante

Classifier chaque item restant en 3 catégories :

**A — Bloque la livraison** → à faire AVANT de livrer (max 20 % du temps restant estimé).

**B — Important mais pas bloquant** → planifier en sprint post-lancement (semaine suivante).

**C — Nice-to-have / perfectionnisme** → backlog. Souvent ne sera jamais fait, et c'est ok.

Règle dure : **si un item C dure depuis > 3 semaines, le supprimer du backlog**.

---

## Plan de clôture — sprint de 3 jours max

Un projet qui "traîne" ne se finit jamais en douceur — il faut **une date limite physique** :

```
Jour 1 matin : audit table ci-dessus + définir la DoD
Jour 1 soir   : finir tous les items A (bloquants)
Jour 2         : tests end-to-end sur prod + corrections rapides
Jour 3 matin  : polish minimal (pas plus de 2 h)
Jour 3 midi   : livraison + message au destinataire
Jour 3 après-midi : post-mortem express (15 min) → note pour le prochain projet
```

Si le sprint de 3 jours est impossible, fixer une date dans le calendrier (dans 7 jours max) et la traiter comme un rendez-vous client.

---

## Les pièges du "presque fini"

**Le perfectionnisme de la dernière heure** : tenter de refaire le design, changer la stack, ajouter une feature — juste avant de livrer. Reconnaître ce pattern et le nommer : c'est de la résistance, pas du travail utile.

**Le "juste encore un truc"** : chaque item résolu en révèle un nouveau. Fixer un freeze créatif : après Jour 1, plus de nouveaux items A ajoutés.

**La peur du jugement** : tant que ce n'est pas livré, ce n'est pas jugé. Un projet livré imparfait > un projet parfait jamais livré.

**L'ouverture d'un nouveau chantier** : symptôme classique de blocage. Règle : interdiction d'ouvrir un nouveau projet si 2 projets ou plus sont en état "presque fini".

---

## Mode préventif — avant d'ouvrir un nouveau chantier

Avant de démarrer tout nouveau projet, exécuter cette checklist :

- [ ] Combien de projets sont en état "en cours" ou "presque fini" ?
- [ ] Si > 2 : fermer le plus avancé AVANT de commencer
- [ ] Définir la DoD du nouveau projet dès le premier jour
- [ ] Estimer l'effort total honnêtement (puis multiplier par 1,5)
- [ ] Bloquer du temps calendrier pour la livraison (pas juste pour le développement)

**Règle des 2 projets maximum** : ne jamais avoir plus de 2 projets actifs simultanément. Au-delà, la qualité de chacun se dégrade et aucun ne se termine.

---

## Post-mortem express (15 min, après chaque livraison)

Répondre à 3 questions :

1. **Qu'est-ce qui a pris plus de temps que prévu, et pourquoi ?**
2. **Qu'est-ce que j'aurais coupé si j'avais su ?**
3. **Une règle à appliquer au prochain projet pour éviter ça.**

Consigner dans un fichier `RETRO.md` ou une note. Ne pas faire un long rapport — 3 phrases suffisent.

---

## Décision d'abandon — quand couper

Parfois, la bonne décision est d'abandonner. Critères d'abandon légitimes :
- La valeur initiale n'existe plus (contexte changé, besoin disparu).
- Le coût de finition > la valeur générée.
- Le projet n'a pas de destinataire réel (projet "pour moi" sans deadline).

Abandonner proprement = archiver le repo, documenter l'état dans le README, libérer l'espace mental. Ne pas laisser zombie.

---

## Do / Don't

| Do | Don't |
|----|-------|
| Définir la DoD avant de commencer | Commencer sans savoir ce que "fini" veut dire |
| Livrer avec les items A à 100 % | Attendre que tout soit parfait |
| Sprint de 3 jours avec date fixe | Laisser traîner "encore une semaine" indéfiniment |
| Post-mortem en 15 min après livraison | Ignorer les patterns récurrents de blocage |
| Max 2 projets actifs en parallèle | Ouvrir un 3e chantier pour "se changer les idées" |

> Skills sœurs : `visual-qa` (audit qualité avant livraison), `web-builder` (checklist go-live), `content-quality` (relecture finale avant publication).
