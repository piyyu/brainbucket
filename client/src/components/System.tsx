export const System = () => {
  return (
    <section id="system" className="min-h-[100dvh] snap-start flex flex-col justify-center py-16 bg-secondary/10 border-y border-border/50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground tracking-tight">
              Platform Performance
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                BrainBucket is built on reliable infrastructure, ensuring 99.99% uptime and instant sync across all your devices. Secure, fast, and always available.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-semibold text-foreground mb-1">0.05ms</div>
                  <div className="text-sm text-muted-foreground font-medium">Average Latency</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-foreground mb-1">256-bit</div>
                  <div className="text-sm text-muted-foreground font-medium">AES Encryption</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-foreground mb-1">99.99%</div>
                  <div className="text-sm text-muted-foreground font-medium">Verified Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-foreground mb-1">Global</div>
                  <div className="text-sm text-muted-foreground font-medium">Edge Network</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-full min-h-[400px] flex items-center justify-center bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent border-t border-white/10" />

            <div className="relative w-full max-w-sm space-y-4 font-mono">
              <div className="h-10 bg-secondary/50 rounded-lg w-3/4 flex items-center px-4 text-xs text-muted-foreground/70">SYNC_STATUS: VERIFIED</div>
              <div className="h-10 bg-secondary/50 rounded-lg w-full flex items-center px-4 text-xs text-muted-foreground/70">UPLINK_ENCRYPTED: TRUE</div>
              <div className="h-10 bg-secondary/50 rounded-lg w-5/6 flex items-center px-4 text-xs text-muted-foreground/70">NETWORK_LATENCY: 0.05ms</div>
              <div className="h-10 bg-secondary/50 rounded-lg w-2/3 flex items-center px-4 text-xs text-muted-foreground/70 animate-pulse text-foreground/50">AWAITING_INPUT...</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
