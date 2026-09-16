import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItems from "../../components/user/cart/Cartitems";
import RecentlyViewed from "../../components/user/cart/recentlyviewed";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import { useAuthState } from "../../hooks";

const ShoppingCartPage = () => {
  const { data: authState } = useAuthState();
  const navigate = useNavigate();
  
  const user = authState?.user;
  const isAuthenticated = authState?.isAuthenticated;

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to auth after 2 seconds
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            You need to be logged in to view your cart.
          </h2>
          <p className="text-gray-500 mt-2">Redirecting to login page...</p>
          <Link
            to="/auth"
            className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded shadow hover:bg-opacity-90"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pink-50 min-h-screen">
      <Helmet>
        <title>Shopping Cart - Zang Global</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
            <Link
              to="/store"
              className="flex items-center space-x-2 text-primary transition-colors mt-4 md:mt-0"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
          <CartItems />
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
