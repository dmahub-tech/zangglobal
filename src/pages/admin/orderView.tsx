import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  MapPin,
  Clock,
  User,
  Loader2,
  AlertCircle
} from "lucide-react";
import api from "../../config/api";
import { Helmet } from "react-helmet";

const OrderView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/orders/${orderId}`);
        
        if (!response.data?.data) {
          throw new Error("Order data not found");
        }
        
        setOrder({
          ...response.data.data,
          // Ensure address is properly parsed
          address: parseAddress(response.data.data.address)
        });
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Robust address parsing function
  const parseAddress = (address) => {
    if (!address) return {};
    if (typeof address === 'object') return address;
    
    try {
      // Handle cases where address might be double-encoded
      const parsed = JSON.parse(address);
      return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    } catch (e) {
      console.warn("Failed to parse address as JSON, using fallback:", e);
      // Fallback for malformed address strings
      try {
        const cleanString = address.replace(/[{}"']/g, '');
        const addressObj = {};
        cleanString.split(',').forEach(pair => {
          const [key, value] = pair.split(':').map(s => s.trim());
          if (key && value) addressObj[key] = value;
        });
        return addressObj;
      } catch (e) {
        console.error("Fallback address parsing failed:", e);
        return {};
      }
    }
  };

  const statusSteps = [
    { id: "Pending", icon: <Package size={20} />, label: "Order Placed", color: "bg-yellow-100 text-yellow-800" },
    { id: "Processing", icon: <Package size={20} />, label: "Processing", color: "bg-blue-100 text-blue-800" },
    { id: "Shipped", icon: <Truck size={20} />, label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { id: "Delivered", icon: <CheckCircle size={20} />, label: "Delivered", color: "bg-green-100 text-green-800" },
    { id: "Cancelled", icon: <AlertCircle size={20} />, label: "Cancelled", color: "bg-red-100 text-red-800" }
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.id === order?.status);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to load order</h2>
        <p className="text-gray-600 mb-4">{error || "Order not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Order #{order.orderId} | Admin | Zang Global</title>
      </Helmet>

      <div className="p-4 md:p-8 lg:ml-64">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Orders</span>
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Order #{order.orderId}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusSteps.find(s => s.id === order.status)?.color || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="relative">
              <div className="flex justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center z-10" style={{ width: `${100/(statusSteps.length-1)}%` }}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${index <= currentStatusIndex ? step.color : 'bg-gray-100 text-gray-400'}`}
                    >
                      {step.icon}
                    </div>
                    <span className={`text-xs font-medium text-center ${index <= currentStatusIndex ? 'text-gray-800' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <User className="text-primary" size={18} />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{order.name}</p>
                <p className="text-gray-600">{order.email}</p>
                {order.userId && (
                  <p className="text-sm text-gray-500">User ID: {order.userId}</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <MapPin className="text-primary" size={18} />
                Shipping Address
              </h3>
              <div className="space-y-1">
                {order.address?.street && <p className="font-medium">{order.address.street}</p>}
                {order.address?.city && (
                  <p>
                    {order.address.city}
                    {order.address.state && `, ${order.address.state}`}
                  </p>
                )}
                {order.address?.pincode && <p>Postal Code: {order.address.pincode}</p>}
                {order.address?.phone && <p>Phone: {order.address.phone}</p>}
                {!order.address?.street && !order.address?.city && (
                  <p className="text-gray-500 italic">No shipping address provided</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Clock className="text-primary" size={18} />
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Time:</span>
                  <span>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span>{order.products?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <CreditCard className="text-primary" size={18} />
                Payment Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="capitalize">{order.paymentMethod || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'Paid' ? 'text-green-600' : 
                    order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus || 'Unknown'}
                  </span>
                </div>
                {order.paymentReference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="text-sm font-mono truncate max-w-[150px]">{order.paymentReference}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.products?.map((product) => (
                    <tr key={product.productId || product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={product.img?.[0] || product.img || '/placeholder-product.png'}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">SKU: {product.productId || product._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{product.price?.toLocaleString() || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity || 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{((product.price || 0) * (product.quantity || 1)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Total */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-end">
              <div className="w-full md:w-1/2">
                <h3 className="text-lg font-semibold mb-4">Order Total</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{order.price?.toLocaleString() || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                    <span>Total:</span>
                    <span>₹{order.price?.toLocaleString() || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderView;