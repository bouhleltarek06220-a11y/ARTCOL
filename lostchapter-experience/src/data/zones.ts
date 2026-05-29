export interface Zone {
  id: string;
  title: string;
  blurb: string;
  accent: 'torch' | 'twitch' | 'gold';
  content: string[]; // points de la slide (à compléter avec le vrai contenu)
}

// Les 9 portes = les 9 sections de la soutenance Lost Chapter.
// Ordre = placement dans DungeonHall : fond (0-2), gauche (3-5), droite (6-8).
export const zones: Zone[] = [
  {
    id: 'nous', title: 'Nous', accent: 'gold',
    blurb: "L'équipe derrière Lost Chapter.",
    content: ['Tarek — porteur du projet', 'Myriam — création & univers', 'Julie — production & contenu', '(Complétez avec vos rôles)'],
  },
  {
    id: 'startup', title: 'Startup', accent: 'gold',
    blurb: 'Lost Chapter : la vision et le concept.',
    content: ['Patrimoine vivant + Twitch + recherche', 'Réveiller les monuments oubliés', "Une expérience immersive et narrative"],
  },
  {
    id: 'objectif', title: 'Objectif', accent: 'gold',
    blurb: 'Ce que nous voulons accomplir.',
    content: ['Valoriser le patrimoine', 'Toucher un large public en ligne', '(Vos objectifs chiffrés ici)'],
  },
  {
    id: 'icp', title: 'ICP / Persona', accent: 'twitch',
    blurb: "À qui s'adresse Lost Chapter.",
    content: ['Public sur place', 'Spectateurs Twitch', 'Mécènes & institutions du patrimoine'],
  },
  {
    id: 'strategie', title: 'Stratégie', accent: 'twitch',
    blurb: 'Notre plan pour y arriver.',
    content: ['Acquisition via influenceurs & live', 'Partenariats patrimoine / CNRS', '(Votre go-to-market)'],
  },
  {
    id: 'probleme', title: 'Problème / Solution', accent: 'torch',
    blurb: 'Le besoin et notre réponse.',
    content: ['Problème : patrimoine sous-valorisé, public éloigné', 'Solution : aventure live immersive', 'Le pont entre histoire et nouvelle génération'],
  },
  {
    id: 'kpi', title: 'KPI', accent: 'torch',
    blurb: 'Nos indicateurs de réussite.',
    content: ['Spectateurs (sur place + Twitch)', 'Engagement & rétention', 'Revenus & mécénat', '(Vos chiffres)'],
  },
  {
    id: 'reco', title: 'Recommandation', accent: 'gold',
    blurb: 'Nos préconisations.',
    content: ['Prochaines étapes', 'Investissements prioritaires', '(Vos recommandations)'],
  },
  {
    id: 'merci', title: 'Remerciement', accent: 'twitch',
    blurb: 'Merci de votre attention.',
    content: ['Merci !', 'Questions & échanges', 'Contact : hello@lostchapter.fr'],
  },
];
