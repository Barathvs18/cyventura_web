import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Dashboard from "./Pages/Dashboard"
import Challenge from "./Pages/Challenge"
import Leaderboard from "./Pages/Leaderboard"
import AdminDashboard from "./Pages/AdminDashboard"
import CreateChallenge from "./Pages/CreateChallenge"
import Submissions from "./Pages/Submissions"
import ProtectedRoute from "./Components/ProtectedRoute"
import Navbar from "./Components/Navbar"        // Home page navbar
import CTFNavbar from "./Components/CTFNavbar"  // CTF platform navbar

// Routes that belong to the CTF platform (show CTFNavbar)
const CTF_PATHS = ["/dashboard", "/leaderboard", "/admin", "/admin/dashboard", "/admin/create-challenge", "/admin/submissions"];

// Routes that belong to the public site (show home Navbar)
const HOME_PATHS = ["/", "/events"];

// Routes with no navbar (auth pages)
const NO_NAV_PATHS = ["/login", "/register"];

function App() {
  const location = useLocation();
  const path = location.pathname;

  const isCTFPath = CTF_PATHS.some(p => path === p || path.startsWith("/challenge/") || path.startsWith("/admin/"));
  const isNoNavPath = NO_NAV_PATHS.includes(path);
  const isHomePath = !isCTFPath && !isNoNavPath;

  return (
    <div>
      {isHomePath && <Navbar />}
      {isCTFPath && <CTFNavbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/challenge/:id" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />

        {/* Admin protected routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/create-challenge" element={<ProtectedRoute adminOnly><CreateChallenge /></ProtectedRoute>} />
        <Route path="/admin/submissions" element={<ProtectedRoute adminOnly><Submissions /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
