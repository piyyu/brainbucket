import { Nav } from "@/components/Nav";
import {Chat} from "../components/Chat";

export const Home = () => {
  return <div className="bg-[#0f1012] text-white h-screen pt-16 flex flex-col items-center">
    <Nav variant="dashboard" />
    <Chat />
  </div>;
}