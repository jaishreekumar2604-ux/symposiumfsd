import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sympora_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sympora_token') || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('sympora_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('sympora_token', res.token);
      localStorage.setItem('sympora_user', JSON.stringify(res.user));
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      return res.user;
    }
  };

  const register = async (userData) => {
    const res = await api('/auth/register', {
      method: 'POST',
      body: userData,
    });

    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('sympora_token', res.token);
      localStorage.setItem('sympora_user', JSON.stringify(res.user));
      showToast('Account registered successfully! Welcome to SYMPORA.', 'success');
      return res.user;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sympora_token');
    localStorage.removeItem('sympora_user');
    showToast('Logged out successfully', 'info');
  };

  // 1-Click quick login for presentation/testing convenience
  const quickDemoLogin = async (role = 'admin') => {
    if (role === 'admin') {
      return await login('jaishree@sympora.edu', 'Admin@123');
    } else {
      return await login('rahul@student.edu', 'User@123');
    }
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'club_organizer');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        quickDemoLogin,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
