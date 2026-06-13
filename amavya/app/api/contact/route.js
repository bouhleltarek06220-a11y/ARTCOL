import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v, n) => String(v ?? "").trim().slice(0, n);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function saveToSupabase(payload) {
  if (!SUPA_URL || !SUPA_ANON) {
    throw new Error("Supabase non configuré (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquants)");
  }
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
  if (!res.ok) throw new Error("Supabase HTTP " + res.status);
}

async function sendNotificationEmail(lead) {
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
  const subject = `[AMAVYA] Nouveau message — ${lead.full_name}`;
  const text = [
    `Nouveau message reçu via amavya.cloud`,
    ``,
    `Nom        : ${lead.full_name}`,
    `Email      : ${lead.email}`,
    `Téléphone  : ${lead.phone || "—"}`,
    `Structure  : ${lead.structure}`,
    ``,
    `Message :`,
    lead.message,
    ``,
    `— Envoyé depuis : ${lead.page_url}`,
  ].join("\n");
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:auto;padding:24px;background:#0b0b14;color:#e9e9f2;border-radius:16px">
      <h2 style="color:#f0d27a;margin:0 0 16px">Nouveau message AMAVYA</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#9b9bb0">Nom</td><td style="padding:6px 0"><strong>${esc(lead.full_name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#9b9bb0">Email</td><td style="padding:6px 0"><a style="color:#f0d27a" href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#9b9bb0">Téléphone</td><td style="padding:6px 0">${esc(lead.phone || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#9b9bb0">Structure</td><td style="padding:6px 0">${esc(lead.structure)}</td></tr>
      </table>
      <div style="margin-top:18px;padding:16px;background:rgba(240,210,122,0.08);border-left:3px solid #f0d27a;border-radius:8px;white-space:pre-wrap">${esc(lead.message)}</div>
      <p style="margin-top:18px;font-size:12px;color:#6b6b80">Envoyé depuis ${esc(lead.page_url)}</p>
    </div>`;
  await transporter.sendMail({
    from,
    to,
    replyTo: lead.email,
    subject,
    text,
    html,
  });
}

export async function POST(req) {
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

  // Champs de qualification (ajoutés au site, pas une colonne Supabase) :
  // on les prefixe dans le message pour que Tarek les voie dans son CRM
  // sans changer le schéma `partner_leads`.
  const typeEntreprise = clip(body.type_entreprise, 80);
  const secteur = clip(body.secteur, 80);
  const ville = clip(body.ville, 80);
  const codePostal = clip(body.code_postal, 10);

  if (honeypot) return Response.json({ ok: true }); // bot silencieux
  if (full_name.length < 2) return Response.json({ ok: false, error: "name" }, { status: 400 });
  if (!EMAIL_RX.test(email)) return Response.json({ ok: false, error: "email" }, { status: 400 });
  if (message.length < 2) return Response.json({ ok: false, error: "message" }, { status: 400 });

  const qualif = [];
  if (typeEntreprise) qualif.push(`Type: ${typeEntreprise}`);
  if (secteur) qualif.push(`Secteur: ${secteur}`);
  if (ville || codePostal) qualif.push(`Lieu: ${[codePostal, ville].filter(Boolean).join(" ")}`);
  const qualifLine = qualif.length ? `[Qualif: ${qualif.join(" | ")}]\n` : "";

  const lead = {
    full_name,
    structure: company.length >= 2 ? company : "Particulier",
    email,
    phone,
    support_type: "autre",
    message: `[AMAVYA — Contact site]\n${qualifLine}${message}`,
    honeypot_filled: false,
    user_agent: clip(req.headers.get("user-agent"), 500),
    page_url: clip(body.page_url, 500),
    referrer: clip(body.referrer, 500),
  };

  try {
    await saveToSupabase(lead);
  } catch (err) {
    console.error("[AMAVYA contact] supabase error", err);
    return Response.json({ ok: false, error: "save" }, { status: 502 });
  }

  // L'email ne doit pas bloquer la réponse au visiteur si le SMTP rate.
  try {
    await sendNotificationEmail(lead);
  } catch (err) {
    console.error("[AMAVYA contact] mail error", err);
  }

  return Response.json({ ok: true });
}
