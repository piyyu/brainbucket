import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInput } from "./ChatInput";
import { Copy, RefreshCw, Sparkles, Lightbulb, Search, Zap } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  { icon: Lightbulb, text: "Summarize my recent notes", color: "text-amber-400" },
  { icon: Search, text: "Find notes about marketing", color: "text-sky-400" },
  { icon: Zap, text: "What did I write last week?", color: "text-emerald-400" },
];

export const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentInput },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          auth: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ query: currentInput }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="h-full w-full overflow-y-auto relative bg-background bg-grid">
      {/* Ambient glow */}
      {isEmpty && (
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-indigo-500/8 via-purple-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
      )}

      <div className="w-full max-w-3xl mx-auto px-4 pt-8 pb-36 relative z-10 flex flex-col min-h-full">
        {/* Empty state */}
        {isEmpty && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <div>
                <h2 className="text-[24px] font-semibold text-foreground tracking-[-0.02em] mb-1">
                  What do you want to know?
                </h2>
                <p className="text-[14px] text-muted-foreground">
                  Ask anything about your buckets and notes.
                </p>
              </div>

              {/* Suggestion pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    onClick={() => { setInput(s.text); }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border/50 bg-secondary/30 backdrop-blur-sm text-[13px] text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent/50 transition-all cursor-pointer card-hover"
                  >
                    <s.icon className={`w-3.5 h-3.5 ${s.color}`} strokeWidth={1.5} />
                    {s.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              key={idx}
              className={`flex mb-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 mr-3 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2} />
                </div>
              )}

              <div
                className={`
                  max-w-[80%] text-[14px] leading-[1.65] relative
                  ${msg.role === "user"
                    ? "bg-foreground text-background px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm"
                    : "text-foreground pt-0.5"
                  }
                `}
              >
                {msg.content}

                {msg.role === "assistant" && (
                  <div className="mt-3 flex gap-1">
                    <button className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-accent px-2 py-1 rounded-md">
                      <Copy className="w-3 h-3" strokeWidth={1.5} /> Copy
                    </button>
                    <button className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-accent px-2 py-1 rounded-md">
                      <RefreshCw className="w-3 h-3" strokeWidth={1.5} /> Retry
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start items-start gap-3 mb-6">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div className="h-10" ref={bottomRef} />
      </div>

      {/* Chat Input — uses absolute so it follows parent container, not viewport */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none ${!isEmpty ? 'bg-gradient-to-t from-background via-background/95 to-transparent' : ''}`}>
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <ChatInput
            askQuestion={askQuestion}
            input={input}
            setInput={setInput}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};
