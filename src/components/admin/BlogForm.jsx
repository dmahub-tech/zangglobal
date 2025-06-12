import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2, Check } from 'lucide-react';
import api from '../../config/api';

const BlogForm = ({ blog, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: 'Zang Global',
    image: null,
    tags: '',
    isPublished: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        author: 'Zang Global',
        category: blog.category,
        image: blog.image || null,
        tags: blog.tags?.join(', ') || '',
        isPublished: blog.isPublished || false
      });
      if (blog.image) setPreview(blog.image);
    }
  }, [blog]);

  useEffect(() => {
    // Clean up preview URL when component unmounts
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous preview if it was a blob URL
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setFormData(prev => ({ ...prev, image: file }));
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const removeImage = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview('');
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setUploadProgress(0);
  
    try {
      const tagsArray = formData?.tags?.split(',')?.map(tag => tag.trim()).filter(tag => tag);
  
      let imageUrl = formData.image;
      if (formData.image instanceof File) {
        const imageData = new FormData();
        imageData.append('files', formData.image);
  
        const uploadResponse = await api.post('/upload/doc-upload', imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        console.log('Image upload response:', uploadResponse);
        if (!uploadResponse.data?.imageUrl) {
          throw new Error('Image upload failed');
        }
  
        imageUrl = uploadResponse.data.imageUrl;
      }
  
      // Build blog payload
      const blogPayload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author: localStorage.getItem('adminId') || 'Zang Global',
        tags: tagsArray,
        image: imageUrl,
        isPublished: formData.isPublished
      };
  
      let response;
      if (blog) {
        response = await api.put(`/blogs/update/${blog._id}`, blogPayload);
      } else {
        response = await api.post('/blogs/create', blogPayload);
      }
  
      if (response.data.status) {
        onSubmit(response.data.post || {
          ...formData,
          image: imageUrl,
          _id: blog?._id
        });
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error saving blog');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };
  

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md mb-4 border border-red-100">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent p-2 border text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent p-2 border text-sm sm:text-base"
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            rows="8"
            value={formData.content}
            onChange={handleChange}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent p-2 border text-sm sm:text-base"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image
            </label>
            
            {preview ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-40 w-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Remove image"
                >
                  <X size={16} className="text-gray-700" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e-commerce, trends, future"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent p-2 border text-sm sm:text-base"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas (e.g., "technology, business, marketing")
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            checked={formData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
            Publish immediately
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                {blog ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                {blog ? 'Update Post' : 'Create Post'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;