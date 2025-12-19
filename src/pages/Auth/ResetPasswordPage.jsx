import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { PrimaryButton } from "../../components/PrimaryButton";
import { authApi } from "../../api/authApi";
import FormInput from "../../components/FormInput";

export default function ResetPasswordPage() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const resetPasswordMutation = useMutation({
    mutationFn: () => authApi.resetPassword(token, password),
    onSuccess: () => {
      setSuccess("Password reset successfully. You can now log in.");
      setPassword("");
      setConfirmPassword("");
      navigate("/auth/login");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to reset password");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    resetPasswordMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>

      <FormInput
        label="New Password"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={resetPasswordMutation.isPending}
      />

      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="Re-enter new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={resetPasswordMutation.isPending}
      />

      {error && <div className="alert alert-error">{error}</div>}

      {success && (
        <div className="alert alert-success">
          {success}
          <Link to="/auth/login" className="link link-primary ml-2">
            Login
          </Link>
        </div>
      )}

      <PrimaryButton
        type="submit"
        className="btn btn-primary w-full"
        disabled={resetPasswordMutation.isPending}
      >
        {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
      </PrimaryButton>
      <p className="text-center text-sm">
        Don't want to change?{" "}
        <Link to="/auth/login" className="link link-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
