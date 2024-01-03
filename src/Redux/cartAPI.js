import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


export const getCartItems = createAsyncThunk('cartAPI/getCartItems', async function () {
  const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/cart', { headers: { token: localStorage.getItem('token') } });
  return data;
})

export const clearCart = createAsyncThunk('cartAPI/clearCart', async function () {
  const { data } = await axios.delete('https://ecommerce.routemisr.com/api/v1/cart', { headers: { token: localStorage.getItem('token') } });
  return data;
})

export const addToCart = createAsyncThunk('cartAPI/addToCart', async function (productID) {
  const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/cart', { "productId": productID }, { headers: { token: localStorage.getItem('token') } });
  return data;
})

export const removeFromCart = createAsyncThunk('cartAPI/removeFromCart', async function (productID) {
  const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productID}`, { headers: { token: localStorage.getItem('token') }, });
  return data;
})

const cartAPISlice = createSlice({
  name: 'cartAPI',
  initialState: {
    cartItems: [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
    cartID: '',
    status: 'failed'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartID = action.payload.data._id;
        state.cartItems = action.payload.data.products;
        state.cartTotalQuantity = action.payload.numOfCartItems;
        state.cartTotalAmount = action.payload.data.totalCartPrice;
        state.status = 'success';
        toast.success('Product Added To Cart Successfully');
      }).addCase(addToCart.rejected, (state, action) => { state.status = 'failed'; })
      .addCase(addToCart.pending, (state, action) => { state.status = 'pending'; })

    builder.addCase(getCartItems.fulfilled, (state, action) => {
      state.cartID = action.payload.data._id;
      state.cartItems = action.payload.data.products;
      state.cartTotalQuantity = action.payload.numOfCartItems;
      state.cartTotalAmount = action.payload.data.totalCartPrice;
      state.status = 'success';
    }).addCase(getCartItems.rejected, (state, action) => {
      state.cartID = '';
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.status = 'failed';
    }).addCase(getCartItems.pending, (state, action) => { state.status = 'pending'; })

    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.cartID = action.payload.data._id;
      state.cartItems = action.payload.data.products;
      state.cartTotalQuantity = action.payload.numOfCartItems;
      state.cartTotalAmount = action.payload.data.totalCartPrice;
      state.status = 'success';
      toast.success('Product Removed from Cart Successfully');
    }).addCase(removeFromCart.rejected, (state, action) => { state.status = 'failed'; })
      .addCase(removeFromCart.pending, (state, action) => { state.status = 'pending'; })

    builder.addCase(clearCart.fulfilled, (state, action) => {
      state.cartID = '';
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.status = 'success';
      toast.success('Cart Cleared');
    }).addCase(clearCart.rejected, (state, action) => {
      state.status = 'failed';
    })
      .addCase(clearCart.pending, (state, action) => { state.status = 'pending'; })
  }
})

export default cartAPISlice.reducer;