import {
  addProduct,
  modifyProduct,
  removeProduct
} from './productsSlice';

/**
 * Handle saving a product (create or update)
 */
export const handleSaveProduct = async (dispatch, productData, editingProduct, showSnackbar) => {
  try {
    if (editingProduct) {
      // Update existing product
      await dispatch(modifyProduct({
        id: editingProduct._id,
        productData
      })).unwrap();
      showSnackbar('Product updated successfully!', 'success');
    } else {
      // Create new product
      await dispatch(addProduct(productData)).unwrap();
      showSnackbar('Product created successfully!', 'success');
    }
    return { success: true };
  } catch (err) {
    showSnackbar(`Error: ${err}`, 'error');
    return { success: false, error: err };
  }
};

/**
 * Handle deleting a product
 */
export const handleDeleteProduct = async (dispatch, id, showSnackbar) => {
  const confirmed = window.confirm('Are you sure you want to delete this product?');
  
  if (!confirmed) return { success: false };

  try {
    await dispatch(removeProduct(id)).unwrap();
    showSnackbar('Product deleted successfully!', 'warning');
    return { success: true };
  } catch (err) {
    showSnackbar(`Error: ${err}`, 'error');
    return { success: false, error: err };
  }
};

/**
 * Handle search query change
 */
export const handleSearchChange = (dispatch, setSearchQuery, query) => {
  dispatch(setSearchQuery(query));
};

/**
 * Handle filter change
 */
export const handleFilterChange = (dispatch, setFilterAvailable, value) => {
  dispatch(setFilterAvailable(value));
};