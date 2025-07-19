import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaGavel } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary-400 hover:text-primary-300 transition-colors">
          <FaGavel className="text-primary-500" />
          <span>LiveAuction</span>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/list-item" className="btn btn-primary">
                List an Item
              </Link>
              <span className="text-gray-300 hidden sm:inline">Welcome, <span className="text-primary-400 font-semibold">{user.username}</span></span>
              <button onClick={logout} className="btn btn-danger text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors px-3 py-2">Login</Link>
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