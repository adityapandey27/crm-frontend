// src/components/leads/LeadFormModal.jsx
import React, { useEffect, useState } from 'react';
import useLeadStore from '../../store/leadStore';

export default function LeadFormModal({ open, onClose, initialData = null, onSaved = () => {} }) {
  const createLead = useLeadStore((s) => s.createLead);
  const updateLead = useLeadStore((s) => s.updateLead);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    stage: 'New',
    note: '',
    score: 'Cold'
  });
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        source: initialData.source || 'Website',
        stage: initialData.stage || 'New',
        note: initialData.note || '',
        score: initialData.score || 'Cold'
      });
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        source: 'Website',
        stage: 'New',
        note: '',
        score: 'Cold'
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const save = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        const updated = await updateLead(initialData._id, form);
        onSaved(updated);
      } else {
        const created = await createLead(form);
        onSaved(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="p-3 rounded-lg bg-white/30 border border-white/20" placeholder="Full name" value={form.name} onChange={handleChange('name')} />
          <input className="p-3 rounded-lg bg-white/30 border border-white/20" placeholder="Email" value={form.email} onChange={handleChange('email')} />
          <input className="p-3 rounded-lg bg-white/30 border border-white/20" placeholder="Phone" value={form.phone} onChange={handleChange('phone')} />
          <select className="p-3 rounded-lg bg-white/30 border border-white/20" value={form.source} onChange={handleChange('source')}>
            <option>Website</option>
            <option>Google</option>
            <option>Referral</option>
            <option>Other</option>
          </select>
          <select className="p-3 rounded-lg bg-white/30 border border-white/20" value={form.stage} onChange={handleChange('stage')}>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Converted</option>
          </select>
          <select className="p-3 rounded-lg bg-white/30 border border-white/20" value={form.score} onChange={handleChange('score')}>
            <option>Cold</option>
            <option>Warm</option>
            <option>Hot</option>
          </select>
        </div>

        <textarea className="w-full mt-3 p-3 rounded-lg bg-white/30 border border-white/20" rows="4" placeholder="Note" value={form.note} onChange={handleChange('note')} />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300">Cancel</button>
          <button onClick={save} disabled={loading} className="px-4 py-2 rounded-lg btn-accent text-white">
            {loading ? 'Saving...' : (isEdit ? 'Update Lead' : 'Create Lead')}
          </button>
        </div>
      </div>
    </div>
  );
}
