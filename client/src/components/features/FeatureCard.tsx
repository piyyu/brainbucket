interface FeatureCardProps {
  title: string;
  description: string;
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl p-8 h-36
        bg-white text-black

        shadow-[0_18px_36px_rgba(0,0,0,0.28),inset_0_-4px_8px_rgba(236,72,153,0.45)]
        transition-all duration-300 ease-out

        hover:shadow-[0_22px_44px_rgba(0,0,0,0.32),inset_0_-8px_14px_rgba(236,72,153,0.6)]
        active:shadow-[0_14px_28px_rgba(0,0,0,0.22),inset_0_-3px_6px_rgba(236,72,153,0.4)]
        active:scale-[0.98]
        hover:scale-[1.02]
      "
    >
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-3">
          {title}
        </h3>
        <p className="text-black/70 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
