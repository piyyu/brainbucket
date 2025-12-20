import { useState } from "react";

export default function SearchIllustration() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mock Search Bar - simpler, smaller */}
      <div className={`
        w-28 h-6 bg-neutral-900 rounded-full shadow-sm border border-neutral-700
        flex items-center px-2 mb-2 transition-all duration-300
        ${isHovered ? 'shadow-md border-pink-500 ring-1 ring-pink-500/20' : 'opacity-80'}
      `}>
        <div className={`w-3 h-3 rounded-full border-2 mr-2 ${isHovered ? 'border-pink-500' : 'border-neutral-500'}`} />
        <div className="w-12 h-1 bg-neutral-700 rounded-full" />
      </div>

      {/* Results Grid - dense */}
      <div className="grid grid-cols-2 gap-1.5 w-28">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`
              h-8 bg-neutral-900 rounded-md border border-neutral-800 p-1.5 flex flex-col gap-1.5
              transition-all duration-300
              ${isHovered && i === 2 ? 'scale-105 border-pink-500 shadow-sm z-10' : 'opacity-50'}
            `}
          >
            <div className={`w-4 h-4 rounded-sm ${isHovered && i === 2 ? 'bg-pink-900/50' : 'bg-neutral-800'}`} />
            <div className="w-full h-1 bg-neutral-700 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
