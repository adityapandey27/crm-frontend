import api from "./api";

export const getTodayFollowups = () =>
  api.get("/leads/today-followups");

export const markDone = (id) =>
  api.put(`/appointments/${id}/mark-done`);

export const deleteAppointment = (id) =>
  api.delete(`/appointments/${id}`);
