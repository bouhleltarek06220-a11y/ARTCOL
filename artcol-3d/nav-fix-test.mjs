import { chromium } from "playwright";

const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
p.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
await p.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5500);

const click = (t) => p.evaluate((txt) => {
  const el = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === txt || new RegExp(txt, "i").test(b.textContent));
  if (el) { el.click(); return true; }
  return false;
}, t);
const phase = () => p.evaluate(() => document.body.innerText.includes("Villa") && /Collection priv/i.test(document.body.innerText) ? "intro" : "visiting");

await click("Entrer dans la villa");
await p.waitForTimeout(800);

// 1) Vol vers un point intérieur (ouvrir RDC puis Hall)
await click("Rez-de-chaussée");
await p.waitForTimeout(300);
console.log("vol Hall:", await click("Hall / Galerie"));
await p.waitForTimeout(1700);

// 2) Le menu/Retour est-il encore cliquable APRES le vol ? (bug d'avant)
const retourOk = await click("Retour");
await p.waitForTimeout(1700);
console.log("Retour cliquable apres vol:", retourOk);

// 3) ESC ne doit PAS sortir vers l'accueil
await p.keyboard.press("Escape");
await p.waitForTimeout(600);
const afterEsc = await phase();
console.log("apres Echap, phase =", afterEsc, afterEsc === "visiting" ? "✅ reste en visite" : "❌ sorti");

// 4) Glisser la souris doit tourner la vue (pas d'erreur)
await p.mouse.move(640, 400);
await p.mouse.down();
await p.mouse.move(440, 400, { steps: 8 });
await p.mouse.up();
await p.waitForTimeout(400);
await p.screenshot({ path: "shot-fix-draglook.png", timeout: 60000 });

console.log("ERREURS:", errs.join(" | ") || "(aucune)");
await b.close();
