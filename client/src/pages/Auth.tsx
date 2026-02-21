import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons/Logo"
import axios from "axios";
import { useNavigate } from "react-router-dom"

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
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 relative overflow-hidden">
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mb-6 shadow-sm">
            <Logo width={28} height={28} />
          </div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Welcome to BrainBucket
          </h1>
          <p className="text-muted-foreground mt-2">
            The intelligent workspace for your thoughts
          </p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-black/5 rounded-[1.5rem] bg-card p-2">
          <CardHeader className="space-y-1 pb-6 pt-6 px-6">
            <CardTitle className="text-xl">
              {isLogin ? "Sign in" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your email below to sign in to your account"
                : "Enter your details below to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required={!isLogin}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-ring transition-colors"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-ring transition-colors"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-ring transition-colors"
                />
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl font-semibold mt-4 text-base">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
