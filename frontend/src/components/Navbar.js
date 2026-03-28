import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, logout }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Crypto Trading Platform</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/trades" className={location.pathname === '/trades' ? 'active' : ''}>
          Trades
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
            Admin
          </Link>
        )}
      </div>
      <div className="navbar-user">
        <span>{user?.name}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;