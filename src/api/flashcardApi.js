import axiosInstance from "./axiosInstance";

export const flashcardApi = {
  getAll: (params) => axiosInstance.get("/flashcards", { params }),
  getById: (id) => axiosInstance.get(`/flashcards/${id}`),
  create: (data) => axiosInstance.post("/flashcards", data),
  update: (id, data) => axiosInstance.put(`/flashcards/${id}`, data),
  delete: (id) => axiosInstance.delete(`/flashcards/${id}`),

  review: (id, isCorrect) =>
    axiosInstance.post(`/flashcards/${id}/review`, { isCorrect }),

  getBySubject: (subjectId) =>
    axiosInstance.get(`/flashcards/subject/${subjectId}`),
  generateFlashcards: (id) =>
    axiosInstance.post(`/flashcards/${id}/flashcards`),
};
