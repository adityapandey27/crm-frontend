import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import * as authApi from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ email, newPassword });
      nav('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="bg-white/60 rounded-2xl p-8 glass fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Reset password</h2>
            <p className="text-sm text-muted mt-1">Enter your registered email and new password</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-red-600">{error}</div>}
            <Input label="Registered Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <div className="flex justify-end">
              <Button type="submit" variant="solid" size="md" disabled={loading}>
                {loading ? 'Saving...' : 'Reset password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
