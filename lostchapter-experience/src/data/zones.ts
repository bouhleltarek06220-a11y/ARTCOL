export interface Zone {
  id: string;
  title: string;
  blurb: string;
  accent: 'torch' | 'twitch' | 'gold';
}

// Les 9 zones du hall (contenu enrichi dans les phases suivantes).
export const zones: Zone[] = [
  { id: 'projet',       title: 'Le Projet',          blurb: 'Les lieux historiques deviennent des aventures immersives live.', accent: 'gold' },
  { id: 'lieux',        title: 'Lieux historiques',  blurb: 'Mont-Saint-Michel, Carcassonne, Avignon, Chambord…',              accent: 'gold' },
  { id: 'jdr',          title: 'Jeu de rôle',        blurb: 'Personnages, dés et quêtes grandeur nature.',                     accent: 'torch' },
  { id: 'influenceurs', title: 'Influenceurs',       blurb: 'Ils racontent l’expérience en direct.',                           accent: 'twitch' },
  { id: 'public',       title: 'Public & Twitch',    blurb: 'Spectateurs sur place et derrière l’écran, réunis.',              accent: 'twitch' },
  { id: 'sponsors',     title: 'Sponsors & Mécènes', blurb: 'Visibilité, fiscalité, stand, impact.',                           accent: 'gold' },
  { id: 'coulisses',    title: 'Coulisses',          blurb: 'Recherche, technique, costumes, décors.',                         accent: 'torch' },
  { id: 'donateurs',    title: 'Donateurs',          blurb: 'Le mur d’honneur des contributeurs.',                             accent: 'gold' },
  { id: 'contact',      title: 'Contact / QR',       blurb: 'Découvrez les prochains chapitres.',                              accent: 'twitch' },
];
