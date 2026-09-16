import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Tag,
  FileText,
} from "lucide-react";
import BlogForm from "../../components/admin/BlogForm";
import api from "../../config/api";

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [expandedBlogs, setExpandedBlogs] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs/all");
        if (response.data.status) {
          setBlogs(response.data.post);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error loading blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter and sort blogs
  const filteredBlogs = blogs
    .filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && blog.isPublished) ||
        (statusFilter === "draft" && !blog.isPublished);
      const matchesCategory =
        categoryFilter === "all" || blog.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || b.publishedAt) -
          new Date(a.createdAt || a.publishedAt)
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || a.publishedAt) -
          new Date(b.createdAt || b.publishedAt)
        );
      } else if (sortBy === "views") {
        return (b.views || 0) - (a.views || 0);
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const categories = [
    ...new Set(blogs.map((blog) => blog.category).filter(Boolean)),
  ];
  const publishedCount = blogs.filter((blog) => blog.isPublished).length;
  const draftCount = blogs.filter((blog) => !blog.isPublished).length;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await api.delete(`/blogs/delete/${id}`);
        if (response.data.status) {
          setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error deleting blog");
      }
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setShowForm(true);
  };

  const handleFormSubmit = (newBlog) => {
    if (selectedBlog) {
      setBlogs((prev) =>
        prev.map((blog) => (blog._id === newBlog._id ? newBlog : blog))
      );
    } else {
      setBlogs((prev) => [newBlog, ...prev]);
    }
    setShowForm(false);
    setSelectedBlog(null);
  };

  const toggleExpandBlog = (id) => {
    setExpandedBlogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Blog Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create, edit, and manage your blog posts
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={18} />
            <span>Add New Blog</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-xl font-bold text-gray-800">
                  {blogs.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-xl font-bold text-gray-800">
                  {publishedCount}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-xl font-bold text-gray-800">{draftCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Views</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {(searchTerm ||
            statusFilter !== "all" ||
            categoryFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredBlogs.length} of {blogs.length} posts
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6 border border-red-100">
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
          {filteredBlogs.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No blog posts found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
              >
                <div
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpandBlog(blog._id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {blog.image && (
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-md object-cover"
                          src={blog.image}
                          alt={blog.title}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-800 truncate">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            blog.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {blog.publishedAt
                            ? moment(blog.publishedAt).format("MMM D")
                            : "Not published"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedBlogs[blog._id] ? (
                    <ChevronUp
                      size={18}
                      className="text-gray-400 flex-shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-gray-400 flex-shrink-0"
                    />
                  )}
                </div>

                {expandedBlogs[blog._id] && (
                  <div className="px-4 pb-4 border-t border-gray-100 space-y-3">
                    <div className="pt-3">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {blog.content.replace(/<[^>]+>/g, "").substring(0, 120)}
                        ...
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {blog.category}
                      </span>
                      {blog.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span
                          className="flex items-center gap-1 text-gray-600"
                          title="Views"
                        >
                          <Eye size={16} />
                          {blog.views || 0}
                        </span>
                        <span
                          className="flex items-center gap-1 text-green-600"
                          title="Likes"
                        >
                          <ThumbsUp size={16} />
                          {blog.likes || 0}
                        </span>
                        <span
                          className="flex items-center gap-1 text-red-600"
                          title="Dislikes"
                        >
                          <ThumbsDown size={16} />
                          {blog.dislikes || 0}
                        </span>
                        <span
                          className="flex items-center gap-1 text-blue-600"
                          title="Comments"
                        >
                          <MessageSquare size={16} />
                          {blog.comments?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Link
                        to={`/blogs/${blog._id}`}
                        target="_blank"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </Link>
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Published
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stats
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              {/* <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No blog posts found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your search or filters
                      </p>
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center min-w-[200px]">
                          {blog.image && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={blog.image}
                                alt={blog.title}
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {blog.title}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {blog.tags?.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                              {blog.tags?.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{blog.tags.length - 2}
                                </span>
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            blog.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.publishedAt
                          ? moment(blog.publishedAt).format("MMM D, YYYY")
                          : "Not published"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4 text-sm">
                          <span
                            className="flex items-center gap-1 text-gray-600"
                            title="Views"
                          >
                            <Eye size={16} />
                            {blog.views || 0}
                          </span>
                          <span
                            className="flex items-center gap-1 text-green-600"
                            title="Likes"
                          >
                            <ThumbsUp size={16} />
                            {blog.likes || 0}
                          </span>
                          <span
                            className="flex items-center gap-1 text-red-600"
                            title="Dislikes"
                          >
                            <ThumbsDown size={16} />
                            {blog.dislikes || 0}
                          </span>
                          <span
                            className="flex items-center gap-1 text-blue-600"
                            title="Comments"
                          >
                            <MessageSquare size={16} />
                            {blog.comments?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/blogs/${blog._id}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-800"
                            title="View post"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit post"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody> */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center">
                      <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-base font-medium text-gray-700 mb-1">
                        No blog posts found
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Try adjusting your search or filters
                      </p>
                      <button
                        onClick={clearFilters}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Title Column - Always visible */}
                      <td className="px-3 py-3">
                        <div className="flex items-center">
                          {blog.image && (
                            <div className="flex-shrink-0 h-8 w-8 mr-2">
                              <img
                                className="h-8 w-8 rounded-md object-cover"
                                src={blog.image}
                                alt={blog.title}
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-800 line-clamp-1">
                              {blog.title}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-xs text-gray-500">
                                {blog.category}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  blog.isPublished
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {blog.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stats Column - Hidden on mobile, visible on tablet+ */}
                      <td className="hidden sm:table-cell px-3 py-3">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="flex items-center text-gray-600">
                            <Eye size={12} className="mr-0.5" />
                            {blog.views || 0}
                          </span>
                          <span className="flex items-center text-green-600">
                            <ThumbsUp size={12} className="mr-0.5" />
                            {blog.likes || 0}
                          </span>
                          <span className="flex items-center text-red-600">
                            <ThumbsDown size={12} className="mr-0.5" />
                            {blog.dislikes || 0}
                          </span>
                        </div>
                      </td>

                      {/* Date Column - Hidden on mobile, visible on tablet+ */}
                      <td className="hidden md:table-cell px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                        {blog.publishedAt
                          ? moment(blog.publishedAt).format("MMM D, YYYY")
                          : "—"}
                      </td>

                      {/* Comments Column - Hidden on mobile, visible on tablet+ */}
                      <td className="hidden lg:table-cell px-3 py-3">
                        <span className="flex items-center text-xs text-blue-600">
                          <MessageSquare size={12} className="mr-0.5" />
                          {blog.comments?.length || 0}
                        </span>
                      </td>

                      {/* Tags Column - Hidden on mobile, visible on desktop+ */}
                      <td className="hidden xl:table-cell px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {blog.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {blog.tags?.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{blog.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions Column - Always visible but compact */}
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/blogs/${blog._id}`}
                            target="_blank"
                            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                            title="View post"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="Edit post"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Delete post"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
