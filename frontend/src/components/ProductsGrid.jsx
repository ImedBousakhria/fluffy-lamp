import React from 'react';
import ProductCard from './ProductCard';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

const ProductsGrid = ({ products, onEdit, onDelete, searchQuery }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <FaceFrownIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">
          {searchQuery
            ? 'Try adjusting your search or filters'
            : 'Click the + button to add your first product'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;