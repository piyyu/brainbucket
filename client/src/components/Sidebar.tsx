import { History, User, LogOut, Settings, Grid3X3 } from "lucide-react";
import { Logo } from "./icons/Logo";
import { AddBucket } from "./AddBucket";
import { Buckets } from "./Buckets";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-20 md:w-24 bg-card border-r border-border/50 flex flex-col items-center py-6 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="mb-10 relative group cursor-pointer">
          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl shadow-sm text-primary-foreground relative z-10 transition-transform group-hover:scale-105">
            <Logo width={24} height={24} />
          </div>
        </div>


        <div className="flex flex-col gap-6 w-full px-2 items-center">
          <div className="relative group">
            <AddBucket />
          </div>

          <div className="w-8 h-[1px] bg-border/50" />

          <div className="flex flex-col gap-4">
            <Buckets />

            <button className="p-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all relative group shadow-sm flex items-center justify-center h-12 w-12 mx-auto">
              <History className="w-5 h-5" />
              <span className="absolute left-16 bg-popover border border-border text-popover-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 pointer-events-none">
                History
              </span>
            </button>

            <button className="p-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all relative group shadow-sm flex items-center justify-center h-12 w-12 mx-auto">
              <Grid3X3 className="w-5 h-5" />
              <span className="absolute left-16 bg-popover border border-border text-popover-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 pointer-events-none">
                Integrations
              </span>
            </button>
          </div>

        </div>


        <div className="mt-auto flex flex-col gap-6 items-center w-full">
          <div className="w-8 h-[1px] bg-border/50" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-3 rounded-full bg-secondary border border-transparent text-secondary-foreground hover:bg-secondary/80 transition-all shadow-sm">
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-12 w-56 bg-popover border-border text-popover-foreground rounded-xl shadow-lg">
              <DropdownMenuItem className="focus:bg-secondary focus:text-secondary-foreground rounded-lg cursor-pointer">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-secondary focus:text-secondary-foreground rounded-lg cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <div className="h-[1px] bg-border/50 my-1" />
              <DropdownMenuItem onClick={Logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer flex items-center">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-col gap-1.5 items-center pb-4">
            <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
