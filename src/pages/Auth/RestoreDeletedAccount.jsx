import { useLocation, useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import FormInput from "../../components/FormInput";
// import { authApi } from "../../api/authApi"; // enable when API is ready

export default function RestoreAccountRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const [step, setStep] = useState("confirm"); // confirm | otp | success
  const [otp, setOtp] = useState("");

  /* ---------------- SEND OTP (API READY) ---------------- */

  const sendOtpMutation = useMutation({
    // send OTP
    mutationFn: () => authApi.sendRestoreOtp({ email }),
    onSuccess: () => {
      setStep("otp");
    },
    onError: (err) => {
      alert(err?.message || "Failed to send OTP");
    },
  });

  /* ---------------- VERIFY OTP (API READY) ---------------- */
  const verifyOtpMutation = useMutation({
    // verify OTP
    mutationFn: () => authApi.verifyRestoreOtp({ email, otp }),
    onSuccess: () => {
      setStep("success");
    },
    onError: (err) => {
      alert(err?.message || "Invalid OTP");
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
        {/* ---------------- CONFIRM STEP ---------------- */}
        {step === "confirm" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Restore Your Account
            </h1>
            <p className="text-sm text-gray-700 mb-6">
              Your account associated with <strong>{email}</strong> is scheduled
              for deletion. Would you like to restore it and regain access?
            </p>

            <div className="flex flex-col gap-3">
              <PrimaryButton
                onClick={() => sendOtpMutation.mutate()}
                loading={sendOtpMutation.isPending}
              >
                Yes, Restore My Account
              </PrimaryButton>

              <button
                onClick={() => navigate("/auth/login")}
                className="text-sm text-gray-500 hover:underline"
              >
                No, I don’t want to restore
              </button>
            </div>
          </>
        )}

        {/* ---------------- OTP STEP ---------------- */}
        {step === "otp" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Verify Your Request
            </h1>
            <p className="text-sm text-gray-700 mb-6">
              We’ve sent a one-time verification code to{" "}
              <strong>{email}</strong>. Please enter it below to restore your
              account.
            </p>

            <FormInput
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <div className="mt-5">
              <PrimaryButton
                onClick={() => verifyOtpMutation.mutate()}
                disabled={!otp}
                loading={verifyOtpMutation.isPending}
              >
                Verify & Restore Account
              </PrimaryButton>
            </div>
          </>
        )}

        {/* ---------------- SUCCESS STEP ---------------- */}
        {step === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-600">
              Account Restored
            </h1>
            <p className="text-sm text-gray-700 mb-6">
              Your account has been successfully restored. You can now log in
              and continue using your account.
            </p>

            <PrimaryButton onClick={() => navigate("/auth/login")}>
              Go to Login
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}
