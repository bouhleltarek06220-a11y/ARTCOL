/**
 * Traductions trilingues FR / EN / ES d'AMAVYA.
 * Toutes les chaînes visibles de la landing page sont centralisées ici.
 * Structure par section : nav, hero, services, vision, technologies,
 * founder, cta, footer, contact, dashboard.
 */
export const SUPPORTED_LANGS = ["fr", "en", "es"];

export const translations = {
  fr: {
    nav: {
      links: [
        { label: "Solutions", href: "#services" },
        { label: "Vision", href: "#vision" },
        { label: "Technologies", href: "#technologies" },
        { label: "Fondateur", href: "#fondateur" },
        { label: "Cosmos", href: "/blog" },
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
      showreelCta: "Voir AMAVYA en 40s",
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
        { label: "Cosmos", href: "/blog" },
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
      showreelCta: "Watch AMAVYA in 40s",
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
  es: {
    nav: {
      links: [
        { label: "Soluciones", href: "#services" },
        { label: "Visión", href: "#vision" },
        { label: "Tecnologías", href: "#technologies" },
        { label: "Fundador", href: "#fondateur" },
        { label: "Cosmos", href: "/blog" },
      ],
      cta: "Reservar una demo",
      openMenu: "Abrir el menú",
    },
    hero: {
      badge: "Empresa francesa · IA · Automatización · SaaS",
      titleLead: "Inteligencia artificial al servicio de las",
      titleHighlight: "empresas modernas.",
      paragraph:
        "AMAVYA desarrolla soluciones de IA, productos SaaS y automatizaciones inteligentes que transforman la prospección, la gestión y la productividad.",
      stats: [
        { value: "24/7", label: "Agentes autónomos" },
        { value: "+50 %", label: "Productividad objetivo" },
        { value: "100 %", label: "A medida" },
      ],
      showreelCta: "Ver AMAVYA en 40s",
    },
    services: {
      eyebrow: "Nuestras soluciones",
      title: "Herramientas de IA diseñadas para escalar",
      description:
        "Una suite completa para automatizar, prospectar y dirigir su negocio con inteligencia artificial.",
      learnMore: "Saber más",
      featuresTitle: "Lo que obtiene",
      videoSoon: "Vídeo demo próximamente",
      modalCta: "Reservar una demo",
      close: "Cerrar",
      cards: [
        {
          title: "Agentes IA",
          desc: "Agentes autónomos que ejecutan sus tareas empresariales, razonan y actúan 24/7.",
          tagline: "Sus compañeros digitales autónomos",
          long: "Agentes inteligentes que entienden sus procesos, toman decisiones y ejecutan tareas complejas sin intervención humana. Trabajan las 24 horas, se integran con sus herramientas y aprenden continuamente para ganar precisión.",
          features: [
            "Ejecución autónoma de tareas empresariales repetitivas o complejas",
            "Razonamiento multietapa y toma de decisiones contextual",
            "Integración con sus herramientas (email, CRM, API, bases de datos)",
            "Disponibilidad 24/7, sin pausas ni olvidos",
            "Aprendizaje continuo a partir de sus datos",
          ],
        },
        {
          title: "CRM inteligente",
          desc: "Un CRM potenciado por IA que califica, prioriza y enriquece sus contactos de forma continua.",
          tagline: "Un CRM que trabaja para usted",
          long: "Mucho más que una agenda: un CRM aumentado por IA que califica automáticamente sus leads, prioriza las oportunidades de alto potencial y enriquece cada ficha de contacto en tiempo real.",
          features: [
            "Calificación y scoring automático de leads",
            "Enriquecimiento de contactos (datos de empresa, cargo, redes)",
            "Priorización inteligente de oportunidades",
            "Seguimiento y recordatorios automatizados",
            "Cuadros de mando claros para dirigir su actividad",
          ],
        },
        {
          title: "Automatización empresarial",
          desc: "Conecte sus herramientas y automatice sus flujos repetitivos sin fricciones.",
          tagline: "Elimine las tareas repetitivas",
          long: "Conecte todas sus herramientas y automatice sus flujos de principio a fin. Adiós a los copiar-pegar y reintroducciones: sus procesos se ejecutan solos, sin errores y sin fricciones.",
          features: [
            "Conexión de sus aplicaciones (Gmail, Slack, Notion, Sheets…)",
            "Automatización completa de flujos sin código",
            "Disparadores inteligentes basados en sus eventos de negocio",
            "Menos errores y tareas manuales",
            "Ahorro de tiempo medible desde las primeras semanas",
          ],
        },
        {
          title: "Prospección automatizada",
          desc: "Identificación, secuenciación y seguimiento de prospectos dirigidos por inteligencia artificial.",
          tagline: "Llene su pipeline en piloto automático",
          long: "Identifique sus prospectos ideales, lance secuencias personalizadas y haga seguimiento automáticamente — todo gestionado por IA. Su equipo comercial se concentra en cerrar, no en buscar.",
          features: [
            "Segmentación de prospectos según su cliente ideal",
            "Secuencias multicanal personalizadas (email, LinkedIn)",
            "Seguimientos automáticos en el momento adecuado",
            "Mensajes generados y adaptados por IA",
            "Análisis de rendimiento y optimización continua",
          ],
        },
        {
          title: "SaaS a medida",
          desc: "Plataformas web y móviles diseñadas para su negocio, escalables y elegantes.",
          tagline: "Su plataforma, hecha para usted",
          long: "Diseñamos y desarrollamos plataformas web y móviles elegantes, de alto rendimiento y escalables, hechas a medida para su negocio — desde el primer prototipo hasta la puesta en producción.",
          features: [
            "Aplicaciones web y móviles a medida",
            "Diseño premium y experiencia de usuario cuidada",
            "Arquitectura escalable lista para crecer",
            "IA integrada en el núcleo del producto",
            "Acompañamiento desde el diseño hasta el despliegue",
          ],
        },
        {
          title: "Formación IA & Negocio",
          desc: "Acompañamiento y capacitación para integrar la IA en sus equipos.",
          tagline: "Capacite a sus equipos",
          long: "Acompañamos a sus equipos para integrar la IA de forma concreta en su día a día: talleres prácticos, capacitación y despliegue de herramientas adaptadas a sus oficios.",
          features: [
            "Talleres prácticos adaptados a su negocio",
            "Dominio de las herramientas de IA generativa",
            "Casos de uso concretos aplicados a su actividad",
            "Acompañamiento al cambio",
            "Seguimiento y soporte post-formación",
          ],
        },
      ],
    },
    vision: {
      eyebrow: "Nuestra visión",
      titleLead: "La IA para",
      titleHighlight: "potenciar al ser humano",
      titleTail: ", no para reemplazarlo.",
      paragraph:
        "Creemos que la inteligencia artificial debe potenciar a las personas, no reemplazarlas. AMAVYA construye herramientas inteligentes diseñadas para que las empresas trabajen más rápido, mejor y con más impacto.",
      points: [
        "Una IA al servicio de decisiones humanas informadas",
        "Automatizaciones que liberan tiempo de alto valor",
        "Una tecnología elegante, fiable y dominada",
      ],
    },
    technologies: {
      eyebrow: "Stack tecnológico",
      title: "Construido sobre las mejores tecnologías del mercado",
      description:
        "AMAVYA se apoya en una base moderna, de alto rendimiento y probada para entregar productos fiables.",
    },
    founder: {
      eyebrow: "El fundador",
      name: "Tarek Bouhlel",
      paragraphLead:
        "Entre experiencia de campo, desarrollo tecnológico y visión de negocio, AMAVYA nace de una voluntad simple:",
      paragraphHighlight: "crear herramientas de IA realmente útiles.",
      facets: [
        "20 años en el campo · corriente fuerte/débil",
        "Desarrollo y arquitectura app & web",
        "Business developer orientado a IA",
      ],
      contactLabel: "Contactar directamente",
    },
    cta: {
      eyebrow: "Pase a la acción",
      titleLead: "¿Listo para transformar su empresa con la ",
      titleHighlight: "IA",
      titleTail: "?",
      paragraph:
        "Hablemos de sus retos e identifiquemos juntos las automatizaciones de mayor impacto para su actividad.",
      button: "Empezar ahora",
    },
    footer: {
      description:
        "Soluciones de IA, productos SaaS y automatizaciones inteligentes para empresas modernas. Empresa francesa.",
      columns: [
        {
          title: "Soluciones",
          links: [
            { label: "Agentes IA", href: "#services" },
            { label: "CRM inteligente", href: "#services" },
            { label: "Automatización", href: "#services" },
            { label: "Prospección", href: "#services" },
          ],
        },
        {
          title: "Empresa",
          links: [
            { label: "Visión", href: "#vision" },
            { label: "Fundador", href: "#fondateur" },
            { label: "Tecnologías", href: "#technologies" },
            { label: "Contacto", href: "#contact" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Aviso legal", href: "/mentions-legales" },
            { label: "Privacidad", href: "/confidentialite" },
            { label: "Términos", href: "/cgu-cgv" },
            { label: "Cookies", href: "/cookies" },
          ],
        },
      ],
      rights: "Todos los derechos reservados.",
      developedBy: "Desarrollado por Tarek Bouhlel",
    },
    contact: {
      eyebrow: "Pase a la acción",
      title: "Contactar AMAVYA",
      subtitle:
        "Cuéntenos su necesidad — le responderemos rápidamente para hablar de ella.",
      labels: {
        fullName: "Nombre completo *",
        company: "Empresa",
        email: "Correo *",
        phone: "Teléfono",
        message: "Su necesidad *",
      },
      placeholders: {
        fullName: "Su nombre",
        company: "Su empresa",
        email: "usted@ejemplo.com",
        phone: "+34 600 12 34 56",
        message:
          "Háblenos de su proyecto, sus retos, las automatizaciones objetivo…",
      },
      errors: {
        fullName: "Indique su nombre.",
        email: "Correo inválido.",
        message: "Describa brevemente su necesidad.",
      },
      submitError: {
        lead: "Se ha producido un error. Inténtelo de nuevo o escríbanos a",
        after: ".",
      },
      success: {
        title: "Mensaje recibido",
        text: "¡Gracias! Hemos recibido su solicitud y le responderemos muy pronto.",
        close: "Cerrar",
      },
      submit: "Enviar mi solicitud",
      submitting: "Enviando…",
      closeAria: "Cerrar",
      dialogAria: "Contactar AMAVYA",
    },
    dashboard: {
      sidebar: ["Vista general", "Agentes IA", "Pipeline", "Prospección", "Analítica"],
      kpis: [
        { k: "Leads procesados", v: "12 480", d: "+24%" },
        { k: "Tasa de respuesta", v: "38,5 %", d: "+11%" },
        { k: "Tareas auto.", v: "1 932", d: "+57%" },
      ],
      chartTitle: "Rendimiento de los agentes",
      chartRange: "Últimos 7 días",
      activeBadge: "Activo",
      floatTitle: "3 agentes en línea",
      floatSubtitle: "Automatización 24/7",
    },
  },
};
