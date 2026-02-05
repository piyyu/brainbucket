import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Menu, X, Cpu, Zap, Layers } from "lucide-react";
import { Logo } from "./icons/Logo";

export const Nav = () => {
    return (
        <NavLanding />
    );
};

const NavLanding = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { name: "FEATURES", icon: Cpu },
        { name: "PRICING", icon: Zap },
        { name: "SYSTEM", icon: Layers },
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
            <div className="relative bg-[#1a1a1a] border border-[#333] px-1 py-1 flex items-center justify-between shadow-2xl rounded-sm">

                {/* Inner Bevel Container */}
                <div className="absolute inset-0 border-bevel pointer-events-none rounded-sm" />

                <div className="flex items-center justify-between w-full px-5 py-2 bg-[#111] rounded-[1px]">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-[#151515] border border-[#333] flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] relative z-10">
                            <Logo width={32} height={32} />
                        </div>
                        <span className="text-lg font-display font-medium tracking-widest text-white/90 text-etched">
                            BRAINBUCKET
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={`#${item.name.toLowerCase()}`}
                                className="px-4 py-2 text-[10px] font-mono tracking-widest text-white/40 hover:text-white hover:bg-[#222] transition-colors uppercase rounded-sm"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* Auth Button & Menu Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Login Button */}
                        <Link to="/auth">
                            <button className="hidden md:flex items-center gap-2 px-5 py-2 bg-[#e5e5e5] text-black font-mono text-xs uppercase tracking-wider hover:bg-white transition-colors border border-transparent hover:border-white/50 rounded-sm">
                                <LogIn className="w-3 h-3" />
                                Initialize
                            </button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-white/70 hover:text-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 w-full bg-[#111] border border-[#333] shadow-2xl p-4 flex flex-col gap-2 md:hidden"
                    >
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-[#222] transition-colors p-3 text-left font-mono text-sm uppercase rounded-sm"
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </button>
                        ))}
                        <Link to="/auth" className="w-full mt-2">
                            <button className="w-full py-3 bg-[#e5e5e5] text-black font-mono text-xs uppercase tracking-wider hover:bg-white transition-colors rounded-sm">
                                Initialize System
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Nav;