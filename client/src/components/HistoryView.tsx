import { motion } from "framer-motion";
import { MessageSquare, Trash2, ArrowRight, Clock, Search } from "lucide-react";
import { useState } from "react";

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

interface HistoryViewProps {
  conversations: Conversation[];
  onLoadConversation: (conv: Conversation) => void;
  onDeleteConversation: (id: string) => void;
}

// Rotating gradient palette — each conversation gets a unique color
const GRADIENTS = [
  { gradient: "from-indigo-500/8 to-violet-500/8", icon: "from-indigo-500/20 to-violet-500/20", border: "border-indigo-500/10", text: "text-indigo-400" },
  { gradient: "from-sky-500/8 to-blue-500/8", icon: "from-sky-500/20 to-blue-500/20", border: "border-sky-500/10", text: "text-sky-400" },
  { gradient: "from-purple-500/8 to-fuchsia-500/8", icon: "from-purple-500/20 to-fuchsia-500/20", border: "border-purple-500/10", text: "text-purple-400" },
  { gradient: "from-emerald-500/8 to-teal-500/8", icon: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/10", text: "text-emerald-400" },
  { gradient: "from-amber-500/8 to-orange-500/8", icon: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/10", text: "text-amber-400" },
  { gradient: "from-rose-500/8 to-pink-500/8", icon: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/10", text: "text-rose-400" },
  { gradient: "from-cyan-500/8 to-sky-500/8", icon: "from-cyan-500/20 to-sky-500/20", border: "border-cyan-500/10", text: "text-cyan-400" },
  { gradient: "from-violet-500/8 to-purple-500/8", icon: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/10", text: "text-violet-400" },
];

const timeAgo = (ts: number) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
};

export const HistoryView = ({ conversations, onLoadConversation, onDeleteConversation }: HistoryViewProps) => {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-background bg-grid relative">
      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[300px] bg-gradient-to-bl from-violet-500/8 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto px-4 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="min-w-0">
              <h1 className="text-[22px] font-semibold text-foreground tracking-[-0.02em]">Chat History</h1>
              <p className="text-[14px] text-muted-foreground mt-0.5">Your past conversations with BrainBucket</p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground shrink-0">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all"
            />
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/20" strokeWidth={1} />
              <div>
                <p className="text-[15px] text-foreground font-medium">
                  {search ? "No matching conversations" : "No conversations yet"}
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {search ? "Try a different search term" : "Start chatting to build your history"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((conv, idx) => {
                const msgCount = conv.messages.length;
                const lastMsg = conv.messages[conv.messages.length - 1];
                const colors = GRADIENTS[idx % GRADIENTS.length];

                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => onLoadConversation(conv)}
                    className="group relative flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/10 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-accent/40 hover:border-border hover:shadow-md hover:-translate-y-[1px]"
                  >
                    {/* Unique hover gradient per item */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                    <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colors.icon} ${colors.border} border flex items-center justify-center shrink-0 relative z-10 transition-all`}>
                      <MessageSquare className={`w-4 h-4 ${colors.text}`} strokeWidth={1.5} />
                    </div>

                    <div className="flex-1 min-w-0 overflow-hidden relative z-10">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14px] font-medium text-foreground truncate">{conv.title}</p>
                      </div>
                      {lastMsg && (
                        <p className="text-[12px] text-muted-foreground truncate">
                          {lastMsg.role === "assistant" ? "AI: " : "You: "}{lastMsg.content.slice(0, 80)}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-muted-foreground/60">{timeAgo(conv.timestamp)}</span>
                        <span className="text-border/30">·</span>
                        <span className="text-[11px] text-muted-foreground/60">{msgCount} message{msgCount !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 relative z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                        className="p-1.5 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <div className="p-1.5 rounded-md text-muted-foreground/30 group-hover:text-foreground transition-all">
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
