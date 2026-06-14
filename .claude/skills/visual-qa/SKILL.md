---
name: visual-qa
description: "Audit qualité visuelle d'une interface en 6 catégories : accessibilité WCAG (contraste, focus, alt-text, aria), cohérence design (tokens, espacement, composants), responsive (mobile 375px / tablet 768px / desktop 1440px), lisibilité typographique (taille, interligne, longueur de ligne), conformité au design system (ARTCOL ou autre), polish final (alignements, états hover/vide/erreur, micro-détails) ; produit un rapport priorisé avec score par catégorie et corrections concrètes. Utiliser pour : valider un écran avant livraison, auditer une page HTML/React/Vue, vérifier la conformité ARTCOL, corriger des problèmes de contraste ou d'accessibilité, produire un rapport QA structuré avec actions. Mots-clés : QA, qualité visuelle, audit, accessibilité, WCAG, contraste, focus, alt-text, aria, responsive, typographie, design system, conformité, polish, rapport, score, revue, livraison, a11y, ARTCOL."
---

# Visual QA — Audit qualité interface

Protocole en **6 catégories** pour valider un écran avant livraison. Sortie : rapport structuré avec **score /10 par catégorie + actions classées par priorité**.

## Quand l'activer
Valider un écran/composant avant livraison, auditer la conformité ARTCOL, produire un rapport QA pour un client ou une review de PR.

---

## Catégorie 1 — Accessibilité WCAG (priorité CRITIQUE)

| Check | Critère | Outil rapide |
|-------|---------|--------------|
| Contraste texte normal | ≥ 4.5:1 | contrast-ratio.com / DevTools |
| Contraste texte large (≥ 18px bold / ≥ 24px) | ≥ 3:1 | — |
| Focus visible | outline ou ring visible sur tous les interactifs | Tab key test |
| Alt-text images | présent et descriptif (décoratif = `alt=""`) | inspect |
| Aria-label boutons icônes | chaque bouton sans texte visible | inspect |
| Ordre de tab | logique (suit le flux visuel) | Tab séquentiel |
| Pas de couleur seule comme indicateur | légende, icône ou texte accompagne | visuel |
| prefers-reduced-motion respecté | pas d'animation forcée | media query |

Score 1 : 1 point si ≥ 7/8 checks OK, -0.5 par check manquant.

---

## Catégorie 2 — Cohérence design

- Les **tokens CSS** sont utilisés (`var(--bg-base)`, pas des hex hardcodées isolées).
- Espacement issu de l'échelle (multiples de 8px) — pas de `13px` ou `17px` arbitraires.
- Radius cohérents sur toute la page (pas `4px` ici, `8px` là, `12px` ailleurs sans règle).
- Mêmes composants pour les mêmes patterns (tous les inputs identiques, tous les badges identiques).
- Ombres et borders cohérentes (pas de `box-shadow` ad hoc sur une seule carte).

---

## Catégorie 3 — Responsive

Tester aux **3 breakpoints clés** :

| Breakpoint | Résolution | Vérifier |
|------------|------------|---------|
| Mobile     | 375 × 812  | Pas de scroll horizontal ; texte lisible ; touch targets ≥ 44px |
| Tablet     | 768 × 1024 | Layouts 2-colonnes corrects ; nav fonctionnelle |
| Desktop    | 1440 × 900 | Pas d'étirement excessif ; max-width sur les blocs de texte |

Bugs fréquents : overflow horizontal invisible, texte tronqué (nowrap), images étirées, modales hors écran sur mobile.

---

## Catégorie 4 — Lisibilité typographique

| Règle | Valeur cible |
|-------|-------------|
| Taille corps minimum | 16px (14px seulement pour labels/captions) |
| Interligne corps | 1.5–1.7 |
| Longueur de ligne prose | 55–75 caractères |
| Hiérarchie H1 > H2 > H3 | ratio ≥ 1.25× entre niveaux |
| Pas de texte en ALL CAPS > 3 mots | (lisibilité réduite) |
| Contraste texte secondaire | ≥ 4.5:1 même pour `--text-secondary` |

---

## Catégorie 5 — Conformité design system (ARTCOL)

Checklist spécifique ARTCOL :

- [ ] Fond `#080b10` (pas de substitut)
- [ ] `--accent-lime` sur CTA principal uniquement (pas dispersé)
- [ ] Fontes : Space Grotesk titres, Inter texte, JetBrains Mono données/code
- [ ] Pas de couleur hors palette (rouge vif, bleu électrique non défini…)
- [ ] Bordures `--border-subtle` au repos, `--border-active` au hover
- [ ] Import Google Fonts présent en tête de fichier
- [ ] Format single-file respecté (si livrable HTML)

Si projet non-ARTCOL : remplacer par les tokens du design system concerné.

---

## Catégorie 6 — Polish final

États à vérifier systématiquement :
- **Hover / focus** : feedback visible sur chaque interactif.
- **État vide** (empty state) : message/illustration quand liste vide.
- **État chargement** : skeleton ou spinner visible.
- **État erreur** : message d'erreur proche du champ, couleur + icône.
- **Alignements** : textes, icônes et éléments de même niveau sont-ils alignés au pixel ?
- **Débordements** : tester avec des textes longs / noms très courts.
- **Favicon et title** présents.
- **Pas d'éléments de debug** visibles (borders rouges, `console.log` affiché, données factices en production).

---

## Format du rapport de sortie

```
## Rapport QA — [Nom de l'écran] — [Date]

### Scores
| Catégorie            | Score /10 |
|----------------------|-----------|
| Accessibilité WCAG   | X/10      |
| Cohérence design     | X/10      |
| Responsive           | X/10      |
| Typographie          | X/10      |
| Conformité DS        | X/10      |
| Polish final         | X/10      |
| **TOTAL**            | **X/60**  |

### Problèmes critiques (bloqueants)
1. [Problème] → [Correction exacte]

### Problèmes importants (à corriger avant livraison)
2. ...

### Améliorations (post-livraison)
3. ...
```

Score global ≥ 50/60 = livrable. Entre 40 et 49 = corrections requises. < 40 = refonte partielle nécessaire.

> Skills sœurs : `artcol-design-system` (tokens de référence), `redesign-chirurgien` (appliquer les corrections CSS), `css-master` (fixes précis), `ui-ux-pro-max` (règles UX générales), `motion-design` (vérifier les animations).
