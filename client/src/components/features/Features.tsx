import FeatureCard from "./FeatureCard";
import CaptureIllustration from "./illustrations/CaptureIllustration";
import ConnectIllustration from "./illustrations/ConnectIllustration";
import SearchIllustration from "./illustrations/SearchIllustration";
import RecallIllustration from "./illustrations/RecallIllustration";

export default function Features() {
  return (
    <section className="py-20 md:py-24 px-4 flex flex-col justify-center h-screen">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center gap-10 sm:gap-8">

        <div className="text-center text-white mt-20">
          <h2 className="text-2xl md:text-4xl font-light tracking-tight">
            give your memory superpowers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[minmax(140px,auto)]">
          <FeatureCard
            title="capture anything"
            description="save thoughts, links, and ideas instantly without breaking your flow."
            className="md:col-span-2"
          >
            <CaptureIllustration />
          </FeatureCard>

          <FeatureCard
            title="connect knowledge"
            description="ideas naturally link together as your knowledge grows."
          >
            <ConnectIllustration />
          </FeatureCard>

          <FeatureCard
            title="semantic search"
            description="find what you need by meaning, not keywords."
          >
            <SearchIllustration />
          </FeatureCard>

          <FeatureCard
            title="recall on demand"
            description="ask questions and get answers from your own notes."
            className="md:col-span-2"
          >
            <RecallIllustration />
          </FeatureCard>
        </div>

      </div>
    </section>
  );
}
