import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

// Query Keys
export const BLOG_QUERY_KEYS = {
  all: ["blogs"],
  lists: () => [...BLOG_QUERY_KEYS.all, "list"],
  list: (filters) => [...BLOG_QUERY_KEYS.lists(), filters],
  details: () => [...BLOG_QUERY_KEYS.all, "detail"],
  detail: (id) => [...BLOG_QUERY_KEYS.details(), id],
  categories: () => [...BLOG_QUERY_KEYS.all, "categories"],
};

// API Functions
const blogApi = {
  getBlogs: async (params = {}) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },
  
  getBlog: async (blogId) => {
    const response = await api.get(`/blogs/${blogId}`);
    return response.data;
  },
  
  createBlog: async (blogData) => {
    const response = await api.post("/blogs", blogData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    return response.data;
  },
  
  updateBlog: async ({ blogId, blogData }) => {
    const response = await api.put(`/blogs/${blogId}`, blogData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    return response.data;
  },
  
  deleteBlog: async (blogId) => {
    await api.delete(`/blogs/${blogId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    return blogId;
  },
};

// Custom Hooks
export const useBlogs = (filters = {}) => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.list(filters),
    queryFn: () => blogApi.getBlogs(filters),
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlog = (blogId, enabled = true) => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.detail(blogId),
    queryFn: () => blogApi.getBlog(blogId),
    select: (data) => data.data || data,
    enabled: Boolean(blogId) && enabled,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blogApi.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.lists() });
      toast.success("Blog created successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create blog");
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blogApi.updateBlog,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(BLOG_QUERY_KEYS.detail(variables.blogId), data);
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.lists() });
      toast.success("Blog updated successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update blog");
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blogApi.deleteBlog,
    onSuccess: (blogId) => {
      queryClient.removeQueries({ queryKey: BLOG_QUERY_KEYS.detail(blogId) });
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.lists() });
      toast.success("Blog deleted successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete blog");
    },
  });
};