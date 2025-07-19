import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaGavel } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <div className="nav-container">
        <Link to="/" className="logo">
          <FaGavel className="text-primary-500" />
          <span>LiveAuction</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/list-item" className="btn btn-primary">
                List an Item
              </Link>
              <span style={{color: '#b0b0b0'}}>Welcome, <span style={{color: '#4ecdc4', fontWeight: '600'}}>{user.username}</span></span>
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;