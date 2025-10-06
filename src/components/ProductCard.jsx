import React from 'react';
import { DevicePhoneMobileIcon, PencilIcon, TrashIcon, ShieldCheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ProductCard = ({ product, onEdit, onDelete }) => {
  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.floor(rating) ? (
          <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Card Content */}
      <div className="p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
            <DevicePhoneMobileIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={product.name}>
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-2xl font-bold text-blue-600 mb-3">
          ${product.price.toFixed(2)}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
        </div>

        {/* Availability Badge */}
        <div className="mb-3">
          {product.available ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Available
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              Unavailable
            </span>
          )}
        </div>

        {/* Warranty Info */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <ShieldCheckIcon className="h-4 w-4 mr-1" />
          <span>{product.warranty_years} year{product.warranty_years > 1 ? 's' : ''} warranty</span>
        </div>

        {/* Type */}
        <p className="text-xs text-gray-400 capitalize">Type: {product.type}</p>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 px-6 py-3 flex justify-between border-t border-gray-100">
        <button
          onClick={() => onEdit(product)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium transition"
        >
          <PencilIcon className="h-5 w-5" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition"
        >
          <TrashIcon className="h-5 w-5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;