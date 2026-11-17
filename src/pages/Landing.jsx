import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ParkingSquare, Wallet, Zap, Clock, Smartphone } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Hero Section */}
      <section style={{ padding: '90px 20px 60px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
          <Zap size={14} /> Automated Smart Parking Platform
        </div>
        <h1 style={{ fontSize: '3.6rem', fontWeight: 900, lineHeight: 1.15, background: 'linear-gradient(135deg, #ffffff 30%, var(--accent-primary) 70%, #00e676 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px', letterSpacing: '-1px' }}>
          Park Smarter, Faster & Securer with PapaPark
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 35px auto', lineHeight: 1.6 }}>
          Reserve parking slots in real-time, manage vehicles, track active sessions, and settle payments effortlessly with our 3D-secure digital wallet & instant gateway.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            Get Started Now
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            Sign In to Dashboard
          </Link>
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', textAlign: 'left' }}>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 212, 255, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ParkingSquare size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Live Slot Grid</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              View real-time availability across Zone A (4-Wheelers), Zone B (2-Wheelers), and Zone C (Heavy Vehicles).
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(112, 0, 255, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Wallet size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Digital Wallet & Gateway</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Instant wallet top-ups, card payments, UPI QR codes, and Postpaid (Pay Later) flexibility.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 230, 118, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Role-Based Security</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              JWT authenticated sessions with admin controls for parking lot occupancy and session audits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
