import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../config/api";

// Utility hooks for common operations

/**
 * Hook for file upload
 */
export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (files) => {
      const formData = new FormData();
      if (Array.isArray(files)) {
        files.forEach((file) => formData.append("files", file));
      } else {
        formData.append("files", files);
      }
      
      const response = await api.post("/upload/docs-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
      
      return response.data;
    },
  });
};

/**
 * Hook for search suggestions
 */
export const useSearchSuggestions = (query, enabled = true) => {
  return useQuery({
    queryKey: ["search", "suggestions", query],
    queryFn: async () => {
      const response = await api.get("/search/suggestions", {
        params: { q: query, limit: 8 },
      });
      return response.data;
    },
    enabled: Boolean(query && query.length > 1) && enabled,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data || data,
  });
};

/**
 * Hook for application settings
 */
export const useAppSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get("/settings");
      return response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    select: (data) => data.data || data,
  });
};

/**
 * Hook for contact form submission
 */
export const useContactForm = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/contact", formData);
      return response.data;
    },
  });
};

/**
 * Hook for newsletter subscription
 */
export const useNewsletterSubscription = () => {
  return useMutation({
    mutationFn: async (email) => {
      const response = await api.post("/newsletter/subscribe", { email });
      return response.data;
    },
  });
};