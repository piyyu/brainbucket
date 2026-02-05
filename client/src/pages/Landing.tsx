import { Nav } from "../components/Nav";
import Hero from "../components/Hero";
import Features from "../components/features/Features";
import { Pricing } from "../components/Pricing";
import { System } from "../components/System";

export default function Landing() {
  return (
    <div className="bg-black min-h-screen selection:bg-primary selection:text-black">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <System />

        <footer className="py-8 text-center text-white/20 text-xs font-mono border-t border-white/5 bg-black">
          <p>BRAINBUCKET SYSTEM v2.0 // ALL RIGHTS RESERVED</p>
        </footer>
      </main>
    </div>
  );
}
