import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

// Query Keys
export const GALLERY_QUERY_KEYS = {
  all: ["gallery"],
  lists: () => [...GALLERY_QUERY_KEYS.all, "list"],
  list: (filters) => [...GALLERY_QUERY_KEYS.lists(), filters],
  details: () => [...GALLERY_QUERY_KEYS.all, "detail"],
  detail: (id) => [...GALLERY_QUERY_KEYS.details(), id],
  categories: () => [...GALLERY_QUERY_KEYS.all, "categories"],
};

// API Functions
const galleryApi = {
  // Get all gallery items
  getGalleryItems: async (params = {}) => {
    const response = await api.get("/gallery", { params });
    return response.data;
  },

  // Get gallery item by ID
  getGalleryItem: async (id) => {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  },

  // Get gallery categories
  getGalleryCategories: async () => {
    const response = await api.get("/gallery/categories");
    return response.data;
  },

  // Create gallery item
  createGalleryItem: async (itemData) => {
    const response = await api.post("/gallery", itemData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  },

  // Update gallery item
  updateGalleryItem: async ({ id, ...itemData }) => {
    const response = await api.put(`/gallery/${id}`, itemData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  },

  // Delete gallery item
  deleteGalleryItem: async (id) => {
    const response = await api.delete(`/gallery/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  },

  // Upload gallery image
  uploadGalleryImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    
    const response = await api.post("/gallery/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  },
};

// Custom Hooks

/**
 * Hook to fetch gallery items with optional filtering
 */
export const useGalleryItems = (filters = {}) => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.list(filters),
    queryFn: () => galleryApi.getGalleryItems(filters),
    select: (data) => data.data, // Extract the actual gallery items from response
  });
};

/**
 * Hook to fetch active gallery items for public display
 */
export const usePublicGalleryItems = (category = null) => {
  const filters = { isActive: true };
  if (category && category !== "all") {
    filters.category = category;
  }

  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.list(filters),
    queryFn: () => galleryApi.getGalleryItems(filters),
    select: (data) => data.data,
  });
};

/**
 * Hook to fetch a single gallery item by ID
 */
export const useGalleryItem = (id, enabled = true) => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.detail(id),
    queryFn: () => galleryApi.getGalleryItem(id),
    select: (data) => data.data,
    enabled: Boolean(id) && enabled,
  });
};

/**
 * Hook to fetch gallery categories
 */
export const useGalleryCategories = () => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.categories(),
    queryFn: galleryApi.getGalleryCategories,
    select: (data) => data.data,
    staleTime: 1000 * 60 * 15, // 15 minutes - categories don't change often
  });
};

/**
 * Hook to create a new gallery item
 */
export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.createGalleryItem,
    onSuccess: (data) => {
      // Invalidate and refetch gallery lists
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.lists() });
      
      // Optionally add the new item to the cache
      queryClient.setQueryData(
        GALLERY_QUERY_KEYS.detail(data.data.galleryId),
        { data: data.data }
      );

      toast.success("Gallery item created successfully");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to create gallery item";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update a gallery item
 */
export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.updateGalleryItem,
    onSuccess: (data, variables) => {
      // Invalidate and refetch gallery lists
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.lists() });
      
      // Update the specific item in the cache
      queryClient.setQueryData(
        GALLERY_QUERY_KEYS.detail(variables.id),
        { data: data.data }
      );

      toast.success("Gallery item updated successfully");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to update gallery item";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to delete a gallery item
 */
export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.deleteGalleryItem,
    onSuccess: (data, galleryId) => {
      // Remove from all list queries
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.lists() });
      
      // Remove the specific item from cache
      queryClient.removeQueries({ queryKey: GALLERY_QUERY_KEYS.detail(galleryId) });

      toast.success("Gallery item deleted successfully");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete gallery item";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to upload gallery image
 */
export const useUploadGalleryImage = () => {
  return useMutation({
    mutationFn: galleryApi.uploadGalleryImage,
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to upload image";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to prefetch gallery data (useful for performance optimization)
 */
export const usePrefetchGalleryItems = () => {
  const queryClient = useQueryClient();

  const prefetchGalleryItems = (filters = {}) => {
    queryClient.prefetchQuery({
      queryKey: GALLERY_QUERY_KEYS.list(filters),
      queryFn: () => galleryApi.getGalleryItems(filters),
    });
  };

  const prefetchGalleryCategories = () => {
    queryClient.prefetchQuery({
      queryKey: GALLERY_QUERY_KEYS.categories(),
      queryFn: galleryApi.getGalleryCategories,
    });
  };

  return {
    prefetchGalleryItems,
    prefetchGalleryCategories,
  };
};