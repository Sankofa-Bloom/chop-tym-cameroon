import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Msg = {
  role: "user" | "assistant";
  content: string;
  quickReplies?: string[];
  submitted?: boolean;
};

const WHATSAPP_NUMBER = "237670416449";

export const AIChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "How far 👋 Na ChopTym AI here. Wetin you wan make we do for you today?",
      quickReplies: ["🍲 Food", "🛒 Errand", "📦 Package", "💬 Other"],
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat-assistant", {
        body: {
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      const reply: Msg = {
        role: "assistant",
        content: data.reply,
        quickReplies: data.quick_replies || [],
        submitted: !!data.submitted,
      };
      setMessages((prev) => [...prev, reply]);

      if (data.submitted) {
        toast({
          title: "Request sent ✅",
          description: "Our team will contact you shortly.",
        });
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      toast({
        title: "Chat unavailable",
        description: e?.message || "Please try again or use WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handoffWhatsApp = () => {
    const transcript = messages
      .map((m) => `${m.role === "user" ? "Me" : "AI"}: ${m.content}`)
      .join("\n");
    const msg = `Hello ChopTym! I was chatting with your AI assistant and would like to continue with a person.\n\n--- Chat so far ---\n${transcript}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      {/* Floating button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-44 right-4 z-40"
        style={{ zIndex: 9998 }}
      >
        <motion.button
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-gradient-to-br from-primary to-orange-600 text-primary-foreground p-4 rounded-full shadow-2xl group"
          aria-label="Open AI chat"
        >
          {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          {!open && (
            <>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[600px] max-h-[85vh] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ zIndex: 9999 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-orange-600 text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1">
                    ChopTym AI <Sparkles className="w-3 h-3" />
                  </h3>
                  <p className="text-xs opacity-90">Your virtual assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-background border rounded-bl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                    {m.role === "assistant" && m.quickReplies && m.quickReplies.length > 0 && i === messages.length - 1 && !loading && (
                      <div className="flex flex-wrap gap-2">
                        {m.quickReplies.map((q, qi) => (
                          <button
                            key={qi}
                            onClick={() => send(q)}
                            className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-full transition"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-background border px-4 py-2 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp handoff */}
            <button
              onClick={handoffWhatsApp}
              className="border-t bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Continue on WhatsApp with a human
            </button>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t p-3 flex gap-2 bg-background"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
