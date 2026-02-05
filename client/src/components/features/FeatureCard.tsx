interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export default function FeatureCard({
  title,
  description,
  className = "",
  children,
}: FeatureCardProps) {
  return (
    <div
      className={`
        bg-neutral-900/50 border border-neutral-800 rounded-xl p-6
        flex flex-col gap-4
        ${className}
      `}
    >
      <div className="flex-1">{children}</div>
      <div>
        <h3 className="text-white text-lg font-medium mb-1">{title}</h3>
        <p className="text-neutral-400 text-sm">{description}</p>
      </div>
    </div>
  );
}
