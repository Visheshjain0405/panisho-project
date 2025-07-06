
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosInstance';

// Create the Auth Context
export const AuthContext = createContext();

// Auth Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Optional: Check session with server
    const checkSession = async () => {
      try {
        const { data } = await api.get('/auth/me', { withCredentials: true });
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    checkSession();
  }, []);

  // Login
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

  // Signup
  const signup = async (firstName, lastName, email, mobile, password) => {
    const { data } = await api.post(
      '/auth/signup',
      { firstName, lastName, email, mobile, password },
      { withCredentials: true }
    );
    setPendingEmail(email);
    return data;
  };

  // Verify Email OTP
  const verifyEmail = async (otp) => {
    if (!pendingEmail) throw new Error('No signup in progress.');
    const { data } = await api.post(
      '/auth/verify-email',
      { email: pendingEmail, otp },
      { withCredentials: true }
    );
    setUser(data.data.user);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setPendingEmail(null);
    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout API failed:', err.message);
    }
    setUser(null);
    setPendingEmail(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, pendingEmail, login, signup, verifyEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);


