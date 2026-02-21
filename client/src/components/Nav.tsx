import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./icons/Logo";

export const Nav = () => {
    return (
        <NavLanding />
    );
};

const NavLanding = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "System", href: "#system" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
            <div className="max-w-[1200px] mx-auto h-14 px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 bg-foreground rounded-[6px] flex items-center justify-center text-background shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                        <Logo width={16} height={16} />
                    </div>
                    <span className="font-semibold text-[14px] tracking-[-0.01em] text-foreground">
                        BrainBucket
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-secondary/50"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/auth" className="hidden md:flex items-center">
                        <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-secondary/50 mr-1 cursor-pointer">
                            Log in
                        </button>
                    </Link>
                    <Link to="/auth" className="hidden md:block">
                        <button className="h-8 px-3.5 bg-foreground text-background text-[13px] font-medium rounded-md hover:bg-foreground/90 transition-colors cursor-pointer shadow-sm">
                            Sign Up
                        </button>
                    </Link>

                    <button
                        className="md:hidden text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden overflow-hidden"
                    >
                        <div className="p-4 flex flex-col gap-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors px-3 py-2.5 rounded-md text-[14px] font-medium"
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="h-px bg-border/50 my-2" />
                            <Link to="/auth" className="w-full" onClick={() => setIsOpen(false)}>
                                <button className="w-full py-2.5 bg-foreground text-background font-medium rounded-md text-[14px] cursor-pointer">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Nav;