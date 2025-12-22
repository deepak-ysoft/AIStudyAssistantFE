import axiosInstance from "./axiosInstance";

export const authApi = {
  signup: (data) => axiosInstance.post("/auth/signup", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  forgotPassword: (email) =>
    axiosInstance.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    axiosInstance.post("/auth/reset-password", { token, newPassword }),
  changePassword: (data) => axiosInstance.put("/auth/change-password", data),
  verifyEmail: (token) => axiosInstance.post("/auth/verify-email", { token }),
  resendVerificationEmail: (email) =>
    axiosInstance.post("/auth/resend-verification", { email }),
  changeEmail: (newEmail) =>
    axiosInstance.put("/auth/change-email", { newEmail }),
  getProfile: () => axiosInstance.get("/auth/profile"),
  updateProfile: (data) => axiosInstance.put("/auth/profile", data),
  deleteAccount: (data) =>
    axiosInstance.delete("/auth/delete-account", {
      data, 
    }),
  authenticator: async () => {
    const res = await axiosInstance.get("/auth/imagekit-auth");

    // IMPORTANT: return only the auth params
    return {
      signature: res.data.signature,
      token: res.data.token,
      expire: res.data.expire,
    };
  },
};
