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
  wood: CanvasTexture;
  sand: CanvasTexture;
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

export function getVillaTextures(): VillaTextures | null {
  if (cache) return cache;
  if (typeof document === "undefined") return null;
  cache = {
    marble: makeMarble(),
    concrete: noiseMap(512, "#b3a896", 16),
    wood: makeWood(),
    sand: noiseMap(512, "#b9b0a0", 14),
  };
  return cache;
}
