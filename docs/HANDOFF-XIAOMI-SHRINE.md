# 🛰️ PASSATION COMPLÈTE — Xiaomi Shrine / AMAVYA Operator

> Document de reprise pour **Claude Code (Mac + VS Code)**.
> Colle ce fichier (ou son contenu) en contexte au démarrage. Il décrit **tout**
> ce qui a été fait, **où**, **comment**, **avec quel outil**, **pourquoi**, et
> **comment tout est connecté**. Rien n'est omis.

---

## 0. COMMENT REPRENDRE (à lire en premier)

- **Repo** : `bouhleltarek06220-a11y/ARTCOL`
- **Branche de travail** : `claude/xiaomi-shrine-assistant-1h7jon` (NE PAS repartir de `main`)
- **Pull Request** : **#160** (draft) → https://github.com/bouhleltarek06220-a11y/ARTCOL/pull/160
- **Récupérer le travail sur ton Mac** :
  ```bash
  git fetch origin
  git checkout claude/xiaomi-shrine-assistant-1h7jon
  git pull origin claude/xiaomi-shrine-assistant-1h7jon
  ```
- **Lancer en local** (obligatoire pour le bus + service workers + le robot 3D) :
  ```bash
  cd mon-monde
  python3 -m http.server 5500
  # puis ouvrir http://localhost:5500/  (PAS file:// — sinon bus/3D cassés)
  ```
  Le robot 3D et le pont Compta↔Shrine n'apparaissent qu'**après déverrouillage du
  Seal Gate** (mot de passe maître du Shrine).

- **Commits déjà sur la branche** (du plus ancien au plus récent) :
  1. `docs: prompt AMAVYA Operator` → ajoute `docs/PROMPT-AMAVYA-OPERATOR.md`
  2. `581bff1` — **Phase A** : Gardienne 3D (robot humanoïde animé)
  3. `b10b0ff` — **Phase B** : connexion bus Compta SASU ↔ Shrine

- **État Vercel** : `mon-monde` déploie **vert** à chaque commit. Le seul échec
  `lostchapter3d` est **pré-existant et SANS RAPPORT** (autre dossier `lostchapter-3d/`).

---

## 1. LE PROJET (contexte technique de base)

Univers personnel « **Mon Monde** » dans `mon-monde/` : **PWA chiffrée, vanilla
HTML/CSS/JS, ZÉRO build step**. Trois modules dans des `<iframe>` **même origine**,
reliés par un bus `BroadcastChannel('xiaomi-os')` :

| Fichier | Rôle |
|---|---|
| `mon-monde/index.html` | Shell : topbar BRAIN / SHRINE / COMPTA + 3 iframes (Ctrl+1/2/3) |
| `mon-monde/brain.html` | Xiaomi Brain v0.8.8 — knowledge graph / notes |
| `mon-monde/shrine.html` | **Xiaomi Shrine** — l'assistante IA (agent Claude + voix + carte + Kanban…) |
| `mon-monde/compta.html` | Compta SASU AMAVYA — factures, écritures, TVA, IS, FEC |
| `mon-monde/api/claude.js` | **Edge function Vercel** : proxy Anthropic (garde la clé côté serveur) |
| `mon-monde/sw.js` | Service worker (réécrit `api.anthropic.com` → `/api/claude` en prod) |

**Backups gelés** (rollback) : `mon-monde/src/shrine-v3.8.html`, `src/brain-v0.8.8.html`.

**Infra externe connue (noms, PAS de secrets)** :
- Anthropic via edge proxy → env `ANTHROPIC_API_KEY` (Vercel, projet mon-monde)
- Supabase « cloud Shrine/Brain » : `https://vbcictorbnmgmkmohmgy.supabase.co`,
  table `vault(user_id, namespace, data chiffrée)`, namespaces `main` (planning),
  `shrine_data`, `brain_notes`, `shared_config`.
- PlayAzur CRM (autre app `playazur-crm/`) : Supabase `dmztalsmreugfwojsaar`,
  edge function `ai-proxy` (services `claude` / `whisper` / `brevo`), secrets
  `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `BREVO_API_KEY`.
- amavya (`amavya/`) : Supabase `qrotbfsvaouwyoyqtqlr`, table `partner_leads`,
  SMTP OVH (`ssl0.ovh.net`, env `SMTP_USER=contact@amavya.cloud`, `SMTP_PASS`…).

---

## 2. CE QUI A ÉTÉ FAIT — PHASE A : GARDIENNE 3D (robot humanoïde)

**But** : remplacer la photo-persona centrale du Shrine par un **robot 3D animé**
qui réagit (parle / écoute / alerte / salut), sans casser le reste.

### Fichiers AJOUTÉS
- `mon-monde/robot3d.js` — module ES autonome (toute la logique 3D).
- `mon-monde/models/RobotExpressive.glb` — **copié depuis** `artcol-3d/public/models/RobotExpressive.glb` (robot riggé, 14 animations : Idle, Walking, Dance, Wave, Yes, No, ThumbsUp, Jump, Punch, Sitting, Standing, Death, Running, WalkJump).
- `mon-monde/vendor/three/lib/three.module.js` + `three.core.js`
- `mon-monde/vendor/three/examples/jsm/loaders/GLTFLoader.js`
- `mon-monde/vendor/three/examples/jsm/utils/BufferGeometryUtils.js` + `SkeletonUtils.js`
  → **Three.js 0.184 auto-hébergé** (ESM). Téléchargé depuis jsDelivr. **Pourquoi
  auto-hébergé** : marche hors-ligne (PWA), pas de dépendance CDN runtime.
  ⚠️ **Dossier nommé `lib/` et non `build/`** : le `.gitignore` racine ignore
  `build/` — ne pas renommer en `build`, ça ne serait pas commité.

### Greffes dans `shrine.html` (toutes ADDITIVES, repères par marqueur)
1. **Import-map** (juste après le `<link>` Leaflet dans `<head>`) :
   ```html
   <script type="importmap">
   {"imports":{"three":"./vendor/three/lib/three.module.js",
               "three/addons/":"./vendor/three/examples/jsm/"}}</script>
   ```
2. **Point de montage** — dans `.shrine`, juste après `</div>` de `.portrait-wrap` :
   `<div class="robot3d" id="robot3d" aria-hidden="true"></div>`
3. **CSS** — juste après la keyframe `@keyframes mouthMove{...}` : règles `.robot3d`,
   `.shrine.robot-on .robot3d`, et masquage de la photo `#shrine.robot-on .portrait img{opacity:0}`.
4. **Script module** — juste avant `</body>` :
   `<script type="module" src="./robot3d.js"></script>`

### Fonctionnement de `robot3d.js` (détails)
- Garde-fou `hasWebGL()` : si pas de WebGL → abandon silencieux, **la photo
  persona d'origine reste** (zéro régression). Idem si le `.glb` ou Three ne charge pas.
- Charge `./models/RobotExpressive.glb` via `GLTFLoader`, joue `Idle` en boucle.
- **Pilotage 100 % par le DOM existant** : un `MutationObserver` surveille les
  classes de `#portrait` (`talking` / `listening` / `alert`) — déjà posées par le
  Shrine quand l'assistante parle/écoute. → AUCUNE modif de la logique du Shrine.
  - `talking` → hochements périodiques (emotes `Yes`/`Wave`), lumière néon.
  - `listening` → lumière cyan.
  - `alert` → emote `No`, lumière rouge.
  - apparition (sortie du Seal Gate) → salut `Wave` une fois.
- Palette suit le thème (`data-theme` matrix/hibi), pause si onglet masqué.
- Caméra : `PerspectiveCamera(30°)`, position `(0,1.85,9.2)`, `lookAt(0,1.55,0)`,
  modèle `scale 0.9` (réglé pour cadrer l'humanoïde entier).
- API exposée : `window.XIAOMI_ROBOT.emote('Wave')`, `.base('Idle')`, `.available()`.

### 🔁 POUR CHANGER LE ROBOT (ex. humanoïde de ton AMAVYA.cloud > Labo)
1. Remplace `mon-monde/models/RobotExpressive.glb` par ton `.glb` (même nom, ou
   change `MODEL_URL` en haut de `robot3d.js`).
2. Si ton modèle a d'autres noms d'animations, adapte les tableaux `EMOTES` /
   `BASES` et les appels `playEmote('Wave')` / `actions['Idle']` dans `robot3d.js`.
3. Ajuste `camera.position` / `lookAt` / `model.scale` selon la taille du modèle.
   (Modèles compatibles : Ready Player Me, Mixamo, tout glTF/GLB riggé.)

### Vérification faite
Capturé au rendu réel via **Playwright + Chromium headless** (`--use-angle=swiftshader`)
sur un harnais minimal : robot chargé (14 anims), `robot-on=true`, poses Idle + salut
+ hochement « parle » OK. Harnais de test supprimé avant commit.

### README
`mon-monde/README.md` mis à jour (section « Gardienne 3D », arbo, note que
`shrine.html` n'est plus identique au backup gelé `src/shrine-v3.8.html`).

---

## 3. CE QUI A ÉTÉ FAIT — PHASE B : BUS COMPTA SASU ↔ SHRINE

**But** : l'assistante **lit les vrais chiffres** de la SASU et **prépare des
brouillons de facture** (que Tarek valide). Avant : les events compta du bus
n'avaient **aucun consommateur**.

### Greffes dans `shrine.html`
- Variable `let _comptaAlive = false;` (à côté de `_brainAlive`).
- Handlers ajoutés dans `initBrainChannel()` (le `onmessage` de `_brainChannel`) :
  - `compta:hello` → marque présence + envoie `compta:request:state`
  - `compta:state` → stocke `state.compta = msg.state`
  - `compta:facture:new` / `compta:ecriture:new` / `compta:ecriture:deleted` →
    redemande `compta:request:state` (rafraîchit le snapshot)
  - à l'init : `postMessage({type:'compta:request:state'})` en plus du `shrine:hello`.
- Champ `compta: null` ajouté à l'objet `state`.
- **2 nouveaux tools agent** dans `XIAOMI_TOOLS` (+ leurs handlers dans `executeXiaomiTool`) :
  - **`read_compta_kpi()`** : renvoie `state.compta` (CA, charges, résultat, IS,
    TVA collectée/déductible/à décaisser, trésorerie, impayés, dernières
    écritures/factures). Si Compta fermée → message « ouvre l'onglet COMPTA ».
    JAMAIS de montant inventé.
  - **`create_invoice_draft(client_nom, prestations[], client_adresse?, client_siret?,
    client_tva?, echeance_jours?)`** : émet `shrine:compta:invoice-draft` sur le bus.
    **N'émet rien** : Compta ouvre un brouillon pré-rempli que Tarek enregistre.
- **System prompt** (`buildSystemPrompt()`) enrichi :
  - description des tools compta dans la section « TOOLS SASU AMAVYA » ;
  - injection LIVE dans « CONTEXTE TEMPS RÉEL » : ligne `Compta SASU AMAVYA (live) :
    CA … · résultat … · IS … · TVA à décaisser … · tréso … · impayés …`.

### Greffes dans `compta.html`
- Handlers ajoutés dans `initBus()` (le `onmessage` de `_bus`) :
  - `compta:request:state` → `pushComptaState()`
  - `shrine:compta:invoice-draft` → `applyInvoiceDraft(m.draft)`
  - à l'init : appelle `pushComptaState()`.
- 3 fonctions ajoutées après `notifyBus()` :
  - **`buildComptaState()`** : `{ societe, exercice, kpi (via computeKPIs()),
    impayes, impayesTotal, nbFactures, nbEcritures, recentFactures, recentEcritures, ts }`.
  - **`pushComptaState()`** : `notifyBus({type:'compta:state', state: buildComptaState()})`.
  - **`applyInvoiceDraft(draft)`** : `openFactureModal()` puis pré-remplit client +
    prestations + échéance, force `statut='brouillon'`, `switchView('factures')`,
    ouvre le modal, toast. **Rien n'est enregistré** (réutilise l'UI existante).
- `pushComptaState()` ajouté après la création d'une écriture (≈ `notifyBus(compta:ecriture:new)`)
  et après `saveFacture()` (≈ `notifyBus(compta:facture:new)`).

### Vérification faite
Playwright : `compta:request:state` → `compta:state` reçu avec tous les KPI ;
`shrine:compta:invoice-draft` → modal ouvert, client pré-rempli, **statut Brouillon**,
échéance J+45, **Total HT 1 500 € / TTC 1 800 €** corrects ; `shrine.html` chargé
**sans aucune erreur JS**.

---

## 4. CARTOGRAPHIE COMPLÈTE DES CONNEXIONS

### Bus `BroadcastChannel('xiaomi-os')` — catalogue d'événements
| Événement | Émetteur | Consommateur(s) | Payload |
|---|---|---|---|
| `shrine:hello` | Shrine | Brain, Compta | `{type, source}` |
| `shrine:key:unlocked` | Shrine | Brain, Compta | `{type, apiKey, source}` |
| `shrine:key:locked` | Shrine | Brain, Compta | `{type, source}` |
| `brain:hello` | Brain | Shrine, Compta | `{type, source}` |
| `brain:request:key` | Brain/Compta | Shrine | `{type}` |
| `compta:hello` | Compta | Shrine, Brain | `{type, source}` |
| `compta:ecriture:new` | Compta | **Shrine (Phase B)** | `{type, ecriture}` |
| `compta:facture:new` | Compta | **Shrine (Phase B)** | `{type, facture}` |
| `compta:ecriture:deleted` | Compta | **Shrine (Phase B)** | `{type, id}` |
| **`compta:request:state`** ⭐ | Shrine | Compta | `{type}` |
| **`compta:state`** ⭐ | Compta | Shrine | `{type, state}` |
| **`shrine:compta:invoice-draft`** ⭐ | Shrine | Compta | `{type, draft}` |

⭐ = nouveaux (Phase B). La clé API Anthropic transite **uniquement en RAM** via
`shrine:key:unlocked` (jamais persistée côté Brain/Compta).

### Stockage (localStorage)
- Shrine : `xiaomi_shrine_*` (api_key_enc, seal, history, prefs, memory, contacts…).
- Brain : `xiaomi-brain-notes-v1`.
- Compta : `xiaomi-compta-state-v1` (`{societe, ecritures[], factures[], nextFactureNum}` — apiKey jamais persistée).
- Cloud Supabase (table `vault`) : namespaces `main`/`shrine_data`/`brain_notes`/`shared_config`.

### Tools agent du Shrine (lecture/écriture)
`open_app`, `open_url`, `web_search_query`, `add_to_kanban`, `create_mail_draft`,
`add_to_intention_today`, `save_memory`, `add_marker_to_map`, `read_planning`,
`read_brain_notes`, `read_shrine_history`, **`read_compta_kpi`** ⭐, **`create_invoice_draft`** ⭐.
Boucle agentique : `callClaude()` ; prompt : `buildSystemPrompt()` ; exécution :
`executeXiaomiTool()`.

### Connexions « apps » déjà présentes (avant moi)
Commandes vocales/texte interceptées (`matchCommand`/`ACTIONS`) : « ouvre ringover /
appelle X / check mails / écris un mail à X / whatsapp / agenda / linkedin / drive /
artcol / tiktok / instagram / carte / agents… » → niveau **deep-link** (pas d'API).

---

## 5. OUTILS / INFRA QUE J'AI UTILISÉS (et pourquoi)
- **3 sous-agents Explore** : cartographier `shrine.html` (977 Ko), le contrat du bus
  (index/brain/compta), et les assets 3D + connecteurs — avant de toucher au code.
- **Playwright + Chromium** (`/opt/pw-browsers`) : vérifier le rendu 3D et le bus
  sans dépendre du Seal Gate (harnais minimaux, supprimés avant commit).
- **`curl` via le proxy HTTPS + CA bundle** : télécharger Three.js dans `vendor/`.
- **Bright Data / WebFetch / WebSearch** : tentative d'analyse de la vidéo TikTok —
  ⚠️ **échec** (TikTok bloque le scraping). Le robot/plan s'appuie donc sur le
  créneau du créateur (Nathan Levallois, « AI Operators ») + l'analyse du code.
- **GitHub MCP** : création de la PR #160 (draft).
- **git** : commits atomiques par phase, push sur la branche désignée.

---

## 6. CE QU'IL RESTE À FAIRE (Phase C & D — non commencées)

### Phase C — connecteurs externes (Insta / TikTok / WhatsApp / CRM / SaaS)
Deux niveaux :
- **Deep-link / brouillon (faisable sans credentials)** : tools agent
  `send_whatsapp_draft` (lien `wa.me/<num>?text=…` pré-rempli), ouverture
  Insta/TikTok ciblée, et un pont vers **PlayAzur CRM** (ouvrir / pré-remplir).
- **Vraie API (nécessite des accès)** :
  - WhatsApp Business Cloud API (token Meta + numéro vérifié)
  - Instagram/TikTok Graph API (comptes Business + app Meta/TikTok review)
  - Écriture CRM : anon key + table Supabase du projet `dmztalsmreugfwojsaar`
  - Emails : Brevo (`BREVO_API_KEY`) via l'edge `ai-proxy`
  → Architecture conseillée : **edge function** (comme `api/claude.js`) qui détient
  les tokens côté serveur ; le Shrine appelle l'edge, jamais l'API directement.
  La clé Anthropic NE doit jamais être en clair côté client en prod.

### Phase D — Opérateur proactif (cf. `docs/PROMPT-AMAVYA-OPERATOR.md`)
Briefings matin/soir parlés, pipeline prospection + relances (J+3/J+7), alertes
d'échéances fiscales (depuis `compta:state`). Déclencheurs **côté client** (au unlock
+ bouton + horaire) — pas de cron serveur.

### Idées d'amélioration de l'existant
- Auto-héberger les Google Fonts (comme Three.js) pour un offline total.
- Brain : exposer ses notes sur le bus (aujourd'hui seulement via cloud `brain_notes`).
- Planning : ajouter l'**écriture** (aujourd'hui `read_planning` est en lecture seule ;
  l'écriture touche le vault chiffré Bachelor — à faire avec précaution).

---

## 7. CONVENTIONS & GARDE-FOUS (à respecter)
- **Vanilla, zéro build, zéro dépendance npm** dans `mon-monde/`.
- **Ne jamais casser** le bus `xiaomi-os`, le coffre chiffré, ni le flux de clé API.
- **Autonomie = « validation »** par défaut : l'assistante prépare des brouillons
  (mails, factures) ; **aucun envoi/émission sans clic de Tarek**.
- Backups gelés `src/*-v3.8.html` / `*-v0.8.8.html` = rollback.
- Commits atomiques par sous-étape ; tester avant de pousser.
- Clé Anthropic via edge proxy en prod (`api/claude.js`), jamais en clair côté client.

---

## 8. PROMPT PRÊT À COLLER DANS CLAUDE CODE (Mac/VS Code)

```
Tu reprends le projet "Xiaomi Shrine / AMAVYA Operator". Lis d'abord
docs/HANDOFF-XIAOMI-SHRINE.md ET docs/PROMPT-AMAVYA-OPERATOR.md à la racine du
repo : ils décrivent tout l'existant (Phases A et B déjà faites et déployées),
la cartographie du bus xiaomi-os, les fichiers, les connexions et les garde-fous.

Travaille sur la branche claude/xiaomi-shrine-assistant-1h7jon (PR #160). Respecte :
vanilla / zéro build, ne casse pas le bus ni le coffre chiffré, autonomie
"validation" (brouillons, jamais d'envoi sans mon clic), commits atomiques testés.

Contexte clé déjà en place :
- Robot 3D : mon-monde/robot3d.js + models/RobotExpressive.glb + vendor/three/.
  Pour changer le robot : remplace le .glb (même nom) et adapte EMOTES/BASES +
  camera/scale dans robot3d.js.
- Bus Compta↔Shrine : events compta:request:state / compta:state /
  shrine:compta:invoice-draft ; tools agent read_compta_kpi + create_invoice_draft.

Prochaine étape que je veux : [DÉCRIS ICI — ex. "Phase C deep-links WhatsApp/Insta/
TikTok + pont PlayAzur CRM", ou "brancher mon humanoïde Labo (.glb fourni)", ou
"Phase D briefings proactifs"]. Commence par me proposer un plan en phases avec les
points d'ancrage exacts dans le code, puis attends ma validation avant de coder.
```

---

*Fin de la passation. Tout l'historique détaillé est aussi visible dans les commits
de la branche et la PR #160.*
