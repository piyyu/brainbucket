import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "FREE",
    price: "0",
    description: "Essential tools for individuals.",
    features: [
      "5 Projects",
      "Basic AI Assistant",
      "3-Day History",
      "Community Support",
    ],
  },
  {
    name: "PRO",
    price: "29",
    description: "For power users who need more.",
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
    name: "TEAM",
    price: "CUSTOM",
    description: "Collaboration for organizations.",
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
    <section id="pricing" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            SIMPLE <span className="text-etched text-white/50">PRICING</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto font-mono text-sm tracking-wide">
            START FOR FREE. UPGRADE WHEN YOU NEED MORE POWER.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`
                relative p-8 rounded-sm border transition-all duration-300 group
                ${tier.highlight
                  ? "bg-[#151515] border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)] scale-105 z-10"
                  : "bg-[#0f1012] border-[#333] hover:border-[#555]"
                }
              `}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="text-[10px] font-mono bg-white text-black px-2 py-1 uppercase tracking-bold">Recommended</div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-display font-medium text-white mb-2 tracking-widest">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tracking-tighter">
                    {tier.price === "CUSTOM" ? "CUSTOM" : `$${tier.price}`}
                  </span>
                  {tier.price !== "CUSTOM" && <span className="text-white/40 font-mono text-sm">/MO</span>}
                </div>
                <p className="mt-4 text-white/50 text-sm">{tier.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${tier.highlight ? "bg-white text-black" : "bg-[#222] text-[#666]"}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-sm text-white/70 font-mono">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={tier.highlight ? "default" : "outline"}
                className={`w-full rounded-sm font-mono uppercase tracking-widest transition-all
                    ${tier.highlight
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-transparent border-[#333] text-white hover:bg-[#222] hover:border-[#666]"
                  }
                `}
              >
                {tier.price === "CUSTOM" ? "Contact Sales" : "Get Started"}
              </Button>

              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/20" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
