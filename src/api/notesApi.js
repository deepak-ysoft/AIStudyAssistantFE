import axiosInstance from './axiosInstance';

export const notesApi = {
  getAll: (params) => axiosInstance.get('/notes', { params }),
  getById: (id) => axiosInstance.get(`/notes/${id}`),
  create: (data) => axiosInstance.post('/notes', data),
  update: (id, data) => axiosInstance.put(`/notes/${id}`, data),
  delete: (id) => axiosInstance.delete(`/notes/${id}`),
  uploadFile: (formData) => axiosInstance.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
