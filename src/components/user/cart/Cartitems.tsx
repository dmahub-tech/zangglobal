import React, { useState, useEffect, useMemo, useCallback } from "react";
import { faTrash, faMinus, faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/api";
import emptyCart from '../../Images/empty_cart.webp';
import { useAuthState, useCart } from "../../../hooks";

const CartItems = () => {
  const [voucher, setVoucher] = useState('');
  const [removingItem, setRemovingItem] = useState(null);
  const [updatingQuantity, setUpdatingQuantity] = useState(null);
  const [discountInfo, setDiscountInfo] = useState({
    code: '',
    percentage: 0,
    message: ''
  });

  const { data: authState } = useAuthState();
  const { data: cartData, isLoading: isLoadingCart } = useCart();
  const removeFromCartMutation = useCart.useRemoveFromCart();
  const updateQuantityMutation = useCart.useUpdateCartQuantity();
  
  const user = authState?.user;

  const totalPrice = cartData?.total || 0;
  const cartItems = cartData?.productsInCart || [];

  // No need for manual fetching - React Query handles this automatically

  const handleRemoveFromCart = useCallback(async (product) => {
    setRemovingItem(product.productId);
    removeFromCartMutation.mutate(
      { productId: product.productId },
      {
        onSuccess: () => {
          toast.success(`${product.name} removed from cart!`);
          setRemovingItem(null);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to remove item.");
          setRemovingItem(null);
        }
      }
    );
  }, [removeFromCartMutation]);
  const handleQuantityChange = useCallback(async (productId, change) => {
    const product = cartItems.find(item => item.productId === productId);
    if (!product) return;

    const newQuantity = product.quantity + change;
    if (newQuantity < 1 || newQuantity > 10) return;

    setUpdatingQuantity(productId);
    updateQuantityMutation.mutate(
      { productId, quantity: newQuantity },
      {
        onSuccess: () => {
          setUpdatingQuantity(null);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to update quantity");
          setUpdatingQuantity(null);
        }
      }
    );
  }, [updateQuantityMutation, cartItems]);

  const handleVoucherRedeem = useCallback(async () => {
    if (!voucher.trim()) return;
    
    try {
      setDiscountInfo(prev => ({ ...prev, message: 'Verifying...' }));
      const response = await api.post('/coupons/verify-coupon', { code: voucher });
      const data = response.data;

      if (data.message === 'Invalid coupon code') {
        setDiscountInfo({
          code: '',
          percentage: 0,
          message: 'Invalid coupon code'
        });
        toast.error('Invalid coupon code');
      } else if (data.discountPercentage) {
        setDiscountInfo({
          code: voucher,
          percentage: data.discountPercentage,
          message: `${data.discountPercentage}% discount applied!`
        });
        toast.success('Coupon applied successfully!');
      }
    } catch (err) {
      setDiscountInfo({
        code: '',
        percentage: 0,
        message: 'Error verifying coupon'
      });
      toast.error('Failed to apply coupon');
    }
  }, [voucher]);

  const subtotal = useMemo(() => totalPrice);
  const discountAmount = useMemo(() => (subtotal * discountInfo.percentage) / 100, [subtotal, discountInfo.percentage]);
  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  if (isLoadingCart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <FontAwesomeIcon 
          icon={faSpinner} 
          className="text-4xl text-primary animate-spin mb-4" 
        />
        <p className="text-lg text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (!cartItems.length && !isLoadingCart) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px]">
        <img 
          src={emptyCart} 
          alt="Empty Cart" 
          className="w-32 sm:w-48 h-32 sm:h-48 mb-4 object-contain" 
        />
        <p className="text-base sm:text-lg text-gray-600 mb-4 text-center">
          Your cart is empty
        </p>
        <Link 
          to="/store" 
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm sm:text-base"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Your Cart ({cartItems.length} items)</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {cartItems.map((item) => (
            <div key={item.productId} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex gap-4">
                <div className="relative">
                  <img
                    src={item.img[0]}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md border"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />
                  {updatingQuantity === item.productId && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <Link to={`/product/${item.productId}`} className="font-medium text-gray-900 hover:text-primary">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 capitalize">{item.category || "No category"}</p>
                    <p className="font-semibold text-sm mt-1">
                      ₦{(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded bg-gray-50">
                      <button
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        disabled={item.quantity <= 1 || updatingQuantity === item.productId}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:bg-transparent transition-colors"
                      >
                        {updatingQuantity === item.productId ? (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        ) : (
                          <FontAwesomeIcon icon={faMinus} />
                        )}
                      </button>
                      <span className="w-10 text-center bg-white">
                        {updatingQuantity === item.productId ? (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, 1)}
                        disabled={item.quantity >= 10 || updatingQuantity === item.productId}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:bg-transparent transition-colors"
                      >
                        {updatingQuantity === item.productId ? (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        ) : (
                          <FontAwesomeIcon icon={faPlus} />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={removingItem === item.productId}
                    >
                      {removingItem === item.productId ? (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={faTrash} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-sm rounded-lg p-4 sticky top-4">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            placeholder="Enter voucher code"
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleVoucherRedeem}
            disabled={!voucher.trim() || discountInfo.message === 'Verifying...'}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {discountInfo.message === 'Verifying...' ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              'Redeem'
            )}
          </button>
        </div>

        {discountInfo.message && (
          <div className={`text-sm p-2 rounded-md mb-3 ${
            discountInfo.code ? 'bg-green-50 text-green-600' : 
            discountInfo.message === 'Verifying...' ? 'bg-blue-50 text-blue-600' : 
            'bg-red-50 text-red-500'
          }`}>
            {discountInfo.message}
          </div>
        )}

        <div className="text-sm mt-3 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₦{subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
          </div>
          {discountInfo.percentage > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountInfo.percentage}%)</span>
              <span>-₦{discountAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="border-t pt-3 flex justify-between font-semibold text-base">
            <span>Total</span>
            <span className="text-primary">₦{total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <Link
          to={'/checkout'}
          className="w-full flex items-center justify-center mt-6 bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors font-medium"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartItems;