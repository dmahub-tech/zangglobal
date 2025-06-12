import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { toast } from "react-toastify";



// Fetch Cart from API
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/carts/${userId}`);
    const products = response.data.cart;
    // localStorage.setItem("cart", JSON.stringify(products)); // Sync with storage
    return products;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Add to Cart
export const addToCart = createAsyncThunk(
  "carts/addToCart",
  async ({ productId, productQty = 1, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/carts/add", { productId, productQty, userId });
      return  response.data.data.productsInCart;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Cart Quantity
export const updateCartQuantity = createAsyncThunk(
  "carts/updateQuantity",
  async ({ productId, productQty, userId }, { rejectWithValue }) => {
    try {
      await api.put("/carts/update-qty", { productId, productQty, userId });
      return { productId, productQty };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove from Cart
// Remove from Cart
export const removeFromCart = createAsyncThunk(
  "carts/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/carts/remove/${userId}/${productId}`);
      return response.data; // Make sure your API returns the updated cart or at least the productId
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { 
    items: {
      cartId: null,
      cart: {},
      productsInCart: []
    }, 
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
   
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Update the productsInCart array with the new data
        state.items.productsInCart = action.payload.productsInCart || action.payload;
        state.loading = false;
        toast.success("Item added to cart!");
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        toast.error(action.payload?.message || "Failed to add to cart");
      })


      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        // Assuming your API returns the updated cart
        if (action.payload.cart) {
          state.items = action.payload.cart;
        } 
        // Or if it just returns the productId
        else if (action.payload.productId) {
          state.items.productsInCart = state.items.productsInCart.filter(
            item => item.productId !== action.payload.productId
          );
        }
        state.loading = false;
      })

      // Update Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { productId, productQty } = action.payload;
        const item = state.items.productsInCart.find((item) => item.productId === productId);
        if (item) {
          item.productQty = productQty;
        }
        state.loading = false;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
