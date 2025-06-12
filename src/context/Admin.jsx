// contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";



const AuthContext = createContext(undefined);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper functions for localStorage with proper typing
  const getLocalStorageItem = (key )=> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing localStorage item ${key}`, error);
      return null;
    }
  };

  const setLocalStorageItem =(key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing item in localStorage ${key}`, error);
    }
  };

  const removeLocalStorageItem = (key) => {
    localStorage.removeItem(key);
  };

  // Add request interceptor to include token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = getLocalStorageItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const setAuthData = useCallback((token , userData) => {
    setLocalStorageItem("token", token);
    // Set token expiry (1 hour from now)
    const expiryDate = new Date(Date.now() + 3600000).toISOString();
    setLocalStorageItem("tokenExpiry", expiryDate);
    setLocalStorageItem("admin", userData);
    setAdmin(userData);
  }, []);

  const clearAuthData = useCallback(() => {
    removeLocalStorageItem("token");
    removeLocalStorageItem("tokenExpiry");
    removeLocalStorageItem("admin");
    setAdmin(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post("/auth/refresh");
      setAuthData(response.data.token, response.data.user);
      return true;
    } catch (err) {
      console.error("Token refresh failed", err);
      clearAuthData();
      navigate("/admin/login");
      return false;
    }
  }, [setAuthData, clearAuthData, navigate]);

  const checkAuth = useCallback(async () => {
    try {
      const token = getLocalStorageItem("token");
      if (token) {
        const adminData = getLocalStorageItem("admin");
        
        if (adminData) {
          setAdmin(adminData);
          
          // Refresh token if it's about to expire
          const tokenExpiry = getLocalStorageItem("tokenExpiry");
          if (
            tokenExpiry &&
            new Date(tokenExpiry) < new Date(Date.now() + 60000 * 30)
          ) {
            await refreshToken();
          }
        } else {
          // If token exists but no admin data, clear auth
          clearAuthData();
        }
      }
    } catch (err) {
      console.error("Auth check failed", err);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, [refreshToken, clearAuthData]);

  useEffect(() => {
    checkAuth();

    // Set up periodic token refresh (every 30 minutes)
    const refreshInterval = setInterval(() => {
      const token = getLocalStorageItem("token");
      if (token) {
        refreshToken().catch(console.error);
      }
    }, 1800000); // 30 minutes

    return () => clearInterval(refreshInterval);
  }, [checkAuth, refreshToken]);

  const login = async (email , password ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/admin/login", { email, password });
      const data = response.data.seller;
      console.log(response);

      const token = response.data.token;
      
      setAuthData(token, data);
      localStorage.setItem("adminId", data._id); // Store user ID in localStorage
      localStorage.setItem("admin", JSON.stringify(data)); // Store admin data in localStorage
      navigate("/admin/dashboard");
    } catch (err ) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData ) => {
    const formData = {
      businessAddress: "Plateaus state",
      businessName: "Technology",
      ...userData,
    };

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/admin/register", formData);
      setAuthData(response.data.token, response.data.user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      console.error("Registration failed", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.clear()
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearAuthData();
      navigate("/admin/login");
    }
  };

  const value = {
    isAdmin: admin?.role === "seller",
    admin,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};