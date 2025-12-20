import { useEffect, useState } from "react";

export default function RecallIllustration() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-3">
      {/* Question Bubble - tiny text */}
      <div className={`
        self-end mr-2 bg-black text-neutral-300 px-3 py-1.5 rounded-xl rounded-tr-sm text-[9px] font-medium tracking-wide
        transition-all duration-500 transform
        ${activeStage >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}>
        what is...
      </div>

      {/* Processing ... small dots */}
      <div className={`
        self-center flex gap-1 my-0.5
        transition-all duration-500
        ${activeStage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
      `}>
        <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>

      {/* Answer Bubble - dense */}
      <div className={`
        self-start ml-2 bg-neutral-900 border border-neutral-800 text-white px-3 py-2 rounded-xl rounded-tl-sm shadow-sm
        transition-all duration-500 transform flex items-center gap-2
        ${activeStage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}>
        <div className="w-3 h-3 bg-pink-900/40 rounded-full flex-shrink-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
        </div>
        <div className="w-12 h-1.5 bg-neutral-700 rounded-full" />
      </div>
    </div>
  );
}
