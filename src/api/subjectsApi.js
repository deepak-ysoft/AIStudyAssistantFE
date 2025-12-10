import axiosInstance from './axiosInstance';

export const subjectsApi = {
  getAll: (params) => axiosInstance.get('/subjects', { params }),
  getById: (id) => axiosInstance.get(`/subjects/${id}`),
  create: (data) => axiosInstance.post('/subjects', data),
  update: (id, data) => axiosInstance.put(`/subjects/${id}`, data),
  delete: (id) => axiosInstance.delete(`/subjects/${id}`),
  addResource: (id, data) => axiosInstance.post(`/subjects/${id}/resources`, data),
  removeResource: (id, resourceId) => axiosInstance.delete(`/subjects/${id}/resources/${resourceId}`),
};
