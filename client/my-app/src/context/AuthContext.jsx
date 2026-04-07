import React, { createContext, useState, useEffect } from 'react';
import { fetchCurrentUser, login as apiLogin, register as apiRegister } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await fetchCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to load user", error);
      localStorage.removeItem('token');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.access_token);
    return await loadUser();
  };

  const register = async (username, email, password) => {
    const data = await apiRegister(username, email, password);
    // Usually API doesn't return token on register, but the endpoint currently returns UserOut
    // which signifies success. The user might need to log in after register.
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
