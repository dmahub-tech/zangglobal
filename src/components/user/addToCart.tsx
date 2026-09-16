import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaShoppingCart, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAddToCart, useCart, useUpdateCartItem, useAuthState } from "../../hooks";

const AddToCart = ({ product }) => {
  const { mutate: addToCart, isLoading: isAdding } = useAddToCart();
  const { mutate: updateCartItem, isLoading: isUpdating } = useUpdateCartItem();
  const { data: cartData } = useCart();
  const { data: authState } = useAuthState();
  const { user } = authState || {};

  const cartItem = cartData?.productsInCart;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const userId = user?.userId;

  const isInCart = cartItem?.some(
    (item) => item.productId === product.productId
  );

  useEffect(() => {
    if (isInCart) {
      const cartProduct = cartItem?.find(
        (item) => item.productId === product.productId
      );
      if (cartProduct && quantity !== cartProduct.quantity) {
        setQuantity(cartProduct.quantity);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.productId, cartItem]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateQuantity = async () => {
    updateCartItem({
      productId: product.productId,
      quantity: quantity,
    });
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to the cart.");
      navigate("/signup");
      return;
    }

    addToCart({
      productId: product.productId,
      quantity: quantity,
    });
  };
  

  return (
    <div className="w-full">
      {isInCart ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-lg w-full bg-gray-50"
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className={`rounded-full p-1 ${quantity <= 1 ? 'text-gray-300' : 'text-primary hover:bg-primary/10'}`}
            >
              <FaMinus size={10} className="sm:w-3 sm:h-3" />
            </button>
            
            <span className="w-6 sm:w-8 text-center font-medium text-gray-700 text-xs sm:text-sm">
              {quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
              className={`rounded-full p-1 ${quantity >= 10 ? 'text-gray-300' : 'text-primary hover:bg-primary/10'}`}
            >
              <FaPlus size={10} className="sm:w-3 sm:h-3" />
            </button>
          </div>
          
          <button
            onClick={handleUpdateQuantity}
            disabled={isUpdating}
            className={`ml-auto px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1 ${
              isUpdating
                ? 'bg-gray-200 text-gray-600'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {isUpdating ? (
              'Updating...'
            ) : (
              <>
                <FaCheck size={12} className="hidden sm:block" />
                <span>Updated</span>
              </>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1 sm:gap-2 ${
            isAdding
              ? 'bg-primary/80 text-white'
              : 'bg-primary hover:bg-primary/90 text-white'
          }`}
        >
          {isAdding ? (
            'Adding...'
          ) : (
            <>
              <FaShoppingCart size={12} className="sm:w-4 sm:h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default AddToCart;