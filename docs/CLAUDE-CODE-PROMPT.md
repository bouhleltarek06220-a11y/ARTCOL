# 🎯 PROMPT INTÉGRAL — à coller dans Claude Code (Mac / VS Code)

> Copie **tout le bloc ci-dessous** dans Claude Code à la racine du repo. Il est
> autoportant : il contient l'état exact du projet, chaque fichier, chaque ancrage
> de code, chaque événement du bus avec son payload, les tools, les tests et la
> suite. Remplis juste la section « CE QUE JE VEUX MAINTENANT » à la fin.

---

```
========================================================================
 BRIEFING COMPLET — XIAOMI SHRINE / AMAVYA OPERATOR
========================================================================

# RÔLE
Tu es mon ingénieur full-stack senior. Tu reprends un projet déjà bien avancé.
Tu travailles comme un CHIRURGIEN : tu lis avant d'écrire, tu fais des modifs
minimales et additives, tu testes chaque sous-étape, tu ne casses RIEN, et tu
commits par petites unités. Avant de coder quoi que ce soit, tu me proposes un
PLAN en phases avec les points d'ancrage exacts, et tu ATTENDS ma validation.

# 0) DÉMARRAGE
- Repo Git : bouhleltarek06220-a11y/ARTCOL
- Branche de travail (NE PAS partir de main) : claude/xiaomi-shrine-assistant-1h7jon
- Pull Request : #160 (draft) — https://github.com/bouhleltarek06220-a11y/ARTCOL/pull/160
- Récupérer le travail :
    git fetch origin
    git checkout claude/xiaomi-shrine-assistant-1h7jon
    git pull origin claude/xiaomi-shrine-assistant-1h7jon
- Lancer en LOCAL (obligatoire : le bus inter-iframes, les service workers et le
  robot 3D ne marchent pas en file://) :
    cd mon-monde && python3 -m http.server 5500
    # ouvrir http://localhost:5500/
- IMPORTANT : le Shrine est protégé par un "Seal Gate" (mot de passe maître).
  Le robot 3D et le pont Compta n'apparaissent qu'APRÈS déverrouillage.
- Commits déjà présents sur la branche (du plus ancien au plus récent) :
    1) docs/PROMPT-AMAVYA-OPERATOR.md       (vision "AI Operator")
    2) 581bff1  Phase A : Gardienne 3D (robot humanoïde animé)
    3) b10b0ff  Phase B : bus Compta SASU <-> Shrine
    4) c8c59d3  docs/HANDOFF-XIAOMI-SHRINE.md (passation)
- Déploiement : Vercel build "mon-monde" en VERT à chaque commit. Le SEUL échec
  "lostchapter3d" est PRÉ-EXISTANT et SANS RAPPORT (autre dossier). Ne pas s'en occuper.

# 1) ARCHITECTURE GLOBALE (dossier mon-monde/)
PWA chiffrée, 100% VANILLA HTML/CSS/JS, ZÉRO build step, ZÉRO dépendance npm.
3 modules dans des <iframe> MÊME ORIGINE, reliés par BroadcastChannel('xiaomi-os') :
  mon-monde/index.html    -> Shell : topbar BRAIN/SHRINE/COMPTA + 3 iframes (Ctrl+1/2/3)
  mon-monde/brain.html    -> Xiaomi Brain v0.8.8 (knowledge graph / notes)
  mon-monde/shrine.html   -> Xiaomi Shrine : l'assistante (agent Claude + voix + carte + Kanban + POWERS)
  mon-monde/compta.html   -> Compta SASU AMAVYA (factures, écritures, TVA, IS, FEC)
  mon-monde/api/claude.js -> Edge function Vercel : proxy Anthropic (garde la clé serveur)
  mon-monde/sw.js         -> Service worker (réécrit api.anthropic.com -> /api/claude en prod)
  mon-monde/src/shrine-v3.8.html  -> BACKUP GELÉ du Shrine d'origine (= rollback)
  mon-monde/src/brain-v0.8.8.html -> BACKUP GELÉ du Brain d'origine
Infra externe (NOMS, jamais de secrets en clair côté client) :
  - Anthropic : env ANTHROPIC_API_KEY (Vercel, via api/claude.js)
  - Supabase "cloud Shrine/Brain" : https://vbcictorbnmgmkmohmgy.supabase.co
      table vault(user_id, namespace, data CHIFFRÉE) ;
      namespaces : main (=planning Bachelor), shrine_data, brain_notes, shared_config
  - PlayAzur CRM (autre app, dossier playazur-crm/) : Supabase dmztalsmreugfwojsaar,
      edge function ai-proxy (services: claude / whisper / brevo),
      secrets ANTHROPIC_API_KEY, OPENAI_API_KEY, BREVO_API_KEY
  - amavya (dossier amavya/) : Supabase qrotbfsvaouwyoyqtqlr, table partner_leads,
      SMTP OVH (ssl0.ovh.net, SMTP_USER=contact@amavya.cloud, SMTP_PASS)

# 2) CE QUI EST DÉJÀ FAIT — PHASE A : GARDIENNE 3D (robot humanoïde central)
But : remplacer la photo-persona centrale par un ROBOT 3D animé qui réagit
(parle/écoute/alerte/salut), avec fallback total si WebGL absent.

FICHIERS AJOUTÉS :
  - mon-monde/robot3d.js                         (toute la logique 3D, module ES)
  - mon-monde/models/RobotExpressive.glb         (copié de artcol-3d/public/models/ ; robot riggé)
       Animations du .glb : Idle, Walking, Running, Dance, Death, Sitting, Standing,
       Jump, Yes, No, Wave, Punch, ThumbsUp, WalkJump
  - mon-monde/vendor/three/lib/three.module.js   (Three.js 0.184 auto-hébergé)
  - mon-monde/vendor/three/lib/three.core.js     (importé par three.module.js)
  - mon-monde/vendor/three/examples/jsm/loaders/GLTFLoader.js
  - mon-monde/vendor/three/examples/jsm/utils/BufferGeometryUtils.js
  - mon-monde/vendor/three/examples/jsm/utils/SkeletonUtils.js
  ⚠️ Le dossier s'appelle lib/ et NON build/ : le .gitignore racine ignore "build/".
     Ne JAMAIS renommer en build/ (les fichiers ne seraient pas commités).
  POURQUOI auto-hébergé : marche hors-ligne (PWA), pas de dépendance CDN au runtime.

GREFFES dans shrine.html (toutes ADDITIVES, repérables par marqueur) :
  (a) Import-map, juste après le <link> Leaflet dans <head> :
      <script type="importmap">
      {"imports":{"three":"./vendor/three/lib/three.module.js",
                  "three/addons/":"./vendor/three/examples/jsm/"}}</script>
  (b) Point de montage, dans .shrine juste après le </div> de .portrait-wrap :
      <div class="robot3d" id="robot3d" aria-hidden="true"></div>
  (c) CSS, juste après "@keyframes mouthMove{...}" : règles .robot3d,
      ".shrine.robot-on .robot3d{opacity:1}", et masquage photo
      "#shrine.robot-on .portrait img{opacity:0}".
  (d) Script module, juste avant </body> :
      <script type="module" src="./robot3d.js"></script>

FONCTIONNEMENT de robot3d.js (lis le fichier en entier avant d'y toucher) :
  - hasWebGL() : si pas de WebGL -> abandon silencieux -> la photo persona d'origine
    reste affichée (ZÉRO régression). Idem si le .glb ou Three ne charge pas (try/catch).
  - Three.js : scène + PerspectiveCamera(30°) à (0,1.85,9.2), lookAt(0,1.55,0),
    modèle scale 0.9, lumières key/rim/fill colorées selon le thème, sol ShadowMaterial.
  - GLTFLoader charge ./models/RobotExpressive.glb, joue "Idle" en boucle.
  - PILOTAGE 100% PAR LE DOM EXISTANT (aucune modif de la logique du Shrine) :
    un MutationObserver surveille les classes de #portrait (talking/listening/alert),
    déjà posées par le Shrine quand l'assistante parle/écoute :
       talking   -> emotes périodiques (Yes/Wave) toutes les 1600 ms + lumière néon
       listening -> lumière cyan
       alert     -> emote No + lumière rouge
       apparition (sortie du Seal Gate) -> salut "Wave" une fois (ResizeObserver)
  - Suit le thème (data-theme matrix/hibi), pause le rendu si onglet masqué.
  - API exposée : window.XIAOMI_ROBOT.emote('Wave') / .base('Idle') / .available().

POUR CHANGER LE ROBOT (ex. ton humanoïde AMAVYA.cloud > Labo) :
  1. Remplace mon-monde/models/RobotExpressive.glb par ton .glb (même nom),
     ou change la const MODEL_URL en haut de robot3d.js.
  2. Si les noms d'animations diffèrent, adapte les tableaux EMOTES / BASES et les
     appels playEmote('Wave')/actions['Idle'] dans robot3d.js.
  3. Ajuste camera.position / lookAt / model.scale selon la taille du modèle.
  (Compatibles : Ready Player Me, Mixamo, tout glTF/GLB riggé.)

README mon-monde/README.md mis à jour (section Gardienne 3D ; note que shrine.html
n'est plus identique au backup gelé src/shrine-v3.8.html, qui reste le rollback).

# 3) CE QUI EST DÉJÀ FAIT — PHASE B : BUS COMPTA SASU <-> SHRINE
But : l'assistante LIT les vrais chiffres de la SASU et PRÉPARE des brouillons de
facture que je valide. Avant : les events compta du bus n'avaient AUCUN consommateur.

GREFFES dans shrine.html :
  - Variable : "let _comptaAlive = false;" (à côté de _brainAlive).
  - Dans initBrainChannel() (le onmessage de _brainChannel), nouveaux cas :
       compta:hello            -> _comptaAlive=true + postMessage compta:request:state
       compta:state            -> state.compta = msg.state
       compta:facture:new / compta:ecriture:new / compta:ecriture:deleted
                               -> repostMessage compta:request:state (refresh)
    + à l'init : postMessage({type:'compta:request:state'}) en plus du shrine:hello.
  - Champ "compta: null" ajouté à l'objet state.
  - 2 NOUVEAUX TOOLS dans le tableau XIAOMI_TOOLS (+ handlers dans executeXiaomiTool) :
       read_compta_kpi()  -> renvoie state.compta : {societe, exercice, kpi{ca,charges,
         resultat,is,tvaColl,tvaDed,tvaNet,treso,nbCa,nbCh}, impayes, impayesTotal,
         nbFactures, nbEcritures, recentFactures[], recentEcritures[], ts}.
         Si Compta fermée -> message "ouvre l'onglet COMPTA". JAMAIS de montant inventé.
       create_invoice_draft(client_nom, prestations[], client_adresse?, client_siret?,
         client_tva?, echeance_jours?) -> émet shrine:compta:invoice-draft sur le bus.
         N'ÉMET RIEN : Compta ouvre un brouillon pré-rempli que JE valide.
  - buildSystemPrompt() enrichi : (i) description des tools dans la section
    "Tools SASU AMAVYA (compta live)" ; (ii) ligne LIVE injectée dans "CONTEXTE
    TEMPS RÉEL" : "Compta SASU AMAVYA (live) : CA … résultat … IS … TVA à décaisser …
    tréso … impayés …".

GREFFES dans compta.html :
  - Dans initBus() (le onmessage de _bus), nouveaux cas :
       compta:request:state         -> pushComptaState()
       shrine:compta:invoice-draft  -> applyInvoiceDraft(m.draft)
    + à l'init : appel pushComptaState().
  - 3 fonctions ajoutées après notifyBus() :
       buildComptaState() : {societe(raisonSociale,siret,regimeTVA,cloture), exercice,
         kpi (via computeKPIs()), impayes, impayesTotal, nbFactures, nbEcritures,
         recentFactures[5], recentEcritures[5], ts}.
       pushComptaState() : notifyBus({type:'compta:state', state: buildComptaState()}).
       applyInvoiceDraft(draft) : openFactureModal() puis pré-remplit client +
         prestations + échéance (today+echeanceJours), force statut='brouillon',
         switchView('factures'), ouvre le modal, toast. RIEN n'est enregistré
         (réutilise l'UI existante ; je clique "Créer la facture" moi-même).
  - pushComptaState() appelé aussi après création d'une écriture (à côté de
    notifyBus compta:ecriture:new) et après saveFacture() (à côté de compta:facture:new).

# 4) CARTOGRAPHIE COMPLÈTE DES CONNEXIONS
## 4.1 Bus BroadcastChannel('xiaomi-os') — catalogue d'événements
  shrine:hello                {type, source}                Shrine -> Brain,Compta
  shrine:key:unlocked         {type, apiKey, source}        Shrine -> Brain,Compta  (clé API EN RAM uniquement)
  shrine:key:locked           {type, source}                Shrine -> Brain,Compta
  brain:hello                 {type, source}                Brain  -> Shrine,Compta
  brain:request:key           {type}                        Brain/Compta -> Shrine
  compta:hello                {type, source}                Compta -> Shrine,Brain
  compta:ecriture:new         {type, ecriture}              Compta -> Shrine (Phase B)
  compta:facture:new          {type, facture}               Compta -> Shrine (Phase B)
  compta:ecriture:deleted     {type, id}                    Compta -> Shrine (Phase B)
  compta:request:state  ⭐     {type}                        Shrine -> Compta
  compta:state          ⭐     {type, state}                 Compta -> Shrine
  shrine:compta:invoice-draft ⭐ {type, draft}               Shrine -> Compta
  ⭐ = nouveaux (Phase B). La clé Anthropic ne transite QUE via shrine:key:unlocked,
  en RAM, jamais persistée côté Brain/Compta.
  Payload "draft" de invoice-draft : { client:{nom,adresse,siret,tvaIntra},
  echeanceJours, prestations:[{description,quantite,prixHT,tauxTVA}] }.

## 4.2 Stockage localStorage
  Shrine  : xiaomi_shrine_*  (api_key_enc, seal, history, prefs, memory, contacts, …)
  Brain   : xiaomi-brain-notes-v1   (notes : {id,title,content,tags,links,createdAt,updatedAt})
  Compta  : xiaomi-compta-state-v1  ({societe, ecritures[], factures[], nextFactureNum} ; apiKey jamais persistée)
  Cloud   : table Supabase vault, namespaces main/shrine_data/brain_notes/shared_config

## 4.3 Tools de l'agent Shrine (boucle callClaude() / exécution executeXiaomiTool())
  open_app, open_url, web_search_query, add_to_kanban, create_mail_draft,
  add_to_intention_today, save_memory, add_marker_to_map, read_planning,
  read_brain_notes, read_shrine_history, read_compta_kpi ⭐, create_invoice_draft ⭐
  + web_search natif Anthropic. System prompt construit par buildSystemPrompt().

## 4.4 Compta : modèles de données (à connaître pour la suite)
  Écriture : {id, date, journal(VTE/HA/BQ/CA/OD/AN), piece, libelle,
              lignes:[{compte(PCG), debit, credit}], createdAt, source, factureId?}
  Facture  : {id, numero(FAC-YYYY-0001), date, echeance, statut(brouillon/envoyee/
              payee/retard/annulee), client:{nom,adresse,siret,tvaIntra},
              prestations:[{description,quantite,prixHT,tauxTVA}], ht, tva, ttc,
              tvaByTaux, createdAt, ecritureId}
  KPI (computeKPIs()) : 70xx=CA, 6xx(hors 695/681)=charges, 445710=TVA collectée,
              445660/445662=TVA déductible, 512000=trésorerie ; IS 15% jusqu'à
              42 500 € puis 25%.

## 4.5 Connexions "apps" déjà présentes AVANT moi (niveau deep-link, pas API)
  matchCommand()/ACTIONS interceptent : "ouvre ringover / appelle X / check mails /
  écris un mail à X / whatsapp / agenda / linkedin / drive / artcol / tiktok /
  instagram / carte / agents…". detectPowerIntent() gère "sauvegarde … comme CLÉ",
  "rappelle CLÉ", "copie …".

# 5) OUTILS QUE J'AI UTILISÉS (contexte, pour que tu saches comment ça a été vérifié)
  - 3 sous-agents d'exploration : cartographier shrine.html (977 Ko), le bus, les assets 3D.
  - Playwright + Chromium headless : vérifier le rendu 3D et le bus sans Seal Gate
    (harnais minimaux supprimés avant commit). Sur Mac, tu peux faire pareil avec
    `npx playwright`. Sinon, teste à la main dans le navigateur.
  - curl via proxy + CA bundle : télécharger Three.js dans vendor/.
  - GitHub : PR #160 (draft). git : commits atomiques par phase.
  - NB : la vidéo TikTok source n'a PAS pu être analysée (TikTok bloque le scraping) ;
    le concept "robot/AI Operator" vient du créneau du créateur (Nathan Levallois) +
    l'analyse du code.

# 6) CE QU'IL RESTE À FAIRE (non commencé)
## Phase C — connecteurs externes (Insta / TikTok / WhatsApp / CRM / SaaS)
  Niveau 1 — deep-link / brouillon (faisable SANS credential) :
    - tool send_whatsapp_draft(phone, message) -> ouvre https://wa.me/<num>?text=<encodé>
    - tools open_instagram / open_tiktok ciblés (profil, DM, upload)
    - pont vers PlayAzur CRM : ouvrir l'app / pré-remplir un prospect.
  Niveau 2 — vraie API (NÉCESSITE des accès que je dois fournir) :
    - WhatsApp Business Cloud API (token Meta + numéro vérifié)
    - Instagram/TikTok Graph API (comptes Business + app Meta/TikTok en review)
    - écriture CRM : anon key + table Supabase du projet dmztalsmreugfwojsaar
    - emails : Brevo (BREVO_API_KEY) via l'edge ai-proxy
    Architecture imposée : une EDGE FUNCTION (comme api/claude.js) détient les tokens
    côté serveur ; le Shrine appelle l'edge, JAMAIS l'API tierce en direct. La clé
    Anthropic ne doit jamais être en clair côté client en prod.
## Phase D — Opérateur proactif (cf. docs/PROMPT-AMAVYA-OPERATOR.md)
  Briefing matin/soir PARLÉ (au unlock + bouton + horaire), pipeline prospection +
  relances J+3/J+7, alertes d'échéances fiscales (depuis compta:state). Déclencheurs
  CÔTÉ CLIENT (pas de cron serveur).
## Améliorations utiles
  - auto-héberger les Google Fonts (comme Three.js) pour un offline total
  - Brain : exposer ses notes sur le bus (aujourd'hui seulement via cloud brain_notes)
  - Planning : ajouter l'ÉCRITURE (read_planning est en lecture seule ; l'écriture
    touche le vault chiffré Bachelor -> à faire avec précaution).

# 7) RÈGLES & GARDE-FOUS (NON NÉGOCIABLES)
  - VANILLA, zéro build, zéro dépendance npm dans mon-monde/.
  - Ne JAMAIS casser : le bus xiaomi-os, le coffre chiffré, le flux de clé API.
  - Ne pas modifier le format chiffré existant (rétro-compat des données déjà stockées).
  - Autonomie = "VALIDATION" par défaut : l'assistante prépare des BROUILLONS
    (mails, factures, relances) ; AUCUN envoi/émission externe sans MON clic.
  - Backups gelés src/*-v3.8.html / *-v0.8.8.html = rollback.
  - Clé Anthropic via edge proxy en prod (api/claude.js), jamais en clair côté client.
  - Commits atomiques par sous-étape ; tester (local + idéalement Playwright) avant push.
  - Pousser sur la branche claude/xiaomi-shrine-assistant-1h7jon, puis mettre la PR #160 à jour.

# 8) MÉTHODE DE TRAVAIL ATTENDUE (à chaque tâche)
  1. Lis les fichiers concernés (ignore les gros blocs base64 d'icônes dans shrine.html).
  2. Donne-moi une CARTE courte des points d'ancrage exacts (fonctions + n° de ligne)
     où tu vas greffer, et un PLAN en phases. ATTENDS ma validation.
  3. Implémente phase par phase. Après chaque phase : commit atomique + comment tester.
  4. Vérifie : `cd mon-monde && python3 -m http.server 5500`, déverrouille, teste le
     comportement réel (ouvre SHRINE et COMPTA côte à côte pour le bus).
  5. Mets à jour README + docs si tu changes l'architecture.

# 9) CE QUE JE VEUX MAINTENANT
  >>> [DÉCRIS ICI ta demande précise. Exemples :
      - "Phase C niveau 1 : tools send_whatsapp_draft + open_instagram/open_tiktok +
         pont PlayAzur CRM (ouverture/pré-remplissage). Garde-fou validation."
      - "Branche mon humanoïde du Labo : voici le .glb (chemin/URL). Remplace le
         RobotExpressive, ajuste anims/caméra/échelle, montre-moi un screenshot."
      - "Phase D : briefing matin parlé au déverrouillage, à partir de read_planning +
         read_compta_kpi, avec un bouton 'Mon brief' et un horaire configurable."
      - "Revoir entièrement le design de l'interface Shrine autour du robot (couleurs,
         panneaux, typo) sans casser les fonctionnalités."]
  Commence par le PLAN en phases + ancrages, puis attends ma validation avant de coder.
========================================================================
```
