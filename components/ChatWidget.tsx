"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  session_id: string;
  sender: "user" | "admin";
  text: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  guest_name: string;
  status: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"intro" | "chat">("intro");
  const [guestName, setGuestName] = useState("");
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (session) {
      pollMessages();
      pollRef.current = setInterval(pollMessages, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function pollMessages() {
    if (!session) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  async function handleStart() {
    if (!guestName.trim()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({ guest_name: guestName.trim(), status: "open" })
        .select()
        .single();
      if (error || !data) throw error;
      setSession(data);
      setPhase("chat");
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || !session) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    try {
      const supabase = createClient();
      await supabase.from("chat_messages").insert({
        session_id: session.id,
        sender: "user",
        text,
      });
      await pollMessages();
    } catch {
      setInput(text);
    } finally {
      setSending(false);
    }
  }

  async function handleClose() {
    if (session) {
      const supabase = createClient();
      await supabase
        .from("chat_sessions")
        .update({ status: "closed" })
        .eq("id", session.id);
    }
    if (pollRef.current) clearInterval(pollRef.current);
    setSession(null);
    setMessages([]);
    setPhase("intro");
    setGuestName("");
    setOpen(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Panel */}
      {open && (
        <div className="mb-4 w-80 bg-[#131d2e] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-blue-500/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white text-sm font-medium">
                Чат с ELEKTROPROFI
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {phase === "intro" && (
            <div className="p-4 flex flex-col gap-3">
              <p className="text-gray-300 text-sm">
                Привет! Напишите ваше имя, чтобы начать чат со специалистом.
              </p>
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Ваше имя"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
              />
              <button
                onClick={handleStart}
                disabled={loading || !guestName.trim()}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Начать чат"
                )}
              </button>
            </div>
          )}

          {phase === "chat" && (
            <>
              {/* Messages */}
              <div className="flex-1 h-64 overflow-y-auto p-3 space-y-2">
                <div className="text-center text-gray-600 text-xs mb-2">
                  Чат начат. Мы ответим вам в ближайшее время.
                </div>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white/5 text-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 p-3 border-t border-white/5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Сообщение..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-60"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Открыть чат"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
