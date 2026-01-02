// src/routes/router.jsx
import { Navigate, createBrowserRouter } from "react-router-dom";
import RequireAuth from "./RequireAuth.jsx";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import EmailVerifiedPage from "../pages/Auth/EmailVerification";
import RestoreAccountRequestPage from "../pages/Auth/RestoreDeletedAccount";
import Dashboard from "../pages/Dashboard/Dashboard";
import SubjectsPage from "../pages/Subjects/SubjectsPage";
import SubjectDetailsPage from "../pages/Subjects/SubjectDetailsPage";
import SubjectNotesPage from "../pages/Subjects/Tabs/NotesPage";
import AIChatPage from "../pages/AIChat/AIChatPage";
import StudyPlannerPage from "../pages/StudyPlanner/StudyPlannerPage";
import PomodoroPage from "../pages/Pomodoro/PomodoroPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SettingsPage from "../pages/Profile/SettingsPage";

function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1>Something went wrong</h1>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  {
    path: "restore-account",
    element: <RestoreAccountRequestPage />,
  },
  // 🔓 PUBLIC ROUTES
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password/:token", element: <ResetPasswordPage /> },
    ],
  },

  { path: "auth/verify-email/:token", element: <EmailVerifiedPage /> },

  // 🔒 PROTECTED ROUTES
  {
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "subjects", element: <SubjectsPage /> },
      { path: "subjects/:subjectId", element: <SubjectDetailsPage /> },
      { path: "subjects/:subjectId/notes", element: <SubjectNotesPage /> },
      { path: "ai-chat", element: <AIChatPage /> },
      { path: "study-planner", element: <StudyPlannerPage /> },
      { path: "pomodoro", element: <PomodoroPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  { path: "*", element: <ErrorFallback /> },
]);
