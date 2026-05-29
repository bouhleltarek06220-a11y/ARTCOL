/* Données partagées de l'AI Command Center (modules + sections bilingues) */

export const MODULES = [
  { key: "prospect",  color: "#67e8f9", r: 2.7, sp: 0.22, ph: 0,    tx:  0.18, tz:  0.05 },
  { key: "crm",       color: "#f0d27a", r: 3.1, sp: 0.18, ph: 1.1,  tx: -0.22, tz:  0.10 },
  { key: "auto",      color: "#a78bfa", r: 3.4, sp: 0.20, ph: 2.2,  tx:  0.10, tz: -0.18 },
  { key: "human",     color: "#fb7185", r: 2.8, sp: 0.24, ph: 3.3,  tx: -0.08, tz:  0.22 },
  { key: "analytics", color: "#34d399", r: 3.6, sp: 0.16, ph: 4.4,  tx:  0.26, tz: -0.10 },
  { key: "knowledge", color: "#93c5fd", r: 2.6, sp: 0.26, ph: 5.5,  tx: -0.14, tz: -0.22 },
];

// Préréglages de caméra — un par section
export const CAM = [
  { pos: [0,  2.0,  9.5], look: [0, 0, 0] },
  { pos: [ 3.8, 0.6, 6.5], look: [0, 0, 0] },
  { pos: [-3.8, 1.2, 6.5], look: [0, 0, 0] },
  { pos: [ 3.2,-0.8, 6.0], look: [0, 0, 0] },
  { pos: [-3.4,-1.0, 6.5], look: [0, 0, 0] },
  { pos: [ 0,   2.8, 6.8], look: [0, 0, 0] },
];

export const SECTIONS = {
  fr: [
    { tag: "00 · NOYAU",        title: "AI CORE",            text: "Le cerveau d'AMAVYA. L'intelligence qui orchestre toute l'expérience.",        accent: "#f0d27a" },
    { tag: "01 · PROSPECTION",  title: "PROSPECTING ENGINE", text: "Identifier les bons prospects, en continu — pilote automatique.",              accent: "#67e8f9" },
    { tag: "02 · CRM",          title: "CRM INTELLIGENCE",   text: "Vos contacts qualifiés, scorés et priorisés en temps réel.",                   accent: "#f0d27a" },
    { tag: "03 · AUTOMATION",   title: "AUTOMATION CENTER",  text: "Vos outils connectés. Vos process exécutés tout seuls, sans friction.",        accent: "#a78bfa" },
    { tag: "04 · COLLABORATION",title: "HUMAN + AI",         text: "L'IA n'est pas là pour remplacer. Elle est là pour augmenter l'humain.",       accent: "#fb7185" },
    { tag: "05 · ANALYTIQUE",   title: "ANALYTICS HUB",      text: "Vos données vivantes. Vos décisions éclairées par la prédiction.",             accent: "#34d399" },
  ],
  en: [
    { tag: "00 · CORE",         title: "AI CORE",            text: "The brain of AMAVYA. The intelligence that orchestrates the entire experience.", accent: "#f0d27a" },
    { tag: "01 · PROSPECTING",  title: "PROSPECTING ENGINE", text: "Spotting the right prospects, continuously — on autopilot.",                    accent: "#67e8f9" },
    { tag: "02 · CRM",          title: "CRM INTELLIGENCE",   text: "Your contacts qualified, scored and prioritized in real time.",                 accent: "#f0d27a" },
    { tag: "03 · AUTOMATION",   title: "AUTOMATION CENTER",  text: "Your tools connected. Your processes running on their own, friction-free.",      accent: "#a78bfa" },
    { tag: "04 · COLLABORATION",title: "HUMAN + AI",         text: "AI is not here to replace people. It is here to augment them.",                 accent: "#fb7185" },
    { tag: "05 · ANALYTICS",    title: "ANALYTICS HUB",      text: "Your data alive. Your decisions guided by prediction.",                          accent: "#34d399" },
  ],
};

export const MODULE_LABEL = {
  fr: {
    prospect: "Prospecting AI",
    crm: "CRM Intelligence",
    auto: "Automation",
    human: "Human + AI",
    analytics: "Analytics",
    knowledge: "Knowledge AI",
  },
  en: {
    prospect: "Prospecting AI",
    crm: "CRM Intelligence",
    auto: "Automation",
    human: "Human + AI",
    analytics: "Analytics",
    knowledge: "Knowledge AI",
  },
};

// Le stop 0 (Core) ne met aucun orbiter en avant ; stops 1..5 → modules 0..4.
export const STOP_TO_MODULE = [null, 0, 1, 2, 3, 4];
export const STOPS = SECTIONS.fr.length;
