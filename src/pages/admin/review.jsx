import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowUpDown, Search, AlertCircle, Loader2 } from 'lucide-react';
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';

const Reviews = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    reviews: [],
    users: {},
    searchQuery: '',
    loading: true,
    error: null
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Memoized auth token check
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return null;
    }
    return token;
  }, [navigate]);

  // Fetch data with error handling
  const fetchData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const [reviewsResponse, usersResponse] = await Promise.all([
        api.get('/reviews', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (!reviewsResponse.data?.reviews) {
        throw new Error('Invalid reviews data format');
      }
      
      // Create users map
      console.log(usersResponse)
      const usersMap = {};
      if (usersResponse?.data) {
        usersResponse?.data?.data.forEach(user => {
          usersMap[user?.userId] = user;
        });
      }
      
      setState({
        reviews: reviewsResponse.data.reviews,
        users: usersMap,
        loading: false,
        error: null,
        searchQuery: ''
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to fetch data'
      }));
      
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  }, [getAuthToken, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimized sort handler
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  }, []);

  // Memoized sorted reviews
  const sortedReviews = useMemo(() => {
    if (!sortConfig.key) return state.reviews;
    
    return [...state.reviews].sort((a, b) => {
      // Handle nested user name sorting
      if (sortConfig.key === 'userName') {
        const nameA = state.users[a.userId]?.name || '';
        const nameB = state.users[b.userId]?.name || '';
        return sortConfig.direction === 'ascending' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      
      // Handle other fields
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [state.reviews, state.users, sortConfig]);

  // Memoized filtered reviews
  const filteredReviews = useMemo(() => {
    const searchLower = state.searchQuery.toLowerCase();
    return sortedReviews.filter(review => {
      const userName = state.users[review.userId]?.name?.toLowerCase() || '';
      return (
        review.productId?.toString().toLowerCase().includes(searchLower) ||
        review.review?.toLowerCase().includes(searchLower) ||
        userName.includes(searchLower)
      );
    });
  }, [sortedReviews, state.users, state.searchQuery]);

  // Memoized rating stars renderer
  const renderRatingStars = useCallback((rating) => (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span 
          key={i} 
          className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  ), []);

  const handleSearchChange = useCallback((e) => {
    setState(prev => ({ ...prev, searchQuery: e.target.value }));
  }, []);

  const { loading, error, searchQuery } = state;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading reviews</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Helmet>
        <title>Reviews | Admin | Zang Global</title>
      </Helmet>
      <div className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Reviews</h1>
            <p className="text-gray-600">Manage and view customer reviews</p>
          </header>

          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by product ID, review, or user..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['productId', 'rating', 'userName'].map((key) => (
                      <th 
                        key={key}
                        onClick={() => handleSort(key)} 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          {key === 'userName' ? 'User' : key === 'productId' ? 'Product ID' : 'Rating'}
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No reviews found matching your search
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((review) => (
                      <ReviewRow 
                        key={review._id} 
                        review={review} 
                        user={state.users[review.userId]} 
                        renderRatingStars={renderRatingStars} 
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted ReviewRow component for better performance
const ReviewRow = React.memo(({ review, user, renderRatingStars }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {review.productId}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {renderRatingStars(review.rating)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <UserInfo user={user} />
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      <div className="line-clamp-2">{review.review}</div>
      {review.createdAt && (
        <div className="mt-1 text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      )}
    </td>
  </tr>
));

// Extracted UserInfo component
const UserInfo = React.memo(({ user }) => (
  <div className="flex items-center">
    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
      {user?.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-gray-500 text-sm">
          {user?.name?.charAt(0) || 'U'}
        </span>
      )}
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">
        {user?.name || 'Unknown'}
      </div>
      <div className="text-sm text-gray-500">
        {user?.email || ''}
      </div>
    </div>
  </div>
));

export default Reviews;