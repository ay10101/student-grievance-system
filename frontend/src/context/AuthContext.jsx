import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// API base URL - adjust for production
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Create axios instance
const api = axios.create({ baseURL: API_URL });

// Add auth interceptor
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload, loading: false, error: null };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { ...state, user: null, loading: false, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: JSON.parse(localStorage.getItem("user")),
    loading: false,
    error: null,
  });

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await api.post("/register", { name, email, password });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err.response?.data?.message || "Registration failed",
      });
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await api.post("/login", { email, password });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err.response?.data?.message || "Login failed",
      });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, register, login, logout, clearError, api }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { api };
