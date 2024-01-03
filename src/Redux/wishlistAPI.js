import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


export const getWishlistItems = createAsyncThunk('wishlistAPI/getWishlistItems', async function () {
  const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', { headers: { token: localStorage.getItem('token') } });
  return data;
})

export const addToWishlist = createAsyncThunk('wishlistAPI/addToWishlist', async function (productID) {
  const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/wishlist', { "productId": productID }, { headers: { token: localStorage.getItem('token') } });
  return data;
})

export const removeFromWishlist = createAsyncThunk('wishlistAPI/removeFromWishlist', async function (productID) {
  const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productID}`, { headers: { token: localStorage.getItem('token') }, });
  return data;
})

const wishlistAPISlice = createSlice({
  name: 'wishlistAPI',
  initialState: {
    wishlistItems: [],
    wishlistTotalQuantity: 0,
    status: 'failed'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (action.payload.data) {

          state.wishlistTotalQuantity = action.payload.data.length;
        }
        else {
          state.wishlistTotalQuantity = 0;
        }
        state.wishlistItems = action.payload.data;
        state.status = 'success';
        toast.success('Product Added To Wishlist Successfully');
      }).addCase(addToWishlist.rejected, (state, action) => { state.status = 'failed'; })
      .addCase(addToWishlist.pending, (state, action) => { state.status = 'pending'; })

    builder.addCase(getWishlistItems.fulfilled, (state, action) => {
      state.wishlistItems = action.payload.data;
      state.wishlistTotalQuantity = action.payload.count;
      state.status = 'success';
    }).addCase(getWishlistItems.rejected, (state, action) => { state.status = 'failed'; })
      .addCase(getWishlistItems.pending, (state, action) => { state.status = 'pending'; })

    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.wishlistTotalQuantity = action.payload.data.length;
      }
      else {
        state.wishlistTotalQuantity = 0;
      }
      state.wishlistItems = action.payload.data;
      state.status = 'success';
      toast.success('Product Removed from Wishlist Successfully');
    }).addCase(removeFromWishlist.rejected, (state, action) => { state.status = 'failed'; })
      .addCase(removeFromWishlist.pending, (state, action) => { state.status = 'pending'; })
  }
})

export default wishlistAPISlice.reducer;