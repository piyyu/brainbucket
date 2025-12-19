import { Button } from "@/components/ui/button";
import ButtonL from "./ButtonL"
import { Logo } from "./icons/Logo";
import { History, User, ArrowRight } from "lucide-react";
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
import { Buckets } from "./Buckets";

interface NavProps {
    variant?: "landing" | "dashboard";
}

const NAV_VARIANTS = {
    landing:
        "fixed top-4 left-1/2 -translate-x-1/2 w-[70%] max-w-6xl border border-white/5 rounded-xl shadow-lg shadow-[0_8px_30px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,0.04)] bg-white/5 text-white z-10",
    dashboard:
        "w-full backdrop-blur-md bg-[#090b0e]/50 border-b border-white/10 text-white fixed top-0 left-0 z-10",
}


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
        <nav className={NAV_VARIANTS.landing}>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <Logo height={36} width={36} />
                    <div className="text-2xl font-semibold tracking-tight">
                        brainbucket.
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-10 text-md text-white/80">
                    <button className="hover:text-white transition cursor-pointer">features</button>
                    <button className="hover:text-white transition cursor-pointer">pricing</button>
                    <button className="hover:text-white transition cursor-pointer">showcase</button>
                    <button className="hover:text-white transition cursor-pointer">docs</button>
                </div>

                <ButtonL
                    onClick={auth}
                    variant="primary"
                    size="small"
                >
                    try for free
                    <ArrowRight className="h-4 w-4" />
                </ButtonL>
            </div>
        </nav>
    );
};


const NavDashboard = () => {
    return (
        <nav className={NAV_VARIANTS["dashboard"]}>
            <div className="flex items-center justify-between px-4 py-3 mx-auto ml-10 mr-10">
                <div className="flex items-center gap-3">
                    <Logo width={36} height={36} />
                    <div className="text-2xl font-semibold tracking-tight">
                        brainbucket.
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <AddBucket />

                    <Buckets />



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