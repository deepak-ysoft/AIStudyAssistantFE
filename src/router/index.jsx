import { Navigate, createBrowserRouter, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";

import Dashboard from "../pages/Dashboard/Dashboard";
import SubjectsPage from "../pages/Subjects/SubjectsPage";
import AIChatPage from "../pages/AIChat/AIChatPage";
import StudyPlannerPage from "../pages/StudyPlanner/StudyPlannerPage";
import PomodoroPage from "../pages/Pomodoro/PomodoroPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import SubjectDetailsPage from "../pages/Subjects/SubjectDetailsPage";
import SubjectNotesPage from "../pages/Subjects/Tabs/NotesPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import { useLocation } from "react-router-dom";

function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-base-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-lg text-base-content/70 mb-6">
          Please try again or contact support
        </p>
        <a href="/" className="btn btn-primary">
          Go Home
        </a>
      </div>
    </div>
  );
}

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <MainLayout />;
}

function PublicLayout() {
  const { isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // 🔒 Only redirect if user is authenticated AND already on auth pages
  if (isAuthenticated && location.pathname.startsWith("/auth")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthLayout />;
}
  
export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorFallback />,
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "/login",
    errorElement: <ErrorFallback />,
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "auth",
    element: <PublicLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "subjects",
        element: <SubjectsPage />,
      },
      {
        path: "subjects/:subjectId",
        element: <SubjectDetailsPage />,
      },
      {
        path: "subjects/:subjectId/notes",
        element: <SubjectNotesPage />,
      },
      {
        path: "ai-chat",
        element: <AIChatPage />,
      },
      {
        path: "study-planner",
        element: <StudyPlannerPage />,
      },
      {
        path: "pomodoro",
        element: <PomodoroPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorFallback />,
  },
]);
