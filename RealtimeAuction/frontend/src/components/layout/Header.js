import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/" className="logo">
          LiveAuction
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              {/* Add this link to the item listing page */}
              <Link to="/list-item" className="btn btn-primary">
                List an Item
              </Link>
              <span style={{ marginLeft: '1rem' }}>Welcome, {user.username}</span>
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
      </nav>
    </header>
  );
};

export default Header;