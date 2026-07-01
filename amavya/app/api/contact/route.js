import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CRM Amavya (projet Supabase dédié). Les leads du formulaire atterrissent dans
// la table `partner_leads`, section « Leads entrants » du CRM. L'insertion publique
// est protégée par la policy RLS `pl_public_insert` (valide les champs + force
// status='new'). La clé anon est publiable par conception ; elle reste ici côté
// serveur (route Node), jamais exposée au navigateur.
const SUPA_URL = "https://qrotbfsvaouwyoyqtqlr.supabase.co";
const SUPA_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyb3RiZnN2YW91d3lveXF0cWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzODA0OTcsImV4cCI6MjA5Njk1NjQ5N30.Pb8o-rLCkUGsrmb81kqEASAf0BJ36Ms6pO56JeywcHU";

// Rate-limit basique en mémoire (best-effort par instance Vercel).
// Même style que /api/chat. 5 requêtes / 10 min par IP.
const RATE_WINDOW = 600_000;
const RATE_MAX = 5;
const rateMap = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const arr = (rateMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  if (arr.length >= RATE_MAX) {
    rateMap.set(ip, arr);
    return true;
  }
  arr.push(now);
  rateMap.set(ip, arr);
  return false;
}

function getIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

// Anti-abus cross-site : le formulaire n'est soumis que depuis amavya.cloud.
// On refuse toute requête d'une autre origine (limite le spam scripté du CRM).
const ALLOWED_HOSTS = new Set([
  "amavya.cloud",
  "www.amavya.cloud",
  "localhost",
  "localhost:3000",
]);
function originAllowed(req) {
  const src = req.headers.get("origin") || req.headers.get("referer") || "";
  if (!src) return false;
  try {
    const h = new URL(src).host;
    return ALLOWED_HOSTS.has(h) || h.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v, n) => String(v ?? "").trim().slice(0, n);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function saveToSupabase(payload) {
  const res = await fetch(SUPA_URL + "/rest/v1/partner_leads", {
    method: "POST",
    headers: {
      apikey: SUPA_ANON,
      Authorization: "Bearer " + SUPA_ANON,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error("Supabase HTTP " + res.status + " " + detail);
  }
}

async function sendNotificationEmail(lead, qualif) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn("[AMAVYA contact] SMTP non configuré, notification ignorée");
    return;
  }
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE ?? "true") === "true",
    auth: { user, pass },
  });
  const to = process.env.CONTACT_TO || "contact@amavya.cloud";
  const from = process.env.CONTACT_FROM || `"AMAVYA — Site" <${user}>`;
  const subject = `[AMAVYA] Nouveau lead — ${lead.full_name}${qualif.outil ? ` (${qualif.outil})` : ""}`;
  const text = [
    `Nouveau lead reçu via amavya.cloud`,
    ``,
    `Nom         : ${lead.full_name}`,
    `Email       : ${lead.email}`,
    `Téléphone   : ${lead.phone || "—"}`,
    `Structure   : ${lead.structure}`,
    `Outil voulu : ${qualif.outil || "—"}`,
    `Secteur     : ${qualif.secteur || "—"}`,
    `Type        : ${qualif.type_entreprise || "—"}`,
    `Lieu        : ${[lead.postal_code, lead.city].filter(Boolean).join(" ") || "—"}`,
    ``,
    `Message :`,
    lead.message || "—",
    ``,
    `— Envoyé depuis : ${lead.page_url}`,
  ].join("\n");
  const row = (k, v) =>
    `<tr><td style="padding:6px 0;color:#9b9bb0">${k}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`;
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:auto;padding:24px;background:#0b0b14;color:#e9e9f2;border-radius:16px">
      <h2 style="color:#f0d27a;margin:0 0 16px">Nouveau lead AMAVYA</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${row("Nom", lead.full_name)}
        <tr><td style="padding:6px 0;color:#9b9bb0">Email</td><td style="padding:6px 0"><a style="color:#f0d27a" href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
        ${row("Téléphone", lead.phone || "—")}
        ${row("Structure", lead.structure)}
        ${row("Outil voulu", qualif.outil || "—")}
        ${row("Secteur", qualif.secteur || "—")}
        ${row("Type", qualif.type_entreprise || "—")}
        ${row("Lieu", [lead.postal_code, lead.city].filter(Boolean).join(" ") || "—")}
      </table>
      <div style="margin-top:18px;padding:16px;background:rgba(240,210,122,0.08);border-left:3px solid #f0d27a;border-radius:8px;white-space:pre-wrap">${esc(lead.message || "—")}</div>
      <p style="margin-top:18px;font-size:12px;color:#6b6b80">Envoyé depuis ${esc(lead.page_url)}</p>
    </div>`;
  await transporter.sendMail({ from, to, replyTo: lead.email, subject, text, html });
}

export async function POST(req) {
  if (!originAllowed(req)) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const full_name = clip(body.full_name, 120);
  const email = clip(body.email, 250);
  const phone = clip(body.phone, 30);
  const company = clip(body.company, 200);
  const message = clip(body.message, 3000);
  const honeypot = clip(body.honeypot, 50);

  // Tagging du lead : axe produit (outil voulu) + verticale (secteur) + taille.
  // Désormais stockés en colonnes dédiées du CRM (plus de concaténation au message).
  const outil = clip(body.outil, 40);
  const typeEntreprise = clip(body.type_entreprise, 80);
  const secteur = clip(body.secteur, 80);
  const ville = clip(body.ville, 80);
  const codePostal = clip(body.code_postal, 10);

  if (honeypot) return Response.json({ ok: true }); // bot silencieux

  // Rate-limit par IP avant toute écriture Supabase / envoi d'email.
  const ip = getIp(req);
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  if (full_name.length < 2) return Response.json({ ok: false, error: "name" }, { status: 400 });
  if (!EMAIL_RX.test(email)) return Response.json({ ok: false, error: "email" }, { status: 400 });
  if (message.length < 2) return Response.json({ ok: false, error: "message" }, { status: 400 });

  const lead = {
    full_name,
    structure: company.length >= 2 ? company : "Particulier",
    email,
    phone,
    support_type: "autre",
    // Colonnes de tagging du CRM
    outil,
    secteur,
    type_entreprise: typeEntreprise,
    city: ville,
    postal_code: codePostal,
    message,
    honeypot_filled: false,
    user_agent: clip(req.headers.get("user-agent"), 500),
    page_url: clip(body.page_url, 500),
    referrer: clip(body.referrer, 500),
    // status laissé à la valeur par défaut 'new' (exigé par la policy RLS).
  };

  try {
    await saveToSupabase(lead);
  } catch (err) {
    console.error("[AMAVYA contact] supabase error", err);
    return Response.json({ ok: false, error: "save" }, { status: 502 });
  }

  // L'email ne doit pas bloquer la réponse au visiteur si le SMTP rate.
  try {
    await sendNotificationEmail(lead, { outil, secteur, type_entreprise: typeEntreprise });
  } catch (err) {
    console.error("[AMAVYA contact] mail error", err);
  }

  return Response.json({ ok: true });
}
