import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import Navbar from '../../components/user/navbar/navbar';
import { ChevronUp, ChevronDown, Clock, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../config/api';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState("")
  const user = useSelector((state) =>state.auth.user)
  console.log(user, "from order")
  const navigate = useNavigate();

  useEffect(() => {
  const fetchOrders = async () => {
    setLoading(true);
    const userId = user?.userId || localStorage.getItem('userId');
    
    // Don't proceed if we don't have a user ID
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/orders/user/${userId}/`);
      
      if (response.data?.success) {
        setOrders(response.data.data);
      } else {
        console.error('Unexpected response format:', response.data);
        // You might want to set some error state here
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Unauthorized - maybe redirect to login
        navigate('/login');
      } else {
        // Set error state for UI feedback
        setError('Failed to load orders. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [navigate, user?.userId]); // Added user?.userId as dependency


  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch('https://api.merabestie.com/:productId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (data.success) {
        return data.product;
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
    return null;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">

        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
          <motion.div 
            className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-lg text-gray-700 font-medium"
          >
            Fetching your orders...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 mt-16">
      <Helmet>
        <title>My Orders | Zang Global</title>
      </Helmet>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg mb-8 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
            <h1 className="text-3xl font-bold text-white">My Orders</h1>
          </div>
        </motion.div>

        <div className="space-y-8">
          {orders?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <p className="text-gray-600 text-xl">No orders found</p>
              <button 
                onClick={() => navigate('/shop')} 
                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-300"
              >
                Start Shopping
              </button>
            </motion.div>
          ) : (
            orders?.map((order, index) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <OrderCard order={order} fetchProductDetails={fetchProductDetails} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


const OrderCard = ({ order, fetchProductDetails }) => {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Safely parse address with fallback
  const address = useMemo(() => {
    try {
      return JSON.parse(order.address) || {};
    } catch {
      return {};
    }
  }, [order.address]);

  // Format date and time
  const formattedDate = useMemo(() => {
    return new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [order.createdAt]);

  const formattedTime = useMemo(() => {
    return new Date(order.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [order.createdAt]);

  // Status display configuration
  const statusConfig = {
    Processing: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
    Shipped: { color: 'bg-blue-100 text-blue-800', icon: <Truck className="w-4 h-4" /> },
    Delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
    Cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> }
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (!expanded || order.products?.length > 0) return;
      
      setLoadingProducts(true);
      try {
        const productDetails = await Promise.all(
          order.productIds.map(id => fetchProductDetails(id))
        );
        setProducts(productDetails.filter(Boolean));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [expanded, order.productIds, order.products, fetchProductDetails]);

  const toggleExpanded = () => setExpanded(!expanded);

  const renderOrderHeader = () => (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Order #{order.orderId.slice(0, 8)}</h2>
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
          {statusConfig[order.status]?.icon}
          <span className="ml-1">{order.status}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Placed on</p>
        <p className="text-gray-800 font-medium">{formattedDate}</p>
        <p className="text-xs text-gray-500">{formattedTime}</p>
      </div>
    </div>
  );

  const renderPaymentInfo = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
        <CreditCard className="w-4 h-4 mr-2" />
        Payment Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Method</p>
          <p className="text-gray-800 font-medium capitalize">{order.paymentMethod}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
            {order.paymentStatus}
          </p>
        </div>
        {order.paymentReference && (
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500">Reference</p>
            <p className="text-gray-800 text-sm font-mono truncate">{order.paymentReference}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAddress = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Customer</p>
          <p className="text-gray-800 font-medium">{order.name}</p>
          <p className="text-gray-600 text-sm">{order.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Shipping Address</p>
          <div className="text-gray-800">
            <p className="font-medium">{address.street || 'Not specified'}</p>
            <p className="text-sm">
              {address.city}{address.city && address.state && ', '}{address.state}
            </p>
            {address.pincode && <p className="text-sm">{address.pincode}</p>}
            {address.phone && (
              <p className="text-sm mt-1">
                <span className="text-gray-500">Phone:</span> {address.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Items</p>
          <p className="text-gray-800 font-medium">{(order.products || products).length}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-xl font-bold text-gray-800">₦{order.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  const renderProductItem = (product, index) => (
    <motion.div
      key={product._id || index}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white p-4 rounded-lg flex items-start space-x-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
    >
      <img 
        src={product.img[0] || product.img} 
        alt={product.name} 
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 font-semibold">{product.name}</p>
        <p className="text-primary font-medium mt-1">₦{product.price?.toLocaleString()}</p>
        {product.quantity && (
          <p className="text-xs text-gray-500 mt-1">Quantity: {product.quantity}</p>
        )}
      </div>
    </motion.div>
  );

  const renderProducts = () => {
    const itemsToRender = order.products || products;
    
    if (loadingProducts) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      );
    }

    if (!itemsToRender?.length) {
      return <p className="text-gray-500 text-center py-4">No products found</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {itemsToRender.map(renderProductItem)}
      </div>
    );
  };

  return (
    <motion.div 
      layout
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-6"
    >
      <div className="p-6">
        {renderOrderHeader()}
        {renderPaymentInfo()}
        {renderAddress()}
        {renderOrderSummary()}
        
        <div 
          className="flex justify-between items-center cursor-pointer pt-4 border-t border-gray-200"
          onClick={toggleExpanded}
          aria-expanded={expanded}
        >
          <h3 className="text-lg font-semibold text-gray-700">Order Details</h3>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 transition-transform" />
          )}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: expanded ? 1 : 0,
          height: expanded ? 'auto' : 0,
          overflow: expanded ? 'visible' : 'hidden'
        }}
        transition={{ duration: 0.3 }}
        className="px-6 pb-6"
      >
        {renderProducts()}
      </motion.div>
    </motion.div>
  );
};


export default Order;

