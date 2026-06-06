"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "./LangProvider";

const STORAGE_KEY = "amavya-chat-history";
const ENABLED_KEY = "amavya-chat-enabled";

const UI = {
  fr: {
    tooltip: "Discuter avec AMAVYA",
    title: "Assistant AMAVYA",
    subtitle: "En ligne · répond en quelques secondes",
    placeholder: "Posez votre question…",
    send: "Envoyer",
    sending: "Envoi…",
    welcome:
      "Bonjour 👋 Je suis l'assistant AMAVYA. Dites-moi en quelques mots ce qui vous amène — agents IA, CRM, automatisations, prospection… je vous oriente.",
    error:
      "Désolé, je n'ai pas pu répondre. Vous pouvez réessayer ou nous écrire via le bouton Contact.",
    rateLimited:
      "Beaucoup de messages d'un coup — laissez-moi une minute le temps de souffler.",
    poweredBy: "Propulsé par AMAVYA",
    closeAria: "Fermer le chat",
    openAria: "Ouvrir le chat AMAVYA",
    resetAria: "Recommencer la conversation",
  },
  en: {
    tooltip: "Chat with AMAVYA",
    title: "AMAVYA assistant",
    subtitle: "Online · replies within seconds",
    placeholder: "Ask your question…",
    send: "Send",
    sending: "Sending…",
    welcome:
      "Hi 👋 I'm the AMAVYA assistant. Tell me in a few words what brings you here — AI agents, CRM, automation, prospecting… I'll point you the right way.",
    error:
      "Sorry, I couldn't reply. Try again or reach us via the Contact button.",
    rateLimited:
      "A lot of messages at once — give me a minute to catch up.",
    poweredBy: "Powered by AMAVYA",
    closeAria: "Close chat",
    openAria: "Open AMAVYA chat",
    resetAria: "Start a new conversation",
  },
  es: {
    tooltip: "Chatear con AMAVYA",
    title: "Asistente AMAVYA",
    subtitle: "En línea · responde en segundos",
    placeholder: "Haga su pregunta…",
    send: "Enviar",
    sending: "Enviando…",
    welcome:
      "¡Hola 👋 Soy el asistente de AMAVYA. Dígame en pocas palabras qué le trae — agentes IA, CRM, automatización, prospección… le oriento.",
    error:
      "Lo siento, no pude responder. Inténtelo de nuevo o escríbanos con el botón Contacto.",
    rateLimited:
      "Muchos mensajes a la vez — déjeme un minuto para respirar.",
    poweredBy: "Impulsado por AMAVYA",
    closeAria: "Cerrar chat",
    openAria: "Abrir chat AMAVYA",
    resetAria: "Reiniciar la conversación",
  },
};

export default function Chatbot() {
  const { lang } = useLang();
  const t = UI[lang] || UI.fr;

  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | streaming | error
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Récupère le drapeau "chatbot activé" (clé API présente côté serveur).
  // Évite d'afficher la bulle si le backend ne peut pas répondre.
  useEffect(() => {
    let cached = null;
    try {
      cached = sessionStorage.getItem(ENABLED_KEY);
    } catch {
      /* ignore */
    }
    if (cached === "1") {
      setEnabled(true);
      return;
    }
    if (cached === "0") return;
    fetch("/api/chat")
      .then((r) => r.json())
      .then((data) => {
        const on = Boolean(data?.enabled);
        setEnabled(on);
        try {
          sessionStorage.setItem(ENABLED_KEY, on ? "1" : "0");
        } catch {
          /* ignore */
        }
      })
      .catch(() => setEnabled(false));
  }, []);

  // Restauration de la conversation au montage.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Sauvegarde à chaque changement.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Scroll auto en bas à chaque nouveau message / token.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Focus l'input à l'ouverture.
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setStatus("idle");
    setErrorMsg("");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || status === "streaming") return;
    setErrorMsg("");
    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStatus("streaming");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let code = "";
        try {
          const data = await res.json();
          code = data?.error || "";
        } catch {
          /* ignore */
        }
        const msg = code === "rate_limited" ? t.rateLimited : t.error;
        setMessages((prev) => prev.slice(0, -1));
        setErrorMsg(msg);
        setStatus("error");
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      setStatus("idle");
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("[AMAVYA chatbot] fetch error", err);
      setMessages((prev) => prev.slice(0, -1));
      setErrorMsg(t.error);
      setStatus("error");
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!enabled) return null;

  const renderMessages =
    messages.length === 0
      ? [{ role: "assistant", content: t.welcome }]
      : messages;

  return (
    <>
      {/* Bouton flottant */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.openAria}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="group fixed bottom-5 left-5 z-[150] flex h-14 w-14 items-center justify-center rounded-full text-ink shadow-[0_12px_40px_-8px_rgba(212,175,55,0.65)] sm:bottom-7 sm:left-7"
            style={{
              background:
                "linear-gradient(135deg, #a87f2e 0%, #f0d27a 55%, #d4af37 100%)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[#f0d27a]/60 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <RobotHead />
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-black"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fenêtre */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 left-3 z-[150] flex w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-gold/30 bg-black/85 shadow-[0_28px_80px_-20px_rgba(212,175,55,0.55)] backdrop-blur-xl sm:bottom-6 sm:left-6"
            style={{ maxHeight: "min(640px, calc(100vh - 2rem))" }}
            role="dialog"
            aria-label={t.title}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-gold/15 bg-[linear-gradient(110deg,rgba(168,127,46,0.25),rgba(240,210,122,0.15))] px-4 py-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
                style={{
                  background:
                    "linear-gradient(135deg, #a87f2e 0%, #f0d27a 55%, #d4af37 100%)",
                }}
              >
                <span className="text-sm font-bold tracking-tight">A</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-paper">
                  {t.title}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t.subtitle}
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label={t.resetAria}
                  className="rounded-full p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-paper"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4v6h6M20 20v-6h-6M5.5 14a7 7 0 0 0 12.5 1M18.5 10A7 7 0 0 0 6 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.closeAria}
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-paper"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {renderMessages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} />
              ))}
              {status === "streaming" &&
                messages[messages.length - 1]?.content === "" && <Typing />}
              {errorMsg && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gold/15 bg-black/60 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  placeholder={t.placeholder}
                  className="max-h-28 flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper placeholder:text-muted-soft outline-none transition-colors focus:border-gold/50"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={status === "streaming" || !input.trim()}
                  aria-label={t.send}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink shadow-[0_6px_24px_-6px_rgba(212,175,55,0.7)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #a87f2e 0%, #f0d27a 55%, #d4af37 100%)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 11l18-8-8 18-2-7-8-3z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      fill="currentColor"
                      fillOpacity="0.2"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] uppercase tracking-[0.25em] text-muted-soft">
                {t.poweredBy}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-gold/15 text-paper"
            : "rounded-bl-md border border-white/10 bg-white/5 text-paper"
        }`}
      >
        {content || "…"}
      </div>
    </div>
  );
}

function RobotHead() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="relative drop-shadow-sm"
    >
      {/* Antenne */}
      <line
        x1="16"
        y1="2.5"
        x2="16"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16" cy="2.5" r="1.4" fill="currentColor" />
      {/* Tête (capsule) */}
      <rect
        x="5"
        y="6.5"
        width="22"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      {/* Yeux */}
      <circle cx="11.5" cy="14.5" r="1.9" fill="currentColor" />
      <circle cx="20.5" cy="14.5" r="1.9" fill="currentColor" />
      {/* Sourire / bouche */}
      <path
        d="M12 19.2 Q16 21.4 20 19.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Oreilles (capteurs) */}
      <rect
        x="2.5"
        y="13"
        width="2.5"
        height="5"
        rx="1"
        fill="currentColor"
        opacity="0.85"
      />
      <rect
        x="27"
        y="13"
        width="2.5"
        height="5"
        rx="1"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Cou */}
      <rect
        x="13"
        y="24"
        width="6"
        height="2.5"
        rx="0.8"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

function Typing() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-3 py-2.5">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold/70"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
