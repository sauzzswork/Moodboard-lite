import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">🎨 MoodBoard Lite</Link>
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/create" className="nav-link">Create</Link>
            <span className="user-info">
              Hello, {user?.username}!
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
        <button
          style={{
            marginLeft: "1.5em",
            fontSize: "1.18em",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#6c63ff"
          }}
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
