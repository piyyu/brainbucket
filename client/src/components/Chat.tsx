
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInput } from "./ChatInput";
import { Copy, RefreshCw, Cpu } from "lucide-react";

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
    <div className="text-white h-full w-full overflow-y-auto relative bg-[#0f1012]">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto px-4 pt-8 pb-32 space-y-6 relative z-10">
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
                <div className="w-8 h-8 mr-4 rounded bg-[#1a1a1a] border border-[#333] flex items-center justify-center shrink-0 shadow-lg">
                  <Cpu className="w-4 h-4 text-[#888]" />
                </div>
              )}

              <div
                className={`
                  max-w-[80%] p-5 text-sm md:text-base leading-relaxed relative
                  ${msg.role === "user"
                    ? "bg-[#e5e5e5] text-black rounded-lg shadow-[4px_4px_0px_#111] border border-[#fff]"
                    : "bg-[#151515] text-[#e0e0e0] rounded-lg border border-[#333] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                  }
                `}
              >
                {/* Decorative screw/rivet for aesthetics */}
                <div className={`absolute top-2 ${msg.role === 'user' ? 'right-2 border-[#ccc]' : 'left-2 border-[#333]'} w-1.5 h-1.5 rounded-full border border-b-0 opacity-50`} />

                {msg.content}

                {msg.role === "assistant" && (
                  <div className="mt-3 pt-3 border-t border-[#333] flex gap-2">
                    <button className="text-[10px] uppercase tracking-wider text-[#666] hover:text-[#aaa] flex items-center gap-1 transition-colors">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                    <button className="text-[10px] uppercase tracking-wider text-[#666] hover:text-[#aaa] flex items-center gap-1 transition-colors">
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start items-center gap-4">
            <div className="w-8 h-8 rounded bg-[#1a1a1a] border border-[#333] flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-[#666] rounded-full animate-ping" />
            </div>
            <div className="text-[#666] text-xs uppercase tracking-widest font-mono animate-pulse">
              Processing Query...
            </div>
          </div>
        )}
        <div className="h-10" ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 md:left-24 right-0 p-4 md:p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent z-20">
        <div className="max-w-3xl mx-auto">
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
