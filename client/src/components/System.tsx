import { motion } from "framer-motion";

const terminalLines = [
  { text: "$ brainbucket sync --status", color: "text-emerald-400", delay: 0 },
  { text: "→ Connecting to edge network...", color: "text-muted-foreground", delay: 0.2 },
  { text: "✓ Connection established (42 regions)", color: "text-muted-foreground", delay: 0.4 },
  { text: "✓ 256-bit AES encryption active", color: "text-muted-foreground", delay: 0.6 },
  { text: "✓ Latency: 0.05ms (optimal)", color: "text-muted-foreground", delay: 0.8 },
  { text: "", color: "", delay: 1.0 },
  { text: "All systems operational.", color: "text-emerald-400", delay: 1.1, typing: true },
];

export const System = () => {
  return (
    <section id="system" className="min-h-[100dvh] snap-start flex items-center py-24 bg-background bg-grid relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-emerald-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 w-full relative z-10">
        {/* Section label + heading centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/80 text-muted-foreground text-[12px] rounded-full font-medium border border-border/50 mb-4">
            INFRASTRUCTURE
          </div>
          <h2 className="text-[40px] md:text-[52px] font-bold text-foreground tracking-[-0.04em] gradient-text-hero leading-[1.05]">
            Built to scale.
          </h2>
          <p className="text-muted-foreground text-[16px] leading-[1.6] max-w-lg mx-auto mt-4">
            Reliable infrastructure with 99.99% uptime and instant sync. Secure, fast, and always available.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "0.05ms", label: "Average Latency", icon: "⚡" },
              { value: "256-bit", label: "AES Encryption", icon: "🔐" },
              { value: "99.99%", label: "Verified Uptime", icon: "📈" },
              { value: "Global", label: "Edge Network", icon: "🌐" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="p-5 rounded-xl border border-border/50 bg-secondary/20 backdrop-blur-sm card-hover"
              >
                <div className="text-lg mb-3">{stat.icon}</div>
                <div className="text-[24px] font-bold text-foreground tracking-[-0.02em] mb-0.5">{stat.value}</div>
                <div className="text-[12px] text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-xl border border-border/50 bg-[#0d0d0d] overflow-hidden shadow-2xl">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#141414]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[11px] text-white/30 font-mono">terminal — brainbucket</span>
              </div>

              {/* Terminal body */}
              <div className="p-5 space-y-1.5 font-mono text-[13px] min-h-[220px]">
                {terminalLines.map((line, i) =>
                  line.text === "" ? (
                    <div key={i} className="h-3" />
                  ) : (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: line.delay }}
                      className={`${line.color} ${line.typing ? "typing-cursor" : ""} leading-relaxed`}
                    >
                      {line.text}
                    </motion.div>
                  )
                )}
              </div>
            </div>

            {/* Glow underneath */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-emerald-500/20 blur-[20px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
