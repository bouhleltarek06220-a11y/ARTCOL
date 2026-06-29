/* ============================================================================
   XIAOMI SHRINE · ROBOT 3D — Gardienne humanoïde au centre de l'interface
   ----------------------------------------------------------------------------
   Module ES autonome, ZÉRO build. Charge Three.js via import-map (CDN) et le
   modèle riggé RobotExpressive.glb. S'auto-attache au DOM existant et lit l'état
   (parle / écoute / alerte) depuis les classes CSS de #portrait — donc AUCUNE
   modification de la logique du Shrine n'est requise.

   Sécurité « sans rien casser » :
   - Si WebGL indisponible ou si le modèle ne charge pas → le module abandonne
     silencieusement et la photo persona d'origine reste affichée (fallback).
   - N'écrit jamais dans le state du Shrine, n'intercepte aucune commande.
   - Se met en pause quand l'onglet est masqué (perf).
============================================================================ */

const MODEL_URL = './models/RobotExpressive.glb';
const THREE_VER = '0.184.0';

// --- Garde-fou WebGL : si pas de contexte, on ne touche à rien ---------------
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (_) { return false; }
}

// --- Palette selon le thème actif (matrix nuit / hibi jour) ------------------
function themePalette() {
  const t = document.documentElement.getAttribute('data-theme') || 'matrix';
  if (t === 'hibi') {
    return { key: 0xff6f9d, rim: 0x7b61ff, fill: 0xfff3e0, bg: null };
  }
  return { key: 0xc8f53a, rim: 0x7b61ff, fill: 0x4de4ff, bg: null };
}

async function boot() {
  if (!hasWebGL()) { console.warn('[robot3d] WebGL absent — fallback photo.'); return; }

  let THREE, GLTFLoader;
  try {
    THREE = await import('three');
    ({ GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'));
  } catch (e) {
    console.warn('[robot3d] Three.js non chargé (offline ?) — fallback photo.', e);
    return;
  }

  const shrine = document.getElementById('shrine');
  const portrait = document.getElementById('portrait');
  const mount = document.getElementById('robot3d');
  if (!shrine || !portrait || !mount) {
    console.warn('[robot3d] points de montage absents — abandon.');
    return;
  }

  // ---- Scène / caméra / renderer -------------------------------------------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.85, 9.2);
  camera.lookAt(0, 1.55, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  mount.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';

  // ---- Lumières (palette du thème) -----------------------------------------
  const pal = themePalette();
  const amb = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(amb);
  const key = new THREE.DirectionalLight(pal.key, 2.1);
  key.position.set(3, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0005;
  scene.add(key);
  const rim = new THREE.DirectionalLight(pal.rim, 1.4);
  rim.position.set(-4, 3, -3); scene.add(rim);
  const fill = new THREE.PointLight(pal.fill, 0.7, 30);
  fill.position.set(-3, 1.5, 4); scene.add(fill);

  // Sol invisible qui reçoit l'ombre (ancre le robot)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.28 })
  );
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0; floor.receiveShadow = true;
  scene.add(floor);

  // ---- Chargement du modèle -------------------------------------------------
  let model, mixer;
  const actions = {};
  let activeBase = null;            // état de base en boucle (Idle par défaut)
  let previousBase = null;          // pour revenir après un emote
  const clock = new THREE.Clock();

  const EMOTES = ['Wave', 'Yes', 'No', 'ThumbsUp', 'Jump', 'Punch'];
  const BASES = ['Idle', 'Walking', 'Dance', 'Standing', 'Sitting'];

  const loader = new GLTFLoader();
  loader.load(MODEL_URL, (gltf) => {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.setScalar(0.9);
    model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach(clip => {
      const a = mixer.clipAction(clip);
      actions[clip.name] = a;
      if (EMOTES.includes(clip.name) || ['Death'].includes(clip.name)) {
        a.clampWhenFinished = true;
        a.loop = THREE.LoopOnce;
      }
    });

    // État de base initial
    activeBase = actions['Idle'] || Object.values(actions)[0];
    if (activeBase) activeBase.play();

    // Salut d'accueil dès que le robot devient visible (après déverrouillage)
    armGreeting();
    // Synchronise immédiatement avec l'état courant du portrait
    syncFromPortrait();
    shrine.classList.add('robot-on');   // masque la photo, révèle le robot

    mixer.addEventListener('finished', () => {
      // Retour à l'état de base après un emote one-shot
      fadeToBase(previousBase || actions['Idle'], 0.25);
    });
  },
  undefined,
  (err) => { console.warn('[robot3d] échec chargement modèle — fallback photo.', err); });

  // ---- Transitions ----------------------------------------------------------
  function fadeToBase(action, dur = 0.4) {
    if (!action || action === activeBase) return;
    if (activeBase) activeBase.fadeOut(dur);
    action.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(dur).play();
    activeBase = action;
  }

  function playEmote(name) {
    const a = actions[name];
    if (!a || !activeBase) return;
    previousBase = activeBase;
    activeBase.fadeOut(0.2);
    a.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.2).play();
    activeBase = a;   // 'finished' nous ramènera à la base
  }

  // ---- Pilotage par l'état du Shrine (classes de #portrait) -----------------
  let talkTimer = null;
  function stopTalkLoop() { if (talkTimer) { clearInterval(talkTimer); talkTimer = null; } }

  function syncFromPortrait() {
    if (!mixer) return;
    const cl = portrait.classList;
    // Lumière d'accent selon l'humeur
    if (cl.contains('alert')) {
      stopTalkLoop();
      key.color.setHex(0xff3355);
      playEmote('No');
    } else if (cl.contains('talking')) {
      key.color.setHex(pal.key);
      fadeToBase(actions['Idle']);
      // hochements / gestes périodiques tant que ça parle
      if (!talkTimer) {
        talkTimer = setInterval(() => {
          if (!portrait.classList.contains('talking')) { stopTalkLoop(); return; }
          playEmote(Math.random() < 0.65 ? 'Yes' : 'Wave');
        }, 1600);
      }
    } else if (cl.contains('listening')) {
      stopTalkLoop();
      key.color.setHex(pal.fill);
      fadeToBase(actions['Idle']);
    } else {
      stopTalkLoop();
      key.color.setHex(pal.key);
      fadeToBase(actions['Idle']);
    }
  }

  const mo = new MutationObserver(syncFromPortrait);
  mo.observe(portrait, { attributes: true, attributeFilter: ['class'] });

  // Salut une seule fois quand l'interface s'ouvre (sortie du Seal Gate)
  let greeted = false;
  function armGreeting() {
    const check = () => {
      if (greeted) return;
      const r = mount.getBoundingClientRect();
      if (r.width > 40 && r.height > 40) { greeted = true; setTimeout(() => playEmote('Wave'), 350); return; }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }

  // ---- Resize ---------------------------------------------------------------
  function resize() {
    const r = mount.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  window.addEventListener('resize', resize);
  resize();

  // Réagit au changement de thème (matrix ↔ hibi)
  new MutationObserver(() => {
    const p = themePalette();
    pal.key = p.key; pal.rim = p.rim; pal.fill = p.fill;
    if (!portrait.classList.contains('alert')) key.color.setHex(p.key);
    rim.color.setHex(p.rim); fill.color.setHex(p.fill);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---- Boucle de rendu (pause si onglet masqué) -----------------------------
  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) tick(); });

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const dt = clock.getDelta();
    if (mixer) mixer.update(dt);
    // léger balancement de la caméra pour la vie
    const t = clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.25) * 0.25;
    camera.lookAt(0, 1.55, 0);
    renderer.render(scene, camera);
  }
  tick();

  // API minimale exposée (optionnelle, pour usage futur côté Shrine)
  window.XIAOMI_ROBOT = {
    emote: (name) => playEmote(name),
    base: (name) => fadeToBase(actions[name]),
    available: () => Object.keys(actions),
  };
  console.log('[robot3d] Gardienne 3D en ligne.');
}

// Démarrage après chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
