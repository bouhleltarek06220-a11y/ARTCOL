# public/models/

Déposer ici les modèles 3D au format **GLTF / GLB**.

## Bonnes pratiques

- **Compresser** la géométrie (Draco ou meshopt) et les textures (KTX2 / WebP)
  avant de committer. Un `.glb` non compressé ralentit fortement le chargement.
- **Convertir** chaque modèle en composant React typé :

  ```bash
  npx gltfjsx public/models/mon-modele.glb --types
  ```

  Placer le composant généré dans `components/3d/` et le charger sous `<Suspense>`.

- **Précharger** avec `useGLTF.preload("/models/mon-modele.glb")` (voir
  `components/3d/Model.tsx`).

> Les chemins sont relatifs à `public/`, donc `public/models/x.glb` se charge
> via l'URL `/models/x.glb`.

## Crédits / licences des modèles

- **CesiumMan.glb** — hôte humain neutre (placeholder). Source : Khronos
  glTF-Sample-Assets, modèle « CesiumMan » par **Cesium**. Licence **CC-BY 4.0**
  (attribution requise). À remplacer par l'avatar perso de l'hôte (ReadyPlayerMe).
- **Soldier.glb / RobotExpressive.glb** — exemples three.js (CC).
