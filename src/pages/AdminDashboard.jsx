import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sliders, Clock, Users, DollarSign, Shield } from 'lucide-react';

export default function AdminDashboard({ onShowAlert }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats()
      .then((data) => setStats(data))
      .catch((err) => onShowAlert(err.message || 'Failed to load admin stats', 'danger'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: '20px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
          <Shield size={12} /> System Admin Overview
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Operations Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time metrics, slot occupancy, revenue analytics, and active sessions.</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid-cards">
        <div className="stat-card glass-panel">
          <div className="stat-icon"><Sliders /></div>
          <div>
            <div className="stat-title">Total Parking Slots</div>
            <div className="stat-value">{stats?.totalSlots ?? '-'}</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.15)', color: 'var(--success)' }}><Clock /></div>
          <div>
            <div className="stat-title">Active Sessions</div>
            <div className="stat-value">{stats?.activeSessions ?? '-'}</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(112, 0, 255, 0.15)', color: '#a855f7' }}><Users /></div>
          <div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats?.totalUsers ?? '-'}</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(255, 171, 0, 0.15)', color: 'var(--warning)' }}><DollarSign /></div>
          <div>
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value">₹{Number(stats?.totalRevenue ?? 0).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
