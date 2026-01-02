import axiosInstance from "./axiosInstance";

export const chatApi = {
  getHistory: () => axiosInstance.get("/chat/history"),
  deleteChat: (id) => axiosInstance.delete(`/chat/${id}`),
  clearHistory: () => axiosInstance.delete("/chat"),
};
