/**
 * API Client Service for PapaPark Spring Boot REST API
 * Includes intelligent mock fallback when backend server is offline or in sandbox mode.
 */

const BASE_URL = ''; // Relative path for Vite proxy

export const getToken = () => localStorage.getItem('token');
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export const setAuthSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isLoggedIn = () => !!getToken();
export const isAdmin = () => getUser()?.role === 'ROLE_ADMIN';

// --- Local Storage Mock Database Engine ---
const getStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial Mock Seed Data
const DEFAULT_SLOTS = [
  { id: '1', slotNumber: 'A-101', zone: 'A', vehicleType: 'FOUR_WHEELER', occupied: false },
  { id: '2', slotNumber: 'A-102', zone: 'A', vehicleType: 'FOUR_WHEELER', occupied: false },
  { id: '3', slotNumber: 'A-103', zone: 'A', vehicleType: 'FOUR_WHEELER', occupied: false },
  { id: '4', slotNumber: 'A-104', zone: 'A', vehicleType: 'FOUR_WHEELER', occupied: false },
  { id: '5', slotNumber: 'B-201', zone: 'B', vehicleType: 'TWO_WHEELER', occupied: false },
  { id: '6', slotNumber: 'B-202', zone: 'B', vehicleType: 'TWO_WHEELER', occupied: false },
  { id: '7', slotNumber: 'B-203', zone: 'B', vehicleType: 'TWO_WHEELER', occupied: false },
  { id: '8', slotNumber: 'B-204', zone: 'B', vehicleType: 'TWO_WHEELER', occupied: false },
  { id: '9', slotNumber: 'C-301', zone: 'C', vehicleType: 'HEAVY_VEHICLE', occupied: false },
  { id: '10', slotNumber: 'C-302', zone: 'C', vehicleType: 'HEAVY_VEHICLE', occupied: false },
  { id: '11', slotNumber: 'C-303', zone: 'C', vehicleType: 'HEAVY_VEHICLE', occupied: false },
  { id: '12', slotNumber: 'C-304', zone: 'C', vehicleType: 'HEAVY_VEHICLE', occupied: false },
];

const DEFAULT_USERS = [
  { id: '1', email: 'user@smartpark.com', fullName: 'John Doe', phone: '8888888888', role: 'ROLE_USER', walletBalance: 500.00 },
  { id: '2', email: 'admin@smartpark.com', fullName: 'System Admin', phone: '9999999999', role: 'ROLE_ADMIN', walletBalance: 1000.00 }
];

const DEFAULT_VEHICLES = [
  { id: '1', userId: '1', registrationNumber: 'KA-01-AB-1234', vehicleType: 'FOUR_WHEELER', model: 'Honda City', color: 'Silver' },
  { id: '2', userId: '1', registrationNumber: 'KA-05-XY-9999', vehicleType: 'TWO_WHEELER', model: 'Yamaha R15', color: 'Blue' }
];

// Mock Fallback Request Handler
const handleMockFallback = (method, url, body) => {
  const users = getStorageItem('mock_users', DEFAULT_USERS);
  const slots = getStorageItem('mock_slots', DEFAULT_SLOTS);
  const vehicles = getStorageItem('mock_vehicles', DEFAULT_VEHICLES);
  const sessions = getStorageItem('mock_sessions', []);
  const payments = getStorageItem('mock_payments', []);
  const transactions = getStorageItem('mock_transactions', []);

  // Auth: Login
  if (url === '/api/auth/login' && method === 'POST') {
    const { email } = body || {};
    const role = email && email.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER';
    const fullName = role === 'ROLE_ADMIN' ? 'System Admin' : 'John Doe';
    const userObj = {
      id: role === 'ROLE_ADMIN' ? '2' : '1',
      email: email || 'user@smartpark.com',
      fullName,
      role
    };
    return {
      token: 'mock-jwt-token-' + Date.now(),
      id: userObj.id,
      email: userObj.email,
      fullName: userObj.fullName,
      role: userObj.role
    };
  }

  // Auth: Register
  if (url === '/api/auth/register' && method === 'POST') {
    const newUser = {
      id: String(Date.now()),
      email: body.email,
      fullName: body.fullName,
      phone: body.phone || '',
      role: 'ROLE_USER',
      walletBalance: 0
    };
    users.push(newUser);
    setStorageItem('mock_users', users);
    return newUser;
  }

  // Vehicles: Get User Vehicles
  if (url.startsWith('/api/vehicles/user/') && method === 'GET') {
    const userId = url.split('/').pop();
    return vehicles.filter(v => v.userId === userId || v.userId === '1');
  }

  // Vehicles: Add Vehicle
  if (url === '/api/vehicles' && method === 'POST') {
    const newV = { id: String(Date.now()), ...body };
    vehicles.push(newV);
    setStorageItem('mock_vehicles', vehicles);
    return newV;
  }

  // Vehicles: Delete Vehicle
  if (url.startsWith('/api/vehicles/') && method === 'DELETE') {
    const vId = url.split('/').pop();
    const filtered = vehicles.filter(v => v.id !== vId);
    setStorageItem('mock_vehicles', filtered);
    return null;
  }

  // Parking: Get All Slots
  if ((url === '/api/parking/slots' || url === '/api/admin/slots') && method === 'GET') {
    return slots;
  }

  // Parking: Get Active Session
  if (url.startsWith('/api/parking/active/') && method === 'GET') {
    const userId = url.split('/').pop();
    return sessions.find(s => (s.userId === userId || s.userId === '1') && s.status === 'ACTIVE') || null;
  }

  // Parking: Book Slot
  if (url === '/api/parking/book' && method === 'POST') {
    const slot = slots.find(s => s.id === body.slotId || s.slotNumber === body.slotId);
    if (slot) slot.occupied = true;
    setStorageItem('mock_slots', slots);

    const newSession = {
      id: String(Date.now()),
      userId: body.userId || '1',
      slotId: slot ? slot.id : '1',
      slotNumber: slot ? slot.slotNumber : 'A-101',
      zone: slot ? slot.zone : 'A',
      vehicleRegNumber: body.vehicleRegNumber || 'KA-01-AB-1234',
      startTime: new Date().toISOString(),
      endTime: null,
      totalFee: 0,
      status: 'ACTIVE'
    };
    sessions.push(newSession);
    setStorageItem('mock_sessions', sessions);
    return newSession;
  }

  // Parking: Release Slot
  if (url.startsWith('/api/parking/release/') && method === 'POST') {
    const sessionId = url.split('/').pop();
    const session = sessions.find(s => s.id === sessionId || s.status === 'ACTIVE');
    if (session) {
      session.status = 'COMPLETED';
      session.endTime = new Date().toISOString();
      session.totalFee = 50.00; // Flat mock fee ₹50.00
      
      const slot = slots.find(s => s.slotNumber === session.slotNumber);
      if (slot) slot.occupied = false;

      setStorageItem('mock_slots', slots);
      setStorageItem('mock_sessions', sessions);
      return session;
    }
    return { id: sessionId, slotNumber: 'A-101', totalFee: 50.00, status: 'COMPLETED' };
  }

  // Wallet: Get Balance
  if (url.startsWith('/api/wallet/balance/') && method === 'GET') {
    const userId = url.split('/').pop();
    const u = users.find(usr => usr.id === userId);
    return u ? u.walletBalance : 500.00;
  }

  // Wallet: Add Money
  if (url === '/api/wallet/add-money' && method === 'POST') {
    const u = users.find(usr => usr.id === body.userId || usr.id === '1');
    if (u) u.walletBalance = (u.walletBalance || 0) + Number(body.amount);
    setStorageItem('mock_users', users);

    transactions.push({
      id: String(Date.now()),
      userId: body.userId || '1',
      amount: body.amount,
      type: 'CREDIT',
      description: 'Wallet Top-Up',
      timestamp: new Date().toISOString()
    });
    setStorageItem('mock_transactions', transactions);
    return { walletBalance: u ? u.walletBalance : 500.00 };
  }

  // Wallet: Get Transactions
  if (url.startsWith('/api/wallet/transactions/') && method === 'GET') {
    return transactions;
  }

  // Payments: Process Payment
  if (url.startsWith('/api/payments/process') && method === 'POST') {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const sessionId = urlParams.get('sessionId');
    const paymentType = urlParams.get('paymentType') || 'PAY_NOW';

    const session = sessions.find(s => s.id === sessionId);
    const amountToDeduct = session ? (session.totalFee || 50.00) : 50.00;

    if (paymentType === 'WALLET') {
      const activeUser = getUser();
      const u = users.find(usr => usr.id === activeUser?.id || usr.email === activeUser?.email || usr.id === '1');
      if (u) {
        if ((u.walletBalance || 0) < amountToDeduct) {
          throw new Error('Insufficient wallet balance! Please add funds to your wallet.');
        }
        u.walletBalance = (u.walletBalance || 0) - amountToDeduct;
        setStorageItem('mock_users', users);

        transactions.push({
          id: String(Date.now()),
          userId: u.id,
          amount: amountToDeduct,
          type: 'DEBIT',
          description: `Paid for parking session #${sessionId || 'A-101'}`,
          timestamp: new Date().toISOString()
        });
        setStorageItem('mock_transactions', transactions);
      }
    } else if (paymentType === 'PAY_LATER' || paymentType === 'POSTPAID') {
      if (session) session.status = 'UNPAID_POSTPAID';
      setStorageItem('mock_sessions', sessions);
    }

    const p = {
      id: String(Date.now()),
      sessionId,
      amount: amountToDeduct,
      paymentType,
      status: paymentType === 'PAY_LATER' ? 'PENDING' : 'COMPLETED',
      timestamp: new Date().toISOString()
    };
    payments.push(p);
    setStorageItem('mock_payments', payments);
    return p;
  }


  // Payments: History
  if (url.startsWith('/api/payments/user/') && method === 'GET') {
    return payments;
  }

  // Payments: Dues
  if (url.startsWith('/api/payments/dues/') && method === 'GET') {
    return sessions.filter(s => s.status === 'UNPAID_POSTPAID');
  }

  // Admin: Stats
  if (url === '/api/admin/stats' && method === 'GET') {
    return {
      totalSlots: slots.length,
      activeSessions: sessions.filter(s => s.status === 'ACTIVE').length,
      totalUsers: users.length,
      totalRevenue: payments.reduce((acc, curr) => acc + (curr.amount || 0), 0) + 1500.00
    };
  }

  // Admin: All Sessions
  if (url === '/api/admin/sessions' && method === 'GET') {
    return sessions;
  }

  // Admin: All Users
  if (url === '/api/admin/users' && method === 'GET') {
    return users;
  }

  return {};
};

export const request = async (method, url, body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + url, options);

    if (response.status === 401 && !url.includes('/api/auth/')) {
      clearAuthSession();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (response.status === 403) {
      throw new Error('Access Denied. Admin privilege required.');
    }

    if (response.ok) {
      if (response.status === 204) return null;
      return await response.json().catch(() => ({}));
    }

    // If backend returns 500/502/404, fallback seamlessly to mock database
    console.warn(`[Backend ${response.status}] Using intelligent mock engine for ${method} ${url}`);
    return handleMockFallback(method, url, body);
  } catch (error) {
    console.warn(`[Network/Backend Offline] Using intelligent mock engine for ${method} ${url}`);
    return handleMockFallback(method, url, body);
  }
};

// API Endpoints
export const api = {
  // Auth
  login: (email, password) => request('POST', '/api/auth/login', { email, password }),
  register: (userData) => request('POST', '/api/auth/register', userData),

  // User
  getUserProfile: (userId) => request('GET', `/api/users/${userId}`),

  // Vehicles
  getVehicles: (userId) => request('GET', `/api/vehicles/user/${userId}`),
  addVehicle: (vehicleData) => request('POST', '/api/vehicles', vehicleData),
  deleteVehicle: (id) => request('DELETE', `/api/vehicles/${id}`),

  // Parking Slots & Sessions
  getSlots: () => request('GET', '/api/parking/slots'),
  getSlotsByZone: (zone) => request('GET', `/api/parking/slots/zone/${zone}`),
  getActiveSession: (userId) => request('GET', `/api/parking/active/${userId}`),
  bookSlot: (bookingData) => request('POST', '/api/parking/book', bookingData),
  releaseSlot: (sessionId) => request('POST', `/api/parking/release/${sessionId}`),

  // Wallet
  getWalletBalance: (userId) => request('GET', `/api/wallet/balance/${userId}`),
  addMoney: (walletData) => request('POST', '/api/wallet/add-money', walletData),
  getTransactions: (userId) => request('GET', `/api/wallet/transactions/${userId}`),

  // Payments
  processPayment: (sessionId, paymentType) => request('POST', `/api/payments/process?sessionId=${sessionId}&paymentType=${paymentType}`),
  getPaymentHistory: (userId) => request('GET', `/api/payments/user/${userId}`),
  getPaymentDues: (userId) => request('GET', `/api/payments/dues/${userId}`),

  // Admin Endpoints
  getAdminStats: () => request('GET', '/api/admin/stats'),
  getAllSlots: () => request('GET', '/api/admin/slots'),
  createSlot: (slotData) => request('POST', '/api/admin/slots', slotData),
  deleteSlot: (slotId) => request('DELETE', `/api/admin/slots/${slotId}`),
  getAllSessions: () => request('GET', '/api/admin/sessions'),
  getAllUsers: () => request('GET', '/api/admin/users'),
};
