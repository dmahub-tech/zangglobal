import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import api from '../../config/api';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs/all');
        if (response.data.status) {
          setBlogs(response.data.post);
        } else {
          setError('Failed to fetch blogs');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? blog.category === categoryFilter : true;
    return matchesSearch && matchesCategory && blog.isPublished;
  });

  const categories = [...new Set(blogs.map(blog => blog.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutralGray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-primary font-medium">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutralGray flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-primary mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutralGray py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Our Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest articles, news, and insights from our team
          </p>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex-shrink-0">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No blog posts found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map(blog => (
              <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {blog.image && (
                  <Link to={`/blogs/${blog._id}`}>
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-2 py-1 bg-mutedSecondary text-primary rounded-full text-xs font-medium">
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {moment(blog.publishedAt).fromNow()}
                    </span>
                  </div>
                  <Link to={`/blogs/${blog._id}`} className="block">
                    <h3 className="text-xl font-bold text-primary mb-2 hover:text-mutedPrimary transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {blog.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>👁️ {blog.views || 0}</span>
                      <span>💬 {blog.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;