import axiosInstance from './axiosInstance';

export const aiApi = {
  chat: (message) => axiosInstance.post('/ai/chat', { message }),
  generateMCQs: (notesId, count = 10) => axiosInstance.post('/ai/mcqs', { notesId, count }),
  generateStudyPlan: (availableHours, subjects) => axiosInstance.post('/ai/study-plan', { availableHours, subjects }),
  solveProblem: (question, context) => axiosInstance.post('/ai/solve', { question, context }),
  generateWeeklyReport: () => axiosInstance.post('/ai/weekly-report'),
  chat_stream: (message) => axiosInstance.post('/ai/chat-stream', { message }),
};
