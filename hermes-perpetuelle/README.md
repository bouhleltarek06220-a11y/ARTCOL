# HERMÈS · PERPÉTUELLE

Expérience digitale immersive — soutenance « Analyse de marché & veille concurrentielle ».
Réponse à la problématique : **Hermès a-t-elle intérêt à investir le marché de la seconde main
et de la circularité, et selon quelles modalités, pour capter de la valeur sans dégrader la
désirabilité de sa marque ?**

> Périmètre retenu : **Arabie Saoudite** (lecture via la trajectoire de Dubaï 1990→2020) ·
> toutes catégories Hermès **hors Birkin & Kelly** · angle : **plateforme propriétaire de rachat,
> revente certifiée & upcycling** (« Hermès Perpétuelle »).

---

## ▶️ Lancer l'expérience

Le projet est **100 % autonome et hors-ligne** (librairies, polices et vidéos vendues en local).

**Option recommandée — serveur local** (évite tout blocage navigateur sur les vidéos) :

```bash
cd hermes-perpetuelle
python3 -m http.server 8000
# puis ouvrir http://localhost:8000 dans Chrome / Edge
```

**Option simple** : double-cliquer sur `index.html` (fonctionne dans la plupart des navigateurs).

> 💡 Pour la soutenance : ouvrir en plein écran (**F11**), navigateur **Chrome** à jour.
> Aucune connexion internet n'est requise.

---

## 🧭 Navigation

- **Scroll vertical** (défilement fluide Lenis)
- **Points de navigation** à droite → saut direct vers une section (utile en Q&R)
- **Survol** des pastilles « ⓘ » → source de chaque chiffre
- **PESTEL** : onglets P·E·S·T·E·L (la sphère se met en pause au survol)
- **SWOT** : boutons Forces/Faiblesses/Opportunités/Menaces, ou **glisser** le cube
- **Parcours client** : les vidéos atelier se lancent automatiquement à l'arrivée en vue

---

## 🗂️ Structure

```
hermes-perpetuelle/
├── index.html        # 13 sections + annexe méthodologique
├── styles.css        # design system (palette Hermès, cuir, doré)
├── app.js            # Lenis · GSAP/ScrollTrigger · Three.js (poussière dorée) · interactions
└── assets/
    ├── video/        # 4 vidéos (hero, cuir, atelier, cadenas)
    ├── img/          # posters
    └── lib/          # gsap, scrolltrigger, lenis, three.js + polices (offline)
```

## 📐 Stack
Next.js n'était pas nécessaire : livrable **HTML/CSS/JS statique** pour une portabilité et une
robustesse maximales le jour J. Technos : **Three.js**, **GSAP + ScrollTrigger**, **Lenis**.

## 🔎 Rigueur des données
Chaque donnée est marquée **Fait · Estimation · Hypothèse** (légende en haut + annexe en bas).
Les TAM/SAM/SOM distinguent explicitement le fait sourcé (TAM) des estimations/hypothèses
(SAM/SOM), conformément à la consigne éliminatoire « aucune donnée fabriquée présentée comme un fait ».
Voir `SOUTENANCE.md` pour le déroulé de présentation.
