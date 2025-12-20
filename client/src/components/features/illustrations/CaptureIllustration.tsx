import { useState, useEffect } from "react";

export default function CaptureIllustration() {
  const [items, setItems] = useState([1, 2, 3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        // Rotate items to create a "flow" effect
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-[200px] h-32">
        {items.map((item, index) => (
          <div
            key={item}
            className={`
              absolute left-0 right-0 mx-auto w-full h-12
              bg-neutral-900 rounded-lg shadow-sm border border-neutral-800
              flex items-center px-3 gap-3
              transition-all duration-500 ease-in-out
            `}
            style={{
              top: `${index * 16}px`,
              transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
              opacity: 1 - index * 0.3,
              zIndex: 10 - index,
            }}
          >
            <div className={`w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center`}>
              <div className="w-2 h-2 rounded-full bg-pink-500" />
            </div>
            <div className="h-2 w-20 bg-neutral-700 rounded-full" />
          </div>
        ))}

        {/* Floating "Input" hint */}
        <div className="absolute -bottom-4 right-0 bg-neutral-900 p-2 rounded-full shadow-lg border border-neutral-700 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M12 5v14M5 12h14" /></svg>
        </div>
      </div>
    </div>
  );
}
