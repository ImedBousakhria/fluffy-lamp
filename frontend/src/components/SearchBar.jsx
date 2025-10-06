import React from 'react';
import { MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ searchQuery, onSearchChange, filterAvailable, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange(null)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              filterAvailable === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ViewColumnsIcon className="h-5 w-5" />
            <span>All</span>
          </button>
          <button
            onClick={() => onFilterChange(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              filterAvailable === true
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircleIcon className="h-5 w-5" />
            <span className="hidden sm:block">Available</span>
          </button>
          <button
            onClick={() => onFilterChange(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              filterAvailable === false
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <XCircleIcon className="h-5 w-5" />
            <span className="hidden sm:block">Unavailable</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;