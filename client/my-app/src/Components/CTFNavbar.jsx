import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Award, Shield, Trophy } from 'lucide-react';
import './CTFNavbar.css';

import logo from "../assets/logo.png";
import textLogo from "../assets/text.png";

const CTFNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="ctf-navbar">
      <div className="ctf-nav-brand" onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" className="nav-logo" style={{ width: '40px', height: 'auto' }} />
        <img src={textLogo} alt="Cyventura" className="nav-text-logo" style={{ width: '110px', height: 'auto', marginLeft: '5px' }} />
      </div>

      <div className="ctf-nav-user" ref={dropdownRef}>
        {user ? (
          <div className="profile-dropdown-container">
            <button 
              className="profile-btn"
              onClick={() => !isAdmin && setDropdownOpen(!dropdownOpen)}
              style={{ cursor: isAdmin ? 'default' : 'pointer' }}
            >
              <User size={18} />
              <span>{user.username}</span>
              {isAdmin && <Shield size={12} style={{marginLeft: '8px', color: '#f50909'}} />}
            </button>
            
            {dropdownOpen && !isAdmin && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-username">{user.username}</span>
                  <span className="ctf-nav-role user">
                    <Award size={12}/> {user.role}
                  </span>
                </div>
                
                <div className="dropdown-item stats-item">
                  <span className="stats-label">Points:</span>
                  <span className="ctf-nav-score">{user.score} pts</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => {
                    navigate('/leaderboard');
                    setDropdownOpen(false);
                }}>
                  <Trophy size={16} style={{marginRight: '8px', color: '#ff1a1a'}} /> <span style={{fontFamily: "'Unica One', sans-serif", letterSpacing: "1px", textTransform: "uppercase"}}>Leaderboard</span>
                </button>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <LogOut size={16} style={{marginRight: '8px'}} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="profile-btn" onClick={() => navigate('/login')}>Log In</button>
        )}
      </div>
    </nav>
  );
};

export default CTFNavbar;
