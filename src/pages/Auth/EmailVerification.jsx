import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PrimaryButton } from "../../components/PrimaryButton";
import { authApi } from "../../api/authApi";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../components/ToastContext";

export default function EmailVerifiedPage() {
  const { token } = useParams(); // from path
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email"); // from query

  const { showToast } = useToast();
  const [statusMessage, setStatusMessage] = useState("Verifying your email...");
  const [isError, setIsError] = useState(false);

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: () => authApi.verifyEmail(token),
    onSuccess: () => {
      setStatusMessage("Email verified successfully!");
      setIsError(false);
    },
    onError: (err) => {
      setStatusMessage(
        err.response?.data?.message || "Invalid or expired verification token."
      );
      setIsError(true);
    },
  });

  // Resend verification email mutation
  const resendMutation = useMutation({
    mutationFn: () => authApi.resendVerificationEmail(email),
    onSuccess: (response) => {
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  // Trigger verification on mount
  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
        <div className="mb-6">
          <svg
            className={`w-20 h-20 mx-auto ${
              isError ? "text-red-500" : "text-green-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isError ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          {isError ? "Verification Failed" : "Email Verified!"}
        </h1>
        <p className="mb-6 text-gray-700">{statusMessage}</p>

        {isError ? (
          <div className="space-y-3">
            <PrimaryButton onClick={() => resendMutation.mutate()}>
              Resend Verification Email
            </PrimaryButton>
            <PrimaryButton onClick={() => navigate("/auth/login")}>
              Back to Login
            </PrimaryButton>
          </div>
        ) : (
          <PrimaryButton onClick={() => navigate("/auth/login")}>
            Continue
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
