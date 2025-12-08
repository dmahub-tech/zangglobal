import React, { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import {
  useGalleryItems,
  useGalleryCategories,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
  useUploadGalleryImage,
} from "../../hooks/useGallery";

const GalleryManagement = () => {
  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    galleryId: "",
    title: "",
    description: "",
    category: "general",
    imageUrl: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);

  // Filter state
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // React Query hooks
  const {
    data: galleryItems = [],
    isLoading: isLoadingItems,
    error: itemsError
  } = useGalleryItems({ 
    category: categoryFilter || undefined 
  });

  const {
    data: categories = [],
    isLoading: isLoadingCategories
  } = useGalleryCategories();

  // Mutation hooks
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();
  const uploadMutation = useUploadGalleryImage();

  // Filter gallery items locally based on search
  const filteredItems = useMemo(() => {
    if (!searchFilter.trim()) return galleryItems;
    
    return galleryItems.filter((item) =>
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [galleryItems, searchFilter]);

  // Loading states
  const isLoading = isLoadingItems || isLoadingCategories;
  const isMutating = createMutation.isPending || updateMutation.isPending || 
                    deleteMutation.isPending || uploadMutation.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = currentItem.imageUrl;

      // Upload image if a new one is selected
      if (imageFile) {
        const uploadResult = await uploadMutation.mutateAsync(imageFile);
        imageUrl = uploadResult.data.imageUrl;
      }

      const itemData = {
        ...currentItem,
        imageUrl,
      };

      if (editMode) {
        await updateMutation.mutateAsync({
          id: currentItem.galleryId,
          ...itemData,
        });
      } else {
        await createMutation.mutateAsync(itemData);
      }

      // Reset form and close modal on success
      setShowModal(false);
      resetForm();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("Error saving gallery item:", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (galleryId) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      await deleteMutation.mutateAsync(galleryId);
    }
  };

  const resetForm = () => {
    setCurrentItem({
      galleryId: "",
      title: "",
      description: "",
      category: "general",
      imageUrl: "",
      isActive: true,
    });
    setImageFile(null);
    setEditMode(false);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Error handling
  if (itemsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Gallery</h3>
          <p className="text-red-600">
            {itemsError?.response?.data?.message || "Failed to load gallery items. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
        <button
          onClick={openModal}
          disabled={isMutating}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add Gallery Item
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search gallery items..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery items...</p>
        </div>
      )}

      {/* Gallery Items Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.galleryId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative group">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => window.open(item.imageUrl, "_blank")}
                    className="bg-white text-black p-2 rounded-full mx-1 hover:bg-gray-200"
                  >
                    <FaEye />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    item.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Category: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      disabled={isMutating}
                      className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white p-2 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.galleryId)}
                      disabled={isMutating}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white p-2 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchFilter || categoryFilter ? "No gallery items found for the selected filters" : "No gallery items found"}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editMode ? "Edit Gallery Item" : "Add Gallery Item"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={currentItem.title}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={currentItem.description}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  value={currentItem.category}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {currentItem.imageUrl && (
                  <img
                    src={currentItem.imageUrl}
                    alt="Current"
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentItem.isActive}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, isActive: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isMutating}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isMutating ? "Saving..." : editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;