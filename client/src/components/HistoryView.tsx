import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, FileText, ExternalLink, Trash2, Search } from "lucide-react";
import axios from "axios";

interface HistoryItem {
  _id: string;
  title: string;
  link?: string;
  description?: string;
}

export const HistoryView = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/buckets/list`, {
        headers: { auth: localStorage.getItem("token") || "" }
      });
      setItems(res.data.contents || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBucket = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bucket/delete`, {
        headers: { auth: localStorage.getItem("token") || "" },
        data: { contentId: id }
      });
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
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
              <h1 className="text-[22px] font-semibold text-foreground tracking-[-0.02em]">History</h1>
              <p className="text-[14px] text-muted-foreground mt-0.5">All your saved buckets and notes</p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground shrink-0">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              {items.length} items
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all"
            />
          </div>

          {/* List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground/30" strokeWidth={1} />
              <div>
                <p className="text-[15px] text-foreground font-medium">
                  {search ? "No matching results" : "No buckets yet"}
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {search ? "Try a different search term" : "Create your first bucket to get started"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/20 backdrop-blur-sm hover:bg-accent/30 hover:border-border transition-all cursor-default"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-secondary border border-border/50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 overflow-hidden">
                      <p className="text-[14px] font-medium text-foreground truncate">{item.title}</p>
                      {item.link && (
                        <p className="text-[12px] text-muted-foreground truncate">{item.link}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </a>
                    )}
                    <button
                      onClick={() => deleteBucket(item._id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
