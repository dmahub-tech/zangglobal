import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { 
  Eye, ThumbsUp, ThumbsDown, MessageSquare,
  Plus, Edit2, Trash2, Loader2,
  ChevronDown, ChevronUp
} from 'lucide-react';
import BlogForm from '../../components/admin/BlogForm';
import api from '../../config/api';

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [expandedBlogs, setExpandedBlogs] = useState({});

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await api.delete(`/blogs/delete/${id}`);
        if (response.data.status) {
          setBlogs(prev => prev.filter(blog => blog._id !== id));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting blog');
      }
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setShowForm(true);
  };

  const handleFormSubmit = (newBlog) => {
    if (selectedBlog) {
      setBlogs(prev => prev.map(blog => 
        blog._id === newBlog._id ? newBlog : blog
      ));
    } else {
      setBlogs(prev => [newBlog, ...prev]);
    }
    setShowForm(false);
    setSelectedBlog(null);
  };

  const toggleExpandBlog = (id) => {
    setExpandedBlogs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Blog Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} />
            <span>Add New Blog</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6 border border-red-100">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <BlogForm 
              blog={selectedBlog} 
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedBlog(null);
              }}
            />
          </div>
        )}

        {/* Mobile View - Card List */}
        <div className="md:hidden space-y-4">
          {blogs.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
              No blog posts found
            </div>
          ) : (
            blogs.map(blog => (
              <div key={blog._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpandBlog(blog._id)}
                >
                  <div className="flex items-center gap-3">
                    {blog.image && (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={blog.image} alt={blog.title} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800 line-clamp-1">{blog.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {blog.publishedAt ? moment(blog.publishedAt).format('MMM D') : 'Not published'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedBlogs[blog._id] ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </div>
                
                {expandedBlogs[blog._id] && (
                  <div className="px-4 pb-4 border-t border-gray-100 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {blog.category}
                      </span>
                      {blog.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Eye size={16} className="text-gray-500" />
                          {blog.views || 0}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <ThumbsUp size={16} className="text-green-500" />
                          {blog.likes || 0}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          <ThumbsDown size={16} className="text-red-500" />
                          {blog.dislikes || 0}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <MessageSquare size={16} className="text-blue-500" />
                          {blog.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No blog posts found
                    </td>
                  </tr>
                ) : (
                  blogs.map(blog => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center min-w-[200px]">
                          {blog.image && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img className="h-10 w-10 rounded-md object-cover" src={blog.image} alt={blog.title} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link 
                              to={`/blogs/${blog._id}`} 
                              className="text-sm font-medium text-gray-800 hover:text-accent truncate block"
                              target="_blank"
                            >
                              {blog.title}
                            </Link>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {blog.tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  #{tag}
                                </span>
                              ))}
                              {blog.tags?.length > 3 && (
                                <span className="text-xs text-gray-500">+{blog.tags.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.publishedAt ? moment(blog.publishedAt).format('MMM D, YYYY') : 'Not published'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600" title="Views">
                            <Eye size={16} className="text-gray-500" />
                            {blog.views || 0}
                          </span>
                          <span className="flex items-center gap-1 text-green-600" title="Likes">
                            <ThumbsUp size={16} className="text-green-500" />
                            {blog.likes || 0}
                          </span>
                          <span className="flex items-center gap-1 text-red-600" title="Dislikes">
                            <ThumbsDown size={16} className="text-red-500" />
                            {blog.dislikes || 0}
                          </span>
                          <span className="flex items-center gap-1 text-blue-600" title="Comments">
                            <MessageSquare size={16} className="text-blue-500" />
                            {blog.comments?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mr-4"
                        >
                          <Edit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
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
  );
};

export default AdminBlogList;