import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
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
    name: "Pro",
    price: "12",
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
    name: "Team",
    price: "Custom",
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
    <section id="pricing" className="min-h-[100dvh] snap-start flex flex-col justify-center py-16 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-12 text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground tracking-tight">
            Simple pricing.
          </h2>
          <p className="text-lg text-muted-foreground">
            Start for free. Upgrade when you need more power and infinite history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`
                relative p-8 rounded-[2rem] border transition-all duration-300 flex flex-col
                ${tier.highlight
                  ? "bg-primary text-primary-foreground shadow-xl md:-translate-y-4"
                  : "bg-card text-card-foreground border-border/60 hover:border-border"
                }
              `}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <div className="text-xs font-semibold bg-background text-foreground px-4 py-1.5 rounded-full shadow-sm">
                    Recommended
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-semibold tracking-tight">
                    {tier.price === "Custom" ? "Custom" : `$${tier.price}`}
                  </span>
                  {tier.price !== "Custom" && <span className={`text-sm ${tier.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>/mo</span>}
                </div>
                <p className={`mt-4 text-sm ${tier.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {tier.description}
                </p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.highlight ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full rounded-full h-12 text-base font-semibold
                    ${tier.highlight
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }
                `}
              >
                {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
