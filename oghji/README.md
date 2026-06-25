# OGHJI — Présentation commerciale

Refonte complète de la présentation commerciale **OGHJI — Le cerveau énergétique et électrique**.
Design premium, narration commerciale resserrée, 12 slides au format 16:9.

## Livrables

| Fichier | Usage |
|---------|-------|
| `OGHJI_Presentation_Commerciale.pptx` | Présentation finale (PowerPoint / Keynote / Google Slides). 12 slides + notes du présentateur. |
| `OGHJI_Presentation_Commerciale.pdf` | Version PDF pour prévisualisation et envoi rapide. |
| `source/preview/overview.png` | Aperçu des 12 slides en une image. |
| `source/deck.html` | Version web : **ouvrir dans un navigateur** pour voir le deck. |

## Plan du deck

1. **Couverture** — Le cerveau énergétique de votre installation
2. **Le constat** — Votre tableau électrique est aveugle (4 douleurs)
3. **La solution** — OGHJI : mesure · protège · pilote · anticipe
4. **Le produit** — Un écran, des boîtiers, une intelligence
5. **Sous le capot** — Tout est intégré nativement (breveté FR3055478B1)
6. **Les bénéfices** — 6 leviers concrets
7. **Le verrou** — Sécurité type B + détection d'arc
8. **3 interfaces** — Écran · App mobile · Web
9. **La différence** — OGHJI vs tableau connecté classique
10. **Pour qui ?** — Smart Home / Building / Service / City
11. **Installation** — 4 étapes, un remplacement pas un chantier
12. **Appel à l'action** — Demander une démo

## Design system

- **Thème** : énergie / électrique — dégradé bleu nuit → vert/teal, accents vert électrique `#2BE08A`.
- **Typo** : Space Grotesk (titres), Inter (texte), JetBrains Mono (labels & data).
- **Icônes** : Lucide (trait fin, cohérent).
- **Photos produit réelles** récupérées de la version d'origine (écran de contrôle, boîtiers, internes, journal d'alertes, avant/après).

## Régénérer

Le deck est généré par code : HTML/CSS → captures Chromium (haute résolution) → assemblage PPTX/PDF.

```bash
cd source
npm install
npm run build      # gen.mjs → render.mjs → build-pptx.mjs → build-pdf.mjs
```

> Le rendu utilise Chromium via Playwright. Dans cet environnement, le binaire préinstallé
> est ciblé via `executablePath` dans `render.mjs` / `overview.mjs`.

### Pour modifier un contenu

Tout le texte vit dans `source/gen.mjs` (une fonction par slide). Le style vit dans `source/style.css`.
Modifier puis relancer `npm run build`.
