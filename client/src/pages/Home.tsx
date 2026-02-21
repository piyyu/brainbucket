import { Sidebar } from "@/components/Sidebar";
import { Chat } from "@/components/Chat";
import { HistoryView } from "@/components/HistoryView";
import { IntegrationsView } from "@/components/IntegrationsView";
import { SettingsView } from "@/components/SettingsView";
import { MemoryMapView } from "@/components/MemoryMapView";
import { BucketsView } from "@/components/BucketsView";
import { useState, useCallback, useRef } from "react";
import { Logo } from "../components/icons/Logo";
import { PanelLeftOpen } from "lucide-react";

type ViewType = "chat" | "history" | "integrations" | "settings" | "memory-map" | "buckets";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
};

export const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>("chat");

  // Persistent chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem("chat_history");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Track current conversation ID so we don't duplicate-save
  const currentConvId = useRef<string | null>(null);

  const saveConversation = useCallback((msgs: Message[]) => {
    if (msgs.length < 2) return;
    const firstUserMsg = msgs.find(m => m.role === "user");
    const title = firstUserMsg?.content.slice(0, 60) || "Untitled conversation";

    // If we're updating an existing conversation, replace it
    if (currentConvId.current) {
      setConversations(prev => {
        const updated = prev.map(c =>
          c.id === currentConvId.current ? { ...c, messages: msgs, timestamp: Date.now(), title } : c
        );
        localStorage.setItem("chat_history", JSON.stringify(updated));
        return updated;
      });
    } else {
      const id = Date.now().toString();
      currentConvId.current = id;
      const conv: Conversation = { id, title, messages: msgs, timestamp: Date.now() };
      setConversations(prev => {
        const updated = [conv, ...prev].slice(0, 50);
        localStorage.setItem("chat_history", JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  // Auto-save when switching away from chat
  const handleViewChange = useCallback((view: ViewType) => {
    if (activeView === "chat" && view !== "chat" && messages.length >= 2) {
      saveConversation(messages);
    }
    setActiveView(view);
    setIsMobileMenuOpen(false);
  }, [activeView, messages, saveConversation]);

  const startNewChat = useCallback(() => {
    // Save current conversation first
    if (messages.length >= 2) {
      saveConversation(messages);
    }
    currentConvId.current = null;
    setMessages([]);
    setInput("");
    setActiveView("chat");
  }, [messages, saveConversation]);

  const loadConversation = useCallback((conv: Conversation) => {
    // Save current conversation first
    if (messages.length >= 2) {
      saveConversation(messages);
    }
    currentConvId.current = conv.id;
    setMessages(conv.messages);
    setInput("");
    setActiveView("chat");
  }, [messages, saveConversation]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem("chat_history", JSON.stringify(updated));
      return updated;
    });
    // If deleting the current conversation, reset
    if (currentConvId.current === id) {
      currentConvId.current = null;
      setMessages([]);
    }
  }, []);

  return (
    <div className="bg-background text-foreground h-[100dvh] w-full flex overflow-hidden">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        isDesktopOpen={isDesktopSidebarOpen}
        onDesktopToggle={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        onViewChange={handleViewChange}
        activeView={activeView}
        onNewChat={startNewChat}
      />

      <div className={`flex-1 relative h-full flex flex-col transition-all duration-200 ${isDesktopSidebarOpen ? 'md:ml-[260px]' : 'ml-0'}`}>

        {/* Desktop Header Toggle (visible only when sidebar closed) */}
        <div className="hidden md:flex absolute top-3 left-3 z-40">
          {!isDesktopSidebarOpen && (
            <button
              onClick={() => setIsDesktopSidebarOpen(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-lg transition-all cursor-pointer hover:bg-accent hover:border-border hover:shadow-sm"
            >
              <PanelLeftOpen size={18} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden h-12 px-4 border-b border-border/50 flex items-center bg-background/80 backdrop-blur-sm">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 -ml-1 text-foreground hover:opacity-70 transition-opacity cursor-pointer"
          >
            <Logo width={24} height={24} />
          </button>
          <span className="ml-2.5 font-semibold text-[14px] tracking-[-0.01em]">BrainBucket</span>
        </div>

        {/* Main Content — Chat uses display toggle to persist DOM state */}
        <div className="flex-1 relative overflow-hidden">
          <div className={activeView === "chat" ? "h-full" : "hidden"}>
            <Chat
              messages={messages}
              setMessages={setMessages}
              input={input}
              setInput={setInput}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          {activeView === "history" && (
            <HistoryView
              conversations={conversations}
              onLoadConversation={loadConversation}
              onDeleteConversation={deleteConversation}
            />
          )}
          {activeView === "buckets" && <BucketsView />}
          {activeView === "integrations" && <IntegrationsView />}
          {activeView === "settings" && <SettingsView />}
          {activeView === "memory-map" && <MemoryMapView />}
        </div>
      </div>
    </div>
  );
}