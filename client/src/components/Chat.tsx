import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInput } from "./ChatInput";
import { Copy, RefreshCw, Sparkles, Lightbulb, Search, Zap } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./icons/Logo";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  { icon: Lightbulb, text: "Summarize my recent notes", color: "text-amber-400" },
  { icon: Search, text: "Find notes about marketing", color: "text-sky-400" },
  { icon: Zap, text: "What did I write last week?", color: "text-emerald-400" },
];

interface ChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Chat = ({ messages, setMessages, input, setInput, loading, setLoading }: ChatProps) => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const handleRetry = async (idx: number) => {
    if (loading) return;
    const userMsgIdx = idx - 1;
    if (userMsgIdx < 0 || messages[userMsgIdx].role !== "user") return;

    const userPrompt = messages[userMsgIdx].content;
    const newMessages = messages.slice(0, userMsgIdx + 1);
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          auth: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ query: userPrompt }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Something went wrong. Please try again.",
      }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Empty state — centered with logo and input */}
        {isEmpty && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 w-full max-w-xl"
            >
              {/* Logo */}
              <div className="flex justify-center mb-2">
                <div className="w-14 h-14 bg-foreground rounded-xl flex items-center justify-center text-background shadow-lg">
                  <Logo width={28} height={28} />
                </div>
              </div>

              <div>
                <h2 className="text-[24px] font-semibold text-foreground tracking-[-0.02em] mb-1">
                  What do you want to know?
                </h2>
                <p className="text-[14px] text-muted-foreground">
                  Ask anything about your buckets and notes.
                </p>
              </div>

              {/* Centered input in empty state */}
              <div className="pt-2">
                <ChatInput
                  askQuestion={askQuestion}
                  input={input}
                  setInput={setInput}
                  disabled={loading}
                />
              </div>

              {/* Suggestion pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    onClick={() => { setInput(s.text); }}
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border/50 bg-secondary/20 backdrop-blur-sm text-[13px] text-muted-foreground hover:text-foreground hover:border-border transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <s.icon className={`w-3.5 h-3.5 ${s.color} relative z-10`} strokeWidth={1.5} />
                    <span className="relative z-10">{s.text}</span>
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
                    ? "bg-foreground text-background px-4 py-2.5 rounded-xl rounded-br-sm shadow-sm"
                    : "text-foreground pt-0.5"
                  }
                `}
              >
                {msg.content}

                {msg.role === "assistant" && (
                  <div className="mt-3 flex gap-1">
                    <button
                      onClick={() => handleCopy(msg.content)}
                      className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-accent px-2 py-1 rounded-md"
                    >
                      <Copy className="w-3 h-3" strokeWidth={1.5} /> Copy
                    </button>
                    {idx === messages.length - 1 && (
                      <button
                        onClick={() => handleRetry(idx)}
                        disabled={loading}
                        className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-accent px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} strokeWidth={1.5} /> Retry
                      </button>
                    )}
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

      {/* Bottom-anchored input (only when conversation has messages) */}
      {!isEmpty && (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none bg-gradient-to-t from-background via-background/95 to-transparent">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <ChatInput
              askQuestion={askQuestion}
              input={input}
              setInput={setInput}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};
