/**
 * Traductions bilingues FR / EN d'AMAVYA.
 * Toutes les chaînes visibles de la landing page sont centralisées ici.
 * Structure par section : nav, hero, services, vision, technologies,
 * founder, cta, footer, contact, dashboard.
 */
export const translations = {
  fr: {
    nav: {
      links: [
        { label: "Solutions", href: "#services" },
        { label: "Vision", href: "#vision" },
        { label: "Technologies", href: "#technologies" },
        { label: "Fondateur", href: "#fondateur" },
      ],
      cta: "Réserver une démo",
      openMenu: "Ouvrir le menu",
    },
    hero: {
      badge: "SASU française · IA · Automatisation · SaaS",
      titleLead: "L'intelligence artificielle au service des",
      titleHighlight: "entreprises modernes.",
      paragraph:
        "AMAVYA développe des solutions IA, SaaS et automatisations intelligentes pour transformer la prospection, la gestion et la productivité.",
      stats: [
        { value: "24/7", label: "Agents autonomes" },
        { value: "+50 %", label: "Productivité visée" },
        { value: "100 %", label: "Sur mesure" },
      ],
    },
    services: {
      eyebrow: "Nos solutions",
      title: "Des outils IA conçus pour passer à l'échelle",
      description:
        "Une suite complète pour automatiser, prospecter et piloter votre activité avec l'intelligence artificielle.",
      learnMore: "En savoir plus",
      featuresTitle: "Ce que vous obtenez",
      videoSoon: "Démo vidéo bientôt disponible",
      modalCta: "Réserver une démo",
      close: "Fermer",
      cards: [
        {
          title: "Agents IA",
          desc: "Des agents autonomes qui exécutent vos tâches métiers, raisonnent et agissent 24/7.",
          tagline: "Vos collaborateurs numériques autonomes",
          long: "Des agents intelligents qui comprennent vos process, prennent des décisions et exécutent des tâches complexes sans intervention humaine. Ils travaillent 24h/24, s'intègrent à vos outils existants et apprennent en continu pour gagner en précision.",
          features: [
            "Exécution autonome de tâches métiers répétitives ou complexes",
            "Raisonnement multi-étapes et prise de décision contextuelle",
            "Intégration à vos outils (email, CRM, API, bases de données)",
            "Disponibilité 24/7, sans pause ni oubli",
            "Apprentissage continu à partir de vos données",
          ],
        },
        {
          title: "CRM intelligent",
          desc: "Un CRM augmenté par l'IA qui qualifie, priorise et enrichit vos contacts en continu.",
          tagline: "Un CRM qui travaille pour vous",
          long: "Bien plus qu'un carnet d'adresses : un CRM augmenté par l'IA qui qualifie automatiquement vos leads, priorise les opportunités à fort potentiel et enrichit chaque fiche contact en temps réel.",
          features: [
            "Qualification et scoring automatique des leads",
            "Enrichissement des contacts (données entreprise, poste, réseaux)",
            "Priorisation intelligente des opportunités",
            "Suivi et relances automatisés",
            "Tableaux de bord clairs pour piloter votre activité",
          ],
        },
        {
          title: "Automatisation métier",
          desc: "Connectez vos outils et automatisez vos workflows répétitifs sans friction.",
          tagline: "Éliminez les tâches répétitives",
          long: "Connectez tous vos outils et automatisez vos workflows de bout en bout. Fini les copier-coller et les ressaisies : vos processus s'exécutent seuls, sans erreur et sans friction.",
          features: [
            "Connexion de vos applications (Gmail, Slack, Notion, Sheets…)",
            "Automatisation de workflows complets sans code",
            "Déclencheurs intelligents basés sur vos événements métiers",
            "Réduction des erreurs et des tâches manuelles",
            "Gain de temps mesurable dès les premières semaines",
          ],
        },
        {
          title: "Prospection automatisée",
          desc: "Identification, séquençage et relance de prospects pilotés par l'intelligence artificielle.",
          tagline: "Remplissez votre pipeline en pilote automatique",
          long: "Identifiez vos prospects idéaux, lancez des séquences personnalisées et relancez automatiquement — le tout piloté par l'IA. Vos commerciaux se concentrent sur la conclusion, pas sur la recherche.",
          features: [
            "Ciblage des prospects correspondant à votre client idéal",
            "Séquences multicanal personnalisées (email, LinkedIn)",
            "Relances automatiques au bon moment",
            "Messages générés et adaptés par l'IA",
            "Suivi des performances et optimisation continue",
          ],
        },
        {
          title: "SaaS sur mesure",
          desc: "Des plateformes web et mobiles conçues pour votre activité, scalables et élégantes.",
          tagline: "Votre plateforme, conçue pour vous",
          long: "Nous concevons et développons des plateformes web et mobiles élégantes, performantes et scalables, taillées précisément pour votre activité — de la première maquette à la mise en production.",
          features: [
            "Applications web et mobiles sur mesure",
            "Design premium et expérience utilisateur soignée",
            "Architecture scalable prête pour la croissance",
            "Intégration de l'IA au cœur du produit",
            "Accompagnement de la conception au déploiement",
          ],
        },
        {
          title: "Formation IA & Business",
          desc: "Accompagnement et montée en compétences pour intégrer l'IA dans vos équipes.",
          tagline: "Montez vos équipes en compétence",
          long: "Nous accompagnons vos équipes pour intégrer concrètement l'IA dans leur quotidien : ateliers pratiques, montée en compétences et mise en place d'outils adaptés à vos métiers.",
          features: [
            "Ateliers pratiques adaptés à vos métiers",
            "Maîtrise des outils d'IA générative",
            "Cas d'usage concrets appliqués à votre activité",
            "Accompagnement au changement",
            "Suivi et support post-formation",
          ],
        },
      ],
    },
    vision: {
      eyebrow: "Notre vision",
      titleLead: "L'IA pour",
      titleHighlight: "renforcer l'humain",
      titleTail: ", pas le remplacer.",
      paragraph:
        "Nous croyons que l'intelligence artificielle doit renforcer l'humain, et non le remplacer. AMAVYA construit des outils intelligents conçus pour aider les entreprises à travailler plus vite, mieux et avec plus d'impact.",
      points: [
        "Une IA au service de décisions humaines éclairées",
        "Des automatisations qui libèrent du temps à forte valeur",
        "Une technologie élégante, fiable et maîtrisée",
      ],
    },
    technologies: {
      eyebrow: "Stack technologique",
      title: "Construit sur les meilleures technologies du marché",
      description:
        "AMAVYA s'appuie sur un socle moderne, performant et éprouvé pour livrer des produits fiables.",
    },
    founder: {
      eyebrow: "Le fondateur",
      name: "Tarek Bouhlel",
      paragraphLead:
        "Entre expérience terrain, développement technologique et vision business, AMAVYA est née d'une volonté simple :",
      paragraphHighlight: "créer des outils IA réellement utiles.",
      facets: [
        "20 ans de terrain · courant fort/faible",
        "Dev & architecture app & web",
        "Business developer orienté IA",
      ],
      contactLabel: "Me contacter directement",
    },
    cta: {
      eyebrow: "Passez à l'action",
      titleLead: "Prêt à transformer votre entreprise avec l'",
      titleHighlight: "IA",
      titleTail: " ?",
      paragraph:
        "Discutons de vos enjeux et identifions ensemble les automatisations à plus fort impact pour votre activité.",
      button: "Commencer maintenant",
    },
    footer: {
      description:
        "Solutions IA, SaaS et automatisations intelligentes pour les entreprises modernes. SASU française.",
      columns: [
        {
          title: "Solutions",
          links: [
            { label: "Agents IA", href: "#services" },
            { label: "CRM intelligent", href: "#services" },
            { label: "Automatisation", href: "#services" },
            { label: "Prospection", href: "#services" },
          ],
        },
        {
          title: "Entreprise",
          links: [
            { label: "Vision", href: "#vision" },
            { label: "Fondateur", href: "#fondateur" },
            { label: "Technologies", href: "#technologies" },
            { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Légal",
          links: [
            { label: "Mentions légales", href: "/mentions-legales" },
            { label: "Confidentialité", href: "/confidentialite" },
            { label: "CGU / CGV", href: "/cgu-cgv" },
            { label: "Cookies", href: "/cookies" },
          ],
        },
      ],
      rights: "Tous droits réservés.",
      developedBy: "Développé par Tarek Bouhlel",
    },
    contact: {
      eyebrow: "Passez à l'action",
      title: "Contacter AMAVYA",
      subtitle:
        "Décrivez votre besoin — on revient vers vous rapidement pour en discuter.",
      labels: {
        fullName: "Nom complet *",
        company: "Entreprise",
        email: "Email *",
        phone: "Téléphone",
        message: "Votre besoin *",
      },
      placeholders: {
        fullName: "Votre nom",
        company: "Votre société",
        email: "vous@exemple.com",
        phone: "06 12 34 56 78",
        message:
          "Parlez-nous de votre projet, vos enjeux, vos automatisations cibles…",
      },
      errors: {
        fullName: "Indiquez votre nom.",
        email: "Email invalide.",
        message: "Décrivez brièvement votre besoin.",
      },
      submitError: {
        lead: "Une erreur est survenue. Réessayez, ou écrivez-nous à",
        after: ".",
      },
      success: {
        title: "Message bien reçu",
        text: "Merci ! Votre demande nous est parvenue. Nous revenons vers vous très rapidement.",
        close: "Fermer",
      },
      submit: "Envoyer ma demande",
      submitting: "Envoi…",
      closeAria: "Fermer",
      dialogAria: "Contacter AMAVYA",
    },
    dashboard: {
      sidebar: ["Vue d'ensemble", "Agents IA", "Pipeline", "Prospection", "Analytics"],
      kpis: [
        { k: "Leads traités", v: "12 480", d: "+24%" },
        { k: "Taux réponse", v: "38,5 %", d: "+11%" },
        { k: "Tâches auto.", v: "1 932", d: "+57%" },
      ],
      chartTitle: "Performance des agents",
      chartRange: "7 derniers jours",
      activeBadge: "Actif",
      floatTitle: "3 agents en ligne",
      floatSubtitle: "Automatisation 24/7",
    },
  },
  en: {
    nav: {
      links: [
        { label: "Solutions", href: "#services" },
        { label: "Vision", href: "#vision" },
        { label: "Technologies", href: "#technologies" },
        { label: "Founder", href: "#fondateur" },
      ],
      cta: "Book a demo",
      openMenu: "Open menu",
    },
    hero: {
      badge: "French company · AI · Automation · SaaS",
      titleLead: "Artificial intelligence for the",
      titleHighlight: "modern enterprise.",
      paragraph:
        "AMAVYA builds AI solutions, SaaS products and intelligent automations that transform prospecting, operations and productivity.",
      stats: [
        { value: "24/7", label: "Autonomous agents" },
        { value: "+50%", label: "Targeted productivity" },
        { value: "100%", label: "Fully tailored" },
      ],
    },
    services: {
      eyebrow: "Our solutions",
      title: "AI tools built to scale",
      description:
        "A complete suite to automate, prospect and run your business with artificial intelligence.",
      learnMore: "Learn more",
      featuresTitle: "What you get",
      videoSoon: "Demo video coming soon",
      modalCta: "Book a demo",
      close: "Close",
      cards: [
        {
          title: "AI Agents",
          desc: "Autonomous agents that execute your business tasks, reason and act 24/7.",
          tagline: "Your autonomous digital coworkers",
          long: "Smart agents that understand your processes, make decisions and carry out complex tasks with no human intervention. They work around the clock, plug into your existing tools and keep learning to become more accurate over time.",
          features: [
            "Autonomous execution of repetitive or complex business tasks",
            "Multi-step reasoning and contextual decision-making",
            "Integration with your tools (email, CRM, APIs, databases)",
            "24/7 availability, no breaks, nothing forgotten",
            "Continuous learning from your data",
          ],
        },
        {
          title: "Intelligent CRM",
          desc: "An AI-powered CRM that qualifies, prioritizes and enriches your contacts continuously.",
          tagline: "A CRM that works for you",
          long: "Far more than an address book: an AI-augmented CRM that automatically qualifies your leads, prioritizes high-potential opportunities and enriches every contact record in real time.",
          features: [
            "Automatic lead qualification and scoring",
            "Contact enrichment (company data, role, social profiles)",
            "Smart prioritization of opportunities",
            "Automated follow-ups and reminders",
            "Clear dashboards to steer your business",
          ],
        },
        {
          title: "Business automation",
          desc: "Connect your tools and automate repetitive workflows without friction.",
          tagline: "Eliminate repetitive work",
          long: "Connect all your tools and automate your workflows end to end. No more copy-pasting or re-keying: your processes run on their own, error-free and friction-free.",
          features: [
            "Connect your apps (Gmail, Slack, Notion, Sheets…)",
            "Automate full workflows with no code",
            "Smart triggers based on your business events",
            "Fewer errors and manual tasks",
            "Measurable time savings within weeks",
          ],
        },
        {
          title: "Automated prospecting",
          desc: "AI-driven identification, sequencing and follow-up of your prospects.",
          tagline: "Fill your pipeline on autopilot",
          long: "Identify your ideal prospects, launch personalized sequences and follow up automatically — all driven by AI. Your sales team focuses on closing, not on searching.",
          features: [
            "Targeting prospects that match your ideal customer",
            "Personalized multichannel sequences (email, LinkedIn)",
            "Automatic follow-ups at the right time",
            "Messages generated and tailored by AI",
            "Performance tracking and continuous optimization",
          ],
        },
        {
          title: "Custom SaaS",
          desc: "Web and mobile platforms designed for your business — scalable and elegant.",
          tagline: "Your platform, built for you",
          long: "We design and build elegant, high-performance and scalable web and mobile platforms, tailored precisely to your business — from the first mockup to production.",
          features: [
            "Custom web and mobile applications",
            "Premium design and polished user experience",
            "Scalable architecture ready for growth",
            "AI built into the core of the product",
            "Support from design to deployment",
          ],
        },
        {
          title: "AI & Business training",
          desc: "Guidance and upskilling to embed AI within your teams.",
          tagline: "Upskill your teams",
          long: "We help your teams embed AI into their daily work for real: hands-on workshops, upskilling and rollout of tools tailored to your business.",
          features: [
            "Hands-on workshops tailored to your business",
            "Mastery of generative AI tools",
            "Concrete use cases applied to your activity",
            "Change-management support",
            "Post-training follow-up and support",
          ],
        },
      ],
    },
    vision: {
      eyebrow: "Our vision",
      titleLead: "AI to",
      titleHighlight: "empower people",
      titleTail: ", not replace them.",
      paragraph:
        "We believe artificial intelligence should empower people, not replace them. AMAVYA builds intelligent tools designed to help companies work faster, better and with greater impact.",
      points: [
        "AI that supports informed human decisions",
        "Automations that free up high-value time",
        "Elegant, reliable and well-mastered technology",
      ],
    },
    technologies: {
      eyebrow: "Technology stack",
      title: "Built on the best technologies on the market",
      description:
        "AMAVYA relies on a modern, high-performance and proven foundation to ship reliable products.",
    },
    founder: {
      eyebrow: "The founder",
      name: "Tarek Bouhlel",
      paragraphLead:
        "Combining field experience, technical development and business vision, AMAVYA was born from a simple ambition:",
      paragraphHighlight: "to build AI tools that are genuinely useful.",
      facets: [
        "20 years in the field · high & low voltage",
        "App & web development and architecture",
        "AI-focused business developer",
      ],
      contactLabel: "Contact me directly",
    },
    cta: {
      eyebrow: "Take action",
      titleLead: "Ready to transform your business with ",
      titleHighlight: "AI",
      titleTail: "?",
      paragraph:
        "Let's discuss your challenges and identify together the highest-impact automations for your business.",
      button: "Get started now",
    },
    footer: {
      description:
        "AI solutions, SaaS products and intelligent automations for modern enterprises. French company.",
      columns: [
        {
          title: "Solutions",
          links: [
            { label: "AI Agents", href: "#services" },
            { label: "Intelligent CRM", href: "#services" },
            { label: "Automation", href: "#services" },
            { label: "Prospecting", href: "#services" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "Vision", href: "#vision" },
            { label: "Founder", href: "#fondateur" },
            { label: "Technologies", href: "#technologies" },
            { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Legal notice", href: "/mentions-legales" },
            { label: "Privacy", href: "/confidentialite" },
            { label: "Terms", href: "/cgu-cgv" },
            { label: "Cookies", href: "/cookies" },
          ],
        },
      ],
      rights: "All rights reserved.",
      developedBy: "Built by Tarek Bouhlel",
    },
    contact: {
      eyebrow: "Take action",
      title: "Contact AMAVYA",
      subtitle:
        "Tell us about your needs — we'll get back to you quickly to discuss them.",
      labels: {
        fullName: "Full name *",
        company: "Company",
        email: "Email *",
        phone: "Phone",
        message: "Your needs *",
      },
      placeholders: {
        fullName: "Your name",
        company: "Your company",
        email: "you@example.com",
        phone: "+33 6 12 34 56 78",
        message:
          "Tell us about your project, your challenges, your target automations…",
      },
      errors: {
        fullName: "Please enter your name.",
        email: "Invalid email.",
        message: "Briefly describe your needs.",
      },
      submitError: {
        lead: "Something went wrong. Please try again, or email us at",
        after: ".",
      },
      success: {
        title: "Message received",
        text: "Thank you! We've received your request and will get back to you very soon.",
        close: "Close",
      },
      submit: "Send my request",
      submitting: "Sending…",
      closeAria: "Close",
      dialogAria: "Contact AMAVYA",
    },
    dashboard: {
      sidebar: ["Overview", "AI Agents", "Pipeline", "Prospecting", "Analytics"],
      kpis: [
        { k: "Leads processed", v: "12,480", d: "+24%" },
        { k: "Response rate", v: "38.5%", d: "+11%" },
        { k: "Auto. tasks", v: "1,932", d: "+57%" },
      ],
      chartTitle: "Agent performance",
      chartRange: "Last 7 days",
      activeBadge: "Active",
      floatTitle: "3 agents online",
      floatSubtitle: "24/7 automation",
    },
  },
};
