// src/components/common/ConfirmModal.jsx
import React from 'react';

export default function ConfirmModal({ open, title = 'Confirm', message = 'Are you sure?', onCancel = () => {}, onConfirm = () => {}, loading = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted mt-2">{message}</p>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-300">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-lg btn-accent text-white">
            {loading ? 'Working...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
