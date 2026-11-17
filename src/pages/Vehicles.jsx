import React, { useState, useEffect } from 'react';
import { api, getUser } from '../services/api';
import { Car, Plus, Trash2, Shield, Info } from 'lucide-react';

export default function Vehicles({ onShowAlert }) {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [regNumber, setRegNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('FOUR_WHEELER');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(false);

  const user = getUser();

  const loadVehicles = async () => {
    if (!user?.id) return;
    try {
      const list = await api.getVehicles(user.id);
      setVehicles(list || []);
    } catch (err) {
      onShowAlert('Failed to load vehicles', 'danger');
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!regNumber) {
      onShowAlert('Please enter vehicle registration number', 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.addVehicle({
        userId: user.id,
        registrationNumber: regNumber.toUpperCase(),
        vehicleType,
        model,
        color,
      });
      onShowAlert('Vehicle registered successfully!', 'success');
      setShowModal(false);
      setRegNumber('');
      setModel('');
      setColor('');
      loadVehicles();
    } catch (err) {
      onShowAlert(err.message || 'Failed to add vehicle', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await api.deleteVehicle(id);
      onShowAlert('Vehicle removed', 'info');
      loadVehicles();
    } catch (err) {
      onShowAlert(err.message || 'Failed to delete vehicle', 'danger');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Vehicles</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your registered vehicles for quick parking reservations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      {/* Vehicle Grid */}
      {vehicles.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <Car size={48} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
          <h3>No Vehicles Registered Yet</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px 0' }}>Add your first car, motorcycle, or truck to get started.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add First Vehicle
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {vehicles.map((v) => (
            <div key={v.id} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-info">{v.vehicleType ? v.vehicleType.replace('_', ' ') : 'VEHICLE'}</span>
                  <h3 style={{ fontSize: '1.3rem', margin: '8px 0 4px 0', letterSpacing: '1px' }}>{v.registrationNumber}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    {v.model || 'Standard Model'} {v.color ? `(${v.color})` : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(v.id)}
                  style={{ background: 'rgba(255,23,68,0.1)', border: 'none', color: 'var(--danger)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  title="Remove Vehicle"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3 style={{ marginBottom: '20px', color: 'var(--accent-primary)' }}>Register New Vehicle</h3>
            <form onSubmit={handleAddVehicle}>
              <div className="form-group">
                <label className="form-label">Registration Number (Plate)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="KA-01-AB-1234"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-select" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                  <option value="TWO_WHEELER">Two Wheeler (Bike / Scooter)</option>
                  <option value="FOUR_WHEELER">Four Wheeler (Car / SUV)</option>
                  <option value="HEAVY_VEHICLE">Heavy Vehicle (Bus / Truck)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Make / Model (Optional)</label>
                <input type="text" className="form-input" placeholder="e.g. Honda City" value={model} onChange={(e) => setModel(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Color (Optional)</label>
                <input type="text" className="form-input" placeholder="e.g. Metallic Silver" value={color} onChange={(e) => setColor(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
