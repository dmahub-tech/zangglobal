import React from "react";
const ProductCardSkeleton = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
        <div className="relative pt-[70%] overflow-hidden bg-gray-200"></div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="mb-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-9 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  };

export default ProductCardSkeleton