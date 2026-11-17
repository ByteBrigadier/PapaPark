import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, isLoggedIn, clearAuthSession } from '../services/api';

import { LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function Navbar({ onShowAlert }) {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    clearAuthSession();
    if (onShowAlert) onShowAlert('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <span style={{ fontSize: '1.6rem' }}>🅿️</span>
        <span>PapaPark</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {loggedIn && user ? (
          <>
            <div className="user-profile-badge">
              <div className="avatar-circle">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  {user.fullName || user.email}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {user.role === 'ROLE_ADMIN' ? <Shield size={12} /> : <UserIcon size={12} />}
                  {user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
