// src/pages/Login.jsx
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import * as authApi from '../api/auth';
import useAuth from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuth((s) => s.setAuth);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      // data shape could be { token, user } or { token: { token: '...' }, user: {...} }
      // Normalize token
      const token = data?.token?.token || data?.token || data?.accessToken || data?.authToken || data;
      const user = data?.user || data?.userData || null;

      // If server returned nested `token` object like { token: { token, ...}, user }
      const finalToken = (typeof token === 'object') ? (token.token || JSON.stringify(token)) : token;

      if (!finalToken) {
        throw new Error('Invalid login response from server');
      }

      setAuth(finalToken, user);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Sign in</h2>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="text-red-600">{error}</div>}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <a href="/reset-password" className="text-sky-600">Forgot password?</a>
            </div>
            <div className="text-sm">
              <a href="/signup" className="text-sky-600">Signup</a>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
