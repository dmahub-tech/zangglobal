import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// Cache variables
let productsCache = null;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache
let lastFetchTime = 0;

// Helper function for cache management
const getCachedProducts = () => {
  try {
    const cached = localStorage.getItem("products");
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }
  return null;
};

// Optimized image upload handler
const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  
  const uploadResponse = await api.post("/upload/docs-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000 // 30s timeout for uploads
  });

  if (!uploadResponse.data.success) {
    throw new Error(uploadResponse.data.message || "Image upload failed");
  }

  return uploadResponse.data.imageUrl || uploadResponse.data.imageUrls;
};

// Fetch All Products with cache
export const getProducts = createAsyncThunk(
  "product/getAll",
  async (_, { rejectWithValue }) => {
    try {
      // Return cached data if available and fresh
      if (productsCache && Date.now() - lastFetchTime < CACHE_EXPIRY) {
        return productsCache;
      }

      const cachedData = getCachedProducts();
      if (cachedData) {
        productsCache = cachedData;
        lastFetchTime = Date.now();
        return cachedData;
      }

      const response = await api.get("/products", {
        timeout: 10000 // 10s timeout
      });
      
      const products = response.data?.data || [];
      
      // Update cache
      productsCache = products;
      lastFetchTime = Date.now();
      localStorage.setItem("products", JSON.stringify({
        data: products,
        timestamp: Date.now()
      }));
      
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      
      // Fallback to cache if available
      const cachedData = getCachedProducts();
      if (cachedData) {
        return cachedData;
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to fetch products"
      );
    }
  }
);

// Fetch Single Product with cache
export const getProductById = createAsyncThunk(
  "product/getById",
  async (productId, { rejectWithValue, getState }) => {
    try {
      // Check if product exists in cached products
      const state = getState();
      const cachedProduct = state.products.products.find(p => p._id === productId);
      if (cachedProduct) return cachedProduct;

      const response = await api.get(`/products/${productId}`, {
        timeout: 5000 // 5s timeout
      });
      return response.data?.data || null;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return rejectWithValue(
        error.response?.data?.message || 
        "Product not found"
      );
    }
  }
);

// Create a new Product (optimized)
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      if (!productData.img || productData.img.length === 0) {
        throw new Error("At least one image is required");
      }

      const uploadedImages = await uploadImages(productData.img);
      const updatedProductData = { 
        ...productData, 
        img: Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages]
      };

      const response = await api.post("/products/new", updatedProductData, {
        timeout: 15000 // 15s timeout
      });
      
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message
      );
    }
  }
);

// Update Product (optimized)
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/products/${productId}`, productData, {
        timeout: 10000 // 10s timeout
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      return rejectWithValue(
        error.response?.data?.message || 
        "Failed to update product"
      );
    }
  }
);

// Delete Product (optimized)
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}`, {
        timeout: 5000 // 5s timeout
      });
      return productId;
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      return rejectWithValue(
        error.response?.data?.message || 
        "Failed to delete product"
      );
    }
  }
);

// Optimized initial state
const initialState = (() => {
  try {
    const cached = localStorage.getItem("products");
    return {
      products: cached ? JSON.parse(cached).data : [],
      product: null,
      loading: false,
      error: null,
      success: false,
      lastUpdated: cached ? JSON.parse(cached).timestamp : 0
    };
  } catch {
    return {
      products: [],
      product: null,
      loading: false,
      error: null,
      success: false,
      lastUpdated: 0
    };
  }
})();

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearProductsCache: (state) => {
      localStorage.removeItem("products");
      state.lastUpdated = 0;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(getProducts.pending, handlePending)
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.success = true;
        state.lastUpdated = Date.now();
      })
      .addCase(getProducts.rejected, handleRejected)

      .addCase(getProductById.pending, handlePending)
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.success = true;
      })
      .addCase(getProductById.rejected, handleRejected)

      .addCase(createProduct.pending, handlePending)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [action.payload, ...state.products];
        state.success = true;
        state.lastUpdated = Date.now();
      })
      .addCase(createProduct.rejected, handleRejected)

      .addCase(updateProduct.pending, handlePending)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map(product => 
          product._id === action.payload._id ? action.payload : product
        );
        state.product = action.payload;
        state.success = true;
        state.lastUpdated = Date.now();
      })
      .addCase(updateProduct.rejected, handleRejected)

      .addCase(deleteProduct.pending, handlePending)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          product => product._id !== action.payload
        );
        state.success = true;
        state.lastUpdated = Date.now();
      })
      .addCase(deleteProduct.rejected, handleRejected);
  },
});

export const { resetProductState, clearProductsCache } = productSlice.actions;

// Selectors for optimized access
export const selectProducts = (state) => state.products.products;
export const selectProductById = (productId) => (state) => 
  state.products.products.find(p => p._id === productId) || state.products.product;

export default productSlice.reducer;