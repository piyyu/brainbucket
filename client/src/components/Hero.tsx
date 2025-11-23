export function Hero() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,1)_10%,rgba(37,99,235,0.9)_45%,rgba(0,0,0,1)_90%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.55),transparent_70%)]" />
    </div>
  );
}
