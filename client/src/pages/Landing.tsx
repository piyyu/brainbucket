import Hero from "../components/Hero";
import Features from "../components/features/Features";
import { Nav } from "../components/Nav";

export default function Landing() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#070B1A] to-black">
      <Nav variant="landing" />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
}
