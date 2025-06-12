import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../config/api';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Increment view count
        await api.post(`/blogs/${id}/view`);
        
        // Fetch blog details
        const blogRes = await api.get(`/blogs/${id}`);
        if (blogRes.data.status) {
          setBlog(blogRes.data.post);
        } else {
          setError('Blog not found');
        }

        console.log(blogRes.data.post);
        
        // Fetch comments
        // const commentsRes = await api.get(`/blogs/${id}/comments`);
        // if (commentsRes.data.status) {
        //   setComments(commentsRes.data.comments);
        // }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading blog');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      await api.post(`/blogs/${id}/like`);
      setBlog(prev => ({
        ...prev,
        likes: prev.likes + 1
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error liking post');
    }
  };

  const handleDislike = async () => {
    try {
      await api.post(`/blogs/${id}/dislike`);
      setBlog(prev => ({
        ...prev,
        dislikes: prev.dislikes + 1
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error disliking post');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsCommenting(true);
    try {
      const response = await api.post(`/blogs/${id}/comments`, {
        content: comment
      });

      console.log(response.data);
      
      if (response.data.status) {
        setComment('');
        // Refresh comments
        const commentsRes = await api.get(`/blogs/${id}/comments`);
        if (commentsRes.data.status) {
          setComments(commentsRes.data.comments);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await api.delete(`/blogs/${id}/comments/${commentId}`);
        if (response.data.status) {
          setComments(prev => prev.filter(c => c._id !== commentId));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting comment');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-primary font-medium">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-primary mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/blogs')}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-orange-600"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-2">
      <div className="max-w-4xl mx-auto">
        {/* Blog Post */}
        <div className="bg-white rounded-lg overflow-hidden mb-8">
          {blog.image && (
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-mutedSecondary text-primary rounded-full text-sm font-medium">
                  {blog.category}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {moment(blog.publishedAt).format('MMMM D, YYYY')}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {blog.views} views
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-primary mb-4">{blog.title}</h1>
            
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
            
            <div className="mt-6 flex items-center space-x-4">
              {/* <button 
                onClick={handleLike}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                </svg>
                {blog.likes}
              </button>
              
              <button 
                onClick={handleDislike}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.5a2 2 0 012 2v6a2 2 0 01-2 2H17m-7 0h2M17 20h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5"></path>
                </svg>
                {blog.dislikes}
              </button> */}
            </div>
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Comments Section */}
        {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary p-6">
            <h3 className="text-xl font-bold text-white">Comments ({comments.length})</h3>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Add a comment
                </label>
                <textarea
                  id="comment"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                  placeholder="Share your thoughts..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isCommenting}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {isCommenting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
            
            {comments.length === 0 ? (
              <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="space-y-6">
                {comments.map(comment => (
                  <div key={comment._id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-700">{comment.content}</p>
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete comment"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>{moment(comment.createdAt).fromNow()}</span>
                      <span className="mx-2">•</span>
                      <button className="flex items-center hover:text-gray-700">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                        </svg>
                        {comment.likes || 0}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BlogDetail;