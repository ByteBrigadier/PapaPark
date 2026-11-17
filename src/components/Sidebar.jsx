import React from 'react';
import { NavLink } from 'react-router-dom';
import { isAdmin } from '../services/api';
import {
  LayoutDashboard,
  Car,
  ParkingSquare,
  Wallet,
  CreditCard,
  Sliders,
  Clock,
  Users,
} from 'lucide-react';

export default function Sidebar() {
  const adminAccess = isAdmin();

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/vehicles" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Car size={18} />
            <span>My Vehicles</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/parking" className={({ isActive }) => (isActive ? 'active' : '')}>
            <ParkingSquare size={18} />
            <span>Book Parking</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/wallet" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Wallet size={18} />
            <span>My Wallet</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/payments" className={({ isActive }) => (isActive ? 'active' : '')}>
            <CreditCard size={18} />
            <span>Payments & Dues</span>
          </NavLink>
        </li>

        {adminAccess && (
          <>
            <li style={{ marginTop: '20px', paddingLeft: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Admin Controls
            </li>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                <LayoutDashboard size={18} color="#00d4ff" />
                <span>Admin Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/slots" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Sliders size={18} color="#00d4ff" />
                <span>Slot Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/sessions" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Clock size={18} color="#00d4ff" />
                <span>All Sessions</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Users size={18} color="#00d4ff" />
                <span>User Directory</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
