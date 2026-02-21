import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Hobby",
    price: "0",
    description: "Essential tools for individuals getting started.",
    features: [
      "5 Projects",
      "Basic AI Assistant",
      "3-Day History",
      "Community Support",
    ],
  },
  {
    name: "Pro",
    price: "12",
    description: "For power users who need unlimited everything.",
    features: [
      "Unlimited Projects",
      "Advanced AI Models",
      "30-Day Version History",
      "Priority Support",
      "API Access",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated infrastructure for organizations.",
    features: [
      "Dedicated Infrastructure",
      "Custom AI Models",
      "Unlimited History",
      "24/7 Dedicated Support",
      "SSO & Audit Logs",
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="min-h-[100dvh] snap-start flex flex-col justify-center py-20 bg-background bg-grid relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/80 text-muted-foreground text-[12px] rounded-full font-medium border border-border/50 mb-2">
            PRICING
          </div>
          <h2 className="text-[40px] md:text-[52px] font-bold text-foreground tracking-[-0.04em] gradient-text-hero leading-[1.05]">
            Simple pricing.
          </h2>
          <p className="text-[16px] text-muted-foreground leading-[1.6]">
            Start for free. Upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`
                relative p-6 rounded-xl border flex flex-col overflow-hidden card-hover
                ${tier.highlight
                  ? "bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/20"
                  : "border-border/50 bg-secondary/20 backdrop-blur-sm"
                }
              `}
            >
              {tier.highlight && (
                <>
                  {/* Premium glow for highlighted card */}
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
                  <div className="absolute top-3 right-4 z-10">
                    <div className="text-[11px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" strokeWidth={2} /> Popular
                    </div>
                  </div>
                </>
              )}

              <div className="relative z-10 mb-6">
                <h3 className="text-[14px] font-medium text-muted-foreground mb-3">{tier.name}</h3>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[44px] font-bold tracking-[-0.04em] text-foreground">
                    {tier.price === "Custom" ? "Custom" : `$${tier.price}`}
                  </span>
                  {tier.price !== "Custom" && <span className="text-[13px] text-muted-foreground">/month</span>}
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground leading-[1.5]">
                  {tier.description}
                </p>
              </div>

              <div className="space-y-3 mb-6 flex-1 relative z-10">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${tier.highlight ? 'text-indigo-400' : 'text-muted-foreground'}`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`relative z-10 w-full h-10 rounded-lg text-[14px] font-medium transition-all cursor-pointer
                  ${tier.highlight
                    ? "bg-white text-black hover:bg-white/90 shadow-lg shadow-indigo-500/20"
                    : "bg-secondary border border-border/50 text-foreground hover:bg-accent hover:border-border"
                  }
                `}
              >
                {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
