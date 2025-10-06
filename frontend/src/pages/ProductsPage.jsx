import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '@heroicons/react/24/outline';

// Components
import Navbar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import ProductsGrid from '../components/ProductsGrid';
import ProductDialog from '../components/ProductDialog';
import LoginDialog from '../components/LoginDialog';
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
import useAuth from '../hooks/useAuth';
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
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  // Custom hooks
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { dialogOpen, editingProduct, openCreateDialog, openEditDialog, closeDialog } = useProductDialog();
  const { user, isAuthenticated, loading: authLoading, login, logout } = useAuth();
  
  // WebSocket connection (bonus) - only connect if authenticated
  useWebSocket(isAuthenticated ? 'ws://localhost:5000' : null);

  // Fetch products when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProducts());
    }
  }, [dispatch, isAuthenticated]);

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
    if (!isAuthenticated) {
      showSnackbar('Please login to perform this action', 'error');
      return;
    }

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
    if (!isAuthenticated) {
      showSnackbar('Please login to perform this action', 'error');
      return;
    }
    
    await handleDeleteProduct(dispatch, id, showSnackbar);
  };

  // Handle login
  const handleLogin = () => {
    setLoginDialogOpen(true);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    showSnackbar('Logged out successfully', 'info');
  };

  // Handle successful login/register
  const onAuthSuccess = (userData) => {
    login(userData);
    // Fetch products after login
    dispatch(getProducts());
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          isAuthenticated={false} 
          onLogin={handleLogin}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Product Manager
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Please login to manage your products
            </p>
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Login / Sign Up
            </button>
          </div>
        </div>

        <LoginDialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
          onLogin={onAuthSuccess}
          onRegister={onAuthSuccess}
          showSnackbar={showSnackbar}
        />

        <NotificationSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={hideSnackbar}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
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

      {/* Login Dialog */}
      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLogin={onAuthSuccess}
        onRegister={onAuthSuccess}
        showSnackbar={showSnackbar}
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