import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1100;

// Rate-limit basique en mémoire (best-effort par instance).
const RATE_WINDOW = 60_000;
const RATE_MAX = 12;
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

const SYSTEM = `Tu es l'« Agent Prospection » d'AMAVYA, un agent IA qui qualifie
les prospects entrants pour des entreprises B2B.

# Profil client idéal d'AMAVYA (ICP)
- PME / ETI (françaises et francophones), contextes B2B
- Dirigeants, directeurs commerciaux, responsables marketing/opérations
- Douleurs : prospection chronophage, leads mal suivis, tâches répétitives,
  besoin de CRM intelligent, d'automatisation ou d'agents IA
- Mauvais fit : particuliers, demandes hors-sujet, spam, recherche d'emploi,
  démarchage de fournisseurs sans rapport.

# Ta mission
À partir des informations d'un lead (nom, société, email, besoin exprimé),
produis une qualification commerciale exploitable, en FRANÇAIS, professionnelle
et concrète. Déduis le contexte société à partir du nom/du domaine email quand
c'est possible (sans inventer de faits précis non vérifiables : reste prudent).

# Format de sortie — IMPÉRATIF
Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises
markdown. Schéma exact :
{
  "score": <entier 0-100>,
  "scoreLabel": "Chaud" | "Tiède" | "Froid",
  "summary": "<1 phrase: le besoin réel du lead>",
  "icpMatch": <true|false>,
  "icpReason": "<courte justification de la correspondance ICP>",
  "companyContext": {
    "sector": "<secteur déduit ou 'Inconnu'>",
    "sizeEstimate": "<taille estimée ou 'Inconnue'>",
    "notes": "<1 remarque utile, prudente>"
  },
  "suggestedEmail": {
    "subject": "<objet d'email personnalisé>",
    "body": "<corps d'email court (4-7 lignes), prêt à envoyer, ton pro et chaleureux, signé 'L'équipe AMAVYA'>"
  },
  "nextAction": "RDV" | "Relance" | "Écarter",
  "nextActionReason": "<courte justification>"
}
Règles de score : 80-100 = Chaud (fort fit + intention claire), 50-79 = Tiède,
0-49 = Froid. Sois discriminant : un lead hors ICP doit être Froid + 'Écarter'.`;

function buildUserPrompt({ fullName, company, email, need }) {
  return `Qualifie ce lead :
- Nom : ${fullName || "(non fourni)"}
- Société : ${company || "(non fournie)"}
- Email : ${email || "(non fourni)"}
- Besoin exprimé : ${need || "(non fourni)"}`;
}

function extractJson(text) {
  if (!text) return null;
  // tente un parse direct, sinon extrait le premier bloc { ... }
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Repli déterministe quand la clé API n'est pas configurée : la démo
// reste fonctionnelle partout (heuristique simple sur le texte du besoin).
function mockQualify({ fullName, company, email, need }) {
  const t = `${need || ""} ${company || ""}`.toLowerCase();
  const keywords = [
    "prospect", "commercial", "vente", "lead", "crm", "automat",
    "ia", "agent", "marketing", "client", "croissance", "rendez-vous",
    "pipeline", "saas", "process",
  ];
  const hits = keywords.filter((k) => t.includes(k)).length;
  const score = Math.max(18, Math.min(96, 42 + hits * 9 + (need ? need.length > 60 ? 8 : 0 : 0)));
  const label = score >= 80 ? "Chaud" : score >= 50 ? "Tiède" : "Froid";
  const icp = score >= 50;
  const firstName = (fullName || "").trim().split(/\s+/)[0] || "";
  const domain = (email || "").split("@")[1] || "";
  return {
    score,
    scoreLabel: label,
    summary: need
      ? `Le lead exprime un besoin lié à : ${need.slice(0, 120)}`
      : "Besoin non précisé — à clarifier lors d'un premier échange.",
    icpMatch: icp,
    icpReason: icp
      ? "Profil B2B avec des signaux de besoin en prospection/automatisation."
      : "Signaux insuffisants pour confirmer la correspondance avec la cible AMAVYA.",
    companyContext: {
      sector: company ? "À confirmer (déduit du nom de société)" : "Inconnu",
      sizeEstimate: "Inconnue",
      notes: domain ? `Domaine email : ${domain}.` : "Pas de domaine professionnel détecté.",
    },
    suggestedEmail: {
      subject: company
        ? `${company} × AMAVYA — vos agents IA au service de votre croissance`
        : "AMAVYA — vos agents IA au service de votre croissance",
      body: `Bonjour ${firstName || ""},\n\nMerci pour votre message. Chez AMAVYA, nous déployons des agents IA qui qualifient vos prospects, relancent automatiquement et alimentent votre pipeline 24/7.\n\nSeriez-vous disponible cette semaine pour un court échange de 15 minutes ? Je vous montrerai concrètement ce que nos agents peuvent faire pour ${company || "votre activité"}.\n\nBien à vous,\nL'équipe AMAVYA`,
    },
    nextAction: score >= 80 ? "RDV" : score >= 50 ? "Relance" : "Écarter",
    nextActionReason:
      score >= 80
        ? "Fort potentiel : proposer un rendez-vous rapidement."
        : score >= 50
          ? "Intérêt à confirmer : relancer avec un message de valeur."
          : "Hors cible apparente : écarter ou requalifier plus tard.",
    _mock: true,
  };
}

function validShape(d) {
  return (
    d &&
    typeof d.score === "number" &&
    d.suggestedEmail &&
    typeof d.suggestedEmail.body === "string"
  );
}

export async function POST(req) {
  const ip = getIp(req);
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const lead = {
    fullName: String(body.fullName || "").slice(0, 200),
    company: String(body.company || "").slice(0, 200),
    email: String(body.email || "").slice(0, 200),
    need: String(body.need || "").slice(0, 2000),
  };

  if (!lead.need && !lead.company && !lead.fullName) {
    return Response.json({ ok: false, error: "empty_lead" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Pas de clé → repli démo (toujours fonctionnel)
  if (!apiKey) {
    return Response.json({ ok: true, mode: "demo", result: mockQualify(lead) });
  }

  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      messages: [{ role: "user", content: buildUserPrompt(lead) }],
    });

    const text = (msg.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const parsed = extractJson(text);
    if (!validShape(parsed)) {
      // Claude n'a pas renvoyé un JSON exploitable → repli propre
      return Response.json({ ok: true, mode: "fallback", result: mockQualify(lead) });
    }
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    return Response.json({ ok: true, mode: "live", result: parsed });
  } catch (err) {
    console.error("[AMAVYA qualify] anthropic error", err);
    return Response.json({ ok: true, mode: "fallback", result: mockQualify(lead) });
  }
}

export async function GET() {
  return Response.json({ enabled: Boolean(process.env.ANTHROPIC_API_KEY) });
}
