// Utility functions for gallery operations

/**
 * Formats gallery item data for display
 */
export const formatGalleryItem = (item) => {
  if (!item) return null;
  
  return {
    ...item,
    formattedDate: new Date(item.createdAt).toLocaleDateString(),
    categoryLabel: item.category.charAt(0).toUpperCase() + item.category.slice(1),
  };
};

/**
 * Groups gallery items by category
 */
export const groupItemsByCategory = (items) => {
  return items.reduce((groups, item) => {
    const category = item.category || 'general';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};

/**
 * Filters gallery items by search term
 */
export const filterGalleryItems = (items, searchTerm) => {
  if (!searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    item.title.toLowerCase().includes(term) ||
    item.description?.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term)
  );
};

/**
 * Sorts gallery items by date (newest first)
 */
export const sortByDate = (items, direction = 'desc') => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return direction === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

/**
 * Validates gallery item data before submission
 */
export const validateGalleryItem = (item) => {
  const errors = {};
  
  if (!item.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!item.imageUrl?.trim()) {
    errors.imageUrl = 'Image is required';
  }
  
  if (!item.category?.trim()) {
    errors.category = 'Category is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Extracts Cloudinary public ID from URL for deletion
 */
export const extractCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;
  
  try {
    // Extract public ID from Cloudinary URL
    const parts = imageUrl.split('/');
    const filenamePart = parts[parts.length - 1];
    return filenamePart.split('.')[0]; // Remove file extension
  } catch {
    return null;
  }
};