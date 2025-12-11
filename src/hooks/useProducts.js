import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

// Query Keys
export const PRODUCT_QUERY_KEYS = {
  all: ["products"],
  lists: () => [...PRODUCT_QUERY_KEYS.all, "list"],
  list: (filters) => [...PRODUCT_QUERY_KEYS.lists(), filters],
  details: () => [...PRODUCT_QUERY_KEYS.all, "detail"],
  detail: (id) => [...PRODUCT_QUERY_KEYS.details(), id],
  categories: () => [...PRODUCT_QUERY_KEYS.all, "categories"],
  search: (query) => [...PRODUCT_QUERY_KEYS.all, "search", query],
};

// API Functions
const productApi = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await api.get("/products", { 
      params,
      timeout: 10000 
    });
    return response.data;
  },

  // Get single product
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`, {
      timeout: 5000
    });
    return response.data;
  },

  // Search products
  searchProducts: async (searchQuery, filters = {}) => {
    const params = {
      search: searchQuery,
      ...filters
    };
    const response = await api.get("/products/search", { 
      params,
      timeout: 10000 
    });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    const response = await api.get(`/products/category/${category}`, { 
      params,
      timeout: 10000 
    });
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get("/products/categories");
    return response.data;
  },

  // Get featured/popular products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get("/products/featured", {
      params: { limit }
    });
    return response.data;
  },

  // Create product (admin)
  createProduct: async (productData) => {
    // Handle image upload if needed
    let uploadedImages = productData.img;
    
    if (productData.img && productData.img.length > 0 && typeof productData.img[0] !== 'string') {
      const formData = new FormData();
      productData.img.forEach((file) => formData.append("files", file));
      
      const uploadResponse = await api.post("/upload/docs-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000
      });

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || "Image upload failed");
      }

      uploadedImages = uploadResponse.data.imageUrl || uploadResponse.data.imageUrls;
      uploadedImages = Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages];
    }

    const response = await api.post("/products/new", {
      ...productData,
      img: uploadedImages
    }, {
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  },

  // Update product (admin)
  updateProduct: async ({ productId, productData }) => {
    const response = await api.patch(`/products/${productId}`, productData, {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (productId) => {
    await api.delete(`/products/${productId}`, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return productId;
  },

  // Update product stock
  updateStock: async ({ productId, stock }) => {
    const response = await api.patch(`/products/${productId}/stock`, 
      { inStockValue: stock },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );
    return response.data;
  },

  // Update product visibility
  updateVisibility: async ({ productId, visibility }) => {
    const response = await api.patch(`/products/${productId}/visibility`, 
      { visibility },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );
    return response.data;
  },
};

// Custom Hooks

/**
 * Hook to fetch all products with optional filtering
 */
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: () => productApi.getProducts(filters),
    select: (data) =>{ data.data || data; console.log(data); return data.data || data},
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch infinite scroll products
 */
export const useInfiniteProducts = (filters = {}, limit = 12) => {
  return useInfiniteQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.list(filters), "infinite"],
    queryFn: ({ pageParam = 1 }) => 
      productApi.getProducts({ ...filters, page: pageParam, limit }),
    getNextPageParam: (lastPage, pages) => {
      const data = lastPage.data || lastPage;
      if (data.length < limit) return undefined;
      return pages.length + 1;
    },
    select: (data) => ({
      pages: data.pages.map(page => page.data || page),
      pageParams: data.pageParams,
    }),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch single product by ID
 */
export const useProduct = (productId, enabled = true) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(productId),
    queryFn: () => productApi.getProduct(productId),
    select: (data) => data.data || data,
    enabled: Boolean(productId) && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Hook to search products
 */
export const useSearchProducts = (searchQuery, filters = {}, enabled = true) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.search(searchQuery), filters],
    queryFn: () => productApi.searchProducts(searchQuery, filters),
    select: (data) => data.data || data,
    enabled: Boolean(searchQuery && searchQuery.length > 2) && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (category, params = {}) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.list({ category }), params],
    queryFn: () => productApi.getProductsByCategory(category, params),
    select: (data) => data.data || data,
    enabled: Boolean(category),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch product categories
 */
export const useProductCategories = () => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.categories(),
    queryFn: productApi.getCategories,
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

/**
 * Hook to fetch featured products
 */
export const useFeaturedProducts = (limit = 8) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.all, "featured", limit],
    queryFn: () => productApi.getFeaturedProducts(limit),
    select: (data) => data.data || data,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Hook to create a new product (admin)
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: (data) => {
      const product = data.data || data;
      
      // Invalidate products lists
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
      
      // Add to cache
      queryClient.setQueryData(
        PRODUCT_QUERY_KEYS.detail(product._id),
        { data: product }
      );

      toast.success(`Product "${product.name}" created successfully!`);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create product";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update a product (admin)
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: (data, variables) => {
      const product = data.data || data;
      const { productId } = variables;

      // Update specific product cache
      queryClient.setQueryData(
        PRODUCT_QUERY_KEYS.detail(productId),
        { data: product }
      );

      // Invalidate product lists to refetch
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });

      toast.success(`Product "${product.name}" updated successfully!`);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to update product";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to delete a product (admin)
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: (productId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(productId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });

      toast.success("Product deleted successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update product stock
 */
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.updateStock,
    onSuccess: (data, variables) => {
      const { productId } = variables;
      const updatedProduct = data.data || data;

      // Update product cache
      queryClient.setQueryData(
        PRODUCT_QUERY_KEYS.detail(productId),
        { data: updatedProduct }
      );

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });

      toast.success("Stock updated successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to update stock";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update product visibility
 */
export const useUpdateVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.updateVisibility,
    onSuccess: (data, variables) => {
      const { productId } = variables;
      const updatedProduct = data.data || data;

      // Update product cache
      queryClient.setQueryData(
        PRODUCT_QUERY_KEYS.detail(productId),
        { data: updatedProduct }
      );

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });

      toast.success("Product visibility updated successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to update visibility";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to prefetch products for performance
 */
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();

  const prefetchProducts = (filters = {}) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.list(filters),
      queryFn: () => productApi.getProducts(filters),
      staleTime: 1000 * 60 * 5,
    });
  };

  const prefetchProduct = (productId) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.detail(productId),
      queryFn: () => productApi.getProduct(productId),
      staleTime: 1000 * 60 * 10,
    });
  };

  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.categories(),
      queryFn: productApi.getCategories,
      staleTime: 1000 * 60 * 15,
    });
  };

  return {
    prefetchProducts,
    prefetchProduct,
    prefetchCategories,
  };
};

/**
 * Hook to get product analytics/stats
 */
export const useProductStats = () => {
  const { data: products = [] } = useProducts();
  
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStockValue > 0).length,
    outOfStock: products.filter(p => p.inStockValue === 0).length,
    visible: products.filter(p => p.visibility === 'on').length,
    hidden: products.filter(p => p.visibility === 'off').length,
    categories: [...new Set(products.map(p => p.category))].length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.inStockValue), 0),
  };

  return stats;
};