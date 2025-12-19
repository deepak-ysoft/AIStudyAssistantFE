import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../../components/FormInput";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function LoginPage() {
  const [email, setEmail] = useState("Deepak@yopmail.com");
  const [password, setPassword] = useState("Deepak@123");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  // useEffect(() => {
  //   const validate = async () => {
  //     try {
  //       const res = await authApi.getProfile();
  //       login(res.data.data, localStorage.getItem("token"));
  //     } catch {
  //       logout();
  //     } finally {
  //       setInitialized(true);
  //     }
  //   };

  //   validate();
  // }, []);

  const loginMutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response) => {
      if (response.data.success) {
        const { user, token } = response.data.data;
        login(user, token);
        navigate("/dashboard", { replace: true });
      }
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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

      <PrimaryButton
        type="submit"
        className="btn btn-primary w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in..." : "Sign In"}
      </PrimaryButton>

      <div className="divider my-4">OR</div>

      <Link to="/auth/forgot-password" className="link link-primary text-sm">
        Forgot Password?
      </Link>

      <p className="text-center text-sm">
        Don't have an account?{" "}
        <Link to="/auth/signup" className="link link-primary">
          Sign up
        </Link>
      </p>
    </form>
  );
}
