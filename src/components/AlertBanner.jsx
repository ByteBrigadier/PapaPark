import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function AlertBanner({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="toast-container">
      {alerts.map((alert) => (
        <div key={alert.id} className="toast">
          {alert.type === 'success' && <CheckCircle size={20} color="#00e676" />}
          {alert.type === 'warning' && <AlertTriangle size={20} color="#ffab00" />}
          {alert.type === 'danger' && <XCircle size={20} color="#ff1744" />}
          {alert.type === 'info' && <Info size={20} color="#29b6f6" />}
          <span style={{ flex: 1 }}>{alert.message}</span>
          <button
            onClick={() => onDismiss(alert.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
