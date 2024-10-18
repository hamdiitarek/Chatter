
import UseAppStore from './store';
import apiclient from './lib/api_client';
import { GET_USER_INFO } from './utils/constants';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react';

export default function Auth() {
  const { userInfo, setUserInfo } = UseAppStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserInfo(undefined);
        setLoading(false);
        return;
      }

      const response = await apiclient.get(
        GET_USER_INFO, {
        withCredentials: true,
      });
  
      setUserInfo(response.data);
      } catch (error) {
      console.error('Error fetching user data:', error)

      setUserInfo(undefined);
      navigate('/login');
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

}
