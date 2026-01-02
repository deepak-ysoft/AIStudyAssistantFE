import axiosInstance from "./axiosInstance";

export const studyPlanApi = {
  get: () => axiosInstance.get("/study-plan"),
  clear: () => axiosInstance.delete("/study-plan"),
};
