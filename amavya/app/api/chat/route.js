import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/chatbot-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 600;
const MAX_HISTORY = 16; // 8 échanges max (visiteur + assistant)
const MAX_MSG_LEN = 2000;

// Rate-limit basique en mémoire (best-effort par instance Vercel).
// 8 messages / 60 s par IP.
const RATE_WINDOW = 60_000;
const RATE_MAX = 8;
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

function sanitizeHistory(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-MAX_HISTORY)
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({
      role: m.role,
      content: String(m.content || "").slice(0, MAX_MSG_LEN),
    }))
    .filter((m) => m.content.length > 0);
}

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, error: "chatbot_disabled" },
      { status: 503 },
    );
  }

  const ip = getIp(req);
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const history = sanitizeHistory(body.messages);
  const lang = ["fr", "en", "es"].includes(body.lang) ? body.lang : "fr";

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return Response.json(
      { ok: false, error: "need_user_message" },
      { status: 400 },
    );
  }

  const langHint = {
    fr: "Le visiteur écrit en français — réponds en français.",
    en: "The visitor writes in English — reply in English.",
    es: "El visitante escribe en español — responde en español.",
  }[lang];

  try {
    const client = new Anthropic({ apiKey });
    const stream = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: `${SYSTEM_PROMPT}\n\n# Langue du visiteur\n${langHint}`,
      messages: history,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta?.type === "text_delta" &&
              event.delta.text
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          console.error("[AMAVYA chatbot] stream error", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[AMAVYA chatbot] anthropic error", err);
    return Response.json(
      { ok: false, error: "upstream" },
      { status: 502 },
    );
  }
}

// Endpoint léger utilisé par le composant Chatbot pour savoir
// si la clé API est configurée (et donc s'il doit s'afficher).
export async function GET() {
  return Response.json({ enabled: Boolean(process.env.ANTHROPIC_API_KEY) });
}
