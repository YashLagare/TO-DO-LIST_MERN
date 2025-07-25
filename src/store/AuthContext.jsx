// src/store/AuthContext.jsx (Updated with localStorage)
import axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false,
        error: null 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        loading: false, 
        error: null 
      };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First check localStorage for user data
      const savedUser = localStorage.getItem('todoapp_user');
      const token = document.cookie.includes('jwt=');
      
      if (savedUser && token) {
        const userData = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: userData });
      } else {
        // Clear localStorage if no valid token
        localStorage.removeItem('todoapp_user');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('todoapp_user');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        withCredentials: true
      });

      // Save user data to localStorage
      localStorage.setItem('todoapp_user', JSON.stringify(response.data));
      
      dispatch({ type: 'SET_USER', payload: response.data });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData, {
        withCredentials: true
      });

      // Save user data to localStorage
      localStorage.setItem('todoapp_user', JSON.stringify(response.data));
      
      dispatch({ type: 'SET_USER', payload: response.data });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear localStorage and local state
      localStorage.removeItem('todoapp_user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};