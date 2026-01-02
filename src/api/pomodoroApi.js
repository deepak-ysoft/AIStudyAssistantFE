import axiosInstance from "./axiosInstance";

export const pomodoroApi = {
  startSession: (data) => axiosInstance.post("/pomodoro/start", data),
  endSession: (data) => axiosInstance.post("/pomodoro/end", data),
  getTodayStats: () => axiosInstance.get("/pomodoro/stats/today"),
  getHistory: (params) => axiosInstance.get("/pomodoro/history", { params }),
};
