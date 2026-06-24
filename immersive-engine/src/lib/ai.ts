/**
 * ✦ AI GATEWAY (v0) — noyau réutilisable de la couche IA d'AMAVYA ✦
 * Routeur de modèles piloté par variables d'environnement :
 *   - AI_BASE_URL  (ex: https://api.openai.com/v1  |  http://localhost:11434/v1 pour Ollama)
 *   - AI_API_KEY   (ta clé — jamais commitée)
 *   - AI_MODEL     (ex: gpt-4o-mini | llama3.1 | qwen2.5 …)
 * Compatible « OpenAI chat completions » → couvre OpenAI, Ollama, Groq, OpenRouter…
 * Sans clé : repli local (réponses basiques à partir des données du projet).
 *
 * 👉 Demain on extrait ce fichier en service autonome (le Gateway), sans toucher
 *    aux SaaS qui l'appellent : le contrat reste `chat(messages)`.
 */
import { PATH, EXPERIENCE, CREATIONS } from "@/data/experience";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

/** System prompt = personnalité du gardien + contexte projet (data-driven). */
export function systemPrompt(): string {
  const works = PATH.filter((n) => n.kind === "creation")
    .map((n) => `- ${n.title} (${n.type}) — ${n.tech?.join(", ")}${n.url && n.url !== "#" ? ` — ${n.url}` : ""}`)
    .join("\n");
  return [
    `Tu es « AMI », le gardien robot de ${EXPERIENCE.name}, une galerie 3D orbitale cyberpunk-japonaise qui expose les créations de Tarek.`,
    `Réponds en français, de façon courte (2-4 phrases), chaleureuse, un brin geek/cyberpunk.`,
    `Tu connais ces créations exposées dans la galerie :`,
    works,
    `Tu peux conseiller quelle œuvre visiter et expliquer comment naviguer (Vue guidée = caméra cinématique ; Explorer = vol libre ; clic sur une œuvre = sa fiche).`,
    `Si on te demande quelque chose hors-sujet, reste sympa et recentre gentiment sur la galerie.`,
  ].join("\n");
}

/** Repli sans clé : reste utile pour la démo (réponses à partir des données). */
function fallback(messages: ChatMessage[]): string {
  const last = (messages[messages.length - 1]?.content ?? "").toLowerCase();
  const titles = CREATIONS.map((n) => n.title);
  if (/créa|crea|œuvre|oeuvre|projet|montre|expos|voir|galerie/.test(last)) {
    return `Dans la galerie tu peux explorer : ${titles.join(", ")}. Clique une œuvre pour ouvrir sa fiche ! (💡 Pour une vraie conversation IA, configure une clé : AI_API_KEY.)`;
  }
  if (/comment|navig|déplac|deplac|marche|vol|bouger/.test(last)) {
    return `Passe en « Explorer » pour voler librement (ZQSD/WASD, Espace pour monter), ou « Vue guidée » pour la balade cinématique. Vise une œuvre puis clique pour sa fiche.`;
  }
  return `Salut, je suis AMI, le gardien d'AMAVYA 🤖. Je peux te parler des créations (${titles.slice(0, 3).join(", ")}…) ou t'aider à naviguer. (Mode basique : ajoute une clé AI_API_KEY pour une vraie IA.)`;
}

/** Point d'entrée du Gateway : un seul contrat, peu importe le fournisseur. */
export async function chat(messages: ChatMessage[]): Promise<string> {
  const key = process.env.AI_API_KEY;
  const base = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (!key) return fallback(messages);

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt() }, ...messages],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });
    if (!res.ok) {
      return `(Gateway) Le fournisseur a répondu ${res.status}. Vérifie AI_BASE_URL / AI_MODEL / AI_API_KEY.`;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "…";
  } catch {
    return `(Gateway) Impossible de joindre le fournisseur IA. En local, lance Ollama ou vérifie AI_BASE_URL.`;
  }
}
