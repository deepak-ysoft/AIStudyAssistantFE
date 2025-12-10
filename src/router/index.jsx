import { Navigate, createBrowserRouter } from 'react-router-dom';
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

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: 'signup',
        element: <PublicRoute><SignupPage /></PublicRoute>,
      },
      {
        path: 'forgot-password',
        element: <PublicRoute><ForgotPasswordPage /></PublicRoute>,
      },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: 'subjects',
        element: <ProtectedRoute><SubjectsPage /></ProtectedRoute>,
      },
      {
        path: 'notes',
        element: <ProtectedRoute><NotesPage /></ProtectedRoute>,
      },
      {
        path: 'flashcards',
        element: <ProtectedRoute><FlashcardsPage /></ProtectedRoute>,
      },
      {
        path: 'quizzes',
        element: <ProtectedRoute><QuizzesPage /></ProtectedRoute>,
      },
      {
        path: 'ai-chat',
        element: <ProtectedRoute><AIChatPage /></ProtectedRoute>,
      },
      {
        path: 'study-planner',
        element: <ProtectedRoute><StudyPlannerPage /></ProtectedRoute>,
      },
      {
        path: 'pomodoro',
        element: <ProtectedRoute><PomodoroPage /></ProtectedRoute>,
      },
      {
        path: 'reports',
        element: <ProtectedRoute><ReportsPage /></ProtectedRoute>,
      },
    ],
  },
]);
