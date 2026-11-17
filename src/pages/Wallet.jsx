import React, { useState, useEffect } from 'react';
import { api, getUser } from '../services/api';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

export default function Wallet({ onShowAlert }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [loading, setLoading] = useState(false);

  const user = getUser();

  const loadWalletData = async () => {
    if (!user?.id) return;
    try {
      const [bal, txList] = await Promise.all([
        api.getWalletBalance(user.id).catch(() => 0),
        api.getTransactions(user.id).catch(() => []),
      ]);
      setBalance(bal || 0);
      setTransactions(txList || []);
    } catch (err) {
      onShowAlert('Failed to load wallet information', 'danger');
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const handleAddFunds = async (amount) => {
    const val = parseFloat(amount || amountToAdd);
    if (!val || val <= 0) {
      onShowAlert('Please enter a valid top-up amount', 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.addMoney({ userId: user.id, amount: val });
      onShowAlert(`Successfully added ₹${val.toFixed(2)} to your wallet!`, 'success');
      setAmountToAdd('');
      loadWalletData();
    } catch (err) {
      onShowAlert(err.message || 'Failed to add funds', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Digital Wallet</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your parking balance and view instant transaction logs.</p>
      </div>

      {/* Balance Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '30px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(0, 212, 255, 0.15))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Available Balance</span>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--success)', margin: '4px 0' }}>
              ₹{Number(balance).toFixed(2)}
            </h1>
            <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> Auto-Deduct Ready
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '260px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quick Top-Up</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => handleAddFunds(100)}>+₹100</button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleAddFunds(500)}>+₹500</button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleAddFunds(1000)}>+₹1000</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="number"
                className="form-input"
                placeholder="Custom amount"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              />
              <button className="btn btn-primary btn-sm" onClick={() => handleAddFunds()} disabled={loading}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Transaction History</h3>
        {transactions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>No transactions recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className={`badge ${tx.type === 'CREDIT' ? 'badge-success' : 'badge-danger'}`}>
                        {tx.type === 'CREDIT' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />} {tx.type}
                      </span>
                    </td>
                    <td>{tx.description || 'Wallet Action'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(tx.timestamp).toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: tx.type === 'CREDIT' ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
