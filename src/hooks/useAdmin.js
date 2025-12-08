import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

// Query Keys
export const ADMIN_QUERY_KEYS = {
  all: ["admin"],
  dashboard: () => [...ADMIN_QUERY_KEYS.all, "dashboard"],
  analytics: () => [...ADMIN_QUERY_KEYS.all, "analytics"],
  users: () => [...ADMIN_QUERY_KEYS.all, "users"],
  settings: () => [...ADMIN_QUERY_KEYS.all, "settings"],
};

// API Functions
const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    return response.data;
  },
  
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    return response.data;
  },
  
  updateUserStatus: async ({ userId, status }) => {
    const response = await api.patch(`/admin/users/${userId}/status`, 
      { status },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      }
    );
    return response.data;
  },
  
  getAnalytics: async (period = "month") => {
    const response = await api.get(`/admin/analytics`, {
      params: { period },
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    return response.data;
  },
};

// Custom Hooks
export const useDashboardStats = () => {
  const adminToken = localStorage.getItem("adminToken");
  
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard(),
    queryFn: adminApi.getDashboardStats,
    enabled: Boolean(adminToken),
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

export const useAdminUsers = (params = {}) => {
  const adminToken = localStorage.getItem("adminToken");
  
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.users(), params],
    queryFn: () => adminApi.getUsers(params),
    enabled: Boolean(adminToken),
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAnalytics = (period = "month") => {
  const adminToken = localStorage.getItem("adminToken");
  
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.analytics(), period],
    queryFn: () => adminApi.getAnalytics(period),
    enabled: Boolean(adminToken),
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 10,
  });
};