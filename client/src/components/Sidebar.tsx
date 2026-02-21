import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, FolderOpen, History, Grid3X3, ChevronDown, Settings, LogOut, MessageSquare, Network } from "lucide-react";
import { Logo } from "./icons/Logo";
import { AddBucket } from "./AddBucket";
import { Buckets } from "./Buckets";

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isDesktopOpen: boolean;
  onDesktopToggle: () => void;
  onViewChange?: (view: "chat" | "history" | "integrations" | "settings" | "memory-map") => void;
  activeView?: string;
}

export const Sidebar = ({
  isMobileOpen,
  onMobileClose,
  isDesktopOpen,
  onDesktopToggle,
  onViewChange,
  activeView = "chat",
}: SidebarProps) => {
  const [addBucketOpen, setAddBucketOpen] = useState(false);
  const [bucketsOpen, setBucketsOpen] = useState(false);
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }, []);

  const displayName = user?.username || user?.email?.split("@")[0] || "Account";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItem = (
    view: string,
    icon: React.ReactNode,
    label: string,
    onClick?: () => void
  ) => (
    <button
      onClick={onClick || (() => onViewChange?.(view as any))}
      className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium transition-colors cursor-pointer
        ${activeView === view
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-background border-r border-border/50 flex flex-col z-50 transition-all duration-200 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-[260px]"}
          ${isDesktopOpen ? "md:translate-x-0 md:w-[260px]" : "md:-translate-x-full md:w-0"}
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center h-14 px-4 border-b border-border/50 w-[260px]">
          <button
            onClick={onDesktopToggle}
            className="flex items-center gap-2.5 w-full text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-7 h-7 bg-foreground rounded-[6px] flex items-center justify-center text-background shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
              <Logo width={16} height={16} />
            </div>
            <span className="font-semibold text-[14px] text-foreground tracking-[-0.01em]">
              BrainBucket
            </span>
          </button>
        </div>

        {/* New Bucket Button */}
        <div className="px-3 pt-3 w-[260px]">
          <button
            onClick={() => setAddBucketOpen(true)}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-foreground text-background text-[13px] font-medium cursor-pointer hover:bg-foreground/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            <span>New Bucket</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 px-2 pt-3 w-[260px] flex-1">
          {navItem("chat", <MessageSquare className="w-4 h-4" strokeWidth={1.5} />, "Chat")}
          {navItem("buckets", <FolderOpen className="w-4 h-4" strokeWidth={1.5} />, "Explore Buckets", () => setBucketsOpen(true))}
          {navItem("history", <History className="w-4 h-4" strokeWidth={1.5} />, "History")}
          {navItem("memory-map", <Network className="w-4 h-4" strokeWidth={1.5} />, "Memory Map")}
          {navItem("integrations", <Grid3X3 className="w-4 h-4" strokeWidth={1.5} />, "Integrations")}
        </nav>

        {/* Footer */}
        <div className="px-2 pb-3 w-[260px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent text-foreground text-[13px] font-medium transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-semibold shrink-0 shadow-sm">
                  {avatarInitial}
                </div>
                <span className="flex-1 text-left truncate">{displayName}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="top"
              className="w-[calc(260px-1rem)] ml-0 bg-popover border border-border/50 shadow-vercel rounded-lg p-1"
            >
              <DropdownMenuItem
                onClick={() => onViewChange?.("settings")}
                className="text-[13px] rounded-md cursor-pointer px-2.5 py-2 focus:bg-accent"
              >
                <Settings className="w-4 h-4 mr-2" strokeWidth={1.5} /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-[13px] rounded-md cursor-pointer px-2.5 py-2 focus:bg-accent text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <AddBucket open={addBucketOpen} onOpenChange={setAddBucketOpen} />
      <Buckets open={bucketsOpen} onOpenChange={setBucketsOpen} />
    </>
  );
};
