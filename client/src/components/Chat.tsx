import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInput } from "./ChatInput";
import { Copy, RefreshCw, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

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

  return (
    <div className="h-full w-full overflow-y-auto relative bg-background">

      <div className="w-full max-w-4xl mx-auto px-4 pt-8 pb-40 space-y-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 mr-4 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`
                  max-w-[85%] sm:max-w-[75%] p-5 text-[15px] leading-relaxed relative
                  ${msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-sm"
                    : "bg-card text-card-foreground rounded-2xl border border-border/50 shadow-sm"
                  }
                `}
              >
                {msg.content}

                {msg.role === "assistant" && (
                  <div className="mt-4 pt-3 border-t border-border/50 flex gap-3">
                    <button className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <button className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> Retry
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-muted-foreground text-sm font-medium animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div className="h-10" ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 md:left-24 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <ChatInput
            askQuestion={askQuestion}
            input={input}
            setInput={setInput}
            disabled={loading}
            isCentered={messages.length === 0}
          />
        </div>
      </div>

    </div >
  );
};
