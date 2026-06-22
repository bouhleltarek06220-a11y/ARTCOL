// Test du NOYAU empilé : on approche l'escalier arrière-gauche et on monte.
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(5000);
await page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((b) => /Entrer dans la villa/i.test(b.textContent));
  if (b) b.click();
});
await page.waitForTimeout(800);

const down = async (c) => page.evaluate((k) => window.dispatchEvent(new KeyboardEvent("keydown", { code: k })), c);
const up = async (c) => page.evaluate((k) => window.dispatchEvent(new KeyboardEvent("keyup", { code: k })), c);
const hold = async (c, ms) => { await down(c); await page.waitForTimeout(ms); await up(c); };
const zone = () => page.evaluate(() => {
  const zones = ["Étage · chambres", "Mezzanine · étage", "Escalier", "Hall principal",
    "Galerie principale", "Galerie · collection", "Cuisine", "Bibliothèque", "Bureau",
    "Terrasse & piscine", "Salle à manger", "Sous-sol · spa"];
  for (const e of document.querySelectorAll("div,span")) {
    const t = e.textContent.trim();
    if (zones.includes(t)) return t;
  }
  return "(?)";
});

const seen = new Set();
const sample = async (n, ms) => { for (let i = 0; i < n; i++) { await page.waitForTimeout(ms); seen.add(await zone()); } };

// 1) approcher le noyau (avant-gauche → lane A x≈-7.4, z≈-3.7)
await hold("KeyA", 250);
await down("KeyW"); await sample(11, 300); await up("KeyW"); // avance + début de montée
console.log("approche/montee lane A:", await zone());

// 2) demi-tour : strafe vers lane B (x≈-9.3) puis remonter +Z
await hold("KeyD", 0); // (placeholder)
await hold("KeyA", 450);
await down("KeyS"); await sample(10, 300); await up("KeyS"); // +Z : 2e demi-volée vers R1
console.log("apres demi-tour:", await zone());

await page.waitForTimeout(300);
console.log("ZONES VUES:", [...seen].join("  ->  "));
const monte = seen.has("Escalier") || seen.has("Mezzanine · étage") || seen.has("Étage · chambres");
console.log(monte ? "✅ LE NOYAU FAIT MONTER" : "❌ pas de montee detectee");
await browser.close();
