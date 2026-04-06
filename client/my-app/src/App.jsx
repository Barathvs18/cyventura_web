import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./Pages/Home"
import LoginHero from "./Components/Login"
import Navbar from "./Components/Navbar"
import Dashboard from "./Pages/Dashboard"

function App() {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/dashboard" && location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginHero />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* Show navbar universally, except on the dashboard and login pages */}
    </div>
  )
}

export default App
