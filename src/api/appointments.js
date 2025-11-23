import api from './axios';

// create appointment
export const createAppointment = (data) => {
  return api.post('/appointments', data).then(res => res.data.data);
};

// get appointments for a single lead
export const getAppointmentsForLead = (leadId) => {
  return api.get(`/leads/${leadId}/appointments`).then(res => res.data.data);
};

// update appointment
export const updateAppointment = (id, data) => {
  return api.put(`/appointments/${id}`, data).then(res => res.data.data);
};

// delete appointment
export const deleteAppointment = (id) => {
  return api.delete(`/appointments/${id}`).then(res => res.data.data);
};

// today's followups
export const todaysAppointment = () => {
  return api.get('/appointments/today').then(res => res.data.data);
};


export const getAllAppointments = (params = {}) => {
  return api.get('/appointments', { params }).then(res => res.data.data);
};

// ----- NEW: calendar-structured appointments
export const getCalendarAppointments = () => {
  return api.get('/appointments/calendar').then(res => res.data.data);
};

// mark done (existing)
export const markDone = (id) => {
  return api.put(`/appointments/${id}/mark-done`).then(res => res.data.data);
};
