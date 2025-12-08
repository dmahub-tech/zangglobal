import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

// Query Keys
export const ORDER_QUERY_KEYS = {
  all: ["orders"],
  lists: () => [...ORDER_QUERY_KEYS.all, "list"],
  list: (filters) => [...ORDER_QUERY_KEYS.lists(), filters],
  details: () => [...ORDER_QUERY_KEYS.all, "detail"],
  detail: (id) => [...ORDER_QUERY_KEYS.details(), id],
  userOrders: (userId) => [...ORDER_QUERY_KEYS.all, "user", userId],
  adminOrders: () => [...ORDER_QUERY_KEYS.all, "admin"],
  stats: () => [...ORDER_QUERY_KEYS.all, "stats"],
};

// API Functions
const orderApi = {
  // Get user orders
  getUserOrders: async (userId) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.get(`/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get single order
  getOrder: async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");
    
    const response = await api.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");
    
    const response = await api.post("/orders/new", orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async ({ orderId, status, trackingId }) => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) throw new Error("Admin authentication required");
    
    const response = await api.patch(`/orders/${orderId}/status`, 
      { status, trackingId },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async (filters = {}) => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) throw new Error("Admin authentication required");
    
    const response = await api.get("/orders", {
      params: filters,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");
    
    const response = await api.patch(`/orders/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Process payment for order
  processPayment: async ({ orderId, paymentDetails }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");
    
    const response = await api.post(`/orders/${orderId}/payment`, paymentDetails, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get order statistics (admin)
  getOrderStats: async () => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) throw new Error("Admin authentication required");
    
    const response = await api.get("/orders/stats", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    return response.data;
  },

  // Track order
  trackOrder: async (orderId) => {
    const response = await api.get(`/orders/track/${orderId}`);
    return response.data;
  },

  // Initiate refund
  initiateRefund: async ({ orderId, reason, amount }) => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) throw new Error("Admin authentication required");
    
    const response = await api.post(`/orders/${orderId}/refund`, 
      { reason, amount },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async ({ orderId, paymentStatus, paymentReference }) => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) throw new Error("Admin authentication required");
    
    const response = await api.patch(`/orders/${orderId}/payment-status`, 
      { paymentStatus, paymentReference },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    return response.data;
  },
};

// Custom Hooks

/**
 * Hook to get user's orders
 */
export const useUserOrders = (enabled = true) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.userOrders(userId),
    queryFn: () => orderApi.getUserOrders(userId),
    enabled: Boolean(userId && token) && enabled,
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to get single order by ID
 */
export const useOrder = (orderId, enabled = true) => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.detail(orderId),
    queryFn: () => orderApi.getOrder(orderId),
    enabled: Boolean(orderId) && enabled,
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Hook to get all orders (admin)
 */
export const useAllOrders = (filters = {}) => {
  const adminToken = localStorage.getItem("adminToken");
  
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.list(filters),
    queryFn: () => orderApi.getAllOrders(filters),
    enabled: Boolean(adminToken),
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

/**
 * Hook to get order statistics (admin)
 */
export const useOrderStats = () => {
  const adminToken = localStorage.getItem("adminToken");
  
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.stats(),
    queryFn: orderApi.getOrderStats,
    enabled: Boolean(adminToken),
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: (data) => {
      const order = data.data || data;
      
      // Add order to user's orders cache
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(order.orderId), order);
      
      // Invalidate user orders to refetch
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.userOrders(userId) });
      
      // Clear cart after successful order
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      
      toast.success("Order placed successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to place order";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update order status (admin)
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.updateOrderStatus,
    onSuccess: (data, variables) => {
      const { orderId } = variables;
      const updatedOrder = data.data || data;
      
      // Update specific order cache
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(orderId), updatedOrder);
      
      // Invalidate order lists
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.adminOrders() });
      
      toast.success("Order status updated successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to update order status";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to cancel an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: orderApi.cancelOrder,
    onSuccess: (data, orderId) => {
      const updatedOrder = data.data || data;
      
      // Update order in cache
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(orderId), updatedOrder);
      
      // Invalidate user orders
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.userOrders(userId) });
      
      toast.success("Order cancelled successfully");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to cancel order";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to process payment
 */
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.processPayment,
    onSuccess: (data, variables) => {
      const { orderId } = variables;
      const updatedOrder = data.data || data;
      
      // Update order cache
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(orderId), updatedOrder);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.userOrders() });
      
      toast.success("Payment processed successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Payment processing failed";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to track an order
 */
export const useTrackOrder = (orderId, enabled = true) => {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEYS.detail(orderId), "tracking"],
    queryFn: () => orderApi.trackOrder(orderId),
    enabled: Boolean(orderId) && enabled,
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes for live tracking
  });
};

/**
 * Hook to initiate refund (admin)
 */
export const useInitiateRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.initiateRefund,
    onSuccess: (data, variables) => {
      const { orderId } = variables;
      
      // Invalidate order data to refetch
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() });
      
      toast.success("Refund initiated successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to initiate refund";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update payment status (admin)
 */
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.updatePaymentStatus,
    onSuccess: (data, variables) => {
      const { orderId } = variables;
      const updatedOrder = data.data || data;
      
      // Update order cache
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(orderId), updatedOrder);
      
      // Invalidate order lists
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() });
      
      toast.success("Payment status updated successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to update payment status";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook for order utilities and computed values
 */
export const useOrderUtils = () => {
  const { data: orders = [] } = useUserOrders();
  
  // Calculate order statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'Pending').length,
    processing: orders.filter(order => order.status === 'Processing').length,
    shipped: orders.filter(order => order.status === 'Shipped').length,
    delivered: orders.filter(order => order.status === 'Delivered').length,
    cancelled: orders.filter(order => order.status === 'Cancelled').length,
    totalValue: orders.reduce((sum, order) => sum + order.price, 0),
  };

  // Get recent orders
  const getRecentOrders = (limit = 5) => {
    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // Check if user can cancel order
  const canCancelOrder = (order) => {
    return ['Pending', 'Processing'].includes(order.status) && 
           order.paymentStatus !== 'Paid';
  };

  // Get order status color
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'orange',
      'Processing': 'blue',
      'Shipped': 'purple',
      'Delivered': 'green',
      'Cancelled': 'red',
    };
    return colors[status] || 'gray';
  };

  return {
    orders,
    stats,
    getRecentOrders,
    canCancelOrder,
    getStatusColor,
  };
};