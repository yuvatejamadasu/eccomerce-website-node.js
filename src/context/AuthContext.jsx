import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in via token and session
    const activeSession = localStorage.getItem('user_session');
    const token = localStorage.getItem('authToken');
    
    if (activeSession && token) {
      setUser(JSON.parse(activeSession));
    } else {
      // Clear any partial state
      localStorage.removeItem('user_session');
      localStorage.removeItem('authToken');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await apiLogin(email, password);
      setUser(result);
      localStorage.setItem('user_session', JSON.stringify(result));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Try again!' 
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const result = await apiSignup(name, email, password);
      setUser(result);
      localStorage.setItem('user_session', JSON.stringify(result));
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed. Try again!' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
