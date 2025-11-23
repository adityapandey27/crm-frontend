// src/api/auth.js
import api from './axios';

export const login = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password });
  // Normalize response: prefer res.data.data or res.data
  return res.data?.data || res.data;
};

export const signup = async ({ name, email, password }) => {
  const res = await api.post('/auth/signup', { name, email, password });
  return res.data?.data || res.data;
};

export const resetPassword = async ({ email, newPassword }) => {
  const res = await api.post('/auth/reset-password', { email, newPassword });
  return res.data?.data || res.data;
};
