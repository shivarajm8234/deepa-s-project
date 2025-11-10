import { createBrowserRouter, RouterProvider, Navigate, type FutureConfig } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobsPage from './pages/JobsPage';
import JobDetails from './pages/JobDetails';
import ResumeBuilder from './pages/ResumeBuilder';
import Interviews from './pages/Interviews';
import AdminDashboard from './pages/AdminDashboard';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import CareerPathway from './pages/CareerPathway';
import PortfolioCreator from './pages/PortfolioCreator';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthInitializer from './components/AuthInitializer';
import ChatContainer from './components/ChatContainer';
import JobEmailTest from './components/JobEmailTest';
import useChatStore from './stores/chatStore';

// Create router with future flag
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'jobs',
        element: <JobsPage />
      },
      {
        path: 'jobs/:id',
        element: <JobDetails />
      },
      {
        path: 'job-details/:id',
        element: <JobDetails />
      },
      {
        path: 'resume-builder',
        element: <ResumeBuilder />
      },
      {
        path: 'interviews',
        element: <Interviews />
      },
      {
        path: 'skill-gap',
        element: <SkillGapAnalysis />
      },
      {
        path: 'career-pathway',
        element: <CareerPathway />
      },
      {
        path: 'portfolio',
        element: <PortfolioCreator />
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'email-test',
        element: <JobEmailTest />
      }
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
    v7_fetcherPersist: true
  } as FutureConfig
});

function App() {
  // Initialize chat store with default session
  useEffect(() => {
    const initializeChatSession = async () => {
      const { createNewSession, getCurrentSession, loadSessions } = useChatStore.getState();
      await loadSessions(); // Load existing sessions first
      if (!getCurrentSession()) {
        await createNewSession();
      }
    };
    initializeChatSession();
  }, []);

  return (
    <>
      <AuthInitializer />
      <ChatContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;