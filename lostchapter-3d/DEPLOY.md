# Déploiement Vercel — `lostchapter-3d`

L'app vit dans le **sous-dossier** `lostchapter-3d/` d'un mono-dépôt. Le `vercel.json`
**racine** pilote un autre projet (`playazur-crm`) — il ne faut donc **pas** réutiliser le
projet `artcol` existant (sa racine = la racine du repo). On crée un **projet dédié** dont
la *Root Directory* pointe sur `lostchapter-3d/`.

## Option A — Dashboard Vercel (recommandé, ~1 min)

1. Vercel → **Add New… → Project**.
2. Importer le repo **`bouhleltarek06220-a11y/artcol`**.
3. **Root Directory → `lostchapter-3d`** (bouton *Edit*).
4. Framework Preset : **Vite** (auto-détecté). Build `npm run build`, Output `dist`
   (déjà dans `lostchapter-3d/vercel.json`).
5. **Deploy**.

Ensuite, chaque `git push` déploie automatiquement :
- branche `main` → production,
- toute autre branche (ex. `claude/zen-darwin-qQyQI`) → **preview URL** (idéale pour la PR).

## Option B — CLI Vercel (en local)

```bash
cd lostchapter-3d
npx vercel            # crée/lie le projet (Root Directory = ce dossier)
npx vercel --prod     # déploiement production
```

## Notes assets

- `public/textures/otherworld.webp` (89 Ko) et `public/videos/portal.mp4` (4,5 Mo) sont
  servis depuis le repo, avec cache long (cf. `vercel.json`). Si la vidéo grossit au-delà
  de ~5 Mo, la déplacer sur un CDN et mettre l'URL dans `config/rooms.js > portalVideo`.
- Bundle ~0,55 Mo gzip (three + drei + postprocessing) : attendu pour une app 3D.
