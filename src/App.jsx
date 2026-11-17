import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AlertBanner from './components/AlertBanner';
import { isLoggedIn, isAdmin } from './services/api';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Parking from './pages/Parking';
import Wallet from './pages/Wallet';
import Payments from './pages/Payments';

import AdminDashboard from './pages/AdminDashboard';
import AdminSlots from './pages/AdminSlots';
import AdminSessions from './pages/AdminSessions';
import AdminUsers from './pages/AdminUsers';

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  return isLoggedIn() && isAdmin() ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const location = useLocation();

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  };

  const handleDismissAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const authenticated = isLoggedIn();
  const hideSidebarRoutes = ['/', '/login', '/register', '/forgot-password'];
  const showSidebar = authenticated && !hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onShowAlert={showAlert} />
      <AlertBanner alerts={alerts} onDismiss={handleDismissAlert} />

      <div className="app-container" style={{ flex: 1 }}>
        {showSidebar && <Sidebar />}

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onShowAlert={showAlert} />} />
            <Route path="/register" element={<Register onShowAlert={showAlert} />} />
            <Route path="/forgot-password" element={<ForgotPassword onShowAlert={showAlert} />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard onShowAlert={showAlert} /></PrivateRoute>} />
            <Route path="/vehicles" element={<PrivateRoute><Vehicles onShowAlert={showAlert} /></PrivateRoute>} />
            <Route path="/parking" element={<PrivateRoute><Parking onShowAlert={showAlert} /></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><Wallet onShowAlert={showAlert} /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><Payments onShowAlert={showAlert} /></PrivateRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard onShowAlert={showAlert} /></AdminRoute>} />
            <Route path="/admin/slots" element={<AdminRoute><AdminSlots onShowAlert={showAlert} /></AdminRoute>} />
            <Route path="/admin/sessions" element={<AdminRoute><AdminSessions onShowAlert={showAlert} /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers onShowAlert={showAlert} /></AdminRoute>} />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
