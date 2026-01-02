import axiosInstance from "./axiosInstance";

export const dashboardApi = {
  getDashboard: () => axiosInstance.get("/dashboard"),

  downloadReport: (type = "weekly") =>
    axiosInstance.get(`/dashboard/report`, {
      params: { type },
      responseType: "blob", // 🔑 IMPORTANT
    }),
};
