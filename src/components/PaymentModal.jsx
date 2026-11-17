import React, { useState, useEffect } from 'react';
import { api, getUser } from '../services/api';
import { CreditCard, QrCode, Wallet, Hourglass, ShieldCheck, X } from 'lucide-react';

export default function PaymentModal({ session, onClose, onSuccess, onShowAlert }) {
  const [activeTab, setActiveTab] = useState('CARD'); // CARD, UPI, WALLET, POSTPAID
  const [step, setStep] = useState('INPUT'); // INPUT, OTP
  const [walletBalance, setWalletBalance] = useState(0);
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);

  const user = getUser();
  const amount = session?.totalFee || 0;

  useEffect(() => {
    if (user?.id) {
      api.getWalletBalance(user.id)
        .then((bal) => setWalletBalance(bal || 0))
        .catch(() => {});
    }
  }, [user]);

  if (!session) return null;

  const handlePayment = async () => {
    if (step === 'INPUT' && activeTab === 'CARD') {
      setStep('OTP');
      return;
    }

    setLoading(true);
    let paymentType = 'PAY_NOW';
    if (activeTab === 'WALLET') paymentType = 'WALLET';
    if (activeTab === 'POSTPAID') paymentType = 'PAY_LATER';

    try {
      await api.processPayment(session.id, paymentType);
      onShowAlert('Payment successful! Session settled and receipt generated.', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      onShowAlert(err.message || 'Payment processing failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
            <ShieldCheck size={24} /> PaySecure Gateway
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Amount Payable</span>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--accent-primary)', margin: '4px 0' }}>
            ₹{Number(amount).toFixed(2)}
          </h2>
          <span className="badge badge-info">Session #{session.id}</span>
        </div>

        {step === 'INPUT' ? (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${activeTab === 'CARD' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('CARD')}
              >
                <CreditCard size={14} /> Card
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'UPI' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('UPI')}
              >
                <QrCode size={14} /> UPI / QR
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'WALLET' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('WALLET')}
              >
                <Wallet size={14} /> Wallet
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'POSTPAID' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('POSTPAID')}
              >
                <Hourglass size={14} /> Postpaid
              </button>
            </div>

            {/* Tab 1: Card */}
            {activeTab === 'CARD' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-input" placeholder="4532 •••• •••• 8901" maxLength="19" defaultValue="4532 8890 1234 8901" />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Expiry Date</label>
                    <input type="text" className="form-input" placeholder="MM/YY" defaultValue="12/28" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">CVV</label>
                    <input type="password" className="form-input" placeholder="•••" defaultValue="888" />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: UPI */}
            {activeTab === 'UPI' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Scan QR with GPay / PhonePe / Paytm or enter UPI ID
                </p>
                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', display: 'inline-block', marginBottom: '15px' }}>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=smartpark@upi"
                    alt="UPI QR"
                    style={{ width: '130px', height: '130px' }}
                  />
                </div>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label className="form-label">UPI ID</label>
                  <input type="text" className="form-input" placeholder="username@upi" defaultValue="user@okicici" />
                </div>
              </div>
            )}

            {/* Tab 3: Wallet */}
            {activeTab === 'WALLET' && (
              <div style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--accent-primary)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>SmartPark Digital Wallet Balance</p>
                <h2 style={{ color: 'var(--success)', margin: '8px 0' }}>₹{Number(walletBalance).toFixed(2)}</h2>
                {walletBalance < amount ? (
                  <p style={{ fontSize: '0.82rem', color: 'var(--danger)', margin: 0 }}>⚠️ Insufficient balance! Please top up your wallet or select another payment option.</p>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Amount will be instantly deducted upon authorization.</p>
                )}
              </div>
            )}

            {/* Tab 4: Postpaid */}
            {activeTab === 'POSTPAID' && (
              <div style={{ background: 'rgba(255, 171, 0, 0.1)', border: '1px solid var(--warning)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '2.2rem' }}>⏳</span>
                <h4 style={{ color: 'var(--warning)', margin: '8px 0' }}>Postpaid Mode Selected</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your parking slot will be released immediately.</p>
                <p style={{ fontSize: '0.8rem', color: '#ffaa00', fontWeight: 600 }}>⚠️ Dues MUST be settled before booking future slots!</p>
              </div>
            )}
          </>
        ) : (
          /* OTP Verification Step */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <span style={{ fontSize: '3rem' }}>🔐</span>
            <h4 style={{ margin: '10px 0' }}>3D Secure OTP Verification</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Enter the 6-digit OTP sent to your registered mobile number
            </p>
            <input
              type="text"
              className="form-input"
              style={{ width: '180px', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '4px', margin: '0 auto 15px auto' }}
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={loading || (activeTab === 'WALLET' && walletBalance < amount)}
          >
            {loading ? 'Processing...' : step === 'INPUT' ? (activeTab === 'POSTPAID' ? 'Confirm Postpaid' : 'Authorize & Pay') : 'Submit OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}
