import axiosInstance from './axiosInstance';

export const authApi = {
  signup: (data) => axiosInstance.post('/auth/signup', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => axiosInstance.post('/auth/reset-password', { token, newPassword }),
  verifyEmail: (token) => axiosInstance.post('/auth/verify-email', { token }),
  resendVerificationEmail: (email) => axiosInstance.post('/auth/resend-verification', { email }),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
};
