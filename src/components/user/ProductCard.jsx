import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddToCart from "./addToCart";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg  overflow-hidden shadow-sm hover:shadow-md transition-shadow  border border-gray-100 h-full flex flex-col">
      {/* Product Image */}
      <Link to={`/product/${product.productId}`} className="block flex-grow">
        <img
          src={product.img[0] || "/fallback-image.jpg"}
          alt={product.name}
          className="w-full h-40 sm:h-48 md:h-56 object-cover hover:scale-105 transition-transform"
          loading="lazy"
        />
      </Link>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow-0">
        <h3 className="font-medium text-sm sm:text-base mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-primary text-sm sm:text-base">
            ₦{product.price.toLocaleString()}
          </span>
          {product.rating > 0 && (
            <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
              <FaStar className="text-yellow-400 mr-1" />
              {product.rating}
            </div>
          )}
        </div>

        <AddToCart product={product} />
      </div>
    </div>
  );
};

export default ProductCard;