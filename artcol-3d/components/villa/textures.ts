import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Textures procédurales (canvas) pour donner de la matière aux surfaces :
 * marbre veiné, béton, bois, sol minéral. Générées une seule fois côté client
 * et mises en cache. Renvoie `null` côté serveur (SSR) — les composants 3D ne
 * sont rendus que dans le Canvas (client).
 */

type VillaTextures = {
  marble: CanvasTexture;
  concrete: CanvasTexture;
  /** Relief (bump) assorti au béton banché : joints + trous de banche + grain. */
  concreteBump: CanvasTexture;
  wood: CanvasTexture;
  sand: CanvasTexture;
  /** Pelouse procédurale (jardin paysager). */
  grass: CanvasTexture;
};

let cache: VillaTextures | null = null;

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, x: c.getContext("2d")! };
}

function tex(c: HTMLCanvasElement) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

function makeMarble() {
  const { c, x } = canvas(1024, 1024);
  x.fillStyle = "#e9e5dd";
  x.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 80; i++) {
    x.globalAlpha = 0.04;
    x.fillStyle = Math.random() < 0.5 ? "#dcd6ca" : "#ffffff";
    x.beginPath();
    x.arc(Math.random() * 1024, Math.random() * 1024, 60 + Math.random() * 240, 0, Math.PI * 2);
    x.fill();
  }
  for (let i = 0; i < 24; i++) {
    x.globalAlpha = 0.1 + Math.random() * 0.14;
    x.strokeStyle = Math.random() < 0.5 ? "#9a9182" : "#b7a98f";
    x.lineWidth = 0.6 + Math.random() * 2.4;
    x.beginPath();
    let px = Math.random() * 1024;
    let py = 0;
    x.moveTo(px, py);
    for (let k = 0; k < 18; k++) {
      px += (Math.random() - 0.5) * 150;
      py += 1024 / 18;
      x.lineTo(px + (Math.random() - 0.5) * 30, py);
    }
    x.stroke();
  }
  x.globalAlpha = 1;
  return tex(c);
}

function noiseMap(w: number, base: string, amp: number) {
  const { c, x } = canvas(w, w);
  x.fillStyle = base;
  x.fillRect(0, 0, w, w);
  const img = x.getImageData(0, 0, w, w);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amp;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  x.putImageData(img, 0, 0);
  return tex(c);
}

function makeWood() {
  const { c, x } = canvas(512, 512);
  x.fillStyle = "#5b3f27";
  x.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 2) {
    const l = 0.5 + Math.sin(y * 0.4) * 0.12 + (Math.random() - 0.5) * 0.18;
    const v = Math.max(0, Math.min(255, 90 + l * 70));
    x.strokeStyle = `rgba(${v | 0},${(v * 0.7) | 0},${(v * 0.45) | 0},0.5)`;
    x.lineWidth = 1 + Math.random();
    x.beginPath();
    x.moveTo(0, y + Math.sin(y * 0.05) * 3);
    for (let xx = 0; xx <= 512; xx += 32) {
      x.lineTo(xx, y + Math.sin((xx + y) * 0.02) * 3);
    }
    x.stroke();
  }
  return tex(c);
}

/**
 * Béton banché architectural : au lieu d'un grain plat, on superpose plusieurs
 * échelles de variation (grandes taches d'humidité, marbrures moyennes, grain
 * fin) + les JOINTS HORIZONTAUX des planches de banche et leurs TROUS de banche.
 * Renvoie la carte de couleur ET une bump map alignée (mêmes joints/trous) pour
 * que la lumière rasante accroche le relief. C'est ce qui sort les murs de
 * l'effet « carton beige uni ».
 */
function makeConcrete(): { map: CanvasTexture; bump: CanvasTexture } {
  const S = 1024;
  const col = canvas(S, S);
  const bmp = canvas(S, S);

  // Fond béton chaud.
  col.x.fillStyle = "#b3a896";
  col.x.fillRect(0, 0, S, S);
  bmp.x.fillStyle = "#8a8a8a"; // gris moyen = niveau de relief neutre
  bmp.x.fillRect(0, 0, S, S);

  // 1) Grandes taches douces (coulures, humidité) — variation à basse fréquence.
  for (let i = 0; i < 34; i++) {
    const r = 120 + Math.random() * 360;
    const cx = Math.random() * S;
    const cy = Math.random() * S;
    const dark = Math.random() < 0.5;
    col.x.globalAlpha = 0.07 + Math.random() * 0.09;
    col.x.fillStyle = dark ? "#857a64" : "#ccc4b0";
    col.x.beginPath();
    col.x.arc(cx, cy, r, 0, Math.PI * 2);
    col.x.fill();
  }
  col.x.globalAlpha = 1;

  // 2) Marbrures moyennes (nuages de ciment).
  for (let i = 0; i < 90; i++) {
    col.x.globalAlpha = 0.03 + Math.random() * 0.05;
    col.x.fillStyle = Math.random() < 0.5 ? "#a59a85" : "#c2b9a4";
    col.x.beginPath();
    col.x.arc(Math.random() * S, Math.random() * S, 24 + Math.random() * 90, 0, Math.PI * 2);
    col.x.fill();
  }
  col.x.globalAlpha = 1;

  // 3) JOINTS DE BANCHE : 4 panneaux verticaux (lignes horizontales tous les
  //    ~S/4) — légère ombre côté couleur, sillon côté bump.
  const rows = 4;
  const tieCols = 5;
  for (let r = 1; r < rows; r++) {
    const y = (r * S) / rows;
    col.x.globalAlpha = 0.16;
    col.x.fillStyle = "#7d7361";
    col.x.fillRect(0, y - 1.5, S, 3);
    col.x.globalAlpha = 0.1;
    col.x.fillStyle = "#d8d0bf";
    col.x.fillRect(0, y + 1.5, S, 1.5);
    // bump : sillon sombre (creux).
    bmp.x.fillStyle = "#3c3c3c";
    bmp.x.fillRect(0, y - 1.5, S, 3);
  }
  col.x.globalAlpha = 1;

  // 4) TROUS DE BANCHE : petits disques réguliers (tie-holes) en relief négatif.
  for (let r = 0; r < rows; r++) {
    const y = (r + 0.5) * (S / rows);
    for (let c = 0; c < tieCols; c++) {
      const x = (c + 0.5) * (S / tieCols) + (Math.random() - 0.5) * 12;
      col.x.globalAlpha = 0.22;
      col.x.fillStyle = "#766c5b";
      col.x.beginPath();
      col.x.arc(x, y, 4.5, 0, Math.PI * 2);
      col.x.fill();
      bmp.x.fillStyle = "#2e2e2e";
      bmp.x.beginPath();
      bmp.x.arc(x, y, 4.5, 0, Math.PI * 2);
      bmp.x.fill();
      bmp.x.fillStyle = "#c8c8c8"; // léger bourrelet clair autour
      bmp.x.beginPath();
      bmp.x.arc(x, y, 7, 0, Math.PI * 2);
      bmp.x.fill();
      bmp.x.fillStyle = "#2e2e2e";
      bmp.x.beginPath();
      bmp.x.arc(x, y, 4.5, 0, Math.PI * 2);
      bmp.x.fill();
    }
  }
  col.x.globalAlpha = 1;

  // 5) Grain fin (pores du béton) sur la couleur ET le relief.
  const cd = col.x.getImageData(0, 0, S, S);
  const bd = bmp.x.getImageData(0, 0, S, S);
  for (let i = 0; i < cd.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    cd.data[i] += n;
    cd.data[i + 1] += n;
    cd.data[i + 2] += n;
    const bn = (Math.random() - 0.5) * 26;
    bd.data[i] += bn;
    bd.data[i + 1] += bn;
    bd.data[i + 2] += bn;
  }
  col.x.putImageData(cd, 0, 0);
  bmp.x.putImageData(bd, 0, 0);

  return { map: tex(col.c), bump: tex(bmp.c) };
}

/** Pelouse : base verte + touffes claires/sombres multi-échelles + grain. */
function makeGrass(): CanvasTexture {
  const S = 512;
  const { c, x } = canvas(S, S);
  x.fillStyle = "#3f5a2a";
  x.fillRect(0, 0, S, S);
  // taches de tonalité (zones plus claires/sèches, plus sombres/humides)
  for (let i = 0; i < 60; i++) {
    x.globalAlpha = 0.06 + Math.random() * 0.1;
    x.fillStyle = Math.random() < 0.5 ? "#4d6b33" : "#34501f";
    x.beginPath();
    x.arc(Math.random() * S, Math.random() * S, 12 + Math.random() * 60, 0, Math.PI * 2);
    x.fill();
  }
  x.globalAlpha = 1;
  // brins (petits traits verticaux) pour casser l'aplat
  for (let i = 0; i < 4000; i++) {
    const gx = Math.random() * S;
    const gy = Math.random() * S;
    const l = 1.5 + Math.random() * 3;
    const v = 70 + Math.random() * 70;
    x.strokeStyle = `rgba(${(v * 0.5) | 0},${v | 0},${(v * 0.35) | 0},0.5)`;
    x.lineWidth = 0.8;
    x.beginPath();
    x.moveTo(gx, gy);
    x.lineTo(gx + (Math.random() - 0.5) * 1.5, gy - l);
    x.stroke();
  }
  return tex(c);
}

export function getVillaTextures(): VillaTextures | null {
  if (cache) return cache;
  if (typeof document === "undefined") return null;
  const concrete = makeConcrete();
  cache = {
    marble: makeMarble(),
    concrete: concrete.map,
    concreteBump: concrete.bump,
    wood: makeWood(),
    sand: noiseMap(512, "#b9b0a0", 14),
    grass: makeGrass(),
  };
  return cache;
}
