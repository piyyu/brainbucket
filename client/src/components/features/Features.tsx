import { motion } from "framer-motion";
import { Network, Search, Database, Zap, ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "Instant Capture",
    description: "Jot down notes immediately. No loading screens, no friction. Open, type, done.",
    icon: Zap,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    title: "Smart Context",
    description: "We automatically connect related ideas using AI, so you never lose context between thoughts.",
    icon: Network,
    gradient: "from-violet-500/20 to-indigo-500/20",
    iconColor: "text-violet-400",
  },
  {
    title: "Natural Search",
    description: "Find notes by describing them in plain English. 'That meeting about marketing' just works.",
    icon: Search,
    gradient: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-400",
  },
  {
    title: "Private & Secure",
    description: "End-to-end encryption ensures your thoughts belong to you, and only you. Always.",
    icon: Database,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
];

export default function Features() {
  return (
    <section className="min-h-[100dvh] snap-start flex flex-col justify-center px-6 bg-background bg-grid relative overflow-hidden" id="features">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-indigo-500/8 via-purple-500/8 to-pink-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] w-full mx-auto space-y-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/80 text-muted-foreground text-[12px] rounded-full font-medium border border-border/50 mb-2">
            FEATURES
          </div>
          <h2 className="text-[40px] md:text-[52px] font-bold text-foreground tracking-[-0.04em] gradient-text-hero leading-[1.05]">
            Built for clarity.
          </h2>
          <p className="text-[16px] text-muted-foreground leading-[1.6] max-w-lg mx-auto">
            Everything you need to organize your mind, without the overwhelming clutter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-6 rounded-xl border border-border/50 bg-secondary/20 backdrop-blur-sm card-hover overflow-hidden cursor-default"
            >
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              {/* Shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-lg bg-secondary border border-border/50 flex items-center justify-center mb-4 ${feature.iconColor} group-hover:border-white/10 transition-colors`}>
                  <feature.icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[16px] font-semibold text-foreground">{feature.title}</h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                </div>
                <p className="text-muted-foreground text-[14px] leading-[1.6]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
