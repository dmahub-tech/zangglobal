import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// Checkout Order
export const checkoutOrder = createAsyncThunk("order/checkout", async (orderData, { rejectWithValue }) => {
  try {
    const response = await api.post("/checkouts", orderData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Fetch Orders
export const fetchOrders = createAsyncThunk("order/fetchOrders", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/orders/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState: { orders: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => { state.orders = action.payload; })
      .addCase(checkoutOrder.fulfilled, (state, action) => { state.orders.push(action.payload); });
  },
});

export default orderSlice.reducer;
