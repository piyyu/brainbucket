import ButtonL from "../components/ButtonL";
import Hero from "../components/Hero";
import Features from "../components/features/Features";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col text-white bg-gradient-to-b from-[#070B1A] to-black">
      <Hero />
      <Features />
    </div>
  );
}
