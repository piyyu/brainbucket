import { motion } from "framer-motion";
import { Network, Search, Database, Zap } from "lucide-react";

const features = [
  {
    title: "Instant Capture",
    description: "Jot down notes immediately. No loading screens, no friction.",
    icon: Zap,
  },
  {
    title: "Smart Context",
    description: "We automatically connect related ideas using AI, so you never lose context.",
    icon: Network,
  },
  {
    title: "Natural Search",
    description: "Find notes by describing them. 'That meeting about marketing' works.",
    icon: Search,
  },
  {
    title: "Private & Secure",
    description: "End-to-end encryption. Your thoughts belong to you, and only you.",
    icon: Database,
  },
];

export default function Features() {
  return (
    <section className="min-h-[100dvh] snap-start flex flex-col justify-center px-4 bg-secondary/30 relative overflow-hidden" id="features">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-6xl w-full mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground tracking-tight">
            Built for clarity.
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to organize your mind, without the overwhelming clutter of traditional tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card p-8 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6 text-foreground group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
