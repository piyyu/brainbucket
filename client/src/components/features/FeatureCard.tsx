import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  children,
  className,
}: FeatureCardProps) {
  const isWide = className?.includes("col-span-2");

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-white text-black",
        "shadow-[0_18px_36px_rgba(0,0,0,0.28),inset_0_-4px_8px_rgba(236,72,153,0.45)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_22px_44px_rgba(0,0,0,0.32),inset_0_-8px_14px_rgba(236,72,153,0.6)]",
        "hover:scale-[1.01] active:scale-[0.99]",
        "group",
        "flex gap-2",
        isWide
          ? "flex-col md:flex-row md:items-center p-3"
          : "flex-col p-3",
        className
      )}
    >
      
      <div
        className={cn(
          "flex flex-col gap-0.5",
          isWide ? "md:w-[48%]" : "w-full"
        )}
      >
        <h3 className="text-sm font-semibold tracking-tight leading-tight">
          {title}
        </h3>

        <p className="text-black/70 text-xs leading-snug font-medium">
          {description}
        </p>
      </div>

      {children && (
        <div
          className={cn(
            "relative rounded-md overflow-hidden",
            "flex items-center justify-center flex-1",
            isWide ? "md:h-full" : "w-full h-20"
          )}
        >
          <div className="w-full h-full flex items-center justify-center">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
