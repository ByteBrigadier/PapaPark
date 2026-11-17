import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, Sliders, CheckCircle, Lock } from 'lucide-react';

export default function AdminSlots({ onShowAlert }) {
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [slotNumber, setSlotNumber] = useState('');
  const [zone, setZone] = useState('A');
  const [vehicleType, setVehicleType] = useState('FOUR_WHEELER');
  const [loading, setLoading] = useState(false);

  const loadSlots = async () => {
    try {
      const list = await api.getAllSlots();
      setSlots(list || []);
    } catch (err) {
      onShowAlert(err.message || 'Failed to load slots', 'danger');
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!slotNumber) {
      onShowAlert('Please enter slot number (e.g. A-105)', 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.createSlot({
        slotNumber: slotNumber.toUpperCase(),
        zone: zone.toUpperCase(),
        vehicleType,
        occupied: false,
      });
      onShowAlert(`Slot ${slotNumber} created successfully!`, 'success');
      setShowModal(false);
      setSlotNumber('');
      loadSlots();
    } catch (err) {
      onShowAlert(err.message || 'Failed to create slot', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Delete this slot permanently?')) return;
    try {
      await api.deleteSlot(id);
      onShowAlert('Slot deleted', 'info');
      loadSlots();
    } catch (err) {
      onShowAlert(err.message || 'Failed to delete slot', 'danger');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Parking Slot Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Add, configure, or decommission parking slots in Zones A, B, and C.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add New Slot
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Slot Number</th>
                <th>Zone</th>
                <th>Vehicle Type Allowed</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s.id}>
                  <td><strong style={{ color: 'var(--accent-primary)', fontSize: '1.05rem' }}>{s.slotNumber}</strong></td>
                  <td>Zone {s.zone}</td>
                  <td>{s.vehicleType ? s.vehicleType.replace('_', ' ') : 'FOUR_WHEELER'}</td>
                  <td>
                    <span className={`badge ${s.occupied ? 'badge-danger' : 'badge-success'}`}>
                      {s.occupied ? <Lock size={12} /> : <CheckCircle size={12} />} {s.occupied ? 'Occupied' : 'Available'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteSlot(s.id)}
                      style={{ background: 'rgba(255,23,68,0.1)', border: 'none', color: 'var(--danger)', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Slot Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3 style={{ marginBottom: '20px', color: 'var(--accent-primary)' }}>Create New Parking Slot</h3>
            <form onSubmit={handleCreateSlot}>
              <div className="form-group">
                <label className="form-label">Slot Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. A-105"
                  value={slotNumber}
                  onChange={(e) => setSlotNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Zone</label>
                <select className="form-select" value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option value="A">Zone A (Cars)</option>
                  <option value="B">Zone B (Bikes)</option>
                  <option value="C">Zone C (Heavy Vehicles)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-select" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                  <option value="FOUR_WHEELER">Four Wheeler (Car)</option>
                  <option value="TWO_WHEELER">Two Wheeler (Bike)</option>
                  <option value="HEAVY_VEHICLE">Heavy Vehicle (Bus/Truck)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
