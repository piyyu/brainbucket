import { History, User, LogOut, Settings, Grid3X3, ChevronDown } from "lucide-react";
import { Logo } from "./icons/Logo";
import { AddBucket } from "./AddBucket";
import { Buckets } from "./Buckets";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isDesktopOpen?: boolean;
  onDesktopToggle?: () => void;
}

export const Sidebar = ({ isMobileOpen, onMobileClose, isDesktopOpen = true, onDesktopToggle }: SidebarProps) => {
  const navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-background border-r border-border flex flex-col z-50 transition-all duration-200 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px]'}
          ${isDesktopOpen ? 'md:translate-x-0 md:w-[260px]' : 'md:-translate-x-full md:w-0'}
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center h-14 px-4 border-b border-border w-[260px]">
          <button
            onClick={onDesktopToggle}
            className="flex items-center gap-2.5 w-full text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-7 h-7 bg-foreground rounded-[6px] flex items-center justify-center text-background">
              <Logo width={16} height={16} />
            </div>
            <span className="font-semibold text-[14px] text-foreground tracking-[-0.01em]">BrainBucket</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-0.5 px-2 pt-2 w-[260px] flex-1">
          <AddBucket />

          <div className="h-px bg-border mx-2 my-1.5" />

          <nav className="flex flex-col gap-0.5 w-full">
            <Buckets />

            <button className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground text-[13px] font-medium transition-colors cursor-pointer">
              <History className="w-4 h-4" strokeWidth={1.5} />
              <span>History</span>
            </button>

            <button className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground text-[13px] font-medium transition-colors cursor-pointer">
              <Grid3X3 className="w-4 h-4" strokeWidth={1.5} />
              <span>Integrations</span>
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="px-2 pb-3 w-[260px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent text-foreground text-[13px] font-medium transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                  U
                </div>
                <span className="flex-1 text-left truncate">My Account</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="top"
              className="w-[calc(260px-1rem)] ml-0 bg-popover border border-border shadow-vercel rounded-lg p-1"
            >
              <DropdownMenuItem className="rounded-md cursor-pointer py-1.5 px-2 text-[13px] gap-2">
                <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md cursor-pointer py-1.5 px-2 text-[13px] gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={Logout} className="text-red-500 focus:text-red-500 rounded-md cursor-pointer py-1.5 px-2 text-[13px] gap-2">
                <LogOut className="h-4 w-4" strokeWidth={1.5} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
};
