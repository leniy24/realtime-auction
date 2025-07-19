import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to register. User or email may already exist.');
    }
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      <p className="form-link">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
};

export default RegisterPage;