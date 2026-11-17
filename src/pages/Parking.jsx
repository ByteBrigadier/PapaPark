import React, { useState, useEffect } from 'react';
import { api, getUser } from '../services/api';
import { ParkingSquare, CheckCircle, Lock, RefreshCw, ArrowRight } from 'lucide-react';

export default function Parking({ onShowAlert }) {
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activeZone, setActiveZone] = useState('ALL'); // ALL, A, B, C
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [loading, setLoading] = useState(false);

  const user = getUser();

  const loadData = async () => {
    try {
      const [slotList, vList] = await Promise.all([
        api.getSlots().catch(() => []),
        user?.id ? api.getVehicles(user.id).catch(() => []) : Promise.resolve([]),
      ]);
      setSlots(slotList || []);
      setVehicles(vList || []);
      if (vList && vList.length > 0) {
        setSelectedVehicle(vList[0].registrationNumber);
      }
    } catch (err) {
      onShowAlert('Failed to refresh parking slots', 'danger');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSlots = slots.filter((slot) => {
    if (activeZone === 'ALL') return true;
    return slot.zone === activeZone;
  });

  const handleBookSlot = async () => {
    if (!selectedSlot) return;
    if (!selectedVehicle) {
      onShowAlert('Please select a vehicle or register one first', 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.bookSlot({
        userId: user.id,
        slotId: selectedSlot.id,
        vehicleRegNumber: selectedVehicle,
      });
      onShowAlert(`Successfully reserved Slot ${selectedSlot.slotNumber}!`, 'success');
      setSelectedSlot(null);
      loadData();
    } catch (err) {
      onShowAlert(err.message || 'Slot booking failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Real-Time Parking Slot Map</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Select an available spot to reserve your parking space.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          <RefreshCw size={14} /> Refresh Grid
        </button>
      </div>

      {/* Zone Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button className={`btn btn-sm ${activeZone === 'ALL' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveZone('ALL')}>
          All Zones ({slots.length})
        </button>
        <button className={`btn btn-sm ${activeZone === 'A' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveZone('A')}>
          Zone A - Car (4W)
        </button>
        <button className={`btn btn-sm ${activeZone === 'B' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveZone('B')}>
          Zone B - Bike (2W)
        </button>
        <button className={`btn btn-sm ${activeZone === 'C' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveZone('C')}>
          Zone C - Heavy (HW)
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '0.85rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}>
          <CheckCircle size={16} /> Available
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)' }}>
          <Lock size={16} /> Occupied
        </span>
      </div>

      {/* Slots Grid */}
      <div className="slot-grid">
        {filteredSlots.map((slot) => {
          const isOccupied = slot.occupied;
          return (
            <div
              key={slot.id}
              className={`slot-card ${isOccupied ? 'occupied' : 'available'}`}
              onClick={() => {
                if (!isOccupied) setSelectedSlot(slot);
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{slot.slotNumber}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Zone {slot.zone}</div>
              <span className={`badge ${isOccupied ? 'badge-danger' : 'badge-success'}`} style={{ marginTop: '8px', fontSize: '0.65rem' }}>
                {isOccupied ? 'Occupied' : 'Reserve'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Reservation Confirmation Modal */}
      {selectedSlot && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3 style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>
              Confirm Slot Reservation: {selectedSlot.slotNumber}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Zone {selectedSlot.zone} | Allowed Vehicle: {selectedSlot.vehicleType ? selectedSlot.vehicleType.replace('_', ' ') : 'Standard'}
            </p>

            <div className="form-group">
              <label className="form-label">Select Your Vehicle</label>
              {vehicles.length === 0 ? (
                <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>
                  No vehicles registered. Please register a vehicle first!
                </p>
              ) : (
                <select className="form-select" value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.registrationNumber}>
                      {v.registrationNumber} ({v.model || v.vehicleType})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedSlot(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleBookSlot} disabled={loading || vehicles.length === 0}>
                {loading ? 'Reserving...' : 'Confirm & Reserve Slot'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
