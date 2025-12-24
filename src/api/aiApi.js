import axiosInstance from "./axiosInstance";

export const aiApi = {
  chat: (message) => axiosInstance.post("/ai/chat", { message }),
  generateFlashcards: (id) => axiosInstance.post(`/ai/${id}/flashcards`),
  generateSummary: (id) => axiosInstance.post(`/ai/${id}/summarize`),
  generateMCQs: (id) => axiosInstance.post(`/ai/${id}/mcqs-from-notes`),
  generateStudyPlan: (availableHours, subjects) =>
    axiosInstance.post("/ai/study-plan", { availableHours, subjects }),
  solveProblem: (question, context) =>
    axiosInstance.post("/ai/solve", { question, context }),
  generateWeeklyReport: () => axiosInstance.post("/ai/weekly-report"),
  chat_stream: (message) => axiosInstance.post("/ai/chat-stream", { message }),
};
