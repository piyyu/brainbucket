import { motion } from "framer-motion";
import { Globe, MessageSquare, Github, Slack, Webhook, ArrowUpRight } from "lucide-react";

const integrations = [
  {
    name: "Web Clipper",
    description: "Save articles, pages, and bookmarks directly to your buckets from any browser.",
    icon: Globe,
    color: "text-sky-400",
    gradient: "from-sky-500/20 to-blue-500/20",
    status: "available",
  },
  {
    name: "Slack",
    description: "Forward messages and threads from Slack channels into your workspace.",
    icon: Slack,
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-violet-500/20",
    status: "coming_soon",
  },
  {
    name: "GitHub",
    description: "Automatically save starred repos, issues, and code snippets.",
    icon: Github,
    color: "text-gray-400",
    gradient: "from-gray-500/20 to-zinc-500/20",
    status: "coming_soon",
  },
  {
    name: "Telegram Bot",
    description: "Send notes to BrainBucket from Telegram with a simple forward.",
    icon: MessageSquare,
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-cyan-500/20",
    status: "coming_soon",
  },
  {
    name: "Webhooks",
    description: "Connect any service via custom webhooks. Zapier compatible.",
    icon: Webhook,
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-orange-500/20",
    status: "coming_soon",
  },
];

export const IntegrationsView = () => {
  return (
    <div className="h-full w-full overflow-y-auto bg-background bg-grid relative">
      <div className="absolute top-[15%] left-[-5%] w-[400px] h-[300px] bg-gradient-to-br from-purple-500/8 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="text-[22px] font-semibold text-foreground tracking-[-0.02em]">Integrations</h1>
            <p className="text-[14px] text-muted-foreground mt-0.5">Connect your favorite tools to BrainBucket</p>
          </div>

          <div className="grid gap-3">
            {integrations.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative p-5 rounded-xl border border-border/50 bg-secondary/20 backdrop-blur-sm hover:bg-accent/20 hover:border-border transition-all cursor-default overflow-hidden"
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-secondary border border-border/50 flex items-center justify-center ${item.color} group-hover:border-white/10 transition-colors shrink-0`}>
                      <item.icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[14px] font-semibold text-foreground">{item.name}</h3>
                        {item.status === "coming_soon" && (
                          <span className="text-[10px] font-medium text-muted-foreground bg-accent border border-border/50 px-1.5 py-0.5 rounded-full">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-[1.5]">{item.description}</p>
                    </div>
                  </div>

                  <button
                    disabled={item.status === "coming_soon"}
                    className={`h-8 px-3 rounded-md text-[13px] font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer
                      ${item.status === "coming_soon"
                        ? "bg-secondary/50 text-muted-foreground/50 cursor-not-allowed"
                        : "bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:shadow-md"
                      }
                    `}
                  >
                    {item.status === "coming_soon" ? "Notify" : "Connect"}
                    {item.status !== "coming_soon" && <ArrowUpRight className="w-3 h-3" strokeWidth={2} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
