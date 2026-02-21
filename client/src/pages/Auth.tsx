import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons/Logo"
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/login`, {
        email,
        password
      })
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/home');
    } catch (e) {
      console.error("Login failed", e);
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/register`, {
        username,
        email,
        password
      })
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/home');
    } catch (e) {
      console.error("Registration failed", e);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] space-y-6 relative z-10"
      >
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
          Back
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center text-background shadow-md">
            <Logo width={20} height={20} />
          </div>
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.02em] text-foreground">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground text-[14px] mt-1">
              {isLogin
                ? "Sign in to continue to BrainBucket"
                : "Get started with BrainBucket for free"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="border border-border/50 rounded-xl bg-secondary/20 backdrop-blur-sm p-6 shadow-vercel">
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[13px] font-medium text-foreground">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required={!isLogin}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 rounded-md bg-background border border-border text-[14px] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-shadow"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-medium text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-md bg-background border border-border text-[14px] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] font-medium text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-md bg-background border border-border text-[14px] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-shadow"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-md bg-foreground text-background font-medium text-[14px] hover:bg-foreground/90 transition-all cursor-pointer mt-2 shadow-sm hover:shadow-md hover:-translate-y-px"
            >
              {isLogin ? "Continue" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/50 text-center text-[13px]">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-foreground font-medium hover:underline underline-offset-4 cursor-pointer"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/50">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  )
}
