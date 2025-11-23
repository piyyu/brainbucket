import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";

export default function Landing() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Nav variant="landing" />

      <Hero />
    </div>
  );
}
