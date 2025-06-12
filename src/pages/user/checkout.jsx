import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, CreditCard, Tag, Loader2, Truck, MapPin, Home, Package } from "lucide-react";
import confetti from "canvas-confetti";
import { Helmet } from "react-helmet";
import Navbar from "../../components/user/navbar/navbar";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../redux/slice/cartSlice";
import { fetchUser } from "../../redux/slice/authSlice";
import api from "../../config/api";

const Checkout = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const discount = parseFloat(location.state?.discount || 0);
  const [shipping, setShipping] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Payment

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const total = useSelector((state) => state.cart.items.total);
  const cartId = useSelector((state) => state.cart.items);
  const cartItems = useSelector((state) => state.cart.items.productsInCart);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token]);

  const queryParams = new URLSearchParams(location.search);
  const trxref = queryParams.get("trxref");
  const reference = queryParams.get("reference");

  useEffect(() => {
    const verifyPayment = async () => {
      if (reference) {
        try {
          const verifyRes = await api.get(`/payments/verify-payment/${reference}`);
          const paymentStatus = verifyRes.data.status;

          if (paymentStatus === "success") {
            setPaymentStatus("✅ Payment Successful!");
          } else {
            setPaymentStatus("❌ Payment Failed or Cancelled.");
          }
        } catch (error) {
          setPaymentStatus("⚠️ Could not verify payment.");
        }
      }
      setLoading(false);
      handleOrderSuccess();
    };

    if (trxref || reference) {
      verifyPayment();
    }
  }, [trxref, reference]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.userId));
    }
  }, [user]);

  useEffect(() => {
    const savedAddress = localStorage.getItem("savedShippingAddress");
    const savedSaveAddressPreference = localStorage.getItem("saveAddressPreference");

    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setAddress(parsedAddress);
      } catch (error) {
        console.error("Error parsing saved address:", error);
      }
    }

    if (savedSaveAddressPreference) {
      setSaveAddress(JSON.parse(savedSaveAddressPreference));
    }
  }, []);

  useEffect(() => {
    if (Number(total) < 499) {
      setShipping(99);
    } else {
      setShipping(0);
    }
  }, [total]);

  const handlePayment = async () => {
    if (!isAddressValid()) return;
    
    setIsProcessing(true);
    const orderData = {
      userId: user.userId,
      cartId: cartId,
      address: JSON.stringify(address),
      email: user.email,
      paymentMethod: "Online",
      name: user.name,
    };

    try {
      const response = await api.post("/orders/checkout", orderData);
      const paymentData = {
        callbackUrl: "https://zangglobal.com/checkout",
        ...response.data?.data,
      };

      const orderProcess = await api.post("/payments/process-payment", paymentData);
      const paystackUrl = orderProcess.data.data.authorization_url;
      window.location.href = paystackUrl;
    } catch (error) {
      setIsProcessing(false);
      console.error("Payment Error:", error.response?.data || error.message);
      alert("❌ Error initializing payment.");
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const updatedAddress = {
      ...address,
      [name]: value,
    };

    setAddress(updatedAddress);

    if (saveAddress) {
      localStorage.setItem("savedShippingAddress", JSON.stringify(updatedAddress));
    }
  };

  const handleSaveAddressToggle = (e) => {
    const isChecked = e.target.checked;
    setSaveAddress(isChecked);
    localStorage.setItem("saveAddressPreference", JSON.stringify(isChecked));

    if (isChecked) {
      localStorage.setItem("savedShippingAddress", JSON.stringify(address));
    } else {
      localStorage.removeItem("savedShippingAddress");
    }
  };

  const isAddressValid = () => {
    return Object.values(address).every((value) => value.trim() !== "");
  };

  const handleOrderSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setShowSuccess(true);
    setTimeout(() => {
      navigate("/cart");
    }, 5000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Helmet>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-2 ${activeStep >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                {activeStep > 1 ? <CheckCircle className="w-4 h-4" /> : 1}
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-1 ${activeStep >= 2 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
            </div>
            
            <div className={`flex items-center ${activeStep >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-2 ${activeStep >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                {activeStep > 2 ? <CheckCircle className="w-4 h-4" /> : 2}
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Address Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-pink-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="123456"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={handleSaveAddressToggle}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-700">
                  Save this address for future orders
                </label>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center mb-6">
                <Truck className="w-6 h-6 text-pink-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Shipping Method</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-pink-500 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="standard-shipping"
                      name="shipping"
                      checked
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label htmlFor="standard-shipping" className="ml-3 block text-sm font-medium text-gray-700">
                      Standard Shipping
                    </label>
                  </div>
                  <span className="text-sm font-medium">
                    {shipping > 0 ? `₦${shipping}` : "FREE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-pink-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center py-3 border-b">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.img[0] || item.img}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">₦{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">₦{total?.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Discount ({discount}%)</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      - ₦{(total * (discount/100)).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">Shipping</span>
                  <span className="text-sm font-medium text-green-600">
                    {shipping > 0 ? `₦${shipping}` : "FREE"}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="font-semibold">
                    ₦{Math.round(total + shipping - (total * (discount/100)))}
                  </span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!isAddressValid() || isProcessing}
                  className={`w-full mt-6 py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
                    isAddressValid()
                      ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:shadow-lg hover:from-pink-700 hover:to-pink-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-fade-in">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Order Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. We've sent a confirmation email with all the details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/orders")}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;