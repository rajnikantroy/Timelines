import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowLeftIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log('Login attempt with:', { email, password });
    // After successful login, navigate to home
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeftIcon className="back-icon" />
        </button>
        
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to Timeline</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <UserIcon className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <KeyIcon className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit" className="login-button">
              Sign In
            </button>
            <button type="button" className="signup-button" onClick={handleSignup}>
              <UserPlusIcon className="button-icon" />
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 