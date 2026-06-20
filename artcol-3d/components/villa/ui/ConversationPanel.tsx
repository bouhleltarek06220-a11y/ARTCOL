"use client";

import { useEffect, useRef, useState } from "react";
import { useVilla } from "../store";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Bienvenue dans ma villa. Je suis l’hôte de cette galerie — chaque salle, chaque œuvre a une histoire. Que puis-je vous faire découvrir ?";

/**
 * Panneau de conversation avec l'hôte (LLM). S'ouvre quand la phase passe à
 * « talking ». Architecture prête à brancher l'IA : appelle /api/guide en
 * streaming. À la fermeture, on revient à la visite (et on reverrouille la
 * souris).
 */
export function ConversationPanel() {
  const phase = useVilla((s) => s.phase);
  const setPhase = useVilla((s) => s.setPhase);
  const lock = useVilla((s) => s.lock);
  const open = phase === "talking";

  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const close = () => {
    setPhase("visiting");
    requestAnimationFrame(() => lock?.());
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");

    // Historique réel envoyé à l'API (on exclut le message d'accueil d'affichage).
    const history = messages.filter((m, i) => !(i === 0 && m.role === "assistant"));
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: text }] }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Pardonnez-moi, la connexion s’est troublée. Reprenons dans un instant.",
        };
        return copy;
      });
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 right-0 z-30 flex w-[min(440px,92vw)] flex-col transition-transform duration-700 ${
        open ? "translate-x-0" : "translate-x-[110%]"
      }`}
      style={{
        background: "linear-gradient(180deg, rgba(247,242,233,.97), rgba(239,232,219,.98))",
        backdropFilter: "blur(26px) saturate(1.1)",
        borderLeft: "1px solid rgba(34,28,21,.14)",
        boxShadow: "-30px 0 80px -40px rgba(40,22,8,.4)",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
      aria-hidden={!open}
    >
      {open && (
        <>
          <button
            type="button"
            onClick={close}
            className="pointer-events-auto absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-lg text-[#4a4036] transition hover:bg-[#221c15] hover:text-[#f7f2e9]"
            style={{ border: "1px solid rgba(34,28,21,.14)" }}
            aria-label="Fermer la conversation"
          >
            ×
          </button>

          {/* En-tête */}
          <div className="px-11 pt-16">
            <div
              className="text-[10px] uppercase text-[#a98a5c]"
              style={{ fontFamily: "'Jost', system-ui, sans-serif", letterSpacing: "0.34em" }}
            >
              L’hôte · AMAVYA
            </div>
            <h2 className="mt-2 text-3xl font-normal text-[#221c15]">Le maître des lieux</h2>
            <div className="mt-5 h-px w-full bg-[rgba(34,28,21,.14)]" />
          </div>

          {/* Messages */}
          <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-11 py-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-2.5 text-[17px] leading-relaxed"
                  style={
                    m.role === "user"
                      ? { background: "#221c15", color: "#f7f2e9" }
                      : { background: "rgba(255,255,255,.6)", color: "#2c2820", border: "1px solid rgba(34,28,21,.1)" }
                  }
                >
                  {m.content || (m.role === "assistant" && busy ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          {/* Saisie */}
          <div
            className="pointer-events-auto flex items-center gap-2 px-7 py-5"
            style={{ borderTop: "1px solid rgba(34,28,21,.12)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Écrivez à votre hôte…"
              className="flex-1 rounded-full bg-white/70 px-5 py-3 text-[16px] text-[#221c15] outline-none"
              style={{ border: "1px solid rgba(34,28,21,.15)", fontFamily: "'Jost', system-ui, sans-serif" }}
            />
            <button
              type="button"
              onClick={send}
              disabled={busy}
              className="rounded-full bg-[#221c15] px-5 py-3 text-xs uppercase text-[#f7f2e9] transition hover:opacity-90 disabled:opacity-40"
              style={{ fontFamily: "'Jost', system-ui, sans-serif", letterSpacing: "0.2em" }}
            >
              Envoyer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
