// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || ' http://localhost:4000/api',
  baseURL: process.env.REACT_APP_API_URL || 'https://adityapandey27-crm-backend.vercel.app/api',
  
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      // token might be a plain string or an object, normalize:
      const t = typeof token === 'string' ? token : (token.token || token.accessToken || token);
      config.headers.Authorization = `Bearer ${t}`;
    }
  } catch (e) { /* ignore */ }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to catch 401 globally (optional)
api.interceptors.response.use((res) => res, (error) => {
  if (error?.response?.status === 401) {
    // leave handling to the app (for example: redirect to login)
    // you could also emit an event or clear localStorage here
  }
  return Promise.reject(error);
});

export default api;
