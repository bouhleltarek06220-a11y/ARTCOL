"use client";

/**
 * Chat avec « AMI », le gardien d'AMAVYA. Appelle le Gateway IA (/api/chat).
 * Ouvrable partout ; libère la souris (utile en mode vol libre).
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const HELLO: Msg = {
  role: "assistant",
  content: "Salut, je suis AMI 🤖 le gardien d'AMAVYA. Demande-moi quelles créations explorer ou comment naviguer !",
};

export default function RobotChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([HELLO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...msgs, { role: "user", content: text } as Msg];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply ?? "…" }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "(hors-ligne) Je n'ai pas pu répondre." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* bouton d'ouverture */}
      {!open && (
        <button
          onClick={() => {
            document.exitPointerLock?.();
            setOpen(true);
          }}
          className="pointer-events-auto absolute bottom-6 left-6 flex items-center gap-2 rounded-full border border-[#7CFF3D]/60 bg-[#7CFF3D]/10 px-4 py-2.5 text-sm text-white backdrop-blur transition hover:bg-[#7CFF3D]/20"
        >
          💬 Parler au gardien
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto absolute bottom-6 left-6 flex h-[460px] w-[min(380px,92vw)] flex-col overflow-hidden rounded-2xl border border-[#7CFF3D]/40 bg-[#0b0816]/92 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#7CFF3D] shadow-[0_0_10px_#7CFF3D]" />
                <span className="text-sm font-semibold text-white">AMI · Gardien AMAVYA</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/50 transition hover:text-white" aria-label="Fermer">✕</button>
            </div>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                      m.role === "user" ? "bg-cyan-300/15 text-white" : "border border-[#7CFF3D]/25 bg-white/[0.04] text-white/90"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-[12px] text-white/40">AMI réfléchit…</div>}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Écris au gardien…"
                className="flex-1 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#7CFF3D]/50"
              />
              <button
                onClick={send}
                disabled={loading}
                className="rounded-full bg-[#7CFF3D] px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
