import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusSquare, 
  ListChecks, 
  LogOut, 
  Shield,
  Home
} from 'lucide-react';
import './AdminSidebar.css';

import logo from "../assets/logo.png";
import textLogo from "../assets/text.png";

const AdminSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand" onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <img src={textLogo} alt="Cyventura" className="sidebar-text-logo" />
      </div>

      <div className="sidebar-badge">
        <Shield size={16} />
        <span>ADMIN PANEL</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          <LayoutDashboard size={20} className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/admin/create-challenge" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          <PlusSquare size={20} className="sidebar-icon" />
          <span>Create Challenge</span>
        </NavLink>

        <NavLink 
          to="/admin/submissions" 
          className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
          <ListChecks size={20} className="sidebar-icon" />
          <span>Submissions</span>
        </NavLink>

        <NavLink 
          to="/" 
          className="sidebar-link"
        >
          <Home size={20} className="sidebar-icon" />
          <span>Back to Site</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
