import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

// Query Keys
export const REVIEW_QUERY_KEYS = {
  all: ["reviews"],
  lists: () => [...REVIEW_QUERY_KEYS.all, "list"],
  product: (productId) => [...REVIEW_QUERY_KEYS.all, "product", productId],
  user: (userId) => [...REVIEW_QUERY_KEYS.all, "user", userId],
};

// API Functions
const reviewApi = {
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },
  
  getUserReviews: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },
  
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },
  
  updateReview: async ({ reviewId, reviewData }) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },
  
  deleteReview: async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return reviewId;
  },
};

// Custom Hooks
export const useProductReviews = (productId, enabled = true) => {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.product(productId),
    queryFn: () => reviewApi.getProductReviews(productId),
    select: (data) => data.data || data,
    enabled: Boolean(productId) && enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserReviews = (enabled = true) => {
  const userId = localStorage.getItem("userId");
  
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.user(userId),
    queryFn: () => reviewApi.getUserReviews(userId),
    select: (data) => data.data || data,
    enabled: Boolean(userId) && enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: (data) => {
      const review = data.data || data;
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.product(review.productId) });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.user() });
      toast.success("Review submitted successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    },
  });
};