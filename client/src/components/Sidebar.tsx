
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-20 md:w-24 bg-[#0a0a0a] border-r border-[#333] flex flex-col items-center py-6 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIiAvPgo8L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,black,transparent)]" />


        <div className="mb-10 relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <div className="w-12 h-12 bg-[#151515] border border-[#333] flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] relative z-10">
            <Logo width={32} height={32} />
          </div>
        </div>


        <div className="flex flex-col gap-6 w-full px-2 items-center">


          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <AddBucket />
          </div>

          <div className="w-10 h-[1px] bg-[#333]" />


          <div className="flex flex-col gap-4">
            <Buckets />

            <button className="p-3 rounded-lg bg-[#111] border border-[#333] text-[#666] hover:text-[#e5e5e5] hover:border-[#666] transition-all relative group shadow-[2px_2px_0px_#000]">
              <History className="w-5 h-5" />
              <span className="absolute left-14 bg-[#111] border border-[#333] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                History
              </span>
            </button>

            <button className="p-3 rounded-lg bg-[#111] border border-[#333] text-[#666] hover:text-[#e5e5e5] hover:border-[#666] transition-all relative group shadow-[2px_2px_0px_#000]">
              <Grid3X3 className="w-5 h-5" />
              <span className="absolute left-14 bg-[#111] border border-[#333] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                Integrations
              </span>
            </button>
          </div>

        </div>


        <div className="mt-auto flex flex-col gap-6 items-center w-full">
          <div className="w-10 h-[1px] bg-[#333]" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-3 rounded-full bg-[#151515] border border-[#333] text-[#888] hover:text-white hover:border-[#555] transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-12 w-56 bg-[#0a0a0a] border-[#333] text-[#e5e5e5]">
              <DropdownMenuItem className="focus:bg-[#1a1a1a] focus:text-white">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#1a1a1a] focus:text-white">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <div className="h-[1px] bg-[#222] my-1" />
              <DropdownMenuItem onClick={Logout} className="text-red-500 focus:bg-[#1a1a1a] focus:text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-col gap-1 items-center pb-4">
            <div className="w-1 h-1 bg-[#222] rounded-full" />
            <div className="w-1 h-1 bg-[#333] rounded-full" />
            <div className="w-1 h-1 bg-green-900 rounded-full animate-pulse shadow-[0_0_5px_rgba(20,83,45,0.5)]" />
          </div>
        </div>


        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#333] to-transparent" />
      </aside>
    </>
  );
};
