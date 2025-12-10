import axiosInstance from './axiosInstance';

export const reportApi = {
  getWeeklyReport: () => axiosInstance.get('/reports/weekly'),
  getMonthlyReport: () => axiosInstance.get('/reports/monthly'),
  getPerformanceStats: (params) => axiosInstance.get('/reports/performance', { params }),
  exportReport: (type, format) => axiosInstance.get(`/reports/export?type=${type}&format=${format}`),
  getStreakData: () => axiosInstance.get('/reports/streak'),
};
