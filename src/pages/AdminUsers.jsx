import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Shield, User as UserIcon } from 'lucide-react';

export default function AdminUsers({ onShowAlert }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllUsers()
      .then((data) => setUsers(data || []))
      .catch((err) => onShowAlert(err.message || 'Failed to load user directory', 'danger'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>User Directory</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View registered driver accounts, roles, and wallet balances.</p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Wallet Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontSize: '0.85rem' }}>#{u.id}</td>
                  <td style={{ fontWeight: 600 }}>{u.fullName || 'User'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td>
                    <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-danger' : 'badge-info'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {u.role === 'ROLE_ADMIN' ? <Shield size={12} /> : <UserIcon size={12} />}
                      {u.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                    ₹{Number(u.walletBalance || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
