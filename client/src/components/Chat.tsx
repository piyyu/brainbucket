import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="bg-[#0f1012] text-white min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col flex-1 px-4 pt-20 pb-32">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-white text-black rounded-br-md"
                      : "bg-white/10 text-white rounded-bl-md"
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                Thinking…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput
        askQuestion={askQuestion}
        input={input}
        setInput={setInput}
        disabled={loading}
      />
    </div>
  );
};
