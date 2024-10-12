import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Forgot from './pages/auth/forgot';
import Profile from './pages/profile';
import Chat from './pages/chat';
import Home from './pages/home';
import { UseAppStore } from './store';
import apiclient from './lib/api_client';
import { GET_USER_INFO } from './utils/constants';

function App() {
  const { userInfo, setUserInfo } = UseAppStore();
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const response = await apiclient.get(GET_USER_INFO, {
        withCredentials: true,
      });
  
      if (response.status === 200 && response.data.id) {
        setUserInfo(response.data);
      } else {
        console.error('Failed to fetch user data:', response.status, response.data);
        setUserInfo(undefined);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserInfo(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []); // Run on initial mount

  const Privateroute = useMemo(() => ({ children }) => {
    return userInfo ? children : <Navigate to="/login" />;
  }, [userInfo]);

  const Authenticated = useMemo(() => ({ children }) => {
    return userInfo ? <Navigate to="/chat" /> : children;
  }, [userInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Authenticated><Login /></Authenticated>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/profile" element={<Privateroute><Profile /></Privateroute>} />
        <Route path="/chat" element={<Privateroute><Chat /></Privateroute>} />
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;