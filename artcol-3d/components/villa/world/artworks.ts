/**
 * Métadonnées des œuvres de la galerie (cartels). Chaque entrée alimente le
 * panneau d'inspection premium (titre, année, style, description, « en savoir
 * plus »). L'`id` est porté par le groupe 3D de l'œuvre (userData) et permet de
 * retrouver ces informations au clic.
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
   * Image de l'œuvre, servie depuis /public (ex : "/art/art-1.jpg"). Si le
   * fichier est absent ou échoue, le cadre retombe sur sa couleur d'origine —
   * il suffit de déposer les fichiers dans public/art/ pour voir les œuvres.
   */
  image?: string;
}

export const ARTWORKS: Record<string, ArtworkMeta> = {
  "art-1": {
    id: "art-1",
    title: "Braise",
    year: "2021",
    style: "Abstraction gestuelle",
    description:
      "Une déflagration de laque grenat où la matière semble encore chaude. L'artiste y cherche le point exact où la couleur devient température.",
    more: "Acquise à Milan — c'est la toute première pièce entrée dans la collection.",
    image: "/art/art-1.jpg",
  },
  "art-2": {
    id: "art-2",
    title: "Horizon Captif",
    year: "2019",
    style: "Color field",
    description:
      "Un bleu de Prusse étiré jusqu'à l'apesanteur. De loin, une mer ; de près, mille nuances de nuit.",
    more: "Diptyque conçu pour ce mur précis, sous la double hauteur du hall.",
    image: "/art/art-2.jpg",
  },
  "art-3": {
    id: "art-3",
    title: "Sève",
    year: "2022",
    style: "Art organique",
    description:
      "Le vert d'un sous-bois après la pluie, posé en glacis successifs. Une respiration végétale dans le minéral de la villa.",
    more: "Travaillée à la cire chaude, couche après couche, sur près d'un an.",
    image: "/art/art-3.jpg",
  },
  "art-4": {
    id: "art-4",
    title: "Nocturne Pourpre",
    year: "2018",
    style: "Abstraction lyrique",
    description:
      "Une tombée de violet impérial traversée d'un éclat d'or. La pièce que je préfère montrer à la nuit tombante.",
    more: "Présentée à la Biennale de Venise avant d'entrer dans cette galerie.",
    image: "/art/art-4.jpg",
  },
  "art-5": {
    id: "art-5",
    title: "Or Liquide",
    year: "2023",
    style: "Art contemporain",
    description:
      "L'ambre d'un dernier rayon, figé dans la résine. Elle dialogue avec le couchant qui inonde le hall.",
    more: "La plus récente acquisition — encore tiède de l'atelier.",
    image: "/art/art-5.jpg",
  },
};
