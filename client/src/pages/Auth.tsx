
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons/Logo"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    } else {
      setCheckingToken(false);
    }
  }, [navigate]);

  if (checkingToken) return null;

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/login`, {
        email,
        password
      })
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/home');
    } catch (e) {
      console.error(e);
      // Optional: Add toast error here
    }
  }

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/register`, {
        username,
        email,
        password
      })
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/home');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden">

      {/* Background Texture similar to Sidebar/Home */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIiAvPgo8L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="flex w-full max-w-5xl z-10 px-4 gap-20 items-center justify-center">

        {/* Brand Side */}
        <div className="hidden md:flex flex-col gap-8 w-1/2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#151515] border border-[#333] flex items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <Logo width={40} height={40} />
            </div>
          </div>
          <div>
            <h1 className="text-6xl font-display font-bold text-[#e5e5e5] mb-4 text-etched tracking-tight">
              BRAIN<br /><span className="text-[#444]">BUCKET.</span>
            </h1>
            <p className="text-[#666] text-lg font-mono leading-relaxed border-l-2 border-[#333] pl-6">
              Secure neural interface for high-fidelity memory storage and retrieval.
            </p>
          </div>

          {/* Tech specs */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 border border-[#222] bg-[#0f0f0f]">
              <div className="text-[#444] text-[10px] uppercase tracking-widest mb-1">Encryption</div>
              <div className="text-[#888] font-mono">AES-256</div>
            </div>
            <div className="p-4 border border-[#222] bg-[#0f0f0f]">
              <div className="text-[#444] text-[10px] uppercase tracking-widest mb-1">Uptime</div>
              <div className="text-[#888] font-mono">99.99%</div>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="w-full max-w-md bg-[#111] border-[#333] shadow-2xl rounded-sm border-bevel relative overflow-hidden">

          {/* Top light accent */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#555] to-transparent" />

          <CardHeader className="text-center pb-8 pt-10">
            <CardTitle className="text-2xl font-display uppercase tracking-widest text-[#e5e5e5]">
              {isLogin ? "System Access" : "New User Registration"}
            </CardTitle>
            <CardDescription className="text-[#555] font-mono text-xs uppercase tracking-wider">
              {isLogin
                ? "Authenticate Credentials"
                : "Initialize Profile"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#888] text-xs uppercase tracking-wider font-mono">
                  Username
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="IDENTIFIER"
                  className="bg-[#050505] border-[#222] text-[#e5e5e5] placeholder:text-[#333] font-mono focus:border-[#555] focus:ring-0 rounded-sm h-12"
                  required={!isLogin}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#888] text-xs uppercase tracking-wider font-mono">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="USER@DOMAIN.COM"
                className="bg-[#050505] border-[#222] text-[#e5e5e5] placeholder:text-[#333] font-mono focus:border-[#555] focus:ring-0 rounded-sm h-12"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#888] text-xs uppercase tracking-wider font-mono">
                  Password
                </Label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-[10px] text-[#444] hover:text-[#888] uppercase tracking-wider transition-colors"
                  >
                    Reset Key?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-[#050505] border-[#222] text-[#e5e5e5] placeholder:text-[#333] font-mono focus:border-[#555] focus:ring-0 rounded-sm h-12"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-10">
            <Button
              type="submit"
              className="w-full bg-[#e5e5e5] text-black hover:bg-white border hover:border-white font-bold uppercase tracking-widest text-xs h-12 rounded-sm"
              onClick={isLogin ? handleLogin : handleRegister}
            >
              {isLogin ? "Authenticate" : "Register Profile"} <ArrowRight className="ml-2 w-3 h-3" />
            </Button>

            <div className="relative w-full text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#222]"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#111] px-2 text-[#444] font-mono">Or</span>
              </div>
            </div>

            <p className="text-xs text-[#555] text-center font-mono">
              {isLogin ? "No credentials found?" : "Already initialized?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#888] hover:text-[#e5e5e5] underline decoration-[#333] underline-offset-4 transition-colors"
              >
                {isLogin ? "Create Profile" : "Access System"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
