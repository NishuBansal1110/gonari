import axios from 'axios';

const API_BASE_URL = "https://gonari-11.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Driver endpoints
export const driverApi = {
  getStatus: () => api.get('/drivers/status'),
  updateStatus: (available) => api.put(`/drivers/status?available=${available}`),
  getNearby: (lat, lng, radius = 10) => api.get(`/drivers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Ride endpoints
export const rideApi = {
  request: (rideData) => api.post('/rides/request', rideData),
  accept: (id) => api.put(`/rides/${id}/accept`),
  start: (id, otp) => api.put(`/rides/${id}/start?otp=${otp}`),
  complete: (id) => api.put(`/rides/${id}/complete`),
  getActive: () => api.get('/rides/active'),
  getHistory: () => api.get('/rides/history'),
};

// SOS & Emergency Contact endpoints
export const sosApi = {
  trigger: (sosData) => api.post('/sos/trigger', sosData),
  getContacts: () => api.get('/sos/contacts'),
  addContact: (contactData) => api.post('/sos/contacts', contactData),
  deleteContact: (id) => api.delete(`/sos/contacts/${id}`),
};

// Admin Verification endpoints
export const adminApi = {
  getPending: () => api.get('/verification/pending'),
  getAllDrivers: () => api.get('/verification/drivers'),
  approveDriver: (userId) => api.put(`/verification/${userId}/approve`),
  rejectDriver: (userId) => api.put(`/verification/${userId}/reject`),
};

// General contact form endpoint
export const contactUsApi = (contactData) => api.post('/contact-us', contactData);

export default api;
