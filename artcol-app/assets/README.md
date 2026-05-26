# Assets ARTCOL

Ce dossier accueille les fichiers visuels statiques de l'app (référencés depuis `app.json`).

## Fichiers attendus

| Fichier | Taille | Rôle | Format |
|---------|--------|------|--------|
| `logo-source.png` | ≥ 1024×1024 | **Logo officiel** (source unique pour générer le reste) | PNG transparent ou fond plein |
| `icon.png` | 1024×1024 | Icône iOS / Android (carrée) | PNG opaque |
| `adaptive-icon.png` | 1024×1024 | Icône Android adaptive (foreground, safe zone au centre) | PNG transparent |
| `splash.png` | ~1284×2778 ou 2048×2048 centré | Écran de splash | PNG, fond `#080b10` |
| `favicon.png` | 48×48 | Favicon version web | PNG |

## Procédure (à faire UNE seule fois quand tu places le logo)

1. Drop ton logo officiel ici en tant que `logo-source.png` (au minimum 1024×1024)
2. Une commande Node régénère tous les formats à partir de la source :

```bash
cd artcol-app
node assets/build-icons.cjs
```

(le script sera ajouté quand le logo source sera en place, parce qu'il faut connaître le ratio
et savoir si tu veux fond transparent ou fond noir `#080b10` selon le rendu désiré)

## Permanence

Tant que `logo-source.png` n'est pas présent, `app.json` pointe vers des fichiers manquants ; Expo
affiche un warning et utilise des placeholders au démarrage — ça ne casse pas l'app, ça enlaidit
juste la splash et l'icône. Pas grave en dev, à corriger avant submission App Store (Phase 7).
