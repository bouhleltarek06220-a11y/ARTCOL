import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Conversation avec l'hôte de la Villa Galerie AMAVYA (le propriétaire/artiste).
 * Propulsé par Claude (claude-opus-4-8) en streaming. Architecture prête à
 * l'emploi : il suffit de définir la variable d'environnement ANTHROPIC_API_KEY
 * sur le projet (Vercel). En son absence, un repli scénarisé garde l'expérience
 * fonctionnelle.
 */

const SYSTEM = `Tu es l'hôte et le maître des lieux de la « Villa Galerie AMAVYA » :
une immense villa d'architecte contemporaine, sur les hauteurs de la Côte d'Azur,
transformée en galerie d'art privée. Tu es un artiste-collectionneur visionnaire,
élégant, charismatique, chaleureux mais sobre. Cette villa et cette collection
sont les tiennes.

Ton rôle : accueillir le visiteur comme un invité privilégié, le guider dans la
visite, parler des œuvres, de l'architecture (béton, pierre, verre, double
hauteur, piscine à débordement), de l'art contemporain et de ta vision.

Style : français soigné, phrases courtes et incarnées, ton confidentiel et
raffiné. Réponses BRÈVES (2 à 4 phrases maximum). Tu poses parfois une question
pour entretenir l'échange. Tu ne sors jamais de ton personnage et ne mentionnes
jamais que tu es une IA.`;

const FALLBACK = [
  "Bienvenue chez moi. Cette villa, je l'ai conçue comme un écrin pour ma collection — chaque salle est une émotion. Que souhaitez-vous découvrir en premier ?",
  "L'art, ici, n'est pas accroché : il habite les lieux. Prenez votre temps, la lumière du couchant fait le reste.",
  "Suivez-moi du regard : le marbre, le béton, le verre… tout a été pensé pour servir les œuvres. Une pièce vous intrigue ?",
];

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Requête invalide.", { status: 400 });
  }

  const history: Msg[] = (body.messages ?? [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-12);

  const key = process.env.ANTHROPIC_API_KEY;

  // Repli scénarisé si la clé n'est pas (encore) configurée.
  if (!key) {
    const line = FALLBACK[Math.min(history.filter((m) => m.role === "user").length, FALLBACK.length - 1)];
    return new Response(line, {
      headers: { "content-type": "text/plain; charset=utf-8", "x-amavya-mode": "fallback" },
    });
  }

  const client = new Anthropic({ apiKey: key });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const llm = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          system: SYSTEM,
          messages: history.length
            ? history
            : [{ role: "user", content: "Bonjour." }],
        });
        llm.on("text", (t) => controller.enqueue(encoder.encode(t)));
        await llm.finalMessage();
      } catch {
        controller.enqueue(
          encoder.encode(
            "Pardonnez-moi, un instant de distraction… Reprenons votre visite quand vous voulez.",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "x-amavya-mode": "live" },
  });
}
