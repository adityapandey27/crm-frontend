// src/api/leads.js
import api from './axios';

// ---------------------------
// CREATE LEAD
// ---------------------------
export const createLead = (data) => {
  return api.post('/leads', data).then(res => res.data.data);
};

// ---------------------------
// GET ALL LEADS
// ---------------------------
export const getLeads = (params = {}) => {
  return api.get('/leads', { params }).then(res => res.data.data);
};

// ---------------------------
// SEARCH LEADS
// name, stage, source, etc.
// ---------------------------
export const searchLeads = (params = {}) => {
  return api.get('/leads/search', { params }).then(res => res.data.data);
};

// ---------------------------
// GET LEAD BY ID
// ---------------------------
export const getLeadById = (id) => {
  return api.get(`/leads/${id}`).then(res => res.data.data);
};

// ---------------------------
// UPDATE LEAD
// ---------------------------
export const updateLead = (id, data) => {
  return api.put(`/leads/${id}`, data).then(res => res.data.data);
};

// ---------------------------
// DELETE LEAD
// ---------------------------
export const deleteLead = (id) => {
  return api.delete(`/leads/${id}`).then(res => res.data.data);
};

// ---------------------------
// UPDATE STAGE ONLY
// ---------------------------
export const updateStage = (id, stage) => {
  return api.put(`/leads/${id}/stage`, { stage }).then(res => res.data.data);
};

// ---------------------------
// GET APPOINTMENTS FOR LEAD
// ---------------------------
export const getLeadAppointments = (id) => {
  return api.get(`/leads/${id}/appointments`).then(res => res.data.data);
};

// ---------------------------
// TODAY FOLLOWUPS
// ---------------------------
export const getTodayFollowups = () => {
  return api.get('/leads/today-followups').then(res => res.data.data);
};


export const deleteAppointment = (id) =>{
  
 return  api.delete(`/appointments/${id}`).then(res=>res.data.data);
}