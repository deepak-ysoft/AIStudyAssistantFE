import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { PrimaryButton } from "../../components/PrimaryButton";
import { authApi } from "../../api/authApi";
import FormInput from "../../components/FormInput";
import { useToast } from "../../components/ToastContext";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const resetPasswordMutation = useMutation({
    mutationFn: () => authApi.resetPassword(token, formData.password),
    onSuccess: () => {
      showToast("Password reset successfully", "success");
      navigate("/auth/login");
    },
    onError: (err) => {
      showToast(
        err.response?.data?.message || "Failed to reset password",
        "error"
      );
    },
  });
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  const validate = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one letter and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    resetPasswordMutation.mutate();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-5 max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>

      <FormInput
        label="New Password"
        type="password"
        placeholder={"Enter your new password"}
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
          setErrors((prev) => ({ ...prev, password: "" }));
        }}
        error={errors.password}
        disabled={resetPasswordMutation.isPending}
        required
      />

      <FormInput
        label="Confirm Password"
        type="password"
        placeholder={"Enter confirm password"}
        value={formData.confirmPassword}
        onChange={(e) => {
          setFormData({
            ...formData,
            confirmPassword: e.target.value,
          });
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
        }}
        error={errors.confirmPassword}
        disabled={resetPasswordMutation.isPending}
        required
      />

      <PrimaryButton
        type="submit"
        className="btn btn-primary w-full"
        loading={resetPasswordMutation.isPending}
      >
        Reset Password
      </PrimaryButton>

      <p className="text-center text-sm">
        Remembered your password?{" "}
        <Link to="/auth/login" className="link link-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
