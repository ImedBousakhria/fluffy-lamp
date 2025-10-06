import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productsApi from "../../api/productsApi";

// dummy data just for early testing
const DUMMY_PRODUCTS = [
  {
    _id: 1,
    name: "AC1 Phone1",
    type: "phone",
    price: 200.05,
    rating: 3.8,
    warranty_years: 1,
    available: true,
  },
  {
    _id: 2,
    name: "AC2 Phone2",
    type: "phone",
    price: 147.21,
    rating: 1,
    warranty_years: 3,
    available: false,
  },
  {
    _id: 3,
    name: "AC3 Phone3",
    type: "phone",
    price: 150,
    rating: 2,
    warranty_years: 1,
    available: true,
  },
  {
    _id: 4,
    name: "AC4 Phone4",
    type: "phone",
    price: 50.2,
    rating: 3,
    warranty_years: 2,
    available: true,
  },
];

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await productsApi.fetchProducts();
      console.log("Fetched products:", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const createdData = await productsApi.createProduct(productData);
      return createdData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const modifyProduct = createAsyncThunk(
  "products/modifyProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const data = await productsApi.updateProduct(id, productData);
      return { id, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id, { rejectWithValue }) => {
    try {
      productsApi.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  searchQuery: "",
  filterAvailable: null, // null = all, true = available only, false = unavailable only
};

// Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterAvailable: (state, action) => {
      state.filterAvailable = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // For WebSocket updates
    updateProductFromSocket: (state, action) => {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    addProductFromSocket: (state, action) => {
      const exists = state.products.find((p) => p._id === action.payload._id);
      if (!exists) {
        state.products.unshift(action.payload);
      }
      state.products.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    removeProductFromSocket: (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        const exists = state.products.find((p) => p._id === action.payload._id);
        if (!exists) state.products.unshift(action.payload);
        // state.products.push(action.payload);
        state.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Modify Product
      .addCase(modifyProduct.fulfilled, (state, action) => {
        const { id, productData } = action.payload;
        const index = state.products.findIndex((p) => p._id === id);
        if (index !== -1) {
          state.products[index] = { ...state.products[index], ...productData };
        }
      })
      .addCase(modifyProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove Product
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectSearchQuery = (state) => state.products.searchQuery;

// Filtered products selector
export const selectFilteredProducts = (state) => {
  const { products, searchQuery, filterAvailable } = state.products;

  return products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterAvailable === null || product.available === filterAvailable;
    return matchesSearch && matchesFilter;
  });
};

export const {
  setSearchQuery,
  setFilterAvailable,
  clearError,
  updateProductFromSocket,
  addProductFromSocket,
  removeProductFromSocket,
} = productsSlice.actions;

export default productsSlice.reducer;
