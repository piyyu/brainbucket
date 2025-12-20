interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

const variants = {
  primary: `
    bg-white text-black font-medium rounded-lg cursor-pointer
    shadow-[0_14px_30px_rgba(0,0,0,0.25),inset_0_-3px_6px_rgba(236,72,153,0.55)]
    transition-all duration-200 ease-out
    hover:shadow-[0_18px_36px_rgba(0,0,0,0.3),inset_0_-4px_8px_rgba(236,72,153,0.65)]
    active:shadow-[0_10px_22px_rgba(0,0,0,0.22),inset_0_-2px_4px_rgba(236,72,153,0.45)]
    active:scale-[0.97]
    hover:scale-[1.02]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
  `,
  secondary: `
    bg-black text-white font-medium rounded-lg
    shadow-[0_10px_24px_rgba(0,0,0,0.35),inset_0_-3px_6px_rgba(236,72,153,0.55)]
    transition-all duration-200 ease-out
    hover:bg-zinc-800
    active:scale-[0.97]
    hover:scale-[1.02]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  `,
};

const sizes = {
  small: "px-4 py-2 text-sm",
  medium: "px-8 py-3 text-lg",
  large: "px-12 py-4 text-xl",
};

export default function ButtonL({
  variant = "primary",
  size = "medium",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        inline-flex items-center gap-2 whitespace-nowrap
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
