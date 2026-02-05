import { motion } from "framer-motion";
import { Network, Search, Database, Disc, Settings } from "lucide-react";

const features = [
  {
    title: "Instant Capture",
    description: "Jot down notes immediately. No loading screens, no friction.",
    icon: Disc,
    colSpan: "md:col-span-2",
  },
  {
    title: "Smart Context",
    description: "We automatically connect related ideas using AI, so you never lose context.",
    icon: Network,
    colSpan: "md:col-span-1",
  },
  {
    title: "Natural Search",
    description: "Find notes by describing them. 'That meeting about marketing' works.",
    icon: Search,
    colSpan: "md:col-span-1",
  },
  {
    title: "Private & Secure",
    description: "End-to-end encryption. Your thoughts belong to you, and only you.",
    icon: Database,
    colSpan: "md:col-span-2",
  },
];

export default function Features() {
  return (
    <section className="py-32 px-4 relative bg-[#0a0a0a]">

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 border-b border-[#333] pb-2 mb-4">
            <Settings className="w-4 h-4 text-[#555] animate-spin-slow" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#555]">
              Capabilities
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-medium text-[#e5e5e5] uppercase text-etched">
            Built for <span className="text-[#333]">Focus</span>
          </h2>
        </div>

        {/* Industrial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              className={`${feature.colSpan} group relative min-h-[240px] bg-metallic p-[1px]`}
            >
              <div className="relative h-full bg-[#111] p-8 flex flex-col justify-between group-hover:bg-[#151515] transition-colors border-bevel">

                {/* Corner Screws */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-[#333] rounded-full" />
                <div className="absolute top-2 right-2 w-1 h-1 bg-[#333] rounded-full" />
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#333] rounded-full" />
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#333] rounded-full" />

                {/* Content */}
                <div className="space-y-6">
                  <div className="w-10 h-10 border border-[#333] flex items-center justify-center bg-[#0a0a0a] group-hover:border-[#555] transition-colors">
                    <feature.icon className="w-5 h-5 text-[#666] group-hover:text-[#e5e5e5] transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-xl font-display text-[#ccc] mb-2 uppercase tracking-wide group-hover:text-white transition-colors">{feature.title}</h3>
                    <p className="text-[#666] font-mono text-xs leading-relaxed max-w-sm border-l border-[#333] pl-3">{feature.description}</p>
                  </div>
                </div>

                {/* Serial No */}
                <div className="absolute bottom-4 right-6 text-[9px] font-mono text-[#222] group-hover:text-[#444] transition-colors">
                  MOD-0{idx + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
