import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to register. User or email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{width: '100%', maxWidth: '500px'}}>
        <div className="form-container">
          <div className="form-header">
            <FaUserPlus className="form-icon" />
            <h2 className="form-title">Join LiveAuction</h2>
            <p className="form-subtitle">Create your account to start bidding</p>
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-container">
                <FaUser className="input-icon" />
                <input 
                  type="text" 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="form-input" 
                  placeholder="Choose a username"
                  required 
                />
              </div>
            </div>
            
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
                  placeholder="Create a password (min. 6 characters)"
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
                  <FaUserPlus />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
          
          <div style={{marginTop: '24px', textAlign: 'center'}}>
            <p style={{color: '#b0b0b0'}}>
              Already have an account?{' '}
              <Link to="/login" style={{color: '#4ecdc4', fontWeight: '600', textDecoration: 'none'}}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;