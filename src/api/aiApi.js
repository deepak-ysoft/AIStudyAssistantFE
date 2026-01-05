import axiosInstance from "./axiosInstance";

export const aiApi = {
  chat: (payload) => axiosInstance.post("/ai/chat", payload),
  generateNotes: (payload) => axiosInstance.post("/ai/notes", payload),
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
