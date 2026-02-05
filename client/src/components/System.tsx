export const System = () => {
  return (
    <section id="system" className="py-24 bg-[#050505] border-t border-[#111] relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              PLATFORM <span className="text-etched text-white/50">PERFORMANCE</span>
            </h2>
            <div className="space-y-6">
              <p className="text-white/60 leading-relaxed max-w-md">
                BrainBucket is built on reliable infrastructure, ensuring 99.99% uptime and instant sync across all your devices. Secure, fast, and always available.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#111] border border-[#333] rounded-sm">
                  <div className="text-2xl font-bold text-white font-mono mb-1">0.05ms</div>
                  <div className="text-[10px] uppercase text-white/40 tracking-widest">Speed</div>
                </div>
                <div className="p-4 bg-[#111] border border-[#333] rounded-sm">
                  <div className="text-2xl font-bold text-white font-mono mb-1">256-bit</div>
                  <div className="text-[10px] uppercase text-white/40 tracking-widest">Security</div>
                </div>
                <div className="p-4 bg-[#111] border border-[#333] rounded-sm">
                  <div className="text-2xl font-bold text-white font-mono mb-1">99.99%</div>
                  <div className="text-[10px] uppercase text-white/40 tracking-widest">Uptime</div>
                </div>
                <div className="p-4 bg-[#111] border border-[#333] rounded-sm">
                  <div className="text-2xl font-bold text-white font-mono mb-1">Global</div>
                  <div className="text-[10px] uppercase text-white/40 tracking-widest">Instant Sync</div>
                </div>
              </div>
            </div>

            <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all rounded-sm flex items-center gap-2">
              <span>View Full Specs</span>
              <span className="text-white/40">→</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-lg blur-2xl" />
            <div className="relative bg-[#0a0a0a] border border-[#222] rounded-lg p-1 w-full aspect-square overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
              {/* Abstract System Visualization */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-48 h-48 border border-white/20 rounded-full border-dashed" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl" />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] text-white/40">
                <span>SYS.STATUS: ONLINE</span>
                <span>VER: 4.2.1-RC</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
