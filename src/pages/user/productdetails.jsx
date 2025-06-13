import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import {
  FaMinus,
  FaPlus,
  FaStar,
  FaTag,
  FaBox,
  FaShippingFast,
  FaWarehouse,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
  FaShare,
  FaHeart
} from 'react-icons/fa';
import { Helmet } from "react-helmet";
import ReviewSection from './ReviewSection';
import ReviewForm from './ReviewForm';
import api, { fetchProductById } from '../../config/api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from 'react-redux';
import AddToCart from '../../components/user/addToCart';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [stockStatus, setStockStatus] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const user = useSelector(state => state.auth.user);
  const userId = user?.userId;

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
        calculateStockStatus(data);
      } catch (error) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/product/${productId}`);
        const data = await response?.data;
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [productId]);

  const calculateStockStatus = (productData) => {
    if (!productData) return;

    const stock = productData.inStockValue || 0;
    let status = '';
    let color = '';

    if (stock > 50) {
      status = 'In Stock';
      color = 'bg-green-50 text-green-800';
    } else if (stock > 10) {
      status = 'Low Stock';
      color = 'bg-yellow-50 text-yellow-800';
    } else if (stock > 0) {
      status = 'Very Low Stock';
      color = 'bg-orange-50 text-orange-800';
    } else {
      status = 'Out of Stock';
      color = 'bg-red-50 text-red-800';
    }

    setStockStatus({ status, color, stock });
  };

  const submitReview = async (data) => {
    try {
      const response = await api.post(`/reviews/new`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Review added successfully!");
      return response.data;
    } catch (error) {
      toast.error("Failed to submit review");
      throw error;
    }
  };

  const handleSubmitReview = async (e, reviewData) => {
    e.preventDefault();
    const data = { userId, productId, ...reviewData };
    try {
      const newReview = await submitReview(data);
      setReviews([newReview, ...reviews]);
      setShowReviewForm(false);
    } catch (error) {
      console.error("Failed to submit review:", error.message);
    }
  };

  const handlePreviousImage = () => {
    setSelectedImage(prev => (prev === 0 ? product.img.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage(prev => (prev === product.img.length - 1 ? 0 : prev + 1));
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(!isWishlisted ? "Added to wishlist" : "Removed from wishlist");
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton height={400} className="rounded-xl" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} height={80} className="rounded-lg" />
                ))}
              </div>
            </div>
            
            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <Skeleton height={32} width="70%" />
              <Skeleton height={28} width="40%" />
              <div className="flex items-center space-x-2">
                <Skeleton circle height={24} width={24} />
                <Skeleton height={24} width="20%" />
              </div>
              <Skeleton height={20} count={4} />
              <div className="flex space-x-4">
                <Skeleton height={48} width={48} />
                <Skeleton height={48} width={120} />
                <Skeleton height={48} width={120} />
              </div>
              <div className="pt-8">
                <Skeleton height={48} width="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Zang Global</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <ToastContainer position="bottom-right" />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 mt-16 md:mt-24">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-pink-600 hover:text-pink-800 mb-4 md:mb-6 transition-colors text-sm md:text-base"
          >
            <FaChevronLeft className="mr-1 md:mr-2" />
            Back to Products
          </button>

          {/* Product Main Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8 p-1 md:p-3">
              {/* Image Gallery */}
              <div className="space-y-3 md:space-y-4">
                <div className="relative aspect-square w-full bg-gray-100 rounded-lg md:rounded-xl overflow-hidden">
                  <img
                    src={product.img[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 md:p-4"
                    loading="lazy"
                  />
                  
                  {/* Navigation Arrows - Mobile: Only show on hover */}
                  <div className="md:hidden absolute inset-0 flex items-center justify-between px-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={handlePreviousImage}
                      className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md"
                    >
                      <FaChevronLeft className="text-gray-700 text-sm" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md"
                    >
                      <FaChevronRight className="text-gray-700 text-sm" />
                    </button>
                  </div>
                  
                  {/* Navigation Arrows - Desktop: Always visible */}
                  <div className="hidden md:block">
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                    >
                      <FaChevronLeft className="text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                    >
                      <FaChevronRight className="text-gray-700" />
                    </button>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 flex space-x-1 md:space-x-2">
                    {product.isNew && (
                      <span className="bg-pink-600 text-white text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                        NEW
                      </span>
                    )}
                    {product.discount && (
                      <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-1 md:gap-2">
                  {product.img.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded md:rounded-lg overflow-hidden border ${selectedImage === index ? 'border-pink-500' : 'border-transparent'}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    <div className="flex items-center mt-1 md:mt-2 space-x-1 md:space-x-2">
                      <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-sm md:text-base">
                        <FaStar className="text-yellow-500 mr-0.5 md:mr-1" />
                        <span className="font-medium text-yellow-700">
                          {product.rating || '4.5'}
                        </span>
                        <span className="text-gray-500 text-xs md:text-sm ml-0.5 md:ml-1">
                          ({reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 md:space-x-3">
                    <button 
                      onClick={toggleWishlist}
                      className={`p-1.5 md:p-2 rounded-full ${isWishlisted ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
                    >
                      <FaHeart className={isWishlisted ? 'fill-current' : ''} size={18} />
                    </button>
                    <button 
                      onClick={shareProduct}
                      className="p-1.5 md:p-2 rounded-full text-gray-400 hover:text-pink-600"
                    >
                      <FaShare size={18} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-0.5 md:space-y-1">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      ₦{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base md:text-lg text-gray-500 line-through">
                        ₦{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.discount && (
                    <span className="text-green-600 font-medium text-sm md:text-base">
                      Save ₦{(product.originalPrice - product.price).toLocaleString()} ({product.discount}%)
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="prose max-w-none text-gray-600 text-sm md:text-base">
                  <p>{product.description}</p>
                </div>

                {/* Stock Status */}
                <div className="flex flex-wrap gap-1 md:gap-2">
                  <div className={`px-2 py-1 md:px-3 md:py-2 rounded-lg flex items-center text-xs md:text-sm font-medium ${stockStatus?.color}`}>
                    {stockStatus?.status === "In Stock" && <FaBox className="mr-1 md:mr-2" size={12} />}
                    {stockStatus?.status === "Low Stock" && <FaExclamationCircle className="mr-1 md:mr-2" size={12} />}
                    {stockStatus?.status === "Very Low Stock" && <FaWarehouse className="mr-1 md:mr-2" size={12} />}
                    {stockStatus?.status === "Out of Stock" && <FaShippingFast className="mr-1 md:mr-2" size={12} />}
                    {stockStatus?.status} ({stockStatus?.stock} available)
                  </div>
                  <div className="px-2 py-1 md:px-3 md:py-2 rounded-lg bg-gray-100 text-gray-800 text-xs md:text-sm font-medium flex items-center">
                    <FaTag className="mr-1 md:mr-2" size={12} />
                    {product.category}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6">
                  <AddToCart 
                    product={product} 
                    className="w-full"
                  />
                  <button
                    className="w-full py-2 md:py-3 px-4 md:px-6 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors text-sm md:text-base"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Details Tabs */}
          <div className="mt-6 md:mt-8 bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button className="py-3 md:py-4 px-4 md:px-6 border-b-2 border-pink-500 text-pink-600 font-medium text-sm md:text-base whitespace-nowrap">
                  Description
                </button>
                <button className="py-3 md:py-4 px-4 md:px-6 text-gray-500 hover:text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">
                  Specifications
                </button>
                <button className="py-3 md:py-4 px-4 md:px-6 text-gray-500 hover:text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">
                  Shipping & Returns
                </button>
              </nav>
            </div>
            <div className="p-4 md:p-6">
              <div className="prose max-w-none text-sm md:text-base">
                <h3 className="text-base md:text-lg font-medium text-gray-900">Product Details</h3>
                <p>{product.description}</p>
                {/* Add more detailed description content here */}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-6 md:mt-8 bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
            <ReviewSection
              reviews={reviews}
              rating={product.rating}
              onWriteReview={() => setShowReviewForm(true)}
            />
          </div>

          {/* Review Form Modal */}
          {showReviewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-xl md:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <ReviewForm
                  productId={productId}
                  onClose={() => setShowReviewForm(false)}
                  onSubmitSuccess={handleSubmitReview}
                  handleSubmit={handleSubmitReview}
                />
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recently Viewed</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {recentlyViewed.map((item) => (
                  <Link 
                    key={item.productId} 
                    to={`/${item.productId}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 relative">
                        <img
                          src={item.img[0] ? item.img[0] : item.img}
                          alt={item.name}
                          className="w-full h-full object-contain p-2 md:p-4"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:opacity-100 opacity-0 transition-opacity" />
                      </div>
                      <div className="p-2 md:p-4">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 text-sm md:text-base">
                          {item.name}
                        </h3>
                        <p className="text-base md:text-lg font-bold text-pink-600">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetail;