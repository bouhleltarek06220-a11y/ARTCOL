# ⊙ Mon Monde · Tarek Bouhlel

L'univers personnel unifié de Tarek : **Brain + Shrine + Compta** (Compta en Phase 2).

Single-page PWA chiffrée de bout en bout, accessible depuis n'importe quel appareil
une fois déployée sur Vercel (Phase 3).

---

## Phase 1 — état actuel

Cette phase **fusionne Brain v0.8.8 et Shrine v3.8 dans un seul univers** sans
modifier une seule ligne des deux applications d'origine.

### Architecture

```
mon-monde/
├── index.html        ← Shell : topbar unifiée + 2 iframes (Brain/Shrine)
├── brain.html        ← Xiaomi Brain v0.8.8 BRIDGED (identique à l'original)
├── shrine.html       ← Xiaomi Shrine v3.8 GARDIENNE DU SEUIL (identique à l'original)
├── sw.js             ← Service worker minimal (PWA installable, pas de cache)
├── manifest.json     ← Manifeste PWA "Mon Monde"
└── src/
    ├── brain-v0.8.8.html    ← Backup gelé (référence)
    ├── shrine-v3.8.html     ← Backup gelé (référence)
    ├── brain-sw.js          ← SW Brain d'origine
    └── shrine-sw.js         ← SW Shrine d'origine
```

### Principe

- **Topbar unifiée** en haut, avec deux onglets : `🌌 BRAIN` et `🌸 SHRINE`
- Chaque module vit dans un `<iframe>` séparé, **même origine** → le bus
  `BroadcastChannel('xiaomi-os')` fonctionne automatiquement entre les deux
- Le pont Shrine→Brain (clé API en RAM via `shrine:key:unlocked`) marche tel quel
- **Aucune modification** des fichiers Brain et Shrine d'origine — preuve :
  les SHA256 sont identiques aux sources :

  ```
  brain.html  : 58dbb2e178575846ac8a50cef60a8086c2f164df1c9becfc1a03e85d34e59454
  shrine.html : b4abcf0fc50e949cb44c053cf1f36d3f0dfa68fc21405a1c260996824979997a
  ```

### Raccourcis clavier

| Touche | Action |
|---|---|
| `Ctrl/Cmd + 1` | Aller à BRAIN |
| `Ctrl/Cmd + 2` | Aller à SHRINE |

---

## Comment tester en local

### Option 1 — Serveur Python (recommandé)

```bash
cd mon-monde/
python3 -m http.server 5500
```

Puis ouvre `http://localhost:5500/` dans Chrome ou Safari.

> ⚠️ **Important** : un serveur HTTP est **nécessaire** pour que le `BroadcastChannel`
> et les service workers fonctionnent. En `file://` direct, les ponts entre Brain
> et Shrine peuvent être bloqués par le navigateur.

### Option 2 — Déploiement Vercel (Phase 3)

Sera ajouté en Phase 3. Pour anticiper : `vercel.json` + edge function
`/api/claude` pour proxifier l'API Anthropic (la clé ne touchera jamais ton navigateur).

---

## Comment déployer sur ton iMac à la place de l'ancien Brain

Si tu veux remplacer ton ancien Brain par Mon Monde dans `~/Documents/XIAOMI_OS/`,
fais ceci (mais attends Phase 3 si tu veux la version la plus aboutie) :

```bash
# Sauvegarde l'ancien dossier
cp -r ~/Documents/XIAOMI_OS ~/Documents/XIAOMI_OS.backup-$(date +%Y%m%d)

# Pose Mon Monde à la place
# (depuis le dossier mon-monde/ de ce repo)
cp index.html brain.html shrine.html sw.js manifest.json ~/Documents/XIAOMI_OS/
```

Puis ouvre `~/Documents/XIAOMI_OS/index.html` dans ton navigateur ou ton PWA.

---

## Roadmap

| Phase | Statut | Contenu |
|---|---|---|
| **P1** | ✅ **livré** | Fusion Brain + Shrine sous topbar unifiée |
| **P2** | 🔜 à venir | Module Compta SASU (écritures, factures, TVA, IS, FEC) |
| **P3** | 🔜 à venir | Déploiement Vercel + edge function proxy Claude |
| **P4** | 🔜 à venir | Intelligence A+B+C (auto-enrichissement, briefing, tool-use) |

---

## Notes techniques

- **Pas de build step.** Tout est du HTML/CSS/JS vanilla. Tu ouvres `index.html`, ça marche.
- **PWA installable** dès qu'un service worker est enregistré (Chrome / Safari iOS / Edge).
- **Tailles** : `index.html` ~10 Ko, `brain.html` 422 Ko, `shrine.html` 977 Ko (icônes PWA en base64).
- **Polices** chargées depuis Google Fonts (mêmes que Brain et Shrine).
- **Tracé du bus inter-iframes** : ouvre la console et tape `window.MM_DEBUG_BUS = true` pour voir tous les messages `xiaomi-os` qui transitent.
