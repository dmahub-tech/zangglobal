import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItems from "../../components/user/cart/Cartitems";
import RecentlyViewed from "../../components/user/cart/recentlyviewed";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../../components/user/navbar/navbar";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";

// Mock user fetch (replace this with your actual auth context or state)

const ShoppingCartPage = () => {
  const user  = useSelector((state)=>state.auth.user)
  console.log("User data:", user); // Debugging line to check user data
  console.log(user)
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to auth after 2 seconds
      const timeout = setTimeout(() => {
        navigate("/login"); // 👈 Replace with your actual auth route
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [user, navigate]);

  if (!user) {
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
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6 mt-16">
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
