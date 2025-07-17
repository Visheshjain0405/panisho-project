// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosInstance';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  const checkSession = async () => {
    try {
      const { data } = await api.get('/auth/me', { withCredentials: true });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post(
      '/auth/login',
      { email, password },
      { withCredentials: true }
    );
    setUser(data.data.user);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data;
  };

  const signup = async (firstName, lastName, email, mobile, password) => {
    const { data } = await api.post(
      '/auth/signup',
      { firstName, lastName, email, mobile, password },
      { withCredentials: true }
    );
    return data;
  };

  const verifyEmail = async (email, otp) => {
    const { data } = await api.post(
      '/auth/verify-email',
      { email, otp },
      { withCredentials: true }
    );
    setUser(data.data.user);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout API failed:', err.message);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, verifyEmail, logout, loading }}
    >
      {!loading && children} {/* Prevent app from rendering until session is checked */}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
