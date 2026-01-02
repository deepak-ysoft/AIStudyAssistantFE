import axiosInstance from "./axiosInstance";

export const quizApi = {
  getAll: (params) => axiosInstance.get("/quizzes", { params }),
  getById: (id) => axiosInstance.get(`/quizzes/${id}`),
  create: (data) => axiosInstance.post("/quizzes", data),
  update: (id, data) => axiosInstance.put(`/quizzes/${id}`, data),
  delete: (id) => axiosInstance.delete(`/quizzes/${id}`),
  startQuiz: (id) => axiosInstance.post(`/quizzes/${id}/start`),
  submitAnswer: (quizId, answers) =>
    axiosInstance.post(`/quizzes/${quizId}/submit`, { answers }),
  getResults: (quizId) => axiosInstance.get(`/quizzes/${quizId}/results`),
  saveAttempt: (data) =>
    axiosInstance.post("/quizzes/quiz-attempts", data).then((res) => res.data),
};
