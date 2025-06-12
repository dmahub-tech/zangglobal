import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// Fetch All Products
export const getProducts = createAsyncThunk(
  "product/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products");
      const products = response.data?.data || [];
      localStorage.setItem("products", JSON.stringify(products));
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// Fetch Single Product
export const getProductById = createAsyncThunk(
  "product/getById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data?.data || null;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return rejectWithValue(error.response?.data?.message || "Product not found");
    }
  }
);

// Create a new Product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      if (!productData.img || productData.img.length === 0) {
        throw new Error("At least one image is required");
      }

      const formData = new FormData();
      productData.img.forEach((file) => formData.append("files", file));

      const uploadResponse = await api.post("/upload/docs-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || "Image upload failed");
      }

      const uploadedImages = uploadResponse.data.imageUrl || uploadResponse.data.imageUrls;
      const updatedProductData = { 
        ...productData, 
        img: Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages]
      };

      const response = await api.post("/products/new", updatedProductData);
      return response.data?.data || response.data;

    } catch (error) {
      console.error("Error creating product:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}`);
      return productId;
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: JSON.parse(localStorage.getItem("products")) || [],
    product: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.success = true;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single product
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.success = true;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [action.payload, ...state.products];
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map(product => 
          product._id === action.payload._id ? action.payload : product
        );
        state.product = action.payload;
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          product => product._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;