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

      <div className="w-full max-w-3xl mx-auto px-4 pt-8 pb-36 space-y-6 relative z-10 flex flex-col min-h-full">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-6 h-6 mr-3 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" strokeWidth={2} />
                </div>
              )}

              <div
                className={`
                  max-w-[80%] text-[14px] leading-[1.6] relative
                  ${msg.role === "user"
                    ? "bg-foreground text-background px-4 py-2.5 rounded-[18px] rounded-br-[4px]"
                    : "text-foreground"
                  }
                `}
              >
                {msg.content}

                {msg.role === "assistant" && (
                  <div className="mt-3 flex gap-1">
                    <button className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer hover:bg-accent px-2 py-1 rounded-md">
                      <Copy className="w-3 h-3" strokeWidth={1.5} /> Copy
                    </button>
                    <button className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer hover:bg-accent px-2 py-1 rounded-md">
                      <RefreshCw className="w-3 h-3" strokeWidth={1.5} /> Retry
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-white animate-pulse" strokeWidth={2} />
            </div>
            <div className="text-muted-foreground text-[14px] animate-pulse pt-0.5">
              Thinking...
            </div>
          </div>
        )}
        <div className="h-10" ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 md:left-[260px] right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-20 pointer-events-none">
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
