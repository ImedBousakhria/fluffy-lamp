import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/products/productsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;