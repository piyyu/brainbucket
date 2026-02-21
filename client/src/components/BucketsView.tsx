import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, ExternalLink, Trash2, Search, FolderOpen } from "lucide-react";
import axios from "axios";

interface Bucket {
  _id: string;
  title: string;
  link?: string;
  description?: string;
  createdAt?: string;
}

// Rotating gradient palette — each bucket gets a unique color
const GRADIENTS = [
  { gradient: "from-sky-500/8 to-blue-500/8", icon: "from-sky-500/20 to-blue-500/20", border: "border-sky-500/10", text: "text-sky-400" },
  { gradient: "from-violet-500/8 to-purple-500/8", icon: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/10", text: "text-violet-400" },
  { gradient: "from-emerald-500/8 to-teal-500/8", icon: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/10", text: "text-emerald-400" },
  { gradient: "from-amber-500/8 to-orange-500/8", icon: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/10", text: "text-amber-400" },
  { gradient: "from-rose-500/8 to-pink-500/8", icon: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/10", text: "text-rose-400" },
  { gradient: "from-indigo-500/8 to-violet-500/8", icon: "from-indigo-500/20 to-violet-500/20", border: "border-indigo-500/10", text: "text-indigo-400" },
  { gradient: "from-cyan-500/8 to-sky-500/8", icon: "from-cyan-500/20 to-sky-500/20", border: "border-cyan-500/10", text: "text-cyan-400" },
  { gradient: "from-purple-500/8 to-fuchsia-500/8", icon: "from-purple-500/20 to-fuchsia-500/20", border: "border-purple-500/10", text: "text-purple-400" },
];

export const BucketsView = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/buckets/list`, {
        headers: { auth: localStorage.getItem("token") || "" }
      });
      setBuckets(res.data.contents || []);
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
      setBuckets((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = buckets.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-background bg-grid relative">
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[300px] bg-gradient-to-br from-sky-500/5 via-indigo-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto px-4 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="min-w-0">
              <h1 className="text-[22px] font-semibold text-foreground tracking-[-0.02em]">Explore Buckets</h1>
              <p className="text-[14px] text-muted-foreground mt-0.5">Browse and manage your saved content</p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground shrink-0">
              <FolderOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
              {buckets.length} bucket{buckets.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search buckets..."
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
              <FolderOpen className="w-10 h-10 mx-auto text-muted-foreground/20" strokeWidth={1} />
              <div>
                <p className="text-[15px] text-foreground font-medium">
                  {search ? "No matching buckets" : "No buckets yet"}
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {search ? "Try a different search term" : "Create your first bucket to get started"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((bucket, idx) => {
                const colors = GRADIENTS[idx % GRADIENTS.length];
                return (
                  <motion.div
                    key={bucket._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group relative flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/10 backdrop-blur-sm cursor-default transition-all duration-200 hover:bg-accent/40 hover:border-border hover:shadow-md hover:-translate-y-[1px]"
                  >
                    {/* Unique hover gradient per item */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                    <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colors.icon} ${colors.border} border flex items-center justify-center shrink-0 relative z-10 transition-all`}>
                      <FileText className={`w-4 h-4 ${colors.text}`} strokeWidth={1.5} />
                    </div>

                    <div className="flex-1 min-w-0 overflow-hidden relative z-10">
                      <p className="text-[14px] font-medium text-foreground truncate">{bucket.title}</p>
                      {bucket.link && (
                        <p className="text-[12px] text-muted-foreground truncate mt-0.5">{bucket.link}</p>
                      )}
                      {bucket.description && (
                        <p className="text-[12px] text-muted-foreground/60 truncate mt-0.5"
                          dangerouslySetInnerHTML={{ __html: bucket.description.replace(/<[^>]*>/g, '').slice(0, 100) }}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bucket.link && (
                        <a
                          href={bucket.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </a>
                      )}
                      <button
                        onClick={() => deleteBucket(bucket._id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
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
