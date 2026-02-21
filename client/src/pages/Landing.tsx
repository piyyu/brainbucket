import { Nav } from "../components/Nav";
import Hero from "../components/Hero";
import Features from "../components/features/Features";
import { Pricing } from "../components/Pricing";
import { System } from "../components/System";

export default function Landing() {
  return (
    <div className="bg-black selection:bg-primary selection:text-black">
      <Nav />
      <main className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth pb-0">
        <Hero />
        <Features />
        <Pricing />
        <System />

        <footer className="h-[50dvh] snap-end flex flex-col items-center justify-center text-white/20 text-xs font-mono border-t border-white/5 bg-black">
          <p>BRAINBUCKET SYSTEM v2.0 // ALL RIGHTS RESERVED</p>
        </footer>
      </main>
    </div>
  );
}
