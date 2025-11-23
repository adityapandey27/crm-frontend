// src/store/authStore.js
import create from 'zustand';
import api from '../api/axios';

const initialToken = localStorage.getItem('token') || null;
const initialUser = (() => {
  try {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
})();

const useAuth = create((set) => ({
  token: initialToken,
  user: initialUser,
  setAuth: (token, user) => {
    // token might be object, normalize to string if necessary
    const finalToken = typeof token === 'string' ? token : (token?.token || token?.accessToken || JSON.stringify(token));
    localStorage.setItem('token', finalToken);
    localStorage.setItem('user', JSON.stringify(user || null));
    // ensure axios uses new token immediately
    if (finalToken) {
      api.defaults.headers.common.Authorization = `Bearer ${typeof finalToken === 'string' ? finalToken : finalToken.token}`;
    }
    set({ token: finalToken, user });
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    set({ token: null, user: null });
  }
}));

export default useAuth;
