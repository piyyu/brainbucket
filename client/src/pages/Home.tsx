import { Sidebar } from "@/components/Sidebar";
import { Chat } from "../components/Chat";
import { useState } from "react";
import { Logo } from "../components/icons/Logo";
import { PanelLeftOpen } from "lucide-react";

export const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <div className="bg-background text-foreground h-[100dvh] w-full flex overflow-hidden">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        isDesktopOpen={isDesktopSidebarOpen}
        onDesktopToggle={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
      />

      <div className={`flex-1 relative h-full flex flex-col transition-all duration-200 ${isDesktopSidebarOpen ? 'md:ml-[260px]' : 'ml-0'}`}>

        {/* Desktop Header Toggle (Visible only when closed) */}
        <div className="hidden md:flex absolute top-3 left-3 z-40">
          {!isDesktopSidebarOpen && (
            <button
              onClick={() => setIsDesktopSidebarOpen(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground bg-background border border-border rounded-md transition-colors cursor-pointer hover:bg-accent"
            >
              <PanelLeftOpen size={18} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Mobile Header / Toggle */}
        <div className="md:hidden h-12 px-4 border-b border-border flex items-center bg-background">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 -ml-1 text-foreground hover:opacity-70 transition-opacity cursor-pointer"
          >
            <Logo width={24} height={24} />
          </button>
          <span className="ml-2.5 font-semibold text-[14px] tracking-[-0.01em]">BrainBucket</span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <Chat />
        </div>
      </div>
    </div>
  );
}