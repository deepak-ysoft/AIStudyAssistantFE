import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const signupMutation = useMutation({
    mutationFn: (data) => authApi.signup(data),
    onSuccess: (response) => {
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/dashboard');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Signup failed');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    signupMutation.mutate(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          className="input input-bordered"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="input input-bordered"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Enter a password"
          className="input input-bordered"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <input
          type="password"
          placeholder="Confirm your password"
          className="input input-bordered"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

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

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/auth/login" className="link link-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
