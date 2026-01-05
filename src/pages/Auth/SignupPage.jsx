import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import FormInput from "../../components/FormInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useToast } from "../../components/ToastContext";

export default function SignupPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: (data) => authApi.signup(data),
    onSuccess: (response) => {
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );

      // ✅ DO NOT AUTO LOGIN
      navigate("/auth/login");
    },
    onError: (err) => {
      showToast(err.response?.data?.message || "Signup failed", "error");
    },
  });

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  const validate = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "User name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one letter and one number";
    }

    // Confirm password
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
    const { confirmPassword, ...submitData } = formData;
    signupMutation.mutate(submitData);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
          setErrors((prev) => ({ ...prev, name: "" }));
        }}
        required
        error={errors.name}
      />

      <FormInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value }),
            setErrors((prev) => ({ ...prev, email: "" }));
        }}
        required
        error={errors.email}
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value }),
            setErrors((prev) => ({ ...prev, password: "" }));
        }}
        required
        error={errors.password}
      />

      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="Enter confirm password"
        value={formData.confirmPassword}
        onChange={(e) => {
          setFormData({ ...formData, confirmPassword: e.target.value });
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }}
        required
        error={errors.confirmPassword}
      />
      <PrimaryButton type="submit" loading={signupMutation.isPending}>
        Create Account
      </PrimaryButton>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/auth/login" className="link link-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
