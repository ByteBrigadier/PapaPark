import React, { useState, useEffect } from 'react';
import { api, getUser } from '../services/api';
import { CreditCard, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export default function Payments({ onShowAlert }) {
  const [payments, setPayments] = useState([]);
  const [dues, setDues] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  const loadPaymentData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [history, dueList] = await Promise.all([
        api.getPaymentHistory(user.id).catch(() => []),
        api.getPaymentDues(user.id).catch(() => []),
      ]);
      setPayments(history || []);
      setDues(dueList || []);
    } catch (err) {
      onShowAlert('Failed to load payment history', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentData();
  }, []);

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Payments & Invoice History</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View completed receipts and settle outstanding postpaid dues.</p>
      </div>

      {/* Outstanding Dues Section */}
      {dues.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px', borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ color: 'var(--warning)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} /> Outstanding Postpaid Dues ({dues.length})
          </h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Slot Number</th>
                  <th>Vehicle</th>
                  <th>Amount Due</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dues.map((due) => (
                  <tr key={due.id}>
                    <td>#{due.id}</td>
                    <td><strong style={{ color: 'var(--accent-primary)' }}>{due.slotNumber}</strong></td>
                    <td>{due.vehicleRegNumber}</td>
                    <td style={{ color: 'var(--warning)', fontWeight: 700 }}>₹{Number(due.totalFee).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => setSelectedSession(due)}>
                        Pay Dues Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Paid Invoices</h3>
        {payments.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>No payment receipts recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontSize: '0.85rem' }}>#{p.id || p.transactionId}</td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>₹{Number(p.amount).toFixed(2)}</td>
                    <td><span className="badge badge-info">{p.paymentType || 'ONLINE'}</span></td>
                    <td>
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> {p.status || 'COMPLETED'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(p.paymentTime || p.timestamp || Date.now()).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settlement Payment Gateway Modal */}
      {selectedSession && (
        <PaymentModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSuccess={loadPaymentData}
          onShowAlert={onShowAlert}
        />
      )}
    </div>
  );
}
