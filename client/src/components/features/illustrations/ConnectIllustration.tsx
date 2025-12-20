export default function ConnectIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden group">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Central Node */}
        <div className="absolute z-20 w-12 h-12 bg-neutral-900 rounded-xl shadow-md border-2 border-neutral-700 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <div className="w-4 h-4 rounded-full bg-pink-500" />
        </div>

        {/* Orbiting Nodes */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-full h-full flex items-center justify-center animate-[spin_10s_linear_infinite]"
            style={{ animationDelay: `-${i * 3}s` }}
          >
            <div
              className="w-8 h-8 -mt-24 bg-neutral-900 rounded-lg shadow-sm border border-neutral-700 flex items-center justify-center transition-all duration-300 group-hover:border-pink-500"
              style={{ transform: 'rotate(0deg)' }} // Keep node upright if needed, simplified here
            >
              <div className="w-2 h-2 rounded-full bg-neutral-500 group-hover:bg-pink-400" />
            </div>
          </div>
        ))}

        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'rotate(0deg)' }}>
          <circle cx="50%" cy="50%" r="48" fill="none" stroke="currentColor" className="text-neutral-300 stroke-1 border-dashed" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}
