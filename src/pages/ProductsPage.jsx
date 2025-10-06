import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '@heroicons/react/24/outline';

// Components
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductsGrid from '../components/ProductsGrid';
import ProductDialog from '../components/ProductDialog';
import LoadingState from '../components/LoadingState';
import ErrorAlert from '../components/ErrorAlert';
import NotificationSnackbar from '../components/NotificationSnackbar';

// Redux
import {
  getProducts,
  setSearchQuery,
  setFilterAvailable,
  selectFilteredProducts,
  selectLoading,
  selectError,
  selectSearchQuery,
  clearError
} from '../features/products/productsSlice';

// Handlers
import {
  handleSaveProduct,
  handleDeleteProduct
} from '../features/products/productHandlers';

// Hooks
import useSnackbar from '../hooks/useSnackbar';
import useProductDialog from '../hooks/useProductDialog';
import useWebSocket from '../hooks/useWebSocket';

const ProductsPage = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const filteredProducts = useSelector(selectFilteredProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const searchQuery = useSelector(selectSearchQuery);
  
  // Local state
  const [filterAvailable, setFilter] = useState(null);
  
  // My hooks
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { dialogOpen, editingProduct, openCreateDialog, openEditDialog, closeDialog } = useProductDialog();
  
  // WebSocket connection 
  useWebSocket('ws://localhost:5000');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Handle search
  const onSearchChange = (query) => {
    dispatch(setSearchQuery(query));
  };

  // Handle filter
  const onFilterChange = (value) => {
    setFilter(value);
    dispatch(setFilterAvailable(value));
  };

  // Handle save (create/update)
  const onSaveProduct = async (productData) => {
    const result = await handleSaveProduct(
      dispatch, 
      productData, 
      editingProduct, 
      showSnackbar
    );
    
    if (result.success) {
      closeDialog();
    }
  };

  // Handle delete
  const onDeleteProduct = async (id) => {
    await handleDeleteProduct(dispatch, id, showSnackbar);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        isAuthenticated={false} 
        onLogin={() => console.log('Login clicked')}
        onLogout={() => console.log('Logout clicked')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filterAvailable={filterAvailable}
            onFilterChange={onFilterChange}
          />
        </div>

        {/* Error Alert */}
        <ErrorAlert 
          error={error} 
          onClose={() => dispatch(clearError())}
        />

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Products Grid */}
        {!loading && (
          <ProductsGrid
            products={filteredProducts}
            onEdit={openEditDialog}
            onDelete={onDeleteProduct}
            searchQuery={searchQuery}
          />
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={openCreateDialog}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group"
        aria-label="Add product"
      >
        <PlusIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
      </button>

      {/* Create/Edit Dialog */}
      <ProductDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSave={onSaveProduct}
        editingProduct={editingProduct}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </div>
  );
};

export default ProductsPage;