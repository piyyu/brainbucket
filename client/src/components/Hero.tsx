import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100dvh] snap-start w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-background">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-4xl space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="mx-auto w-fit inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-full font-medium mb-4 border border-border/50">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <span>The intelligent workspace</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight text-foreground leading-[1.1]">
          Capture your best ideas. <br className="hidden md:block" />
          <span className="text-muted-foreground">Without the friction.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The fastest way to note, organize, and retrieve your thoughts. BrainBucket is built for focus, designed for clarity, and powered by intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto text-base shadow-lg shadow-primary/20"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </button>

          <button className="px-8 py-4 bg-background border border-border text-foreground hover:bg-secondary transition-colors rounded-full font-semibold w-full sm:w-auto text-base">
            See how it works
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
