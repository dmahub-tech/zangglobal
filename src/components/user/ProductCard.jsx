import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddToCart from "./addToCart";

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col h-full">
      {/* Product Image Container - Now with better proportions */}
      <Link 
        to={`/product/${product.productId}`} 
        className="block relative pt-[70%] overflow-hidden bg-gray-50"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.img[0] || "/fallback-image.jpg"}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover p-2 transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          width="240"
          height="240"
          decoding="async"
        />
      </Link>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="font-medium text-gray-900 text-sm sm:text-[15px] mb-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.category && (
            <span className="text-xs text-gray-500">{product.category}</span>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <span className="font-bold text-primary text-[15px] sm:text-base">
              ₦{product.price.toLocaleString()}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center text-xs bg-gray-100/80 px-2 py-1 rounded-full">
                <FaStar className="text-yellow-400 mr-1 text-[13px]" />
                {product.rating.toFixed(1)}
              </div>
            )}
          </div>

          <AddToCart product={product} className="w-full text-sm" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);