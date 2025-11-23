import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"
import Landing from "./pages/Landing";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/auth" element={<Auth />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
