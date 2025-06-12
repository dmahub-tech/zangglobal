import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  fetchCart,
  updateCartQuantity,
} from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { fetchUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaShoppingCart, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const AddToCart = ({ product }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.items.productsInCart);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const  userId = user?.userId


  const isInCart =cartItem?.some(
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
  }, [product.productId]); // only run when product changes
  

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateQuantity = async () => {
    setIsUpdating(true);
    try {
      await dispatch(
        updateCartQuantity({
          productId: product.productId,
          productQty: quantity,
          userId,
        })
      ).unwrap();
      toast.success("Quantity updated!");
    } catch (error) {
      toast.error(error?.message || "Failed to update quantity");
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to the cart.");
      navigate("/signup");
      return;
    }
  
    setIsAdding(true);
    try {
      await dispatch(
        addToCart({
          productId: product.productId,
          productQty: quantity,
          userId: user.userId,
        })
      ).unwrap();
  
      // The toast will now be shown from the Redux slice
      // Refresh the cart to ensure consistency
      await dispatch(fetchCart(user.userId));
    } catch (error) {
      // Error toast will be shown from Redux slice
      console.error("Add to cart error:", error);
    } finally {
      setIsAdding(false);
    }
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