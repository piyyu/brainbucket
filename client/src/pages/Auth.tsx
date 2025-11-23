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
    const res = await axios.post('http://localhost:3000/api/v1/login', {
      email,
      password
    })
    console.log(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    navigate('/home');
  }

  const handleRegister = async () => {
    const res = await axios.post('http://localhost:3000/api/v1/register', {
      username,
      email,
      password
    })
    console.log(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    navigate('/home');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-around bg-[#0f1012] overflow-hidden">

      <div className="flex flex-col items-center gap-6 w-1/2">
        <Logo width={96} height={96} />
        <div className="text-white text-9xl font-bold">brainbucket.</div>
      </div>

      <div className="">
        <Card className="relative z-10 w-full max-w-sm bg-[#1e2024] border border-white/10 shadow-xl backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-white">
              {isLogin ? "Login" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin
                ? "Welcome back — sign in to continue"
                : "Start your journey — it's free"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-6">
              {!isLogin && (
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-200">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    className="bg-[#121317] border-white/10 text-white"
                    required={!isLogin}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-[#121317] border-white/10 text-white"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-gray-200">
                    Password
                  </Label>

                  {isLogin && (
                    <button
                      type="button"
                      className="ml-auto text-sm text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  className="bg-[#121317] border-white/10 text-white"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" onClick={isLogin ? handleLogin : handleRegister}>
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>

            <p className="text-sm text-gray-400 text-center">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>


    </div>
  )
}
