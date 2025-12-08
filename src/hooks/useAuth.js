import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

// Query Keys
export const AUTH_QUERY_KEYS = {
  all: ["auth"],
  user: () => [...AUTH_QUERY_KEYS.all, "user"],
  profile: (userId) => [...AUTH_QUERY_KEYS.user(), "profile", userId],
};

// API Functions
const authApi = {
  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Register user  
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Get user profile
  getProfile: async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    
    const response = await api.get(`/auth/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Update user profile
  updateProfile: async ({ userId, userData }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    
    const response = await api.put(`/auth/profile/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Change password
  changePassword: async ({ currentPassword, newPassword }) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.put(`/auth/change-password/${userId}`, {
      currentPassword,
      newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async ({ token, newPassword }) => {
    const response = await api.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },

  // Verify email
  verifyEmail: async (verificationToken) => {
    const response = await api.post("/auth/verify-email", { token: verificationToken });
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");
    
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },
};

// Custom Hooks

/**
 * Hook to get current user profile
 */
export const useUserProfile = (enabled = true) => {
  const userId = localStorage.getItem("userId");
  
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile(userId),
    queryFn: () => authApi.getProfile(userId),
    enabled: Boolean(userId) && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
    select: (data) => data.user || data,
  });
};

/**
 * Hook to get current auth state from localStorage
 */
export const useAuthState = () => {
  const getAuthState = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userId = localStorage.getItem("userId");
    
    return {
      isAuthenticated: Boolean(token && userId),
      token,
      user: user ? JSON.parse(user) : null,
      userId,
    };
  };

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user(),
    queryFn: getAuthState,
    staleTime: Infinity, // Never become stale
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to login user
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const { token, user, userId } = data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", userId);

      // Update query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.user(), {
        isAuthenticated: true,
        token,
        user,
        userId,
      });

      queryClient.setQueryData(AUTH_QUERY_KEYS.profile(userId), user);

      toast.success("Login successful! Welcome back.");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to register user
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const { token, user } = data;
      const userId = user.userId;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", userId);

      // Update query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.user(), {
        isAuthenticated: true,
        token,
        user,
        userId,
      });

      queryClient.setQueryData(AUTH_QUERY_KEYS.profile(userId), user);

      toast.success("Welcome to Zang Global! Your account has been created successfully.");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to logout user
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    // Clear localStorage
    ["token", "user", "userId", "cart", "adminToken"].forEach((key) =>
      localStorage.removeItem(key)
    );

    // Clear all auth-related queries
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.all });
    
    // Clear other user-specific data
    queryClient.removeQueries({ queryKey: ["cart"] });
    queryClient.removeQueries({ queryKey: ["orders"] });
    queryClient.removeQueries({ queryKey: ["profile"] });

    // Reset auth state
    queryClient.setQueryData(AUTH_QUERY_KEYS.user(), {
      isAuthenticated: false,
      token: null,
      user: null,
      userId: null,
    });

    toast.info("You have been logged out successfully.");
  };

  return { logout };
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data, variables) => {
      const { userId } = variables;
      const updatedUser = data.user || data;

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile(userId), updatedUser);
      
      queryClient.setQueryData(AUTH_QUERY_KEYS.user(), (old) => ({
        ...old,
        user: updatedUser,
      }));

      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to change password.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to request password reset
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset email sent! Please check your inbox.");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to send password reset email.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to reset password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully! You can now login with your new password.");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to reset password.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to verify email
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success("Email verified successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Email verification failed.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to refresh authentication token
 */
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      const { token, user } = data;
      
      // Update localStorage
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Update query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.user(), (old) => ({
        ...old,
        token,
        user: user || old.user,
      }));

      console.log("Token refreshed successfully");
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      // Force logout on refresh failure
      const { logout } = useLogout();
      logout();
    },
  });
};

/**
 * Hook to check if user has specific permissions
 */
export const usePermissions = () => {
  const { data: authState } = useAuthState();
  
  const hasRole = (requiredRole) => {
    return authState?.user?.role === requiredRole;
  };

  const isAdmin = () => {
    return authState?.user?.role === "admin" || authState?.user?.isAdmin;
  };

  const isSeller = () => {
    return authState?.user?.role === "seller" || authState?.user?.isSeller;
  };

  return {
    hasRole,
    isAdmin,
    isSeller,
    isAuthenticated: authState?.isAuthenticated || false,
  };
};