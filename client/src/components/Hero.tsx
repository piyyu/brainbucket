import { useNavigate } from "react-router";
import ButtonL from "./ButtonL";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black pointer-events-auto">

      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundPosition: "bottom center",
        }}
      />


      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 space-y-4 pt-10">
        <h1
          className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-pink-500 leading-tight select-none pb-2"
          style={{
            backgroundImage: "linear-gradient(to bottom, #ffffff 30%, #ffffff 50%, #ec4899 100%)",
            filter: "drop-shadow(0 14px 30px rgba(0,0,0,0.5))"
          }}
        >
          your second brain ai <br /> assistant
        </h1>
        <p className="text-white/70 max-w-md text-lg md:text-xl font-light">
          save thoughts, organize ideas, and boost productivity.
        </p>

        <ButtonL variant="primary" size="small" onClick={() => navigate("/auth")}>
          get started
        </ButtonL>
      </div>
    </section>
  );
};

export default Hero;
