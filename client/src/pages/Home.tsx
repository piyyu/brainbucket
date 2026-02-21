import { Sidebar } from "@/components/Sidebar";
import { Chat } from "@/components/Chat";
import { HistoryView } from "@/components/HistoryView";
import { IntegrationsView } from "@/components/IntegrationsView";
import { SettingsView } from "@/components/SettingsView";
import { MemoryMapView } from "@/components/MemoryMapView";
import { useState } from "react";
import { Logo } from "../components/icons/Logo";
import { PanelLeftOpen } from "lucide-react";

type ViewType = "chat" | "history" | "integrations" | "settings" | "memory-map";

export const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>("chat");

  return (
    <div className="bg-background text-foreground h-[100dvh] w-full flex overflow-hidden">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        isDesktopOpen={isDesktopSidebarOpen}
        onDesktopToggle={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        onViewChange={(view) => { setActiveView(view); setIsMobileMenuOpen(false); }}
        activeView={activeView}
      />

      <div className={`flex-1 relative h-full flex flex-col transition-all duration-200 ${isDesktopSidebarOpen ? 'md:ml-[260px]' : 'ml-0'}`}>

        {/* Desktop Header Toggle (visible only when sidebar closed) */}
        <div className="hidden md:flex absolute top-3 left-3 z-40">
          {!isDesktopSidebarOpen && (
            <button
              onClick={() => setIsDesktopSidebarOpen(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-lg transition-all cursor-pointer hover:bg-accent hover:border-border hover:shadow-sm"
            >
              <PanelLeftOpen size={18} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden h-12 px-4 border-b border-border/50 flex items-center bg-background/80 backdrop-blur-sm">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 -ml-1 text-foreground hover:opacity-70 transition-opacity cursor-pointer"
          >
            <Logo width={24} height={24} />
          </button>
          <span className="ml-2.5 font-semibold text-[14px] tracking-[-0.01em]">BrainBucket</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative overflow-hidden">
          {activeView === "chat" && <Chat />}
          {activeView === "history" && <HistoryView />}
          {activeView === "integrations" && <IntegrationsView />}
          {activeView === "settings" && <SettingsView />}
          {activeView === "memory-map" && <MemoryMapView />}
        </div>
      </div>
    </div>
  );
}