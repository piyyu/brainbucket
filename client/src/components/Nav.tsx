import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";
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
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
            <div className="bg-background/80 backdrop-blur-md border border-border/50 shadow-sm rounded-full px-6 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
                        <Logo width={20} height={20} />
                    </div>
                    <span className="text-xl font-display font-semibold tracking-tight text-foreground">
                        BrainBucket
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/auth">
                        <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:opacity-90 transition-opacity shadow-sm">
                            Sign In
                            <LogIn className="w-4 h-4 ml-1" />
                        </button>
                    </Link>

                    <button
                        className="md:hidden text-muted-foreground hover:text-foreground p-1"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 w-full bg-background border border-border/50 shadow-lg p-4 rounded-2xl flex flex-col gap-2 md:hidden"
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors p-3 rounded-xl font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                        <Link to="/auth" className="w-full mt-2" onClick={() => setIsOpen(false)}>
                            <button className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl">
                                Sign In
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Nav;