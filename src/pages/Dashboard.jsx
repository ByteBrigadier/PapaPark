import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, getUser } from '../services/api';
import { Car, Wallet, ParkingSquare, Clock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export default function Dashboard({ onShowAlert }) {
  const [vehicles, setVehicles] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [activeSession, setActiveSession] = useState(null);
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionForPayment, setSelectedSessionForPayment] = useState(null);

  const user = getUser();

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [vList, bal, session, dueList] = await Promise.all([
        api.getVehicles(user.id).catch(() => []),
        api.getWalletBalance(user.id).catch(() => 0),
        api.getActiveSession(user.id).catch(() => null),
        api.getPaymentDues(user.id).catch(() => []),
      ]);

      setVehicles(vList || []);
      setWalletBalance(bal || 0);
      setActiveSession(session);
      setDues(dueList || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRelease = async (sessionId) => {
    try {
      const session = await api.releaseSlot(sessionId);
      onShowAlert(`Slot ${session.slotNumber} released. Fee: ₹${session.totalFee.toFixed(2)}`, 'info');
      setSelectedSessionForPayment(session);
    } catch (err) {
      onShowAlert(err.message || 'Failed to release slot', 'danger');
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, {user?.fullName || 'Driver'}! 👋</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of your parking activities, wallet, and registered vehicles.</p>
      </div>

      {/* Dues Warning Banner */}
      {dues.length > 0 && (
        <div style={{ background: 'rgba(255, 171, 0, 0.15)', border: '1px solid var(--warning)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={24} color="var(--warning)" />
            <div>
              <strong style={{ color: 'var(--warning)' }}>Outstanding Postpaid Dues ({dues.length})</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>You have unsettled parking dues. Please settle them to book future slots.</p>
            </div>
          </div>
          <Link to="/payments" className="btn btn-primary btn-sm">
            Pay Dues Now
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid-cards">
        <div className="stat-card glass-panel">
          <div className="stat-icon"><Car /></div>
          <div>
            <div className="stat-title">My Vehicles</div>
            <div className="stat-value">{vehicles.length}</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.15)', color: 'var(--success)' }}><Wallet /></div>
          <div>
            <div className="stat-title">Wallet Balance</div>
            <div className="stat-value">₹{Number(walletBalance).toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(255, 171, 0, 0.15)', color: 'var(--warning)' }}><ParkingSquare /></div>
          <div>
            <div className="stat-title">Active Booking</div>
            <div className="stat-value">{activeSession ? activeSession.slotNumber : 'None'}</div>
          </div>
        </div>
      </div>

      {/* Active Session Card */}
      {activeSession ? (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '8px' }}>Active Reservation</span>
              <h3 style={{ fontSize: '1.4rem', margin: '4px 0' }}>
                Slot {activeSession.slotNumber} (Zone {activeSession.zone})
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Vehicle: <strong>{activeSession.vehicleRegNumber}</strong> | Started: {new Date(activeSession.startTime).toLocaleTimeString()}
              </p>
            </div>
            <button className="btn btn-danger" onClick={() => handleRelease(activeSession.id)}>
              <Clock size={16} /> Release Slot & Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center', marginBottom: '30px' }}>
          <ParkingSquare size={40} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
          <h3>No Active Parking Session</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px 0' }}>Looking for a parking spot? Reserve one instantly across Zones A, B, or C.</p>
          <Link to="/parking" className="btn btn-primary">
            Book a Parking Slot <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Quick Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={18} color="var(--accent-primary)" /> Quick Vehicle Add
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Register new 2-Wheelers or 4-Wheelers for instant slot matching.</p>
          <Link to="/vehicles" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Vehicles
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={18} color="var(--success)" /> Digital Wallet Top-up
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Add funds to your wallet for automated toll-gate deductions.</p>
          <Link to="/wallet" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Top-up Wallet
          </Link>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {selectedSessionForPayment && (
        <PaymentModal
          session={selectedSessionForPayment}
          onClose={() => setSelectedSessionForPayment(null)}
          onSuccess={fetchData}
          onShowAlert={onShowAlert}
        />
      )}
    </div>
  );
}
