# PROMPT CLAUDE CODE — « AMAVYA OPERATOR »

> Prompt prêt à copier-coller dans Claude Code, à la racine du repo `ARTCOL`.
> Objectif : transformer le **Xiaomi Shrine v3.8** en une **assistante / AI Operator
> autonome** qui pilote l'activité de la SASU **AMAVYA** — inspiré du concept
> « AI Operator » de Nathan Levallois (agent IA qui fait tourner le business à ta place).

---

## ░ À COLLER DANS CLAUDE CODE ░

```
Tu es mon ingénieur full-stack. Tu vas faire évoluer mon assistante personnelle
"Xiaomi Shrine" pour qu'elle devienne un véritable AI OPERATOR autonome au service
de ma société (SASU AMAVYA, basée à Antibes/Nice). Lis tout ce brief avant d'écrire
la moindre ligne, puis confirme-moi ton plan d'exécution en phases avant de coder.

────────────────────────────────────────────────────────
CONTEXTE — CE QUI EXISTE DÉJÀ (ne casse RIEN)
────────────────────────────────────────────────────────
Le projet vit dans le dossier `mon-monde/`. C'est une PWA chiffrée, sans build step,
HTML/CSS/JS vanilla. Trois modules tournent chacun dans une iframe même-origine,
reliés par un bus `BroadcastChannel('xiaomi-os')` :

- `mon-monde/index.html`  → shell + topbar BRAIN / SHRINE / COMPTA + 3 iframes
- `mon-monde/brain.html`  → Xiaomi Brain v0.8.8 (knowledge graph / notes)
- `mon-monde/shrine.html` → Xiaomi Shrine v3.8 "Gardienne du Seuil" (l'assistante)
- `mon-monde/compta.html` → Compta SASU v1.0 (factures, écritures, TVA, IS, FEC)

Le Shrine (`shrine.html`) est déjà un agent Claude agentique. Avant de coder, LIS et
cartographie ces éléments existants (ne les réécris pas, branche-toi dessus) :
- `buildSystemPrompt()` ............ construit le system prompt (5 personas, identité)
- `callClaude()` ................... la boucle agentique (gère les tool_use)
- `XIAOMI_TOOLS` ................... les outils client-side déjà déclarés :
      open_app, open_url, web_search_query, add_to_kanban, create_mail_draft,
      add_to_intention_today, save_memory, add_marker_to_map, read_planning,
      read_brain_notes, read_shrine_history
- les commandes vocales interceptées (matchCommand / detectPowerIntent)
- le coffre chiffré (encryptForVault / decryptFromVault / deriveKeyFromPassword)
- la carte territoire (addCustomMarkerToMap), le Kanban (renderKanban/moveKanban),
  les contacts (renderContacts), les POWERS (pwSaveMemory/pwGetTemplates/…)
- le bus inter-iframes : `BroadcastChannel('xiaomi-os')`, événements existants
  `shrine:key:unlocked`, `compta:ecriture:new`, `compta:facture:new`

CONTRAINTES NON NÉGOCIABLES :
1. PAS de build step, PAS de framework, PAS de dépendance npm nouvelle. Vanilla only.
2. Tout reste compatible PWA installable + déploiement Vercel (cf. DEPLOY.md). La clé
   Anthropic NE doit JAMAIS être exposée côté client en prod : passe par l'edge
   function proxy déjà prévue.
3. Ne modifie pas le format chiffré du coffre existant (rétro-compatibilité des données
   déjà stockées). Toute nouvelle donnée sensible passe par le même coffre chiffré.
4. Le bus xiaomi-os reste la colonne vertébrale : Shrine ↔ Brain ↔ Compta communiquent
   par événements, jamais par couplage direct.
5. Tu travailles sur la branche git désignée. Commits atomiques et descriptifs.

────────────────────────────────────────────────────────
VISION — CE QUE JE VEUX (l'AI Operator)
────────────────────────────────────────────────────────
Aujourd'hui le Shrine est RÉACTIF (je parle → il répond/agit). Je veux qu'il devienne
PROACTIF et AUTONOME comme un "AI Operator" : une assistante qui fait tourner AMAVYA
à ma place, anticipe, prépare, relance, rend compte. Construis ça en 5 modules.

╔═ MODULE 1 — OPÉRATEUR BUSINESS (prospection / relances / RDV) ═╗
- Pipeline de prospection : à partir des markers "prospect" de la carte + des contacts,
  l'assistante propose chaque jour qui contacter, rédige le 1er message + les relances
  (J+3, J+7), et trace l'historique de chaque prospect (statut : à contacter → relancé →
  RDV → gagné/perdu).
- Nouveaux tools agent : `schedule_followup`, `log_prospect_touch`, `draft_outreach`,
  `book_meeting` (crée un brouillon d'invitation + ajoute au planning).
- Tout passe par des BROUILLONS que je valide (cf. garde-fous). Rien n'est envoyé sans
  mon clic, en mode par défaut.

╔═ MODULE 2 — PILOTE SASU / COMPTA (connecté au module Compta) ═╗
- L'assistante lit l'état compta via le bus (CA HT, charges, IS prévisionnel, TVA à
  décaisser, trésorerie, échéances fiscales) et sait en parler / alerter.
- Nouveaux tools : `read_compta_kpi`, `create_invoice_draft` (émet un événement que
  Compta capte pour pré-remplir une facture), `flag_unpaid` (relance impayés).
- Elle me prévient avant chaque échéance fiscale (TVA CA3, acompte IS, CFE, greffe).

╔═ MODULE 3 — BRIEFING & REPORTING PROACTIF ═╗
- Briefing matin (au déverrouillage) : agenda du jour (read_planning), priorités,
  prospects à relancer, chiffres clés compta, ce qui a bougé depuis hier.
- Bilan du soir : ce qui a été fait, ce qui reste, relances de demain.
- L'assistante PARLE le briefing (TTS persona courante) et l'affiche.
- Implémenté SANS serveur cron : déclencheurs côté client (au unlock + bouton + horaire
  configurable vérifié à l'ouverture). Documente clairement cette limite.

╔═ MODULE 4 — MÉMOIRE & APPRENTISSAGE ═╗
- L'assistante consolide une "mémoire AMAVYA" structurée (offres, tarifs, arguments,
  objections types, infos prospects) dans les POWERS chiffrés existants, et l'injecte
  dans buildSystemPrompt() pour des réponses de plus en plus pertinentes.
- Tool `recall_amavya` pour retrouver n'importe quelle info métier mémorisée.

╔═ MODULE 5 — "FAIT-TOUT" VOCAL DOPÉ ═╗
- Étends les commandes vocales interceptées + le tool-use pour couvrir les nouveaux
  verbes ("relance Marie", "prépare la facture de X", "mon brief", "où en est le
  prospect Y", "qu'est-ce que je dois décaisser ce mois").
- L'expérience reste : je parle, elle exécute, elle confirme à voix haute.

────────────────────────────────────────────────────────
GARDE-FOUS (niveau d'autonomie) — IMPORTANT
────────────────────────────────────────────────────────
Mode par défaut = "PROACTIVE mais VALIDATION" :
- Actions SÛRES exécutées seules : lire, analyser, mémoriser, préparer des brouillons,
  briefings, notes, ajout au kanban/carte.
- Actions EXTERNES ou ENGAGEANTES (envoi d'un mail/WhatsApp, émission d'une facture,
  tout ce qui touche à l'argent ou sort vers un tiers) → TOUJOURS un brouillon + un
  bouton "Valider et envoyer". Jamais d'envoi silencieux.
- Prévois un réglage `OPERATOR_AUTONOMY` à 3 crans (validation / autonome-supervisée /
  full) stocké dans les prefs, mais livre en "validation" par défaut.
- Toute action autonome est journalisée (logEvent) et consultable dans l'historique.

────────────────────────────────────────────────────────
MÉTHODE DE TRAVAIL ATTENDUE
────────────────────────────────────────────────────────
1. D'abord : lis shrine.html (ignore les blocs base64 d'icônes), produis-moi une carte
   courte de l'architecture agent existante + les points d'ancrage exacts (n° de ligne)
   où tu vas brancher chaque module.
2. Propose un PLAN en phases (1 module = 1+ phases), avec pour chaque phase : ce que tu
   ajoutes, où, et comment tu vérifies que rien n'est cassé. ATTENDS ma validation.
3. Implémente phase par phase. Après chaque phase : un commit atomique + un court
   récap de comment tester en local (`python3 -m http.server` dans mon-monde/).
4. Ne touche jamais au format chiffré ni au protocole du bus sans me prévenir.
5. À la fin : mets à jour mon-monde/README.md (nouvelle version du Shrine, nouveaux
   tools, nouveau module Operator) et vérifie le déploiement Vercel.

────────────────────────────────────────────────────────
CRITÈRES D'ACCEPTATION (la livraison est "irréprochable" si…)
────────────────────────────────────────────────────────
[ ] Les 3 modules existants (Brain/Shrine/Compta) fonctionnent exactement comme avant.
[ ] Le bus xiaomi-os relaie les nouveaux événements sans régression.
[ ] L'assistante produit un briefing matin parlé + affiché, avec données réelles
    (planning + compta), pas inventées.
[ ] Le pipeline prospection propose des relances et les trace ; chaque envoi externe
    reste un brouillon validable.
[ ] La clé Anthropic n'est jamais en clair côté client en prod (proxy edge OK).
[ ] Aucune donnée du coffre chiffré existant n'est perdue ou illisible après upgrade.
[ ] README.md à jour, app installable en PWA et déployée sur Vercel.
[ ] Code vanilla, zéro build, zéro nouvelle dépendance.

Commence par l'étape 1 (cartographie + plan en phases) et attends ma validation
avant de coder.
```

---

## Notes d'usage

- **Avant de lancer** : confirme à Claude Code quel est le mode d'autonomie voulu si tu
  veux autre chose que « validation » par défaut.
- **Si la vidéo TikTok montre une mécanique précise** que ce prompt ne couvre pas
  (ex. un canal d'envoi spécifique, un outil tiers nommé), ajoute-la dans le MODULE
  concerné — le squelette est fait pour ça.
- **Sécurité** : ne mets jamais ta vraie clé Anthropic dans un fichier commité ; passe
  par l'edge proxy (cf. `mon-monde/DEPLOY.md`) et `.env`.
