import { Navigate, createBrowserRouter, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';

import Dashboard from '../pages/Dashboard/Dashboard';
import SubjectsPage from '../pages/Subjects/SubjectsPage';
import NotesPage from '../pages/Notes/NotesPage';
import FlashcardsPage from '../pages/Flashcards/FlashcardsPage';
import QuizzesPage from '../pages/Quizzes/QuizzesPage';
import AIChatPage from '../pages/AIChat/AIChatPage';
import StudyPlannerPage from '../pages/StudyPlanner/StudyPlannerPage';
import PomodoroPage from '../pages/Pomodoro/PomodoroPage';
import ReportsPage from '../pages/Reports/ReportsPage';

function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-base-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-lg text-base-content/70 mb-6">Please try again or contact support</p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  );
}

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <MainLayout />;
}

function PublicLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthLayout />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorFallback />,
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: 'auth',
    element: <PublicLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'subjects',
        element: <SubjectsPage />,
      },
      {
        path: 'notes',
        element: <NotesPage />,
      },
      {
        path: 'flashcards',
        element: <FlashcardsPage />,
      },
      {
        path: 'quizzes',
        element: <QuizzesPage />,
      },
      {
        path: 'ai-chat',
        element: <AIChatPage />,
      },
      {
        path: 'study-planner',
        element: <StudyPlannerPage />,
      },
      {
        path: 'pomodoro',
        element: <PomodoroPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorFallback />,
  },
]);
