# Lost Chapter — Expérience 3D de soutenance

Expérience 3D navigable (univers médiéval / dark fantasy) pour la soutenance :
monde par étages/salles, porte → portail vers un autre monde, **armure de chevalier
qui se décompose / recompose à la souris**, slides intégrées dans les salles.

Stack : **Vite + React 19 + React Three Fiber + drei** (post-processing, GSAP/Lenis ajoutés
aux étapes suivantes). Voir `../RAPPORT-3D.md` pour la référence technique complète et
`./PROPOSITION.md` pour la structure détaillée.

## Démarrer

```bash
cd lostchapter-3d
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de dev (HMR) |
| `npm run build` | Build de production → `dist/` |
| `npm run preview` | Prévisualise le build |

## Avancement (plan en 6 étapes)

- [x] **1. Scaffold** — Vite + R3F, `<Canvas>` qui tourne, build OK
- [ ] 2. Armure exploded view (souris)
- [ ] 3. Monde navigable au scroll (GSAP + Lenis)
- [ ] 4. Porte / portail (MeshTransmissionMaterial) + slides
- [ ] 5. Photoréalisme (HDRI, post-processing, torches)
- [ ] 6. Déploiement Vercel + compression assets

## Assets

Les GLB (armure, props) sont générés sur **Meshy** (PBR), découpés en pièces dans Blender
(origine = centre de masse), compressés via `npx gltfjsx model.glb -t -T`, puis placés dans
`public/models/` (ou un CDN si > 5 Mo).
