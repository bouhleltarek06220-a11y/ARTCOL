/**
 * ✦ CONTENU ÉDITABLE DE L'EXPÉRIENCE ✦
 * Tout le « scénario » du site vit ici. Pour adapter le moteur à un autre projet
 * (auto, luxe, immobilier…), on ne touche qu'à ce fichier.
 *
 * Univers par défaut : AGENCE IA FUTURISTE.
 * Chaque station est un moment posé dans l'espace 3D, sur le rail de la caméra.
 */

export type Vec3 = [number, number, number];

export type Station = {
  id: string;
  kicker: string;       // sur-titre court
  title: string;        // titre de la section
  body: string;         // texte d'accroche
  position: Vec3;       // point sur le rail (la caméra y passe)
  /** Côté où le panneau holographique apparaît par rapport à l'allée. */
  side: "left" | "right" | "center";
};

export const THEME = {
  bg: "#05070d",
  fog: "#070b14",
  accent: "#5ad1ff",   // cyan néon
  accent2: "#9b6bff",  // violet
  accent3: "#36f5b0",  // vert hologramme
  ground: "#0a0e18",
  text: "#eaf2ff",
};

export const EXPERIENCE = {
  name: "NEXUS",
  tagline: "Agence d'intelligence artificielle",
};

/**
 * Le rail va de z=0 vers le fond (-z). On décale légèrement x/y pour que le
 * couloir « respire » et que le déplacement soit lisible.
 */
export const STATIONS: Station[] = [
  {
    id: "hero",
    kicker: "NEXUS · INTELLIGENCE ARTIFICIELLE",
    title: "Entrez dans le futur.",
    body: "Pas une page. Un univers. Avancez pour découvrir ce que l'IA peut faire pour vous.",
    position: [0, 0, 4],
    side: "center",
  },
  {
    id: "concept",
    kicker: "I · Le concept",
    title: "Une intelligence, sur mesure.",
    body: "Nous concevons des systèmes d'IA taillés pour votre métier — pas des gadgets.",
    position: [3.5, 0.6, -16],
    side: "right",
  },
  {
    id: "services",
    kicker: "II · Nos expertises",
    title: "Ce que nous construisons.",
    body: "Agents autonomes, copilotes métier, vision par ordinateur, RAG & data.",
    position: [-4, -0.4, -36],
    side: "left",
  },
  {
    id: "demo",
    kicker: "III · La démonstration",
    title: "Voir l'IA en action.",
    body: "Une démonstration interactive, en temps réel, dans l'espace.",
    position: [3, 0.8, -56],
    side: "right",
  },
  {
    id: "proof",
    kicker: "IV · La preuve",
    title: "Des résultats mesurables.",
    body: "+38 % de productivité · −60 % de tâches répétitives · ROI en 4 mois.",
    position: [-3.5, 0.2, -76],
    side: "left",
  },
  {
    id: "cta",
    kicker: "V · Embarquez",
    title: "Construisons votre univers.",
    body: "Parlons de votre projet. Le futur n'attend pas.",
    position: [0, 0, -96],
    side: "center",
  },
];
