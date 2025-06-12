import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Search, AlertCircle, Loader2 } from 'lucide-react';
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';

const Reviews = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Get token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login'); // Redirect to login if no token
      return null;
    }
    return token;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        setLoading(true);
        setError(null);
        
        const [reviewsResponse, usersResponse] = await Promise.all([
          api.get('/reviews', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          api.get('/users', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        
        if (reviewsResponse.data?.reviews) {
          setReviews(reviewsResponse.data.reviews);
        } else {
          throw new Error('Invalid reviews data format');
        }
        
        // Create users map
        if (usersResponse.data) {
          const usersMap = {};
          usersResponse.data.forEach(user => {
            usersMap[user.userId] = user;
          });
          setUsers(usersMap);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedReviews = React.useMemo(() => {
    let sortableReviews = [...reviews];
    if (sortConfig.key !== null) {
      sortableReviews.sort((a, b) => {
        // Handle nested user name sorting
        if (sortConfig.key === 'userName') {
          const nameA = users[a.userId]?.name || '';
          const nameB = users[b.userId]?.name || '';
          return sortConfig.direction === 'ascending' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        
        // Handle other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableReviews;
  }, [reviews, sortConfig, users]);

  const filteredReviews = sortedReviews.filter(review => {
    const searchLower = searchQuery.toLowerCase();
    return (
      review.productId?.toString().toLowerCase().includes(searchLower) ||
      review.review?.toLowerCase().includes(searchLower) ||
      (users[review.userId]?.name?.toLowerCase().includes(searchLower))
    );
  });

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex">
        <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading reviews</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Helmet>
        <title>Reviews | Admin | Zang Global</title>
      </Helmet>
      <div className="flex-1 p-4 md:p-8 ml-0 lg:ml-64 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Reviews</h1>
            <p className="text-gray-600">Manage and view customer reviews</p>
          </div>

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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('productId')} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Product ID
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('rating')} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Rating
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('userName')} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        User
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
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
                      <tr key={review._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {review.productId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {renderRatingStars(review.rating)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {users[review.userId]?.avatar ? (
                                <img 
                                  src={users[review.userId].avatar} 
                                  alt={users[review.userId]?.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  {users[review.userId]?.name?.charAt(0) || 'U'}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {users[review.userId]?.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {users[review.userId]?.email || ''}
                              </div>
                            </div>
                          </div>
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

export default Reviews;