# ⊙ Mon Monde · Tarek Bouhlel

L'univers personnel unifié de Tarek : **Brain + Shrine + Compta** (Compta en Phase 2).

Single-page PWA chiffrée de bout en bout, accessible depuis n'importe quel appareil
une fois déployée sur Vercel (Phase 3).

---

## État actuel — Phase 2

L'univers réunit désormais **Brain + Shrine + Compta SASU** sous une seule topbar.

### Architecture

```
mon-monde/
├── index.html        ← Shell : topbar unifiée BRAIN / SHRINE / COMPTA + 3 iframes
├── brain.html        ← Xiaomi Brain v0.8.8 BRIDGED (identique à l'original)
├── shrine.html       ← Xiaomi Shrine GARDIENNE DU SEUIL (+ Gardienne 3D — Phase A)
├── compta.html       ← Xiaomi Compta v1.0 SASU (nouveau - Phase 2)
├── robot3d.js        ← Module Gardienne 3D (Three.js, robot humanoïde animé au centre)
├── models/           ← RobotExpressive.glb (modèle riggé du robot)
├── vendor/three/     ← Three.js 0.184 auto-hébergé (ESM, zéro build, marche hors-ligne)
├── sw.js             ← Service worker minimal (PWA installable, pas de cache)
├── manifest.json     ← Manifeste PWA "Mon Monde"
└── src/
    ├── brain-v0.8.8.html    ← Backup gelé (référence)
    ├── shrine-v3.8.html     ← Backup gelé (référence — rollback Shrine d'origine)
    ├── brain-sw.js          ← SW Brain d'origine
    └── shrine-sw.js         ← SW Shrine d'origine
```

### Gardienne 3D (Phase A)

Le visage-photo central du Shrine est désormais doublé d'un **robot humanoïde 3D
animé** (modèle `RobotExpressive.glb`), monté via `robot3d.js` (Three.js auto-hébergé,
**sans build**). Le robot :
- salue à l'ouverture, **hoche la tête quand l'assistante parle**, s'illumine en cyan
  à l'écoute, en rouge en alerte — piloté par les classes CSS de `#portrait` (zéro
  modification de la logique du Shrine) ;
- **se désactive proprement** si WebGL est absent ou hors-ligne → la photo persona
  d'origine reste affichée (aucune régression).

> Note : `shrine.html` n'est donc plus identique au backup gelé `src/shrine-v3.8.html`
> (qui reste la référence de rollback). Les greffes sont minimales et additives
> (import-map, point de montage `#robot3d`, CSS `.robot-on`, balise module).

### Principe

- **Topbar unifiée** en haut, avec deux onglets : `🌌 BRAIN` et `🌸 SHRINE`
- Chaque module vit dans un `<iframe>` séparé, **même origine** → le bus
  `BroadcastChannel('xiaomi-os')` fonctionne automatiquement entre les deux
- Le pont Shrine→Brain (clé API en RAM via `shrine:key:unlocked`) marche tel quel
- **Brain reste identique à l'origine** (SHA256 inchangé) ; **Shrine** a reçu la
  Gardienne 3D (Phase A) — greffes additives, backup d'origine conservé dans
  `src/shrine-v3.8.html`.

  ```
  brain.html (inchangé) : 58dbb2e178575846ac8a50cef60a8086c2f164df1c9becfc1a03e85d34e59454
  ```

### Raccourcis clavier

| Touche | Action |
|---|---|
| `Ctrl/Cmd + 1` | Aller à BRAIN |
| `Ctrl/Cmd + 2` | Aller à SHRINE |
| `Ctrl/Cmd + 3` | Aller à COMPTA |

### Module Compta SASU — fonctionnalités

| Vue | Description |
|---|---|
| **◈ Tableau de bord** | 8 KPI live : CA HT, charges, résultat, IS prévisionnel, TVA collectée/déductible/à décaisser, trésorerie 512. Échéances + dernières écritures. |
| **◆ Écritures** | Saisie en partie double sur le PCG (60+ comptes pré-chargés). Validation auto débit=crédit. Filtres par journal, date, libellé. Détail dépliable. Grand-livre par compte. |
| **⬢ Factures** | Création avec mentions légales 2026 (pénalités L441-10, indemnité 40 €, art. 293 B si franchise). Génération auto de l'écriture VTE 411/706/44571. Marquage payée → écriture BQ auto. Impression HTML. |
| **▼ Déclarations** | TVA CA3 mensuelle/trimestrielle, IS 15%/25%, échéancier fiscal complet (TVA + IS + greffe + CFE), simulateur salaire vs dividendes. |
| **⚙ Réglages** | Config SASU (raison sociale, SIRET, RCS, capital, APE, TVA intra, IBAN, date clôture, régime TVA). Export FEC officiel (18 colonnes, format `SIRETfecCLOTURE.txt`). Backup/restore JSON. Démo. |

**Bus xiaomi-os** : Compta écoute le bus → reçoit la clé API si Shrine est déverrouillée, émet `compta:ecriture:new` et `compta:facture:new` que Brain pourra capter (Phase 4).

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

### Option 2 — Déploiement Vercel (Phase 3 ✅ disponible)

Voir le guide complet **[DEPLOY.md](./DEPLOY.md)** — déploiement en 8 étapes claires, ~10 minutes.

Une fois déployé, tu obtiens une URL HTTPS accessible depuis n'importe quel appareil + un edge proxy qui garde ta clé Anthropic côté serveur.

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
| **P1** | ✅ livré | Fusion Brain + Shrine sous topbar unifiée |
| **P2** | ✅ livré | Module Compta SASU (écritures, factures, TVA, IS, FEC) |
| **P3** | ✅ **livré** | Déploiement Vercel + edge function proxy Claude (voir DEPLOY.md) |
| **P4** | 🔜 à venir | Intelligence A+B+C (auto-enrichissement, briefing, tool-use) |

---

## Notes techniques

- **Pas de build step.** Tout est du HTML/CSS/JS vanilla. Tu ouvres `index.html`, ça marche.
- **PWA installable** dès qu'un service worker est enregistré (Chrome / Safari iOS / Edge).
- **Tailles** : `index.html` ~10 Ko, `brain.html` 422 Ko, `shrine.html` 977 Ko (icônes PWA en base64).
- **Polices** chargées depuis Google Fonts (mêmes que Brain et Shrine).
- **Tracé du bus inter-iframes** : ouvre la console et tape `window.MM_DEBUG_BUS = true` pour voir tous les messages `xiaomi-os` qui transitent.
