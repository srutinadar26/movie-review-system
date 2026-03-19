import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    toast.success('Logged out successfully');
  };

  // Check if current route is home page
  const isHomePage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Movie<span>Review</span>
        </Link>

        {/* Only show search bar on home page */}
        {isHomePage && (
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>
        )}

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          
          {/* Filter Movies Link */}
          <Link to="/filter" className="nav-link filter-link">
            Filter Movies
          </Link>
          
          <Link to="/languages" className="nav-link">Languages</Link>
          <Link to="/recommendations" className="nav-link">Recommendations</Link>
          <Link to="/favorites" className="nav-link">Favorites</Link>
          
          {currentUser ? (
            <div className="user-menu">
              <button 
                className="user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">👤</span>
                <span className="user-name">{currentUser.displayName || 'User'}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Profile
                  </Link>
                  <Link to="/filter" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Filter Movies
                  </Link>
                  <Link to="/languages" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Languages
                  </Link>
                  <Link to="/recommendations" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Recommendations
                  </Link>
                  <Link to="/favorites" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Favorites
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link login">Login</Link>
              <Link to="/register" className="nav-link register">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;