import { Nav } from "../components/Nav";
import Hero from "../components/Hero";
import Features from "../components/features/Features";
import { Pricing } from "../components/Pricing";
import { System } from "../components/System";
import { Logo } from "../components/icons/Logo";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-background text-foreground">
      <Nav />
      <main className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth">
        <Hero />
        <Features />
        <Pricing />
        <System />

        {/* CTA + Footer */}
        <footer className="snap-end border-t border-border/50 bg-background bg-grid relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-[80px] pointer-events-none" />

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-[1100px] mx-auto px-6 pt-20 pb-16 relative z-10"
          >
            <div className="text-center space-y-6">
              <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.04em] gradient-text-hero leading-[1.1]">
                Ready to think better?
              </h2>
              <p className="text-muted-foreground text-[16px] max-w-md mx-auto leading-[1.6]">
                Join thousands of thinkers who use BrainBucket to capture and organize their best ideas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link to="/auth">
                  <button className="group flex items-center justify-center gap-2 h-11 px-6 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all text-[14px] cursor-pointer shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5">
                    Get started for free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Footer grid */}
          <div className="max-w-[1100px] mx-auto px-6 py-12 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-foreground rounded-[6px] flex items-center justify-center text-background">
                    <Logo width={16} height={16} />
                  </div>
                  <span className="font-semibold text-[14px] tracking-[-0.01em] text-foreground">
                    BrainBucket
                  </span>
                </div>
                <p className="text-muted-foreground text-[13px] leading-[1.6] max-w-[200px]">
                  The intelligent workspace for your thoughts.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-[12px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">Product</h4>
                <ul className="space-y-2.5">
                  <li><a href="#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#system" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Infrastructure</a></li>
                  <li><a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Changelog</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-[12px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">Company</h4>
                <ul className="space-y-2.5">
                  <li><a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                  <li><a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="mailto:hello@brainbucket.com" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                  <li><a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-[12px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  <li><a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
                  <li><a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground/50 text-[12px]">
                &copy; {new Date().getFullYear()} BrainBucket. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-muted-foreground/50">
                <a href="#" className="hover:text-foreground transition-colors text-[12px]">Twitter</a>
                <a href="#" className="hover:text-foreground transition-colors text-[12px]">GitHub</a>
                <a href="#" className="hover:text-foreground transition-colors text-[12px]">Discord</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
