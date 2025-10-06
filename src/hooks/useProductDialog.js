import { useState } from 'react';

/**
 * Custom hook for managing product dialog state
 */
export const useProductDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  return {
    dialogOpen,
    editingProduct,
    openCreateDialog,
    openEditDialog,
    closeDialog
  };
};

export default useProductDialog;