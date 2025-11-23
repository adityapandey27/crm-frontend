// src/store/leadStore.js
import create from 'zustand';
import * as leadApi from '../api/leads';

const useLeadStore = create((set, get) => ({
  leads: [],
  loading: false,
  error: null,

  // load leads from backend
  fetchLeads: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await leadApi.getLeads(params);
      // backend returns array of leads
      set({ leads: data || [], loading: false });
      return data;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  addLeadLocal: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),

  // create via API
  createLead: async (payload) => {
    set({ loading: true, error: null });
    try {
      const newLead = await leadApi.createLead(payload);
      // backend returns created lead
      set((s) => ({ leads: [newLead, ...s.leads], loading: false }));
      return newLead;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  updateLeadLocal: (id, data) => set((s) => ({ leads: s.leads.map(l => (l._id === id ? { ...l, ...data } : l)) })),

  updateLead: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const updated = await leadApi.updateLead(id, payload);
      set((s) => ({ leads: s.leads.map(l => (l._id === id ? updated : l)), loading: false }));
      return updated;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  deleteLeadLocal: (id) => set((s) => ({ leads: s.leads.filter(l => l._id !== id) })),

  deleteLead: async (id) => {
    set({ loading: true, error: null });
    try {
      await leadApi.deleteLead(id);
      set((s) => ({ leads: s.leads.filter(l => l._id !== id), loading: false }));
      return true;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  updateStage: async (id, stage) => {
    set({ loading: true, error: null });
    try {
      const updated = await leadApi.updateStage(id, stage);
      set((s) => ({ leads: s.leads.map(l => (l._id === id ? updated : l)), loading: false }));
      return updated;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  }
}));

export default useLeadStore;
