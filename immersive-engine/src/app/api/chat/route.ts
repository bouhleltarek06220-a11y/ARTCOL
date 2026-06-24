/**
 * Endpoint du Gateway IA : POST { messages } -> { reply }.
 * C'est l'API que le robot (et demain tes autres SaaS) appellent.
 */
import { NextRequest } from "next/server";
import { chat, type ChatMessage } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = (body.messages ?? []).slice(-12); // on borne le contexte
    const reply = await chat(messages);
    return Response.json({ reply });
  } catch {
    return Response.json({ reply: "(Gateway) Requête invalide." }, { status: 400 });
  }
}
