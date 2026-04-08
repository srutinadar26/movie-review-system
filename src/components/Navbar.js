import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const isHomePage = location.pathname === '/';

  // Close mobile menu + dropdown on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMobileOpen(false);
    }
  };

  // REMOVED the duplicate toast from here - AuthContext already shows it
  const handleLogout = async () => {
    await logout(); // AuthContext already shows the toast message
    setShowUserMenu(false);
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/filter', label: 'Filter' },
    { to: '/languages', label: 'Languages' },
    { to: '/recommendations', label: 'Recommendations' },
    { to: '/favorites', label: 'Favorites' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            Movie<span>Review</span>
          </Link>

          {/* Desktop Search (home only) */}
          {isHomePage && (
            <form onSubmit={handleSearch} className="search-form desktop-only">
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search movies"
              />
              <button type="submit" className="search-button" aria-label="Search">
                Search
              </button>
            </form>
          )}

          {/* Desktop Nav */}
          <div className="nav-links desktop-only">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/filter" className="nav-link filter-link">Filter Movies</Link>
            <Link to="/languages" className="nav-link">Languages</Link>
            <Link to="/recommendations" className="nav-link">Recommendations</Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>

            {currentUser ? (
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="user-menu-button"
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                >
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{currentUser.displayName || 'User'}</span>
                  <span className="chevron">{showUserMenu ? '▲' : '▼'}</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Profile
                    </Link>
                    <Link to="/favorites" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Favorites
                    </Link>
                    <Link to="/recommendations" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Recommendations
                    </Link>
                    <hr className="dropdown-divider" />
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

          {/* Mobile: hamburger */}
          <button
            className={`hamburger mobile-only ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Search bar below (home only) */}
        {isHomePage && (
          <form onSubmit={handleSearch} className="search-form mobile-search mobile-only">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search movies"
            />
            <button type="submit" className="search-button" aria-label="Search">
              Search
            </button>
          </form>
        )}
      </nav>

      {/* Mobile Menu overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mobile-menu">
          {/* Header */}
          <div className="mobile-menu-header">
            <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
              Movie<span>Review</span>
            </Link>
            <button
              className="mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <nav className="mobile-nav">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`mobile-link ${location.pathname === to ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth section */}
          <div className="mobile-auth">
            {currentUser ? (
              <>
                <div className="mobile-user-info">
                  <span className="mobile-avatar">👤</span>
                  <span className="mobile-username">{currentUser.displayName || 'User'}</span>
                </div>
                <Link to="/profile" className="mobile-link" onClick={() => setMobileOpen(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <div className="mobile-auth-btns">
                <Link to="/login" className="mobile-login-btn" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="mobile-register-btn" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;