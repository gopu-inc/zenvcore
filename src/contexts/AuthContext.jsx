import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('zenv_token');
      if (token) {
        try {
          const res = await AuthService.getProfile();
          setUser(res.data.user);
        } catch {
          localStorage.removeItem('zenv_token');
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('zenv_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('zenv_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);