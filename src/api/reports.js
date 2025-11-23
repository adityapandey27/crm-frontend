import api from './axios';

export const getLeadsWeekly = (params = {}) => {
  // params: start, end
  return api.get('/report/leads-weekly', { params }).then(res => res.data.data);
};

export const getLeadsByStage = () => {
  return api.get('/report/leads-by-stage').then(res => res.data.data);
};

export const getConversionTrend = () => {
  return api.get('/report/conversion-trend').then(res => res.data.data);
};

export const getSourcePerformance = () => {
  return api.get('/report/source-performance').then(res => res.data.data);
};

export const getUpcomingFollowups = (days = 7) => {
  return api.get('/report/upcoming-followups', { params: { days } }).then(res => res.data.data);
};

export const getConversionRate = () => {
  return api.get('/report/conversion-rate').then(res => res.data.data);
};

export const getDateRangeReport = (start, end) =>
  api.get('/report/date-range', { params: { start, end } }).then(res => res.data.data);
