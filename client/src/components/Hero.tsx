import { useNavigate } from "react-router";
import bg from "./../assets/bg.png";
import ButtonL from "./ButtonL";
import { Nav } from "./Nav";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  const auth = () => navigate("/auth");

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundPosition: "bottom center",
        }}
      />


      <div className="relative z-10 flex h-full flex-col justify-center text-center px-4">
        <div className="flex flex-col">
          <Nav variant="landing" />
        </div>

        <div className="flex flex-col items-center flex-1 space-y-5 my-54">
          <div className="text-6xl font-bold text-white drop-shadow-lg">your second brain ai <br />assistant</div>
          <p>save thoughts, organize ideas, and boost productivity.</p>
          <ButtonL variant="primary" size="small" onClick={auth}>
            sign up
            <ArrowRight className="h-4 w-4" />
          </ButtonL>
        </div>
      </div>


    </section>
  );
};

export default Hero;
