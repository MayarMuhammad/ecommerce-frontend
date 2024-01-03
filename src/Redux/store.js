import { configureStore } from '@reduxjs/toolkit'
import cartAPIReducer from './cartAPI.js'
import wishlistAPIReducer from './wishlistAPI.js';

export const store = configureStore({
    reducer: { cartAPIReducer, wishlistAPIReducer }
});
