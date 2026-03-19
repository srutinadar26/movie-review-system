import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/firebase';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({ email: false, password: false });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    
    if (result.success) {
      toast.success('Welcome back! 🎬');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    // Auto submit after setting demo credentials
    setTimeout(() => {
      document.getElementById('login-form').requestSubmit();
    }, 100);
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field, value) => {
    if (!value) {
      setFocused({ ...focused, [field]: false });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎬 Welcome Back</h1>
          <p>Sign in to continue your movie journey</p>
        </div>

        <form id="login-form" onSubmit={handleSubmit} className="auth-form">
          <div className={`form-group ${focused.email ? 'focused' : ''}`}>
            <label>
              <i className="fas fa-envelope"></i> Email
            </label>
            <div className="input-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={(e) => handleBlur('email', e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>

          <div className={`form-group ${focused.password ? 'focused' : ''}`}>
            <label>
              <i className="fas fa-lock"></i> Password
            </label>
            <div className="input-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleFocus('password')}
                onBlur={(e) => handleBlur('password', e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one now</Link></p>
          <button onClick={handleDemoLogin} className="demo-button">
            Try Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;