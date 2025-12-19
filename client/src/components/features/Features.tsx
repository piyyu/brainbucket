import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#04040e] h-screen flex items-center">
      <div className="max-w-6xl mx-auto">

        <div className="mb-16 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-light">
            give your memory superpowers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols gap-8">
          <FeatureCard
            title="capture anything"
            description="save thoughts, links, and ideas instantly without breaking your flow."
          />

          <FeatureCard
            title="connect knowledge"
            description="ideas naturally link together as your knowledge grows."
          />

          <FeatureCard
            title="semantic search"
            description="find what you need by meaning, not keywords."
          />

          <FeatureCard
            title="recall on demand"
            description="ask questions and get answers from your own notes."
          />
        </div>

      </div>
    </section>
  );
}
