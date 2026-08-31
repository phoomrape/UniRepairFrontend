import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('unirepair_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('unirepair_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('unirepair_user', JSON.stringify(res.data.user));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('unirepair_token', token);
    localStorage.setItem('unirepair_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const res = await API.post('/auth/register', { name, email, password, phone });
    const { token, user: userData } = res.data;
    localStorage.setItem('unirepair_token', token);
    localStorage.setItem('unirepair_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('unirepair_token');
    localStorage.removeItem('unirepair_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
