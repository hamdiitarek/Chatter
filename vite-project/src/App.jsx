import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import UseAppStore from './store';
import apiclient from './lib/api_client';
import { GET_USER_INFO } from './utils/constants';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Forgot from './pages/auth/forgot';
import Profile from './pages/profile';
import Chat from './pages/chat';
import Home from './pages/home';
import LoadingSpinner from './components/ui/loading-spinner';

function App() {
  const { userInfo, setUserInfo } = UseAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserInfo(null);
        setLoading(false);
        return;
      }

      const response = await apiclient.get(GET_USER_INFO, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data) {
        setUserInfo(response.data);
      } else {
        throw new Error('No user data returned');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error);
      localStorage.removeItem('token');
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();

    // Set up periodic token validation (every 5 minutes)
    const interval = setInterval(() => {
      if (userInfo) {
        getUserData();
      }
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const PrivateRoute = useMemo(() => ({ children }) => {
    if (loading) return <LoadingScreen />;
    return userInfo ? children : <Navigate to="/login" replace />;
  }, [userInfo, loading]);

  const AuthRoute = useMemo(() => ({ children }) => {
    if (loading) return <LoadingScreen />;
    return userInfo ? <Navigate to="/chat" replace /> : children;
  }, [userInfo, loading]);

  const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <LoadingSpinner className="h-12 w-12 mx-auto text-teal-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading application...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-500 mb-2">
            Error Loading Application
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message || 'Failed to initialize application'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
          <Route path="/forgot" element={<AuthRoute><Forgot /></AuthRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'font-sans',
          duration: 5000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }} 
      />
    </>
  );
}

export default App;