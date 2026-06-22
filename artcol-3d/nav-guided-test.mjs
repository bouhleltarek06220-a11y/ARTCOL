import { chromium } from "playwright";

const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
p.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
await p.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5500);

const clickText = async (t) =>
  p.evaluate((txt) => {
    const el = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === txt || new RegExp(txt, "i").test(b.textContent));
    if (el) { el.click(); return true; }
    return false;
  }, t);

// 1) Entrer
await clickText("Entrer dans la villa");
await p.waitForTimeout(1200);
await p.screenshot({ path: "shot-guided-0-menu.png", timeout: 60000 });
console.log("menu visible:", await p.evaluate(() => /Destinations|Visite/.test(document.body.innerText)));

// 2) Vol vers "Vue d'ensemble" (groupe Extérieur, ouvert par défaut)
console.log("clic Vue d'ensemble:", await clickText("Vue d'ensemble"));
await p.waitForTimeout(2000);
await p.screenshot({ path: "shot-guided-1-apercu.png", timeout: 60000 });

// 3) Ouvrir le groupe RDC puis voler vers le Hall
console.log("ouvre RDC:", await clickText("Rez-de-chaussée"));
await p.waitForTimeout(400);
console.log("clic Hall:", await clickText("Hall / Galerie"));
await p.waitForTimeout(2000);
await p.screenshot({ path: "shot-guided-2-hall.png", timeout: 60000 });

// 4) Ouvrir Étage puis voler vers la Suite (R1)
console.log("ouvre Étage:", await clickText("Étage"));
await p.waitForTimeout(400);
console.log("clic Suite:", await clickText("Suite parentale"));
await p.waitForTimeout(2000);
await p.screenshot({ path: "shot-guided-3-suite.png", timeout: 60000 });

// 5) Retour (revient au Hall)
console.log("clic Retour:", await clickText("Retour"));
await p.waitForTimeout(2000);
await p.screenshot({ path: "shot-guided-4-retour.png", timeout: 60000 });

console.log("ERREURS:", errs.join(" | ") || "(aucune)");
await b.close();
