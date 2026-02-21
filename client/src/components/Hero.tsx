import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100dvh] snap-start w-full flex flex-col items-center justify-center text-center px-6 bg-background bg-grid overflow-hidden pt-16">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tl from-blue-500/15 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-4xl space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-fit"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/80 backdrop-blur-sm text-foreground/80 text-[13px] rounded-full font-medium border border-border/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2} />
            <span>Now in public beta</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-[52px] md:text-[72px] font-bold tracking-[-0.04em] leading-[1.0] gradient-text-hero"
        >
          Your second brain,{" "}
          <br className="hidden md:block" />
          amplified.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-[17px] md:text-[19px] text-muted-foreground max-w-xl mx-auto leading-[1.65]"
        >
          Capture, organize, and retrieve your thoughts instantly.
          Built for focus, designed for clarity, powered by AI.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
        >
          <button
            onClick={() => navigate("/auth")}
            className="group flex items-center justify-center gap-2 h-11 px-6 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all w-full sm:w-auto text-[14px] cursor-pointer shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5"
          >
            Start for free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
          </button>

          <button className="h-11 px-6 bg-transparent border border-border/50 text-foreground hover:bg-secondary/50 hover:border-border transition-all rounded-lg font-medium w-full sm:w-auto text-[14px] cursor-pointer backdrop-blur-sm">
            See how it works
          </button>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-6 flex items-center justify-center gap-4 text-[12px] text-muted-foreground/60"
        >
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> No credit card required</span>
          <span>·</span>
          <span>Free forever plan</span>
          <span>·</span>
          <span>Set up in 30 seconds</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
