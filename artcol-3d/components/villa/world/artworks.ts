/**
 * Métadonnées des œuvres de la galerie (cartels). Chaque entrée alimente le
 * panneau d'inspection premium (titre, année, style, description, « en savoir
 * plus », lien vers le projet). L'`id` est porté par le groupe 3D de l'œuvre
 * (userData) et permet de retrouver ces informations au clic.
 *
 * Ici, chaque « œuvre » est un PROJET réel : la miniature (`image`) est une
 * capture du site et `url` ouvre le projet dans un nouvel onglet.
 */
export interface ArtworkMeta {
  id: string;
  title: string;
  year: string;
  style: string;
  description: string;
  /** Anecdote « en savoir plus » (dévoilée à la demande). */
  more: string;
  /**
   * Miniature de l'œuvre, servie depuis /public (ex : "/art/work-1.jpg"). Si le
   * fichier est absent ou échoue, le cadre retombe sur sa couleur d'origine —
   * il suffit de déposer les fichiers dans public/art/ pour voir les œuvres.
   */
  image?: string;
  /** Lien du projet ouvert depuis le cartel (« Ouvrir le projet »). */
  url?: string;
}

export const ARTWORKS: Record<string, ArtworkMeta> = {
  "art-1": {
    id: "art-1",
    title: "Hermès — L'Atelier du Golfe",
    year: "2026",
    style: "Étude stratégique · Luxe",
    description:
      "« Hermès ne vend pas des sacs. » Une étude immersive : pourquoi la maison devrait bâtir sa propre plateforme de rachat, revente certifiée & upcycling dans le Golfe.",
    more: "Expérience scrollytelling éditoriale (Immersive Engine).",
    image: "/art/work-1.jpg",
    url: "https://immersive-engine.vercel.app/works/hermes.html",
  },
  "art-2": {
    id: "art-2",
    title: "Dose — Phénomène viral",
    year: "2026",
    style: "Décryptage de marque",
    description:
      "Comment Dose a transformé l'eau vitaminée en phénomène viral : 250M+ de vues, 150K canettes, 200+ points de vente — une « com' de cartel », 0 € de pub.",
    more: "Analyse commerciale immersive (Immersive Engine).",
    image: "/art/work-2.jpg",
    url: "https://immersive-engine.vercel.app/works/dose.html",
  },
  "art-3": {
    id: "art-3",
    title: "Le Refuge des Pins",
    year: "2026",
    style: "Maison d'architecte",
    description:
      "Une maison de campagne en pierre & bois, posée dans une clairière de pins. Visite immersive sur-mesure d'un projet d'architecture.",
    more: "Site expérientiel scrollytelling (Immersive Engine).",
    image: "/art/work-3.jpg",
    url: "https://immersive-engine.vercel.app/works/refuge.html",
  },
  "art-4": {
    id: "art-4",
    title: "Lost Chapter",
    year: "2026",
    style: "Patrimoine vivant",
    description:
      "« Réveillez l'histoire. » Et si un monument oublié redevenait, le temps d'une journée, le théâtre vivant de sa propre légende ?",
    more: "Plateforme interactive — patrimoine, mécénat, création, aventure.",
    image: "/art/work-4.jpg",
    url: "https://lostchapter.vercel.app/",
  },
  "art-5": {
    id: "art-5",
    title: "ARTCOL",
    year: "2026",
    style: "Plateforme · Le projet",
    description:
      "La collaboration entre artistes en manque de visibilité : trouver des partenaires créatifs, lancer des projets, développer son réseau, donner vie aux idées.",
    more: "Le projet phare — bientôt en ligne.",
    image: "/art/work-5.jpg",
    url: "https://artcol.online/",
  },
  "art-6": {
    id: "art-6",
    title: "Lost Chapter · Soutenance",
    year: "2026",
    style: "Stratégie d'acquisition",
    description:
      "La soutenance Jupiter : stratégie d'acquisition Play Azur Production. Rocket School · Promotion Apollo 186 · Challenge 3.",
    more: "Deck interactif présenté en équipe (Jupiter).",
    image: "/art/work-6.jpg",
    url: "https://lostchapter-git-claude-48b214-bouhleltarek06220-4609s-projects.vercel.app/Soutenance",
  },
  "art-7": {
    id: "art-7",
    title: "Objectif Planète Mars",
    year: "2026",
    style: "Soutenance · Challenge 1",
    description:
      "Class'Croute, secteur Nice Méridia : développer le portefeuille client et accélérer l'e-cantine & le service traiteur. Rocket School.",
    more: "Soutenance C1 — équipe Jupiter.",
    image: "/art/work-7.jpg",
    url: "/works/soutenance-c1.html",
  },
  "art-8": {
    id: "art-8",
    title: "TDM · Jupiter — CRM Apimo",
    year: "2026",
    style: "Soutenance · Challenge 2",
    description:
      "« Trois BizDev, un système connecté. » Une cellule commerciale tech-enabled : l'ingénierie rencontre l'exécution commerciale brute (CRM Apimo Jupiter).",
    more: "Soutenance C2 — Tarek, Delphine, Marie.",
    image: "/art/work-8.jpg",
    url: "/works/soutenance-c2.html",
  },
};
