import { Nav } from "@/components/Nav";
import { Chat } from "../components/Chat";

export const Home = () => {
  return (
    <div className="bg-[#0f1012] text-white h-[100dvh] w-full relative overflow-hidden">
      <Nav variant="dashboard" />
      <div className="absolute inset-0 top-20 w-full">
        <Chat />
      </div>
    </div>
  );
}