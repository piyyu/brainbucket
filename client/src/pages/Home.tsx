import { Sidebar } from "@/components/Sidebar";
import { Chat } from "../components/Chat";
import { useState } from "react";
import { Logo } from "../components/icons/Logo";

export const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#0f1012] text-white h-[100dvh] w-full flex overflow-hidden">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 relative h-full ml-0 md:ml-24 flex flex-col">
        {/* Mobile Header / Toggle */}
        <div className="md:hidden p-4 border-b border-[#333] flex items-center bg-[#0a0a0a]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 -ml-1 text-[#888] hover:text-white"
          >
            <Logo width={32} height={32} />
          </button>
          <span className="ml-3 font-display font-medium tracking-wide">BRAINBUCKET</span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <Chat />
        </div>
      </div>
    </div>
  );
}