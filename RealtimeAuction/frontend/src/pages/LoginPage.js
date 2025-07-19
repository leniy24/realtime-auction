import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{width: '100%', maxWidth: '500px'}}>
        <div className="form-container">
          <div className="form-header">
            <FaSignInAlt className="form-icon" />
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-container">
                <FaEnvelope className="input-icon" />
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="form-input" 
                  placeholder="Enter your email"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <FaLock className="input-icon" />
                <input 
                  type="password" 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="form-input" 
                  placeholder="Enter your password"
                  required 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{width: '100%', justifyContent: 'center', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
            >
              {loading ? (
                <div className="loading-spinner" style={{width: '20px', height: '20px', margin: 0}}></div>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
          
          <div style={{marginTop: '24px', textAlign: 'center'}}>
            <p style={{color: '#b0b0b0'}}>
              Don't have an account?{' '}
              <Link to="/register" style={{color: '#4ecdc4', fontWeight: '600', textDecoration: 'none'}}>
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;