import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-20">


      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)]" />

      <motion.div
        className="relative z-10 max-w-5xl space-y-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >


        <div className="space-y-4">
          <motion.h1
            className="text-5xl md:text-8xl font-display font-bold tracking-tighter text-[#e5e5e5] uppercase leading-none text-etched"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Capture Your
            <br />
            <span className="text-[#444]">Best Ideas</span>
          </motion.h1>
        </div>


        <motion.p
          className="text-lg md:text-xl font-mono text-[#666] max-w-xl mx-auto leading-relaxed border-l-2 border-[#333] pl-6 text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          The fastest way to note, organize, and retrieve your thoughts. Built for focus, designed for speed.
        </motion.p>


        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-0 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => navigate("/auth")}
            className="group relative px-10 py-5 bg-[#e5e5e5] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors min-w-[200px]"
          >
            Start for Free
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black" />
          </button>

          <button className="group relative px-10 py-5 bg-transparent border border-[#333] text-[#666] hover:text-[#e5e5e5] hover:border-[#666] transition-all min-w-[200px] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3">
            <Terminal className="w-3 h-3" />
            Learn More
          </button>
        </motion.div>
      </motion.div>


      <motion.div
        className="absolute bottom-10 flex w-full justify-between px-10 text-[10px] font-mono text-[#333] uppercase select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>99.9% UPTIME</span>
        <span>E2E ENCRYPTED</span>
        <span>GLOBAL CDN</span>
      </motion.div>
    </section>
  );
};

export default Hero;
