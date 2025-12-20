import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInput } from "./ChatInput";

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
      const response = await fetch("http://localhost:3000/api/v1/ask", {
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
    <div className="text-white h-full w-full overflow-y-auto relative">
      <div className="w-full max-w-3xl mx-auto px-4 pt-4 pb-32 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${msg.role === "user"
                    ? "bg-white text-black rounded-br-none shadow-[0_14px_30px_rgba(0,0,0,0.25),inset_0_-3px_6px_rgba(236,72,153,0.55)]"
                    : "bg-white/5 text-white rounded-bl-none border border-white/10 backdrop-blur-sm"
                  }
                `}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white rounded-2xl rounded-bl-md px-4 py-3 text-sm">
              Thinking…
            </div>
          </div>
        )}
        <div className="h-32" ref={bottomRef} />
      </div>

      <ChatInput
        askQuestion={askQuestion}
        input={input}
        setInput={setInput}
        disabled={loading}
        isCentered={messages.length === 0}
      />
    </div >
  );
};
