import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

// Query Keys
export const CART_QUERY_KEYS = {
  all: ["cart"],
  userCart: (userId) => [...CART_QUERY_KEYS.all, userId],
  cartItems: (userId) => [...CART_QUERY_KEYS.userCart(userId), "items"],
};

// API Functions
const cartApi = {
  // Get user's cart
  getCart: async (userId) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.get(`/carts/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Add item to cart
  addToCart: async ({ userId, productId, quantity = 1 }) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.post(`/carts/add`, 
      { userId, productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async ({ userId, productId, quantity }) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.put(`/carts/update`, 
      { userId, productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async ({ userId, productId }) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.delete(`/carts/remove`, {
      data: { userId, productId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Clear entire cart
  clearCart: async (userId) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.delete(`/carts/clear/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Apply coupon to cart
  applyCoupon: async ({ userId, couponCode }) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.post(`/carts/coupon/apply`, 
      { userId, couponCode },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Remove coupon from cart
  removeCoupon: async (userId) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.delete(`/carts/coupon/remove/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get cart summary (totals, counts, etc.)
  getCartSummary: async (userId) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.get(`/carts/summary/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Sync local cart with server (for guest to user migration)
  syncCart: async ({ userId, localCartItems }) => {
    const token = localStorage.getItem("token");
    if (!token || !userId) throw new Error("Authentication required");
    
    const response = await api.post(`/carts/sync`, 
      { userId, items: localCartItems },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

// Custom Hooks

/**
 * Hook to get user's cart
 */
export const useCart = (enabled = true) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: CART_QUERY_KEYS.userCart(userId),
    queryFn: () => cartApi.getCart(userId),
    enabled: Boolean(userId && token) && enabled,
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Hook to get cart summary/totals
 */
export const useCartSummary = (enabled = true) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: [...CART_QUERY_KEYS.userCart(userId), "summary"],
    queryFn: () => cartApi.getCartSummary(userId),
    enabled: Boolean(userId && token) && enabled,
    select: (data) => data.data || data,
    staleTime: 1000 * 30, // 30 seconds
  });
};

/**
 * Hook to add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: (data) => cartApi.addToCart({ userId, ...data }),
    onMutate: async ({ productId, quantity = 1 }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });

      // Snapshot the previous cart
      const previousCart = queryClient.getQueryData(CART_QUERY_KEYS.userCart(userId));

      // Optimistically update cart
      if (previousCart) {
        const existingItem = previousCart.productsInCart?.find(item => item.productId === productId);
        
        if (existingItem) {
          // Update existing item
          queryClient.setQueryData(CART_QUERY_KEYS.userCart(userId), {
            ...previousCart,
            productsInCart: previousCart.productsInCart.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          // Add new item (we'd need product data for this)
          queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });
        }
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Roll back optimistic update
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.userCart(userId), context.previousCart);
      }
      
      const errorMessage = err?.response?.data?.message || "Failed to add item to cart";
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      // Invalidate cart queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });
      toast.success("Item added to cart!");
    },
  });
};

/**
 * Hook to update cart item quantity
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: (data) => cartApi.updateCartItem({ userId, ...data }),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });

      const previousCart = queryClient.getQueryData(CART_QUERY_KEYS.userCart(userId));

      if (previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.userCart(userId), {
          ...previousCart,
          productsInCart: previousCart.productsInCart.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.userCart(userId), context.previousCart);
      }
      
      const errorMessage = err?.response?.data?.message || "Failed to update cart item";
      toast.error(errorMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });
    },
  });
};

/**
 * Hook to remove item from cart
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: (data) => cartApi.removeFromCart({ userId, ...data }),
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });

      const previousCart = queryClient.getQueryData(CART_QUERY_KEYS.userCart(userId));

      if (previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.userCart(userId), {
          ...previousCart,
          productsInCart: previousCart.productsInCart.filter(item => item.productId !== productId),
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.userCart(userId), context.previousCart);
      }
      
      const errorMessage = err?.response?.data?.message || "Failed to remove item from cart";
      toast.error(errorMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });
      toast.success("Item removed from cart");
    },
  });
};

/**
 * Hook to clear entire cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: () => cartApi.clearCart(userId),
    onSuccess: () => {
      // Clear cart cache
      queryClient.setQueryData(CART_QUERY_KEYS.userCart(userId), {
        cartId: null,
        userId,
        productsInCart: [],
        total: 0,
      });
      
      toast.success("Cart cleared successfully");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to clear cart";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to apply coupon to cart
 */
export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: (couponCode) => cartApi.applyCoupon({ userId, couponCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });
      toast.success("Coupon applied successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Invalid coupon code";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to remove coupon from cart
 */
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: () => cartApi.removeCoupon(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });
      toast.success("Coupon removed");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to remove coupon";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to sync local cart with server (guest to user migration)
 */
export const useSyncCart = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  return useMutation({
    mutationFn: (localCartItems) => cartApi.syncCart({ userId, localCartItems }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.userCart(userId) });
      // Clear local cart from localStorage after sync
      localStorage.removeItem("cart");
      toast.success("Cart synced successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to sync cart";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook for cart utilities and computed values
 */
export const useCartUtils = () => {
  const { data: cart } = useCart();
  
  const cartItems = cart?.productsInCart || [];
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const isEmpty = cartItems.length === 0;
  
  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };
  
  // Get quantity of specific product in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };
  
  // Get cart item by product ID
  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId === productId);
  };

  return {
    cart,
    cartItems,
    itemCount,
    subtotal,
    isEmpty,
    isInCart,
    getItemQuantity,
    getCartItem,
  };
};

/**
 * Local cart management for guest users
 */
export const useLocalCart = () => {
  const getLocalCart = () => {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  };

  const setLocalCart = (cartItems) => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };

  const addToLocalCart = (product, quantity = 1) => {
    const cart = getLocalCart();
    const existingItemIndex = cart.findIndex(item => item.productId === product._id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        img: product.img,
        category: product.category,
        quantity,
      });
    }

    setLocalCart(cart);
    toast.success("Item added to cart!");
    return cart;
  };

  const updateLocalCartItem = (productId, quantity) => {
    const cart = getLocalCart();
    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setLocalCart(updatedCart);
    return updatedCart;
  };

  const removeFromLocalCart = (productId) => {
    const cart = getLocalCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    setLocalCart(updatedCart);
    toast.success("Item removed from cart");
    return updatedCart;
  };

  const clearLocalCart = () => {
    localStorage.removeItem("cart");
    toast.success("Cart cleared");
    return [];
  };

  return {
    getLocalCart,
    addToLocalCart,
    updateLocalCartItem,
    removeFromLocalCart,
    clearLocalCart,
  };
};