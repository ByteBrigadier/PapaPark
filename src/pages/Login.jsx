import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuthSession } from '../services/api';
import { Lock, Mail, ArrowRight, Shield, UserCheck } from 'lucide-react';

export default function Login({ onShowAlert }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      onShowAlert('Please enter email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login(email, password);
      setAuthSession(response.token, {
        id: response.id,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
      });

      onShowAlert(`Welcome back, ${response.fullName || response.email}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      onShowAlert(err.message || 'Invalid email or password', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-primary)' }}>
            Sign In to PapaPark
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enter your credentials to access your parking dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>
                Forgot?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Accounts Quick Login */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Quick Demo Logins:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleDemoLogin('user@smartpark.com', 'user123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <UserCheck size={14} /> Demo User
            </button>
            <button
              onClick={() => handleDemoLogin('admin@smartpark.com', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <Shield size={14} /> Demo Admin
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
