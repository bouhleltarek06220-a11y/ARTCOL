/**
 * Générateur procédural de textures de planètes.
 * Aucune dépendance externe : tout est calculé en Canvas2D côté client.
 * Une texture = un dataURL utilisable comme map d'un MeshStandardMaterial.
 *
 * Six types de planètes :
 *   - earth   : océans + continents verts/bruns + nuages
 *   - mars    : surface rouge cratérisée
 *   - gas     : géante gazeuse à bandes (style Jupiter)
 *   - ice     : géante de glace bleutée (style Neptune/Uranus)
 *   - saturn  : ocre dorée à bandes douces (la planète centrale a un anneau)
 *   - exotic  : violette/cyan, pour les sujets vision/exotiques
 */

/* Pseudo-noise déterministe (valeur), pas de simplex pour rester sans dépendance. */
function hash(x, y, seed = 0) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 14.7) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x, y, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

/* fBm (sommation d'octaves) — donne du relief naturel. */
function fbm(x, y, seed, octaves = 5) {
  let v = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += smoothNoise(x * freq, y * freq, seed + i * 17) * amp;
    freq *= 2;
    amp *= 0.5;
  }
  return v;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

/* Renvoie un dataURL PNG. Width/height équirectangulaire pour mapping sphérique. */
function makeCanvas(w, h, drawPixel) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = drawPixel(x, y, w, h);
      const i = (y * w + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = a ?? 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/* ---------- Six générateurs ---------- */

function makeEarth(seed) {
  // Bleu océan, continents verts/bruns, calottes polaires blanches.
  const w = 512;
  const h = 256;
  const OCEAN_DEEP = [11, 35, 80];
  const OCEAN = [25, 86, 168];
  const COAST = [40, 130, 200];
  const GRASS = [54, 110, 52];
  const FOREST = [30, 78, 38];
  const MOUNTAIN = [102, 86, 60];
  const SNOW = [240, 244, 250];

  return makeCanvas(w, h, (x, y) => {
    const u = x / w;
    const v = y / h;
    const lat = Math.abs(v - 0.5) * 2;
    const noise = fbm(u * 6, v * 4, seed, 6);
    const continents = fbm(u * 3, v * 2.5, seed + 100, 4);

    if (lat > 0.92) return [...SNOW, 255];

    let color;
    if (continents > 0.55) {
      const elev = (continents - 0.55) / 0.45;
      if (elev > 0.7) color = MOUNTAIN;
      else if (elev > 0.35) color = mixColor(GRASS, MOUNTAIN, (elev - 0.35) / 0.35);
      else color = mixColor(FOREST, GRASS, elev / 0.35);
      // bruine de couleurs pour briser l'uniformité
      const jitter = (noise - 0.5) * 0.3;
      color = color.map((c) => Math.max(0, Math.min(255, c + jitter * 50)));
    } else {
      const depth = (0.55 - continents) / 0.55;
      color = mixColor(COAST, OCEAN_DEEP, depth);
      // remous
      const r = (noise - 0.5) * 0.2;
      color[0] += r * 20;
      color[2] += r * 30;
    }

    // gel polaire progressif
    if (lat > 0.78) {
      const t = (lat - 0.78) / 0.14;
      color = mixColor(color, SNOW, t);
    }

    return [...color, 255];
  });
}

function makeMars(seed) {
  const w = 512;
  const h = 256;
  const RUST_DARK = [82, 35, 18];
  const RUST = [168, 78, 40];
  const RUST_LIGHT = [202, 120, 70];
  const POLE = [220, 215, 205];

  return makeCanvas(w, h, (x, y) => {
    const u = x / w;
    const v = y / h;
    const lat = Math.abs(v - 0.5) * 2;
    const noise = fbm(u * 8, v * 5, seed, 6);
    const craters = fbm(u * 16, v * 10, seed + 50, 4);

    let color = mixColor(RUST, RUST_LIGHT, noise);
    if (craters > 0.7) color = mixColor(color, RUST_DARK, (craters - 0.7) * 2);

    if (lat > 0.88) {
      const t = (lat - 0.88) / 0.12;
      color = mixColor(color, POLE, t);
    }

    return [...color, 255];
  });
}

function makeGasGiant(seed, palette) {
  const w = 512;
  const h = 256;
  return makeCanvas(w, h, (x, y) => {
    const v = y / h;
    const u = x / w;
    // Bandes : sinusoidale en latitude + perturbation
    const bands =
      Math.sin(v * Math.PI * 7 + fbm(u * 2, v * 2, seed, 3) * 1.6) * 0.5 + 0.5;
    const swirl = fbm(u * 4 + bands * 2, v * 4, seed + 30, 4);
    const t = bands * 0.6 + swirl * 0.4;
    const color = mixColor(palette[0], palette[1], t);
    // Tache "œil" (style tache rouge de Jupiter)
    const spotX = 0.32;
    const spotY = 0.58;
    const dx = (u - spotX) * 1.8;
    const dy = (v - spotY) * 3.2;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 0.12) {
      const k = 1 - d / 0.12;
      const tint = mixColor(color, palette[2], k);
      return [...tint, 255];
    }
    return [...color, 255];
  });
}

function makeJupiter(seed) {
  return makeGasGiant(seed, [
    [188, 134, 84], // sable
    [230, 198, 144], // crème
    [180, 60, 50], // tache rouge
  ]);
}

function makeSaturn(seed) {
  return makeGasGiant(seed, [
    [210, 170, 105], // ocre clair
    [240, 215, 160], // crème dorée
    [165, 130, 80], // accent
  ]);
}

function makeIce(seed) {
  return makeGasGiant(seed, [
    [78, 134, 188], // bleu profond
    [180, 220, 245], // cyan glacé
    [120, 170, 220], // accent
  ]);
}

function makeExotic(seed) {
  return makeGasGiant(seed, [
    [102, 60, 168], // violet
    [200, 180, 255], // lavande
    [60, 200, 230], // cyan néon
  ]);
}

/* ---------- API publique ---------- */

const cache = new Map();

export function getPlanetTexture(type, seed = 1) {
  const key = `${type}-${seed}`;
  if (cache.has(key)) return cache.get(key);

  let canvas;
  switch (type) {
    case "earth":
      canvas = makeEarth(seed);
      break;
    case "mars":
      canvas = makeMars(seed);
      break;
    case "jupiter":
      canvas = makeJupiter(seed);
      break;
    case "saturn":
      canvas = makeSaturn(seed);
      break;
    case "ice":
      canvas = makeIce(seed);
      break;
    case "exotic":
      canvas = makeExotic(seed);
      break;
    default:
      canvas = makeEarth(seed);
  }

  const dataUrl = canvas.toDataURL("image/png");
  cache.set(key, dataUrl);
  return dataUrl;
}

/* Mapping catégorie → type de planète. Modifiable depuis le frontmatter
   en spécifiant planet.type explicitement. */
export const CATEGORY_TO_TYPE = {
  automation: "earth",
  "ai-agents": "mars",
  "case-study": "ice",
  vision: "saturn",
  crm: "jupiter",
  formation: "exotic",
};

/* Indique si une planète d'un type donné a un anneau (Saturne). */
export function hasRings(type) {
  return type === "saturn";
}
