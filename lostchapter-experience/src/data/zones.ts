export interface Zone {
  id: string;
  title: string;
  blurb: string;
  accent: 'torch' | 'twitch' | 'gold';
}

// Les 9 portes = les 9 sections de la soutenance Lost Chapter.
// Ordre = placement dans DungeonHall : fond (0-2), gauche (3-5), droite (6-8).
export const zones: Zone[] = [
  { id: 'nous',        title: 'Nous',                 blurb: "L'équipe derrière Lost Chapter.",                          accent: 'gold' },
  { id: 'startup',     title: 'Startup',              blurb: "Lost Chapter : la vision et le concept.",                  accent: 'gold' },
  { id: 'objectif',    title: 'Objectif',            blurb: "Ce que nous voulons accomplir.",                           accent: 'gold' },
  { id: 'icp',         title: 'ICP / Persona',       blurb: "À qui s'adresse Lost Chapter.",                            accent: 'twitch' },
  { id: 'strategie',   title: 'Stratégie',           blurb: "Notre plan pour y arriver.",                               accent: 'twitch' },
  { id: 'probleme',    title: 'Problème / Solution', blurb: "Le besoin et notre réponse.",                              accent: 'torch' },
  { id: 'kpi',         title: 'KPI',                 blurb: "Nos indicateurs de réussite.",                             accent: 'torch' },
  { id: 'reco',        title: 'Recommandation',      blurb: "Nos préconisations.",                                      accent: 'gold' },
  { id: 'merci',       title: 'Remerciement',        blurb: "Merci de votre attention.",                                accent: 'twitch' },
];
