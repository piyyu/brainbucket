import { Button } from "@/components/ui/button";
import { Logo } from "./icons/Logo";
import { Plus, BookMarked, History, User, ArrowRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { AddBucket } from "./AddBucket";

interface NavProps {
    variant?: "landing" | "dashboard";
}

const NAV_VARIANTS = {
    landing:
        "fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl backdrop-blur-md bg-[#090b0e]/30 border border-white/10 rounded-xl shadow-lg text-white z-10 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]",
    dashboard:
        "w-full backdrop-blur-md bg-[#090b0e]/50 border-b border-white/10 text-white px-10 py-3 fixed top-0 left-0 z-10",
};

export const Nav = ({ variant }: NavProps) => {
    return (
        <>
            {variant === "landing" ? <NavLanding /> : <NavDashboard />}
        </>
    );
};


const NavLanding = () => {
    const navigate = useNavigate();
    const auth = () => navigate("/auth");

    return (
        <nav className={NAV_VARIANTS["landing"]}>
            <div className="flex items-center justify-between py-4 px-6">

                <div className="flex items-center gap-3">
                    <Logo height={36} width={36} />
                    <div className="text-2xl font-semibold tracking-tight">
                        brainbucket.
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-10 text-md text-white/80">
                    <button className="hover:text-white transition">features</button>
                    <button className="hover:text-white transition">pricing</button>
                    <button className="hover:text-white transition">showcase</button>
                    <button className="hover:text-white transition">docs</button>
                </div>

                <div className="flex items-center gap-3" onClick={auth}>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 bg-black text-white px-8 py-6 rounded-xl transition duration-200"
                    >
                        try for free
                        <ArrowRight className="h-4 w-4" />
                    </Button>


                </div>

            </div>
        </nav>
    );
};

const NavDashboard = () => {
    return (
        <nav className={NAV_VARIANTS["dashboard"]}>
            <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center gap-3">
                    <Logo width={36} height={36} />
                    <div className="text-2xl font-semibold tracking-tight">
                        brainbucket.
                    </div>
                </div>


                <div className="flex items-center gap-3">
                    <AddBucket />            

                    <Button variant="default" size="icon" className="bg-[#0f1012] text-white hover:bg-white/10">
                        <BookMarked className="h-5 w-5" />
                    </Button>

                    <Button variant="default" size="icon" className="bg-[#0f1012] text-white hover:bg-white/10">
                        <History className="h-5 w-5" />
                    </Button>

                    <UserDropdown>
                            <User className="h-5 w-5 text-white" />
                    </UserDropdown>
                </div>
            </div>
        </nav>
    );
}

const UserDropdown = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="default" size="icon" className="rounded-full bg-[#0f1012]">
                    {children}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem
                    onClick={Logout}
                    className="text-red-600 hover:bg-red-600 hover:text-white
             data-[highlighted]:bg-red-600 data-[highlighted]:text-white
             cursor-pointer"
                >
                    Logout
                </DropdownMenuItem>


            </DropdownMenuContent>
        </DropdownMenu>

    );
}