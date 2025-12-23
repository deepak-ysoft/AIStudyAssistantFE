import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../../components/FormInput";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const signupMutation = useMutation({
    mutationFn: (data) => authApi.signup(data),
    onSuccess: (response) => {
      const { user, token } = response.data.data;
      login(user, token);
      navigate("/dashboard");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Signup failed");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

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
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <FormInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="Enter confirm password"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
        required
      />
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m6-8a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
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
