import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSessions({ onShowAlert }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllSessions()
      .then((data) => setSessions(data || []))
      .catch((err) => onShowAlert(err.message || 'Failed to load sessions', 'danger'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Parking Session Audit Log</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View all active and historical parking reservations across all zones.</p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Slot Number</th>
                <th>Vehicle Plate</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Total Fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>#{s.id}</td>
                  <td><strong style={{ color: 'var(--accent-primary)' }}>{s.slotNumber}</strong></td>
                  <td>{s.vehicleRegNumber}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{new Date(s.startTime).toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{s.endTime ? new Date(s.endTime).toLocaleString() : 'Ongoing...'}</td>
                  <td style={{ fontWeight: 700, color: s.totalFee > 0 ? 'var(--success)' : 'var(--text-main)' }}>
                    ₹{Number(s.totalFee || 0).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${s.status === 'COMPLETED' ? 'badge-success' : s.status === 'ACTIVE' ? 'badge-info' : 'badge-warning'}`}>
                      {s.status}
                    </span>
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
