/**
 * Données détaillées des 6 solutions AMAVYA, affichées dans la modale /labs.
 * Chaque service contient :
 * - definition : ce que c'est
 * - benefits : 4 bénéfices business chiffrables
 * - sectors : exemples de personnalisation par secteur d'activité
 * - kpi : indicateurs clés que l'on suit
 */
export const LABS_SERVICES = [
  {
    id: "agents-ia",
    label: "Agents IA",
    tagline: "Vos collaborateurs numériques autonomes",
    definition:
      "Des agents intelligents qui comprennent vos processus, prennent des décisions et exécutent des tâches complexes sans intervention humaine. Ils s'intègrent à vos outils existants (CRM, email, ERP, bases de données) et apprennent en continu pour devenir plus précis dans le temps.",
    benefits: [
      "Réduction de 60 à 80 % du temps consacré aux tâches répétitives.",
      "Disponibilité 24/7, sans coût de structure caché ni gestion RH.",
      "Décisions traçables et auditables — l'inverse d'une boîte noire.",
      "ROI mesurable en 30 à 90 jours sur les premières missions livrées.",
    ],
    sectors: [
      {
        sector: "Cabinet conseil / juridique",
        useCase:
          "Synthèse de jurisprudence, première lecture de contrats, qualification automatique des prospects entrants.",
      },
      {
        sector: "E-commerce",
        useCase:
          "Service client niveau 1, suivi de commande, relances de panier, recouvrement intelligent.",
      },
      {
        sector: "Immobilier",
        useCase:
          "Qualification d'appels entrants, planification automatique des visites, relances de mandats expirants.",
      },
      {
        sector: "Industrie / PME",
        useCase:
          "Alertes de maintenance prédictive, suivi qualité, support technique interne 24/7.",
      },
      {
        sector: "Santé",
        useCase:
          "Pré-anamnèse, prise de RDV, suivi observance traitement, rappels patients.",
      },
    ],
    kpi: [
      "Tâches automatisées / mois",
      "Taux de résolution sans humain",
      "Heures équivalent-temps-plein économisées",
    ],
  },
  {
    id: "crm-intelligent",
    label: "CRM intelligent",
    tagline: "Un CRM qui travaille pour vous",
    definition:
      "Bien plus qu'un carnet d'adresses : un CRM augmenté par IA qui qualifie automatiquement vos leads, priorise les opportunités à fort potentiel et enrichit chaque fiche contact en temps réel. Vos commerciaux ne perdent plus de temps à mettre à jour la donnée — ils la consomment.",
    benefits: [
      "Lead scoring automatique : les bons prospects remontent en tête.",
      "Enrichissement temps réel (taille société, financements, signaux d'achat).",
      "Relances multicanal personnalisées par l'IA, sans intervention manuelle.",
      "+20 à 30 % de taux de prise de RDV constaté sur les leads qualifiés.",
    ],
    sectors: [
      {
        sector: "B2B Tech / SaaS",
        useCase:
          "Détection de signaux d'achat (levées de fonds, recrutements, changements d'outils) et priorisation des comptes.",
      },
      {
        sector: "Cabinet d'expertise / audit",
        useCase:
          "Suivi des renouvellements de mandats, alertes sur les clients à risque de churn.",
      },
      {
        sector: "Banque / assurance / patrimoine",
        useCase:
          "Cross-sell intelligent (qui est éligible à quel produit), prévention de la déshérence client.",
      },
      {
        sector: "Distribution / négoce",
        useCase:
          "Anticipation des commandes récurrentes, alerte sur baisse de fréquence d'achat.",
      },
    ],
    kpi: [
      "Score de lead moyen",
      "Taux de transformation par segment",
      "Temps moyen entre 1ᵉʳ contact et signature",
    ],
  },
  {
    id: "automatisation",
    label: "Automatisation",
    tagline: "Éliminez les tâches répétitives",
    definition:
      "Connectez tous vos outils (Gmail, Slack, Notion, Sheets, votre CRM, votre compta…) et automatisez vos workflows de bout en bout. Plus de copier-coller, plus de ressaisies : vos processus s'exécutent seuls, sans erreur et sans friction.",
    benefits: [
      "Suppression des erreurs de saisie qui coûtent du temps et de l'argent.",
      "Gain mesurable : 5 à 15 heures par semaine et par poste concerné.",
      "Audit complet du workflow avant — vous savez ce qui change.",
      "Aucun code à maintenir côté client, AMAVYA fait évoluer la chaîne.",
    ],
    sectors: [
      {
        sector: "Comptabilité / paie",
        useCase:
          "Saisie automatique des factures, rapprochement bancaire, suivi des paiements clients.",
      },
      {
        sector: "RH",
        useCase:
          "Pré-tri des CV, planification d'entretiens, onboarding automatisé.",
      },
      {
        sector: "Logistique / supply chain",
        useCase:
          "Réassort automatique, suivi des livraisons, alertes ruptures.",
      },
      {
        sector: "Marketing",
        useCase:
          "Distribution multicanal des contenus, reporting performance, suivi UTM.",
      },
    ],
    kpi: [
      "Heures économisées / mois",
      "Taux d'erreur post-automatisation",
      "Temps de cycle d'un workflow",
    ],
  },
  {
    id: "prospection-ia",
    label: "Prospection IA",
    tagline: "Remplissez votre pipeline en pilote automatique",
    definition:
      "Identifiez vos prospects idéaux, lancez des séquences personnalisées et relancez automatiquement — le tout piloté par IA. Vos commerciaux se concentrent sur la signature, pas sur la recherche froide.",
    benefits: [
      "Ciblage précis sur votre ICP (Ideal Customer Profile) réel.",
      "Messages multicanal générés et adaptés au prospect, jamais génériques.",
      "Relances envoyées au meilleur moment (jour, heure, canal).",
      "Reporting en clair : qui est intéressé, qui ne l'est pas, pourquoi.",
    ],
    sectors: [
      {
        sector: "Agence de conseil / freelance",
        useCase:
          "Identification de PME en croissance dans votre zone, prise de contact LinkedIn personnalisée.",
      },
      {
        sector: "BTP / industrie",
        useCase:
          "Veille sur les appels d'offres et permis de construire, alerte temps réel.",
      },
      {
        sector: "Formation professionnelle",
        useCase:
          "Ciblage par OPCO, alertes sur les budgets formation qui se débloquent.",
      },
      {
        sector: "SaaS",
        useCase:
          "Détection des signaux d'usage chez la concurrence pour intercepter au bon moment.",
      },
    ],
    kpi: [
      "Volume de prospects qualifiés / mois",
      "Taux de réponse moyen",
      "Coût d'acquisition par RDV",
    ],
  },
  {
    id: "saas-sur-mesure",
    label: "SaaS sur mesure",
    tagline: "Votre plateforme, conçue pour vous",
    definition:
      "Nous concevons et développons des plateformes web et mobile élégantes, performantes et scalables, taillées précisément pour votre activité — de la première maquette à la mise en production, avec l'IA au cœur du produit.",
    benefits: [
      "Un outil qui colle à 100 % à votre métier, pas une généralité.",
      "Évolutivité : architecture prête à supporter votre croissance.",
      "Design premium : effet pro auprès de vos clients et investisseurs.",
      "IA intégrée nativement (pas un module add-on bricolé).",
    ],
    sectors: [
      {
        sector: "Cabinet d'audit / conseil",
        useCase:
          "Espace client unifié, partage de livrables, signature électronique, suivi de mission.",
      },
      {
        sector: "Santé / médical",
        useCase:
          "Téléconsultation, dossier patient sécurisé HDS, intégration assurance.",
      },
      {
        sector: "Marketplace verticale",
        useCase:
          "Mise en relation B2B, paiement intégré, modération assistée par IA.",
      },
      {
        sector: "Formation / e-learning",
        useCase:
          "LMS personnalisé, tutorat assisté par IA, certification automatique.",
      },
    ],
    kpi: [
      "Time-to-market",
      "Note utilisateurs (NPS interne)",
      "Coût total de possession sur 3 ans",
    ],
  },
  {
    id: "formation",
    label: "Formation",
    tagline: "Montez vos équipes en compétence",
    definition:
      "Nous accompagnons vos équipes pour intégrer concrètement l'IA dans leur quotidien : ateliers pratiques, montée en compétences, mise en place d'outils adaptés à vos métiers, et suivi post-formation pour ancrer la nouvelle pratique.",
    benefits: [
      "Adoption rapide : vos équipes utilisent l'IA en 2 à 4 semaines.",
      "Cas pratiques tirés de VOS données et VOS processus.",
      "Réduction des résistances au changement (acco. humain dédié).",
      "Suivi post-formation : on ne lâche pas vos équipes en cours de route.",
    ],
    sectors: [
      {
        sector: "Direction générale / COMEX",
        useCase:
          "Comprendre les enjeux IA, arbitrer les investissements, identifier les cas d'usage prioritaires.",
      },
      {
        sector: "Commercial / marketing",
        useCase:
          "Maîtriser ChatGPT / Claude pour prospection, copywriting, analyse de marché.",
      },
      {
        sector: "Opérations / back-office",
        useCase:
          "Automatisation Excel, traitement de PDF, gestion documentaire assistée.",
      },
      {
        sector: "Direction technique",
        useCase:
          "Cursus dev assisté (Copilot, Claude Code), revue de code, génération de tests.",
      },
    ],
    kpi: [
      "Taux d'adoption à 30 / 60 / 90 jours",
      "Gain de productivité auto-déclaré",
      "Nombre de cas d'usage déployés en interne",
    ],
  },
];

export function getLabsService(id) {
  return LABS_SERVICES.find((s) => s.id === id) || null;
}
