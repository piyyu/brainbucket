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
        bg-background border border-border rounded-lg p-6
        flex flex-col gap-4 hover:border-foreground/20 transition-colors
        ${className}
      `}
    >
      <div className="flex-1">{children}</div>
      <div>
        <h3 className="text-foreground text-[16px] font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground text-[13px] leading-[1.5]">{description}</p>
      </div>
    </div>
  );
}
